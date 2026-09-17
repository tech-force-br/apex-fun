/**
 * The Next.js site calls the aer box over HTTPS. It does not run aer itself.
 * Spec: specs/11-tech-architecture.md
 */
export async function postToRunner(apex: string) {
  const url = process.env.RUNNER_URL;
  const secret = process.env.RUNNER_SECRET;
  if (!url || !secret) {
    throw new Error("Missing RUNNER_URL or RUNNER_SECRET");
  }

  const response = await fetch(`${url}/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-runner-secret": secret,
    },
    body: JSON.stringify({ apex }),
  });

  return response.json() as Promise<{
    compiled: boolean;
    log: string;
    raw: string;
    error?: string;
  }>;
}
