import { buildTaskCompletionEvent } from "@/lib/task-results";

export function normalizeCallbackUrl(input: unknown) {
  if (typeof input !== "string" || input.trim() === "") {
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    throw new Error("callback_url must be a valid URL");
  }

  const isHttps = parsed.protocol === "https:";
  const isLocalhostHttp =
    parsed.protocol === "http:" &&
    (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1");

  if (!isHttps && !isLocalhostHttp) {
    throw new Error("callback_url must use https (or http://localhost for local testing)");
  }

  return parsed.toString();
}

export async function deliverTaskCompletionCallback(taskId: string, callbackUrl: string) {
  const event = await buildTaskCompletionEvent(taskId);
  if (!event) {
    return {
      ok: false,
      status: null,
      error: "Task not found while building callback payload",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(callbackUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "human-signal-callback/1.0",
      },
      body: JSON.stringify(event),
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: `Callback returned ${response.status} ${response.statusText}`,
      };
    }

    return {
      ok: true,
      status: response.status,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}
