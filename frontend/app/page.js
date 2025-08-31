/*
Next.js + Tailwind AI Chatbot (homepage example)

Usage:
- Place this code into your `pages/index.jsx` (Pages Router) or `app/page.jsx` (App Router).
- Then you can refactor into components (MessageList, ChatInput, etc.) as needed.
- Make sure Tailwind CSS is configured.
- Add the `/api/chat` endpoint as shown at the bottom to connect to your AI backend.
*/
"use client";
import { useEffect, useRef, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

const STORAGE_KEY = "ai_chat_conversation_v1";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function HomePage() {
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw
        ? JSON.parse(raw)
        : [{ role: "system", content: "You are a helpful assistant." }];
    } catch (e) {
      return [{ role: "system", content: "You are a helpful assistant." }];
    }
  });
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {}
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function addMessage(role, content) {
    setMessages((m) => [...m, { role, content }]);
  }

  async function handleSend(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    addMessage("user", text);
    setInput("");

    addMessage("assistant", "");
    setIsSending(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: `Error: ${errText}`,
          };
          return copy;
        });
        setIsSending(false);
        return;
      }

      const reader = resp.body?.getReader?.();
      if (reader) {
        const decoder = new TextDecoder();
        let done = false;
        let accumulated = "";
        while (!done) {
          const { value, done: d } = await reader.read();
          done = d;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            accumulated += chunk;
            setMessages((prev) => {
              const copy = [...prev];
              copy[copy.length - 1] = {
                role: "assistant",
                content: accumulated,
              };
              return copy;
            });
          }
        }
      } else {
        const text = await resp.text();
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: text };
          return copy;
        });
      }
    } catch (error) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: `Network error: ${error.message}`,
        };
        return copy;
      });
    } finally {
      setIsSending(false);
    }
  }

  function clearConversation() {
    const base = [{ role: "system", content: "You are a helpful assistant." }];
    setMessages(base);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Loj(AI)stik Chatbot
          </h1>
        </header>

        <main className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden flex flex-col min-h-[70vh]">
          <div className="flex-1 overflow-auto p-6 space-y-4">
            {messages.map((m, idx) => {
              if (m.role === "system") return null;
              const isUser = m.role === "user";
              return (
                <div
                  key={idx}
                  className={classNames(
                    "flex",
                    isUser ? "justify-end" : "justify-start"
                  )}>
                  <div
                    className={classNames(
                      "max-w-[80%] px-4 py-2 rounded-lg whitespace-pre-wrap leading-relaxed text-sm",
                      isUser
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                    )}>
                    {m.content}
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Mesajınızı yazın..."
                className="flex-1 resize-none rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50">
                <PaperAirplaneIcon className="w-4 h-4 rotate-45" />
                <span className="text-sm">Send</span>
              </button>
              <button
                onClick={clearConversation}
                className="text-sm px-3 py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100">
                Clear
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

/*
Example Next.js API route (pages/api/chat.js)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { message } = req.body || {};
  if (!message) return res.status(400).send("Missing `message`");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const reply = `You asked: ${message}\n\n(This is an example response.)`;
      controller.enqueue(encoder.encode(reply));
      controller.close();
    },
  });

  const reader = stream.getReader();
  const chunker = async () => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      await res.write(value);
    }
    res.end();
  };
  chunker();
}
*/
