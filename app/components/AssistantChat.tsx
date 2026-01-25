"use client";

import { useEffect, useRef, useState } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

type ChatRole = "user" | "assistant" | "system";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

const MODEL_NAME =
  process.env.NEXT_PUBLIC_ASSISTANT_MODEL ?? "qwen3:14b";
const PROVIDER_NAME =
  process.env.NEXT_PUBLIC_ASSISTANT_PROVIDER ?? "OpenWebUI";
const PROVIDER_DESCRIPTION =
  process.env.NEXT_PUBLIC_ASSISTANT_PROVIDER_DESCRIPTION ??
  "Connected to your OpenWebUI instance for model management and custom prompts.";

const THINK_TAGS: Array<[string, string]> = [
  ["<think>", "</think>"],
  ["<thinking>", "</thinking>"],
  ["<reason>", "</reason>"],
  ["<reasoning>", "</reasoning>"],
  ["<thought>", "</thought>"],
  ["<|begin_of_thought|>", "<|end_of_thought|>"]
];

const markdownComponents: Components = {
  table({ children, className, ...props }) {
    const combinedClassName = [
      "w-full min-w-[420px] table-fixed border-collapse text-left",
      className
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <div className="my-3 overflow-x-auto">
        <table {...props} className={combinedClassName}>
          {children}
        </table>
      </div>
    );
  },
  th({ children, className, ...props }) {
    const combinedClassName = [
      "border-b border-white/20 px-2 py-1 align-top text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70",
      className
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <th {...props} className={combinedClassName}>
        {children}
      </th>
    );
  },
  td({ children, className, ...props }) {
    const combinedClassName = [
      "border-b border-white/10 px-2 py-1 align-top text-xs text-white/85 break-words whitespace-normal",
      className
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <td {...props} className={combinedClassName}>
        {children}
      </td>
    );
  }
};

