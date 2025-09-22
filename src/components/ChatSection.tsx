// src/components/ChatSection.tsx
// VERA — AI Companion chat section with typing dots animation.

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { VeraContext } from "../pages/_app";
import useSpeechRecognition from "../utils/useSpeechRecognition";
import "./ChatSection.css";

type ChatRole = "user" | "assistant" | "system";
type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  ts: number;
};

const CHIME_URL = "/vera-chime.mp3";
const USE_SERVER_TTS =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_USE_SERVER_TTS === "true";

/** Replace this with your real backend call */
async function fetchAssistantReply(prompt: string): Promise<string> {
  // TODO: connect to your LLM route
  const canned =
    "I’m here with you. Tell me what’s happening in your body right now, and what you want most from me in this moment.";
  return `You said: “${prompt}”. ${canned}`;
}

export default function ChatSection() {
  const {
    speakerOn,
    setSpeakerOn,
    voiceName = "Samantha",
  } = useContext(VeraContext) as {
    speakerOn: boolean;
    setSpeakerOn?: (on: boolean) => void;
    voiceName?: string;
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: cryptoRandomId(),
      role: "assistant",
      content: "I’m VERA. Your AI Companion. What would you like to explore together?",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    listening,
    supported: sttSupported,
    start,
    stop,
    transcript,
    error: sttError,
  } = useSpeechRecognition();

  // auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  // update input with transcript while listening
  useEffect(() => {
    if (listening && transcript) {
      setInput((prev) => {
        if (!prev || prev.trim().length === 0) return transcript;
        if (prev.includes(transcript)) return prev;
        return `${prev.trim()} ${transcript}`.trim();
      });
    }
  }, [listening, transcript]);

  const playChime = useCallback(async () => {
    try {
      const a = new Audio(CHIME_URL);
      await a.play();
    } catch {
      // ignore
    }
  }, []);

  const speakLocal = useCallback(
    async (text: string) => {
      if (!("speechSynthesis" in window)) return;
      try {
        await playChime();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "en-US";
        utter.rate = 1;
        const voices = window.speechSynthesis.getVoices();
        const match = voices.find((v) =>
          v.name.toLowerCase().includes((voiceName || "").toLowerCase())
        );
        if (match) utter.voice = match;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      } catch {
        // ignore
      }
    },
    [playChime, voiceName]
  );

  const speakServer = useCallback(
    async (text: string) => {
      try {
        await playChime();
        const res = await fetch("/api/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voice: voiceName }),
        });
        if (!res.ok) {
          await speakLocal(text);
          return;
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = url;
        await audioRef.current.play();
        setTimeout(() => URL.revokeObjectURL(url), 30_000);
      } catch {
        await speakLocal(text);
      }
    },
    [playChime, speakLocal, voiceName]
  );

  const speak = useCallback(
    async (text: string) => {
      if (!speakerOn) return;
      if (USE_SERVER_TTS) {
        await speakServer(text);
      } else {
        await speakLocal(text);
      }
    },
    [speakerOn, speakLocal, speakServer]
  );

  const handleSend = useCallback(
    async (userText?: string) => {
      const content = (userText ?? input).trim();
      if (!content) return;
      setSending(true);

      const userMsg: ChatMessage = {
        id: cryptoRandomId(),
        role: "user",
        content,
        ts: Date.now(),
      };
      setMessages((m) => [...m, userMsg]);
      setInput("");

      try {
        const reply = await fetchAssistantReply(content);
        const assistantMsg: ChatMessage = {
          id: cryptoRandomId(),
          role: "assistant",
          content: reply,
          ts: Date.now(),
        };
        // delay to simulate thinking + typing dots
        setTimeout(() => {
          setMessages((m) => [...m, assistantMsg]);
          speak(reply);
          setSending(false);
        }, 1500);
      } catch {
        const errMsg: ChatMessage = {
          id: cryptoRandomId(),
          role: "system",
          content: "Hmm, I hit a snag. Try again?",
          ts: Date.now(),
        };
        setMessages((m) => [...m, errMsg]);
        setSending(false);
      }
    },
    [input, speak]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const toggleMic = useCallback(() => {
    if (!sttSupported) return;
    if (listening) stop();
    else start();
  }, [listening, start, stop, sttSupported]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: cryptoRandomId(),
        role: "assistant",
        content: "Reset complete. I’m here. What’s on your mind?",
        ts: Date.now(),
      },
    ]);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const micAria = useMemo(() => {
    if (!sttSupported) return "Microphone not supported on this device";
    return listening ? "Stop microphone" : "Start microphone";
  }, [listening, sttSupported]);

  return (
    <section id="chat" className="chat-section" aria-labelledby="chat-heading">
      <header className="chat-header">
        <h2 id="chat-heading" className="chat-title">
          Chat with VERA
        </h2>
        <div className="chat-controls" role="group" aria-label="Chat controls">
          <button className="chat-btn" onClick={clearChat}>
            Clear
          </button>
          <button
            className="chat-btn"
            onClick={() => setSpeakerOn?.(!speakerOn)}
            aria-pressed={!!speakerOn}
          >
            {speakerOn ? "Speaker: On" : "Speaker: Off"}
          </button>
          <button
            className="chat-btn"
            onClick={toggleMic}
            disabled={!sttSupported}
            aria-label={micAria}
            aria-pressed={listening}
          >
            {sttSupported ? (listening ? "Stop Mic" : "Start Mic") : "Mic N/A"}
          </button>
        </div>
      </header>

      <div className="chat-transcript" ref={scrollRef}>
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} ts={m.ts} />
        ))}
        {sending && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
      </div>

      <form
        className="chat-composer"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <textarea
          id="chat-input"
          className="chat-input"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
        />
        <button type="submit" className="chat-send-btn" disabled={sending || !input.trim()}>
          {sending ? "…" : "Send"}
        </button>
      </form>

      {sttError && <p className="chat-hint">Mic error: {sttError}</p>}
      <audio ref={audioRef} className="sr-only" aria-hidden="true" />
    </section>
  );
}

function MessageBubble({ role, content, ts }: { role: ChatRole; content: string; ts: number }) {
  const time = new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div className={`chat-msg ${role}`}>
      <div className="chat-msg-meta">
        <span className="chat-msg-role">
          {role === "assistant" ? "VERA" : role === "user" ? "You" : "System"}
        </span>
        <time className="chat-msg-time">{time}</time>
      </div>
      <p className="chat-msg-text">{content}</p>
    </div>
  );
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}
