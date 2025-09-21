// src/components/ChatSection.tsx
// VERA — AI Companion chat section (text + voice). Accessible & mobile-friendly.
// - Text input with Enter-to-send, Shift+Enter newline
// - Mic input via Web Speech (fallback to text if unsupported)
// - Speaker toggle: server TTS (/api/speak) when NEXT_PUBLIC_USE_SERVER_TTS=true; else Web Speech Synthesis
// - Swap in your real LLM by editing fetchAssistantReply()

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { VeraContext } from "../pages/_app";
import useSpeechRecognition from "../utils/useSpeechRecognition";

type ChatRole = "user" | "assistant" | "system";
type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  ts: number;
};

const CHIME_URL = "/vera-chime.mp3";
const USE_SERVER_TTS = typeof window !== "undefined" && (window as any)?.__NEXT_DATA__
  ? (process.env.NEXT_PUBLIC_USE_SERVER_TTS === "true")
  : (typeof process !== "undefined" && process.env.NEXT_PUBLIC_USE_SERVER_TTS === "true");

/** Replace this with your real backend call */
async function fetchAssistantReply(prompt: string): Promise<string> {
  // TODO: integrate your LLM route here (e.g., /api/chat)
  // Keep it deterministic for now
  const canned =
    "I’m here with you. Tell me what’s happening in your body right now, and what you want most from me in this moment.";
  // Simple echo + supportive close, trimmed to avoid run-on
  const summary = prompt.length > 500 ? prompt.slice(0, 500) + "…" : prompt;
  return `You said: “${summary}”. ${canned}`;
}

export default function ChatSection() {
  const {
    speakerOn,
    setSpeakerOn, // optional in your context; will guard below
    voiceName = "Samantha" // prefer an American English Web Speech voice if available
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

  // Speech recognition (browser Web Speech API)
  const {
    listening,
    supported: sttSupported,
    start,
    stop,
    transcript,
    error: sttError,
  } = useSpeechRecognition();

  // autoscroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // move partial transcript into input while listening (non-destructive)
  useEffect(() => {
    if (listening && transcript) {
      setInput((prev) => {
        // If user typed while listening, prefer typed content + space + transcript
        if (!prev || prev.trim().length === 0) return transcript;
        if (prev.includes(transcript)) return prev; // avoid duplicates
        return `${prev.trim()} ${transcript}`.trim();
      });
    }
  }, [listening, transcript]);

  // play a short chime before TTS
  const playChime = useCallback(async () => {
    try {
      const a = new Audio(CHIME_URL);
      await a.play();
    } catch {
      // ignore
    }
  }, []);

  // Web Speech Synthesis fallback
  const speakLocal = useCallback(
    async (text: string) => {
      if (!("speechSynthesis" in window)) return;
      try {
        await playChime();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "en-US";
        utter.rate = 1;
        // try to pick a voice by name if present
        const voices = window.speechSynthesis.getVoices();
        const match = voices.find((v) => v.name.toLowerCase().includes((voiceName || "").toLowerCase()));
        if (match) utter.voice = match;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      } catch {
        // ignore
      }
    },
    [playChime, voiceName]
  );

  // Server TTS via /api/speak
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
          // fallback to local if server disabled
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
        // cleanup
        setTimeout(() => URL.revokeObjectURL(url), 30_000);
      } catch {
        await speakLocal(text);
      }
    },
    [playChime, speakLocal, voiceName]
  );

  // unified TTS (guard by context speaker toggle)
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

      const userMsg: ChatMessage = { id: cryptoRandomId(), role: "user", content, ts: Date.now() };
      setMessages((m) => [...m, userMsg]);
      setInput("");

      try {
        const reply = await fetchAssistantReply(content);
        const assistantMsg: ChatMessage = { id: cryptoRandomId(), role: "assistant", content: reply, ts: Date.now() };
        setMessages((m) => [...m, assistantMsg]);
        await speak(reply);
      } catch (e) {
        const errMsg: ChatMessage = {
          id: cryptoRandomId(),
          role: "system",
          content: "Hmm, I hit a snag. Try again?",
          ts: Date.now(),
        };
        setMessages((m) => [...m, errMsg]);
      } finally {
        setSending(false);
      }
    },
    [input, speak]
  );

  // keyboard handling: Enter to send; Shift+Enter for newline
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // mic toggle
  const toggleMic = useCallback(() => {
    if (!sttSupported) return;
    if (listening) stop();
    else start();
  }, [listening, start, stop, sttSupported]);

  // clear chat
  const clearChat = useCallback(() => {
    setMessages([
      {
        id: cryptoRandomId(),
        role: "assistant",
        content: "Reset complete. I’m here. What’s on your mind?",
        ts: Date.now(),
      },
    ]);
    // stop any talking
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  // a11y label for mic button
  const micAria = useMemo(() => {
    if (!sttSupported) return "Microphone not supported on this device";
    return listening ? "Stop microphone" : "Start microphone";
  }, [listening, sttSupported]);

  return (
    <section id="chat" className="chat-section" aria-labelledby="chat-heading">
      <header className="chat-header">
        <h2 id="chat-heading" className="chat-title">Chat with VERA</h2>

        <div className="chat-controls" role="group" aria-label="Chat controls">
          <button
            type="button"
            className="chat-btn"
            onClick={clearChat}
            aria-label="Clear chat"
            title="Clear chat"
          >
            Clear
          </button>

          <button
            type="button"
            className="chat-btn"
            onClick={() => setSpeakerOn?.(!speakerOn)}
            aria-pressed={!!speakerOn}
            aria-label={speakerOn ? "Turn speaker off" : "Turn speaker on"}
            title={speakerOn ? "Speaker: on" : "Speaker: off"}
          >
            {speakerOn ? "Speaker: On" : "Speaker: Off"}
          </button>

          <button
            type="button"
            className="chat-btn"
            onClick={toggleMic}
            disabled={!sttSupported}
            aria-label={micAria}
            aria-pressed={listening}
            title={sttSupported ? (listening ? "Listening…" : "Start mic") : "Mic not supported"}
          >
            {sttSupported ? (listening ? "Stop Mic" : "Start Mic") : "Mic N/A"}
          </button>
        </div>
      </header>

      <div className="chat-transcript" ref={scrollRef} role="log" aria-live="polite" aria-relevant="additions">
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} content={m.content} ts={m.ts} />
        ))}
      </div>

      <form
        className="chat-composer"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          Message VERA
        </label>
        <textarea
          id="chat-input"
          className="chat-input"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          aria-label="Message input"
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={sending || (!input.trim() && !transcript)}
          aria-label="Send message"
          title="Send"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </form>

      {/* optional STT error notice */}
      {sttError && <p className="chat-hint" role="status">Mic error: {sttError}</p>}

      {/* visually hidden audio node used by server TTS */}
      <audio ref={audioRef} className="sr-only" aria-hidden="true" />
    </section>
  );
}

function MessageBubble({ role, content, ts }: { role: ChatRole; content: string; ts: number }) {
  const time = new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const isAssistant = role === "assistant";
  const isSystem = role === "system";
  return (
    <div className={`chat-msg ${isAssistant ? "assistant" : role} ${isSystem ? "system" : ""}`}>
      <div className="chat-msg-meta">
        <span className="chat-msg-role">{labelForRole(role)}</span>
        <time className="chat-msg-time" dateTime={new Date(ts).toISOString()}>{time}</time>
      </div>
      <p className="chat-msg-text">{content}</p>
    </div>
  );
}

function labelForRole(role: ChatRole) {
  if (role === "assistant") return "VERA";
  if (role === "user") return "You";
  return "System";
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

