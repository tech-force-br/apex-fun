import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

/**
 * TypeScript aer box. Spec: specs/13-runner.md
 *
 * Accepts only requests that have the site secret. aer CLI flags, wrapper
 * class name, timeout seconds, and process isolation are still open
 * (specs/15-open-questions.md) — this process does not call aer yet.
 */

const PORT = Number(process.env.PORT ?? 8787);
const SECRET = process.env.RUNNER_SECRET;

type RunResponse = {
  compiled: boolean;
  log: string;
  raw: string;
  error?: string;
};

function json(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function authorized(req: IncomingMessage): boolean {
  if (!SECRET) return false;
  return req.headers["x-runner-secret"] === SECRET;
}

const server = createServer(async (req, res) => {
  const url = req.url ?? "/";

  if (req.method === "GET" && url === "/health") {
    json(res, 200, { ok: true, aerWired: false });
    return;
  }

  if (req.method === "POST" && url === "/run") {
    if (!authorized(req)) {
      json(res, 401, { error: "unauthorized" });
      return;
    }

    await readBody(req);

    const body: RunResponse = {
      compiled: false,
      log: "",
      raw: "",
      error: "aer is not wired yet",
    };
    json(res, 501, body);
    return;
  }

  json(res, 404, { error: "not found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`ApexFun runner listening on http://127.0.0.1:${PORT}`);
});
