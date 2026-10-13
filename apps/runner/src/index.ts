import { timingSafeEqual } from "node:crypto";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * TypeScript aer box. Spec: specs/13-runner.md
 *
 * Accepts only requests that have the site secret. Runs anonymous Apex with
 * `aer exec -q` on stdin. The website decides pass/fail.
 */

const SRC_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SRC_DIR, "../../..");

loadEnvFile(path.join(SRC_DIR, "../.env"));

const PORT = Number(process.env.PORT ?? 8787);
const SECRET = process.env.RUNNER_SECRET ?? "";
const TIMEOUT_MS = timeoutMs(process.env.RUNNER_TIMEOUT_SECONDS);
const MAX_SOURCE = 100_000;
const MAX_OUTPUT = 1_000_000;

type RunResponse = {
  compiled: boolean;
  clean: boolean;
  log: string;
  raw: string;
  error?: string;
};

function loadEnvFile(file: string) {
  if (!existsSync(file)) return;
  const text = readFileSync(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function timeoutMs(raw: string | undefined) {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1) return 10_000;
  return Math.min(parsed, 60) * 1000;
}

function aerBin() {
  const configured = process.env.AER_BIN?.trim();
  if (configured) return configured;
  return path.join(REPO_ROOT, "tools", "aer", "aer.exe");
}

function json(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let bytes = 0;
    req.on("data", (chunk: Buffer) => {
      bytes += chunk.length;
      if (bytes > MAX_SOURCE * 4) {
        reject(new Error("body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function authorized(req: IncomingMessage): boolean {
  if (!SECRET) return false;
  const header = req.headers["x-runner-secret"];
  if (typeof header !== "string") return false;
  const got = Buffer.from(header);
  const want = Buffer.from(SECRET);
  if (got.length !== want.length) return false;
  return timingSafeEqual(got, want);
}

function isCompileFailure(raw: string) {
  return /failed to parse anonymous Apex|^type error:|anonymous Apex source is empty/m.test(
    raw,
  );
}

function compilerSummary(raw: string) {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const first = lines[0];
  if (!first) return "";
  if (first === "type error:" && lines[1]) {
    const detail = lines[1];
    const errorAt = detail.indexOf("Error ");
    return errorAt >= 0 ? detail.slice(errorAt).trim() : detail;
  }
  const cut = first.indexOf(" expecting ");
  return (cut > 0 ? first.slice(0, cut) : first).trim();
}

function buildLog(raw: string, compiled: boolean) {
  if (!compiled) return compilerSummary(raw);
  return raw
    .split(/\r?\n/)
    .filter((line) => line.startsWith("DEBUG |"))
    .join("\n");
}

function runAer(apex: string): Promise<RunResponse> {
  const bin = aerBin();
  return new Promise((resolve) => {
    let settled = false;
    const chunks: Buffer[] = [];
    let bytes = 0;
    const finish = (body: RunResponse) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(body);
    };

    const child = spawn(bin, ["exec", "-q"], {
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    const timer = setTimeout(() => {
      child.kill();
      finish({
        compiled: false,
        clean: false,
        log: "",
        raw: "",
        error: "timeout",
      });
    }, TIMEOUT_MS);

    const take = (chunk: Buffer) => {
      bytes += chunk.length;
      if (bytes > MAX_OUTPUT) {
        child.kill();
        finish({
          compiled: false,
          clean: false,
          log: "",
          raw: "",
          error: "output",
        });
        return;
      }
      chunks.push(chunk);
    };

    child.stdout?.on("data", take);
    child.stderr?.on("data", take);
    child.on("error", () => {
      finish({
        compiled: false,
        clean: false,
        log: "",
        raw: "",
        error: "aer",
      });
    });
    child.on("close", (code) => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      const compileFailure = code !== 0 && isCompileFailure(raw);
      const compiled = code === 0 || !compileFailure;
      finish({
        compiled,
        clean: code === 0,
        log: buildLog(raw, compiled),
        raw,
      });
    });

    try {
      child.stdin?.write(apex);
      child.stdin?.end();
    } catch {
      finish({
        compiled: false,
        clean: false,
        log: "",
        raw: "",
        error: "aer",
      });
    }
  });
}

const server = createServer(async (req, res) => {
  const url = req.url ?? "/";

  if (req.method === "GET" && url === "/health") {
    json(res, 200, { ok: true, aerWired: existsSync(aerBin()) });
    return;
  }

  if (req.method === "POST" && url === "/run") {
    if (!authorized(req)) {
      json(res, 401, { error: "unauthorized" });
      return;
    }

    let payload: unknown;
    try {
      payload = JSON.parse(await readBody(req));
    } catch {
      json(res, 400, { error: "bad request" });
      return;
    }

    const apex =
      payload &&
      typeof payload === "object" &&
      "apex" in payload &&
      typeof payload.apex === "string"
        ? payload.apex
        : null;
    if (apex == null || apex.length > MAX_SOURCE) {
      json(res, 400, { error: "bad request" });
      return;
    }

    json(res, 200, await runAer(apex));
    return;
  }

  json(res, 404, { error: "not found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`ApexFun runner listening on http://127.0.0.1:${PORT}`);
});
