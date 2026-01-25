export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const OPENWEBUI_URL =
    process.env.OPENWEBUI_URL ?? "https://openwebui.mailodatacenter.com/";
const OPENWEBUI_MODEL = process.env.OPENWEBUI_MODEL ?? "qwen3:14b";
const OPENWEBUI_API_KEY = process.env.OPENWEBUI_API_KEY ?? "";
const OPENWEBUI_SYSTEM_PROMPT =
    process.env.OPENWEBUI_SYSTEM_PROMPT ?? "";
const OPENWEBUI_KEEP_ALIVE =
    process.env.OPENWEBUI_KEEP_ALIVE ?? "-1";
const streamControllers = new Map<string, AbortController>();
const chatHistories = new Map<string, ChatMessage[]>();
const chatContexts = new Map<string, number[]>();
const chatLastActive = new Map<string, number>();
const CHAT_TTL_MS = 5 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 60 * 1000;
const getChatKey = (id: string, userId?: string | null) =>
    `${userId ?? "anon"}:${id}`;

const cleanupExpiredChats = () => {
  const now = Date.now();
  for (const [key, lastActive] of chatLastActive.entries()) {
    if (now - lastActive < CHAT_TTL_MS) continue;
    if (streamControllers.has(key)) continue;
    chatLastActive.delete(key);
    chatHistories.delete(key);
    chatContexts.delete(key);
  }
};

const globalForCleanup = globalThis as typeof globalThis & {
  __assistantCleanupInterval?: NodeJS.Timeout;
};

if (!globalForCleanup.__assistantCleanupInterval) {
  globalForCleanup.__assistantCleanupInterval = setInterval(
      cleanupExpiredChats,
      CLEANUP_INTERVAL_MS
  );
}

