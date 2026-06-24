"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ChatMsg = { sender: "visitor" | "admin"; body: string };

export function FloatingActions() {
  const t = useTranslations("Floating");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const waLink = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    t("whatsappMessage"),
  )}`;

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([{ sender: "admin", body: t("chatGreeting") }]);
    }
  }, [chatOpen, messages.length, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send() {
    const body = input.trim();
    if (!body) return;
    setMessages((m) => [...m, { sender: "visitor", body }]);
    setInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, body }),
      });
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          { sender: "admin", body: data.reply ?? t("chatOffline") },
        ]);
      }, 600);
    } catch {
      setMessages((m) => [...m, { sender: "admin", body: t("chatOffline") }]);
    }
  }

  return (
    <>
      {/* Chat panel */}
      <div
        className={cn(
          "fixed bottom-24 right-5 z-[60] w-[min(360px,calc(100vw-2.5rem))] origin-bottom-right rounded-2xl border border-border bg-white shadow-2xl transition-all duration-300 sm:right-6",
          chatOpen ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0",
        )}
      >
        <div className="flex items-center justify-between rounded-t-2xl bg-ink px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-semibold">{t("chatTitle")}</span>
          </div>
          <button onClick={() => setChatOpen(false)} aria-label="Close chat">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div ref={scrollRef} className="h-72 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                m.sender === "visitor"
                  ? "ml-auto bg-gold text-ink"
                  : "bg-muted text-ink",
              )}
            >
              {m.body}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-border p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t("chatPlaceholder")}
            className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button size="icon" variant="gold" onClick={send} aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Buttons */}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 sm:right-6">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Sales"
          className="flex h-14 w-14 animate-pulse-ring items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
        <button
          onClick={() => setChatOpen((v) => !v)}
          aria-label="Live chat"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-lg transition-transform hover:scale-105"
        >
          {chatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>
    </>
  );
}
