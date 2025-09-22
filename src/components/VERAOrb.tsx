import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import "./VERAOrb.css";

// Optional context (won't break if you don't have it wired yet)
let VeraCtx: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  VeraCtx = require("../pages/_app").VeraContext;
} catch {
  // noop – context is optional
}
const VeraContext =
  VeraCtx?.VeraContext ??
  React.createContext({ speakerOn: true, setSpeakerOn: (_: boolean) => {} });

type ChatMessage = {
  role: "user" | "assistant" | "system";
  text: string;
  ts: number;
};

type STTState = {
  supported: boolean;
  listening: boolean;
  transcript: string;
  error?: string | null;
};

const LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "es-ES", label: "Español" },
  { code: "fr-FR", label: "Français" },
];

// ---------- simple built-in STT (graceful fallback) ----------
function useBuiltInSTT(
  lang: string
): [STTState, { start: () => void; stop: () => void; reset: () => void }] {
  const recRef = useRef<SpeechRecognition | null>(null);
  const [state, setState] = useState<STTState>({
    supported: false,
    listening: false,
    transcript: "",
    error: null,
  });

  useEffect(() => {
    // @ts-ignore
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setState((s) => ({ ...s, supported: false }));
      return;
    }
    const rec: SpeechRecognition = new SR();
    recRef.current = rec;
    rec.lang = lang;
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => setState((s) => ({ ...s, listening: true, error: null }));
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let t = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        t += e.results[i][0].transcript;
      }
      setState((s) => ({ ...s, transcript: t }));
    };
    rec.onerror = (e: any) => {
      setState((s) => ({ ...s, error: e?.error || "stt_error", listening: false }));
    };
    rec.onend = () => {
      setState((s) => ({ ...s, listening: false }));
    };

    setState((s) => ({ ...s, supported: true, error: null }));

    return () => {
      try {
        rec.onstart = null as any;
        rec.onresult = null as any;
        rec.onerror = null as any;
        rec.onend = null as any;
        // @ts-ignore
        rec.abort?.();
      } catch {}
      recRef.current = null;
    };
  }, [lang]);

  const start = useCallback(() => {
    if (!recRef.current) return;
    try {
      // Reset transcript for a fresh capture
      setState((s) => ({ ...s, transcript: "" }));
      recRef.current.start();
    } catch {}
  }, []);

  const stop = useCallback(() => {
    if (!recRef.current) return;
    try {
      recRef.current.stop();
    } catch {}
  }, []);

  const reset = useCallback(() => {
    setState((s) => ({ ...s, transcript: "" }));
  }, []);

  return [state, { start, stop, reset }];
}