export async function POST(request: Request) {
  let payload: { id?: string; userId?: string; message?: ChatMessage } | null =
      null;

  try {
    payload = (await request.json()) as {
      id?: string;
      userId?: string;
      message?: ChatMessage;
    };
  } catch {
    payload = null;
  }

  if (!payload?.id || !payload?.message) {
    return Response.json(
        { error: "Provide an id and message to start a chat." },
        { status: 400 }
    );
  }

  cleanupExpiredChats();
  const chatKey = getChatKey(payload.id, payload.userId);

  const controller = new AbortController();
  streamControllers.set(chatKey, controller);

  const baseUrl = OPENWEBUI_URL.trim().replace(/[)\s]+$/, "");
  let generateUrl: string;

  try {
    generateUrl = new URL("/api/chat/completions", baseUrl).toString();
  } catch {
    return Response.json(
        {
          error: `Invalid OPENWEBUI_URL: ${OPENWEBUI_URL}. Check for extra characters.`
        },
        { status: 500 }
    );
  }

  if (!OPENWEBUI_API_KEY) {
    return Response.json(
        { error: "Missing OPENWEBUI_API_KEY for OpenWebUI requests." },
        { status: 500 }
    );
  }

  const history = chatHistories.get(chatKey) ?? [];
  const nextHistory = [...history, payload.message];
  chatHistories.set(chatKey, nextHistory);
  chatLastActive.set(chatKey, Date.now());

  const systemPrompt = OPENWEBUI_SYSTEM_PROMPT.trim();
  const upstreamMessages =
      systemPrompt.length > 0
          ? [{ role: "system", content: systemPrompt }, ...nextHistory]
          : nextHistory;

  const keepAliveValue = OPENWEBUI_KEEP_ALIVE.trim();

  const upstream = await fetch(generateUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENWEBUI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENWEBUI_MODEL,
      messages: upstreamMessages,
      stream: true,
      ...(keepAliveValue
          ? {
            keep_alive:
                keepAliveValue === "0"
                    ? 0
                    : Number.isFinite(Number(keepAliveValue))
                        ? Number(keepAliveValue)
                        : keepAliveValue
          }
          : {})
    }),
    signal: controller.signal
  });

  if (!upstream.ok || !upstream.body) {
    const errorBody = await upstream.text().catch(() => "");
    return Response.json(
        {
          error:
              errorBody ||
              `OpenWebUI request failed with status ${upstream.status}.`
        },
        { status: 502 }
    );
  }

  const body = upstream.body;
  if (!body) {
    return Response.json(
        { error: "Ollama response had no body." },
        { status: 502 }
    );
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = body.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";
      let assistantContent = "";
      let thinkingOpen = false;
      let doneFromUpstream = false;

      const handleChunk = (chunk: string) => {
        const trimmed = chunk.trim();
        if (!trimmed) return;

        const payloadLine = trimmed.startsWith("data:")
            ? trimmed.slice(5).trim()
            : trimmed;

        if (payloadLine === "[DONE]") {
          doneFromUpstream = true;
          if (thinkingOpen) {
            thinkingOpen = false;
            controller.enqueue(encoder.encode("</think>"));
          }
          return;
        }

        try {
          const parsed = JSON.parse(payloadLine) as {
            message?: { content?: string; thinking?: string };
            choices?: Array<{
              delta?: {
                content?: string;
                reasoning_content?: string;
                reasoning?: string;
                thinking?: string;
              };
              message?: {
                content?: string;
                reasoning_content?: string;
                reasoning?: string;
                thinking?: string;
              };
              finish_reason?: string | null;
            }>;
            error?: { message?: string } | string;
            done?: boolean;
          };

          const errorMessage =
              typeof parsed.error === "string"
                  ? parsed.error
                  : parsed.error?.message;

          if (errorMessage) {
            controller.enqueue(
                encoder.encode(`\n[Error] ${errorMessage}\n`)
            );
            return;
          }

          const choice = parsed.choices?.[0];
          const thinkingChunk =
              parsed.message?.thinking ??
              choice?.delta?.reasoning_content ??
              choice?.delta?.reasoning ??
              choice?.delta?.thinking ??
              choice?.message?.reasoning_content ??
              choice?.message?.reasoning ??
              choice?.message?.thinking;
          const contentChunk =
              parsed.message?.content ??
              choice?.delta?.content ??
              choice?.message?.content;

          if (thinkingChunk) {
            if (!thinkingOpen) {
              thinkingOpen = true;
              controller.enqueue(encoder.encode("<think>"));
            }
            controller.enqueue(encoder.encode(thinkingChunk));
          }

          if (contentChunk) {
            if (thinkingOpen) {
              thinkingOpen = false;
              controller.enqueue(encoder.encode("</think>"));
            }
            assistantContent += contentChunk;
            controller.enqueue(encoder.encode(contentChunk));
          }

          if (parsed.done || choice?.finish_reason) {
            doneFromUpstream = true;
            if (thinkingOpen) {
              thinkingOpen = false;
              controller.enqueue(encoder.encode("</think>"));
            }
          }
        } catch {
          // Ignore malformed chunks.
        }
      };

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            handleChunk(line);
          }
          if (doneFromUpstream) {
            try {
              await reader.cancel();
            } catch {
              // Ignore cancellation errors.
            }
            break;
          }
        }

        if (buffer.trim()) {
          handleChunk(buffer);
        }
      } catch (err) {
        const message =
            err instanceof Error ? err.message : "Stream closed unexpectedly.";
        controller.enqueue(
            encoder.encode(`\n[Error] ${message}\n`)
        );
      } finally {
        controller.close();
        if (assistantContent) {
          const updatedHistory = chatHistories.get(chatKey) ?? nextHistory;
          chatHistories.set(chatKey, [
            ...updatedHistory,
            { role: "assistant", content: assistantContent }
          ]);
        }
        chatLastActive.set(chatKey, Date.now());
        streamControllers.delete(chatKey);
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}

export async function DELETE(request: Request) {
  let payload: { id?: string; userId?: string } | null = null;

  try {
    payload = (await request.json()) as { id?: string; userId?: string };
  } catch {
    payload = null;
  }

  if (!payload?.id) {
    return Response.json({ error: "Provide an id to stop." }, { status: 400 });
  }

  cleanupExpiredChats();
  const chatKey = getChatKey(payload.id, payload.userId);
  const controller = streamControllers.get(chatKey);
  if (controller) {
    controller.abort();
    streamControllers.delete(chatKey);
    return Response.json({ ok: true });
  }

  return Response.json({ ok: false, error: "Not found." }, { status: 404 });
}