const extractThought = (content: string) => {
  const detailsMatch = content.match(
    /<details[^>]*type=["']reasoning["'][^>]*>([\s\S]*?)<\/details>/i
  );
  if (detailsMatch) {
    const rawInner = detailsMatch[1] ?? "";
    const withoutSummary = rawInner.replace(
      /<summary[\s\S]*?<\/summary>/i,
      ""
    );
    const cleanedThought = withoutSummary
      .replace(/<\/?[^>]+>/g, "")
      .trim();
    const answer = content.replace(detailsMatch[0], "").trim();
    return { thought: cleanedThought, answer };
  }

  let bestTag: [string, string] | null = null;
  let bestIndex = -1;

  for (const [openTag, closeTag] of THINK_TAGS) {
    const idx = content.indexOf(openTag);
    if (idx === -1) continue;
    if (bestIndex === -1 || idx < bestIndex) {
      bestIndex = idx;
      bestTag = [openTag, closeTag];
    }
  }

  if (!bestTag || bestIndex === -1) {
    return { thought: "", answer: content.trim() };
  }

  const [openTag, closeTag] = bestTag;
  const start = bestIndex;
  const end = content.indexOf(closeTag, start + openTag.length);

  if (end === -1) {
    return {
      thought: content.slice(start + openTag.length).trim(),
      answer: content.slice(0, start).trim()
    };
  }

  return {
    thought: content
      .slice(start + openTag.length, end)
      .trim(),
    answer: `${content.slice(0, start)}${content.slice(
      end + closeTag.length
    )}`.trim()
  };
};

type AssistantChatProps = {
  messages?: ChatMessage[];
  onMessagesChange?: React.Dispatch<
    React.SetStateAction<ChatMessage[]>
  >;
  onAssistantComplete?: (content: string) => void;
};

export default function AssistantChat({
  messages: externalMessages,
  onMessagesChange,
  onAssistantComplete
}: AssistantChatProps) {
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const messages = externalMessages ?? localMessages;
  const setMessages = onMessagesChange ?? setLocalMessages;
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thoughtOpenByIndex, setThoughtOpenByIndex] = useState<
    Record<number, boolean>
  >({});
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const readerRef =
    useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const chatIdRef = useRef<string | null>(null);
  const userIdRef = useRef<string | null>(null);
  const assistantBufferRef = useRef("");

  useEffect(() => {
    if (!autoScroll) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isStreaming, autoScroll]);

  useEffect(() => {
    setThoughtOpenByIndex((prev) => {
      let next = prev;
      let changed = false;
      messages.forEach((message, index) => {
        if (message.role !== "assistant") return;
        const { thought, answer } = extractThought(message.content);
        if (thought && prev[index] === undefined) {
          if (!changed) {
            next = { ...prev };
            changed = true;
          }
          next[index] = false;
        }
        if (thought && answer && prev[index] === true) {
          if (!changed) {
            next = { ...prev };
            changed = true;
          }
          next[index] = false;
        }
      });
      return changed ? next : prev;
    });
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("assistant-user-id");
    if (stored) {
      userIdRef.current = stored;
      return;
    }
    const created = crypto.randomUUID();
    window.localStorage.setItem("assistant-user-id", created);
    userIdRef.current = created;
  }, []);


  const submitMessage = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);

    const baseMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessage }
    ];
    const assistantIndex = baseMessages.length;

    setMessages([...baseMessages, { role: "assistant", content: "" }]);
    if (!chatIdRef.current) {
      chatIdRef.current = crypto.randomUUID();
    }
    const requestId = chatIdRef.current;
    const controller = new AbortController();
    abortRef.current = controller;
    setIsStreaming(true);

    let wasAborted = false;
    assistantBufferRef.current = "";

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: requestId,
          userId: userIdRef.current,
          message: { role: "user", content: userMessage }
        }),
        signal: controller.signal
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text().catch(() => "");
        throw new Error(errorText || "Unable to reach the assistant.");
      }

      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        if (controller.signal.aborted) {
          wasAborted = true;
          break;
        }
        const result = await reader.read();
        done = result.done;
        const chunk = result.value
          ? decoder.decode(result.value, { stream: !done })
          : "";

        if (!chunk) continue;
        assistantBufferRef.current += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          const current = updated[assistantIndex];
          if (current && current.role === "assistant") {
            updated[assistantIndex] = {
              ...current,
              content: current.content + chunk
            };
          }
          return updated;
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Request failed. Try again.";
      if (err instanceof DOMException && err.name === "AbortError") {
        wasAborted = true;
        setError(null);
        setMessages((prev) => {
          const updated = [...prev];
          const current = updated[assistantIndex];
          if (current?.role === "assistant" && current.content === "") {
            updated[assistantIndex] = {
              role: "assistant",
              content: "Stopped."
            };
          }
          return updated;
        });
        return;
      }
      setError(message);
      setMessages((prev) => {
        const updated = [...prev];
        const current = updated[assistantIndex];
        if (current?.role === "assistant" && current.content === "") {
          updated[assistantIndex] = {
            role: "assistant",
            content: "Sorry, I couldn't reach the OpenWebUI server."
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
      readerRef.current = null;
      if (assistantBufferRef.current && !wasAborted) {
        onAssistantComplete?.(assistantBufferRef.current);
      }
    }
  };

  const stopStreaming = () => {
    abortRef.current?.abort();
    void readerRef.current?.cancel();
    const requestId = chatIdRef.current;
    if (requestId) {
      void fetch("/api/assistant", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, userId: userIdRef.current })
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitMessage();
    }
  };

  return (
    <section className="grid h-full gap-5">
      <div className="flex h-full flex-col overflow-hidden rounded-none border border-white/10 bg-[#14101d]/80 shadow-xl">
        <div
          ref={scrollRef}
          onScroll={() => {
            const node = scrollRef.current;
            if (!node) return;
            const distanceFromBottom =
              node.scrollHeight - node.scrollTop - node.clientHeight;
            const nextAutoScroll = distanceFromBottom < 80;
            setAutoScroll((prev) =>
              prev === nextAutoScroll ? prev : nextAutoScroll
            );
          }}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5"
        >
          {messages.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-5 text-xs text-white/60">
              Ask anything. Streaming replies will show up here.
            </div>
          ) : (
            messages.map((message, index) => {
              const isUser = message.role === "user";
              const { thought, answer } = isUser
                ? { thought: "", answer: message.content }
                : extractThought(message.content);
              const isThoughtOpen = thoughtOpenByIndex[index] ?? false;
              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[85%] space-y-2 ${
                    isUser ? "ml-auto text-right" : "mr-auto text-left"
                  }`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
                    {isUser ? "You" : "Assistant"}
                  </p>
                  <div
                    className={`rounded-xl border px-4 py-3 text-xs leading-relaxed ${
                      isUser
                        ? "border-white/10 bg-white/10 text-white"
                        : "border-white/10 bg-[#0f0c16] text-white/90"
                    }`}
                  >
                    {!isUser && thought ? (
                      <details
                        open={isThoughtOpen}
                        onToggle={(event) => {
                          const isOpen = event.currentTarget.open;
                          setThoughtOpenByIndex((prev) => ({
                            ...prev,
                            [index]: isOpen
                          }));
                        }}
                        className="text-[11px] text-white/60"
                      >
                        <summary className="cursor-pointer select-none text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
                          Thinking
                        </summary>
                        <div className="prose mt-2 max-w-none text-[11px] leading-relaxed text-white/70 prose-invert prose-table:my-2 prose-table:w-full prose-table:table-fixed">
                          <Markdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={markdownComponents}
                          >
                            {thought}
                          </Markdown>
                        </div>
                      </details>
                    ) : null}
                    <div className="prose mt-2 max-w-none text-sm text-white/90 prose-invert prose-table:my-2 prose-table:w-full prose-table:table-fixed">
                      {answer ? (
                        <Markdown
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                          components={markdownComponents}
                        >
                          {answer}
                        </Markdown>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <span className="animate-pulse">•</span>
                          <span className="animate-pulse [animation-delay:120ms]">
                            •
                          </span>
                          <span className="animate-pulse [animation-delay:240ms]">
                            •
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>
        <form
          onSubmit={submitMessage}
          className="border-t border-white/10 bg-[#0f0c16] px-4 pt-8 pb-10"
        >
          <textarea
            className="min-h-[96px] w-full resize-none rounded-xl border border-white/10 bg-[#15111f] px-4 py-3 text-sm text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Ask about servers, streams, or automation…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/60">
            <span>Enter to send • Shift+Enter for a new line</span>
            <button
              type={isStreaming ? "button" : "submit"}
              onClick={isStreaming ? stopStreaming : undefined}
              disabled={isStreaming ? false : !input.trim()}
              className="inline-flex items-center justify-center rounded-full bg-white/90 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d0b12] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isStreaming ? "Stop" : "Send"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