// ---------- main component ----------
export default function VERAOrb({
  initialLang = "en-US",
  welcome = "Hello. I’m here. What’s alive in your body right now?",
  showControls = true,
  onSend, // optional: if you want to receive the user text externally
}: {
  initialLang?: string;
  welcome?: string;
  showControls?: boolean;
  onSend?: (text: string) => void | Promise<void>;
}) {
  const ctx = useContext(VeraContext);
  const externalSpeaker = typeof ctx?.speakerOn === "boolean" ? ctx.speakerOn : undefined;
  const setExternalSpeaker = typeof ctx?.setSpeakerOn === "function" ? ctx.setSpeakerOn : undefined;

  const [lang, setLang] = useState(initialLang);
  const [speakerOn, setSpeakerOn] = useState<boolean>(externalSpeaker ?? true);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: welcome, ts: Date.now() },
  ]);
  const [presenceState, setPresenceState] = useState<
    "idle" | "listening" | "thinking" | "speaking"
  >("idle");
  const endRef = useRef<HTMLDivElement | null>(null);
  const chimeRef = useRef<HTMLAudioElement | null>(null);

  const [stt, sttCtrl] = useBuiltInSTT(lang);

  // keep local speaker state synced with context if present
  useEffect(() => {
    if (externalSpeaker !== undefined) {
      setSpeakerOn(externalSpeaker);
    }
  }, [externalSpeaker]);

  useEffect(() => {
    if (setExternalSpeaker) setExternalSpeaker(speakerOn);
  }, [speakerOn, setExternalSpeaker]);

  // scroll chat to end when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // if STT produced transcript and stopped, move text to input
  useEffect(() => {
    if (!stt.listening && stt.transcript) {
      setInput(stt.transcript.trim());
    }
  }, [stt.listening, stt.transcript]);

  // preload a gentle chime
  useEffect(() => {
    chimeRef.current = new Audio("/vera-chime.mp3");
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!speakerOn) return;
      const playChime = () => {
        try {
          chimeRef.current?.currentTime && (chimeRef.current.currentTime = 0);
          chimeRef.current?.play();
        } catch {}
      };

      // Option 1: remote TTS (set NEXT_PUBLIC_USE_SERVER_TTS=true)
      if (process.env.NEXT_PUBLIC_USE_SERVER_TTS === "true") {
        playChime();
        fetch("/api/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voice: lang }),
        })
          .then((r) => (r.ok ? r.blob() : Promise.reject(new Error("speak_failed"))))
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            setPresenceState("speaking");
            audio.onended = () => setPresenceState("idle");
            audio.play();
          })
          .catch(() => {
            // fallback to client TTS
            tryClientTTS(text, playChime);
          });
        return;
      }

      // Option 2: client TTS
      const tryClientTTS = (t: string, bell?: () => void) => {
        if (!("speechSynthesis" in window)) return;
        bell?.();
        const msg = new SpeechSynthesisUtterance(t);
        msg.lang = lang;
        msg.rate = 1;
        msg.pitch = 1.05;
        const voices = window.speechSynthesis.getVoices();
        msg.voice = voices.find((v) => v.lang === lang) || null;
        msg.onstart = () => setPresenceState("speaking");
        msg.onend = () => setPresenceState("idle");
        window.speechSynthesis.speak(msg);
      };

      tryClientTTS(text, playChime);
    },
    [lang, speakerOn]
  );

  // Mock assistant (replace with your real API later)
  const fetchAssistantReply = useCallback(async (prompt: string): Promise<string> => {
    setPresenceState("thinking");
    await new Promise((r) => setTimeout(r, 650));
    // You can route to your model API here.
    // Keep the tone aligned with your brand:
    const temps: string[] = [
      "I’m with you. Where in your body is this most alive right now?",
      "Gently place a hand where it feels most intense. We’ll listen together.",
      "Let’s slow everything down. Inhale for four… hold… exhale for six. What changes?",
      "You’re not alone in this. Describe the sensation’s shape, size, and temperature.",
    ];
    const reply = temps[(Math.random() * temps.length) | 0];
    return reply;
  }, []);

  const send = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isSending) return;
      setIsSending(true);
      setPresenceState("idle");
      setMessages((m) => [...m, { role: "user", text: content, ts: Date.now() }]);
      setInput("");
      try {
        if (onSend) await onSend(content);
        const reply = await fetchAssistantReply(content);
        setMessages((m) => [...m, { role: "assistant", text: reply, ts: Date.now() }]);
        speak(reply);
      } finally {
        setIsSending(false);
      }
    },
    [fetchAssistantReply, input, isSending, onSend, speak]
  );

  const micToggle = useCallback(() => {
    if (!stt.supported) return;
    if (stt.listening) {
      sttCtrl.stop();
      setPresenceState("idle");
    } else {
      sttCtrl.reset();
      sttCtrl.start();
      setPresenceState("listening");
    }
  }, [stt.supported, stt.listening, sttCtrl]);

  const orbStatusLabel = useMemo(() => {
    switch (presenceState) {
      case "listening":
        return "VERA is listening";
      case "thinking":
        return "VERA is thinking";
      case "speaking":
        return "VERA is speaking";
      default:
        return "VERA is here";
    }
  }, [presenceState]);

  return (
    <section className="vera-orb-wrap" aria-labelledby="vera-orb-heading">
      <h2 id="vera-orb-heading" className="sr-only">
        VERA Companion
      </h2>

      {/* Animated Presence */}
      <div
        className={`vera-orb ${presenceState}`}
        role="img"
        aria-label={orbStatusLabel}
        aria-live="polite"
        tabIndex={0}
      >
        <div className="orb-core" />
        <div className="orb-halo" />
        <div className="orb-field">
          {/* decorative spark layers */}
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="spark" style={{ ["--i" as any]: i }} />
          ))}
        </div>

        {/* subtle status ring */}
        <div className="orb-status">
          {presenceState === "listening" && <span>Listening…</span>}
          {presenceState === "thinking" && <span>Thinking…</span>}
          {presenceState === "speaking" && <span>Speaking…</span>}
          {presenceState === "idle" && <span>Here with you</span>}
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="vera-controls" role="group" aria-label="VERA controls">
          <div className="vera-controls-left">
            <button
              className={`ctrl ctrl-mic ${stt.listening ? "active" : ""}`}
              onClick={micToggle}
              disabled={!stt.supported}
              aria-pressed={stt.listening}
              aria-label={
                stt.supported
                  ? stt.listening
                    ? "Stop listening"
                    : "Start listening"
                  : "Microphone not supported"
              }
              title={
                stt.supported
                  ? "Hold a phrase and release"
                  : "Speech recognition not supported on this browser"
              }
            >
              🎤
            </button>

            <button
              className={`ctrl ctrl-speaker ${speakerOn ? "active" : ""}`}
              onClick={() => setSpeakerOn((v) => !v)}
              aria-pressed={speakerOn}
              aria-label={speakerOn ? "Mute VERA voice" : "Unmute VERA voice"}
              title="Toggle voice guidance"
            >
              🔊
            </button>

            <label className="lang-label" htmlFor="vera-orb-lang">
              <span className="sr-only">Language</span>
              <select
                id="vera-orb-lang"
                className="lang-select"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label="Speech language"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="vera-controls-right">
            <form
              className="send-form"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <input
                className="send-input"
                type="text"
                placeholder="Tell VERA what you're feeling…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Type a message to VERA"
              />
              <button className="send-btn" type="submit" disabled={isSending || !input.trim()}>
                {isSending ? "…" : "Send"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Minimal transcript hint */}
      {stt.supported && stt.listening && (
        <div className="stt-transcript" aria-live="polite">
          {stt.transcript || "Listening…"}
        </div>
      )}

      {/* Conversation preview (compact – orb is primary UI) */}
      <div className="vera-orb-messages" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`m ${m.role}`}>
            <div className="bubble">{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* non-blocking error for STT */}
      {stt.error && (
        <p className="stt-error" role="status">
          Mic error: {String(stt.error)}
        </p>
      )}
    </section>
  );
}
