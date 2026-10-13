import type { RunnerBody } from "@/lib/score-run";

/**
 * The Next.js site calls the aer box over HTTP. It does not run aer itself.
 * Spec: specs/11-tech-architecture.md
 */
export async function postToRunner(apex: string): Promise<RunnerBody> {
  const url = process.env.RUNNER_URL;
  const secret = process.env.RUNNER_SECRET;
  if (!url || !secret) {
    return { compiled: false, clean: false, log: "", raw: "", error: "config" };
  }

  const response = await fetch(`${url}/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-runner-secret": secret,
    },
    body: JSON.stringify({ apex }),
    signal: AbortSignal.timeout(15_000),
  });

  const body = (await response.json()) as RunnerBody;
  if (!response.ok) {
    return {
      compiled: false,
      clean: false,
      log: "",
      raw: "",
      error: body.error ?? "runner",
    };
  }
  return body;
}
