"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import {
  AiChatHistoryMessage,
  AiChatQuickAction,
  sendAiChatMessage,
} from "@/app/actions/ai";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: AiChatQuickAction[];
};

const STORAGE_KEY = "equipflow-chat-session-v1";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I’m your EquipFlow assistant. Ask me about booking steps, equipment info, payment, or returns.",
  suggestions: [
    { label: "Browse Equipment", href: "/equipment" },
    { label: "How Booking Works", href: "/about" },
  ],
};

const isValidStoredMessage = (value: unknown): value is ChatMessage => {
  if (!value || typeof value !== "object") return false;

  const role = (value as { role?: unknown }).role;
  const content = (value as { content?: unknown }).content;
  if ((role !== "user" && role !== "assistant") || typeof content !== "string") return false;

  const suggestions = (value as { suggestions?: unknown }).suggestions;
  if (suggestions === undefined) return true;

  return Array.isArray(suggestions) && suggestions.every((item) => {
    if (!item || typeof item !== "object") return false;
    const label = (item as { label?: unknown }).label;
    const href = (item as { href?: unknown }).href;
    return typeof label === "string" && typeof href === "string";
  });
};

const getInitialMessages = (): ChatMessage[] => {
  if (typeof window === "undefined") return [WELCOME_MESSAGE];

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME_MESSAGE];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [WELCOME_MESSAGE];

    const safeMessages = parsed.filter(isValidStoredMessage).slice(-20);
    return safeMessages.length > 0 ? safeMessages : [WELCOME_MESSAGE];
  } catch {
    return [WELCOME_MESSAGE];
  }
};

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const historyForApi = useMemo<AiChatHistoryMessage[]>(() => {
    return messages.slice(-8).map((message) => ({
      role: message.role,
      content: message.content,
    }));
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const messageText = input.trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
    };

    const nextHistory = [...historyForApi, { role: "user", content: messageText }].slice(-8);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const response = await sendAiChatMessage(messageText, nextHistory);

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: response.reply,
      suggestions: response.suggestions,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#e8612e] text-white shadow-xl shadow-black/30 hover:bg-[#f07248]"
        aria-label="Toggle AI assistant chat"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-5 z-[70] w-[min(24rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-[#e0dbd3] bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#ece6de] bg-[#111] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot size={16} />
              <p className="text-sm font-semibold">EquipFlow Assistant</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-96 space-y-3 overflow-y-auto bg-[#f9f8f6] p-4">
            {messages.map((message) => (
              <div key={message.id} className={message.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={`inline-block max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${message.role === "user"
                    ? "bg-[#111] text-white"
                    : "border border-[#e6dfd5] bg-white text-[#222]"
                    }`}
                >
                  {message.content}
                </div>

                {message.role === "assistant" && message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion) => (
                      <Link
                        key={`${message.id}-${suggestion.href}`}
                        href={suggestion.href}
                        className="rounded-full border border-[#e0dbd3] bg-white px-3 py-1 text-xs font-medium text-[#555] hover:border-[#e8612e] hover:text-[#e8612e]"
                      >
                        {suggestion.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="text-left">
                <div className="inline-flex items-center gap-2 rounded-xl border border-[#e6dfd5] bg-white px-3 py-2 text-sm text-[#666]">
                  <Loader2 size={14} className="animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={onSubmit} className="border-t border-[#ece6de] bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about booking, returns, or equipment..."
                className="h-10 flex-1 rounded-lg border border-[#dfd8ce] px-3 text-sm text-[#111] outline-none focus:border-[#e8612e]"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8612e] text-white disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send chat message"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

