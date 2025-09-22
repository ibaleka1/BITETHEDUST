// Chat + voice section: transcript, mic (STT), speaker toggle, language select, TTS.
// Assistant replies are factored into fetchAssistantReply(prompt: string).
import React, { useState, useRef, useEffect, useContext } from "react";
import { VeraContext } from "../pages/_app";
import useSpeechRecognition from "../utils/useSpeechRecognition";
import "./VERACompanion.css";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  ts: number;
};

const LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "es-ES", label: "Español" },
  { code: "fr-FR", label: "Français" },
];

export default function VERACompanion() {
  const { speakerOn } = useContext(VeraContext);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hello! How is your body feeling right now?",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("en-US");
  const [isSending, setIsSending] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // STT hook
  const speech = useSpeechRecognition({ lang });

  // Scroll to end on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // When STT transcript updates and listening stopped, drop into input
  useEffect(() => {
    if (speech.transcript && !speech.listening && speech.supported) {
      setInput(speech.transcript);
    }
  }, [speech.transcript, speech.listening, speech.supported]);

  // Utility: gentle chime before speaking
  const playChime = () => {
    const audio = new Audio("/vera-chime.mp3");
    audio.play().catch(() => {});
  };

  // TTS (browser or server endpoint)
  const speak = async (text: string) => {
    if (!speakerOn) return;
    setSpeaking(true);
    playChime();

    try {
      if (process.env.NEXT_PUBLIC_USE_SERVER_TTS === "true") {
        const r = await fetch("/api/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voice: lang }),
        });
        if (r.ok) {
          const blob = await r.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          await audio.play();
          audio.onended = () => setSpeaking(false);
          return;
        }
      }

      if ("speechSynthesis" in window) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang;
        utter.rate = 1;
        const voices = window.speechSynthesis.getVoices();
        utter.voice = voices.find((v) => v.lang === lang) || undefined;
        utter.onend = () => setSpeaking(false);
        window.speechSynthesis.speak(utter);
      } else {
        setSpeaking(false);
      }
    } catch {
      setSpeaking(false);
    }
  };

  // TODO: replace this with your real LLM/backend
  async function fetchAssistantReply(prompt: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 700));
    const p = prompt.toLowerCase();
    if (p.includes("tight") || p.includes("chest"))
      return "I hear the tightness. Place a hand there. Soften your shoulders a millimeter and notice what shifts.";
    if (p.includes("anxious"))
      return "Press your feet into the floor gently. You're here. That extra electricity just needs ground.";
    if (p.includes("relax"))
      return "Try this: tense everything for 3 seconds… then release. Teach your body the difference.";
    if (p.includes("safe"))
      return "Name five things you can see, four you can touch, three you hear, two you smell, one you taste.";
    return "Where is this most alive in your body—sharp or dull, moving or still, hot or cold?";
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const value = input.trim();
    if (!value || isSending) return;

    const now = Date.now();
    setMessages((m) => [...m, { role: "user", text: value, ts: now }]);
    setInput("");
    setIsSending(true);

    try {
      const reply = await fetchAssistantReply(value);
      setMessages((m) => [...m, { role: "assistant", text: reply, ts: Date.now() }]);
      speak(reply);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section id="chat" className="vera-companion">
      <header className="vc-header">
        <h2>Speak With VERA</h2>
        <p className="sub">I'm here. I see you. Talk to me.</p>

        <div className="controls">
          <div className="control">
            <label htmlFor="lang">Language</label>
            <select
              id="lang"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Select language"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control stt">
            <button
              type="button"
              className={`pill ${speech.listening ? "active" : ""}`}
              onClick={() => (speech.listening ? speech.stop() : speech.start())}
              disabled={!speech.supported}
              aria-pressed={speech.listening}
            >
              {speech.listening ? "🎙️ Listening…" : "🎤 Speak"}
            </button>
            {!speech.supported && <span className="hint">STT not supported</span>}
          </div>

          <div className="control tts">
            <span className={`pill ${speaking ? "speaking" : ""}`}>
              🔊 {speaking ? "Speaking…" : speakerOn ? "Voice On" : "Voice Off"}
            </span>
          </div>
        </div>
      </header>

      <div className="vc-chat">
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <div className="bubble">{m.text}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form className="composer" onSubmit={submit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell VERA what you're feeling…"
            aria-label="Message VERA"
          />
          <button type="submit" disabled={isSending}>
            {isSending ? "…" : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
}
