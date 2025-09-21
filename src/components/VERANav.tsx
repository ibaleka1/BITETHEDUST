// Chat + voice section: transcript, mic (STT), speaker toggle, language select, TTS.
// Factor assistant reply into fetchAssistantReply(prompt: string): Promise<string>.
import React, { useState, useRef, useEffect, useContext } from "react";
import { VeraContext } from "../pages/_app";
import useSpeechRecognition from "../utils/useSpeechRecognition";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  ts: number;
};

const LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "es-ES", label: "Español" },
  { code: "fr-FR", label: "Français" }
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
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // STT hook
  const speech = useSpeechRecognition({ lang });

  // Scroll to end when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // When STT transcript updates
  useEffect(() => {
    if (speech.transcript && !speech.listening && speech.supported) {
      setInput(speech.transcript);
    }
  }, [speech.transcript, speech.listening, speech.supported]);

  // Utility: Play chime before speaking
  const playChime = () => {
    const audio = new Audio("/vera-chime.mp3");
    audio.play();
  };

  // TTS: browser or server (ElevenLabs)
  const speak = (text: string) => {
    if (!speakerOn) return;
    playChime();
    if (process.env.NEXT_PUBLIC_USE_SERVER_TTS === "true") {
      fetch("/api/speak", {
        method: "POST",
        body: JSON.stringify({ text, voice: lang }),
        headers: { "Content-Type": "application/json" },
      })
        .then((r) => r.ok ? r.blob() : null)
        .then((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.play();
          }
        });
    } else if ("speechSynthesis" in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = lang;
      utter.rate = 1;
      // Use preferred voice if available
      const voices = window.speechSynthesis.getVoices();
      utter.voice = voices.find((v) => v.lang === lang) || undefined;
      window.speechSynthesis.speak(utter);
    }
  };

  // Mock LLM reply (replace with real endpoint later)
  async function fetchAssistantReply(prompt: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 800));
    return (
      "Thank you for sharing. Can you notice where in your body this is most alive?"
    );
  }

  // Send message
  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim()) return;
    const now = Date.now();
    setMessages((m) => [...m, { role: "user", text: input, ts: now }]);
    setIsSending(true);
    setInput("");
    const reply = await fetchAssistantReply(input);
    setMessages
