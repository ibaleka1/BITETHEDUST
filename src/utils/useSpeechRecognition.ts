/**
 * useSpeechRecognition - React hook for Web Speech API recognition.
 * Returns: { listening, supported, start, stop, transcript, error }
 */
import { useCallback, useEffect, useRef, useState } from "react";

type UseSpeechRecognitionReturn = {
  listening: boolean;
  supported: boolean;
  transcript: string;
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
};

export default function useSpeechRecognition(opts?: { lang?: string }): UseSpeechRecognitionReturn {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = opts?.lang || "en-US";

      recognitionRef.current.onresult = (e: SpeechRecognitionEvent) => {
        setTranscript(e.results[0][0].transcript);
      };
      recognitionRef.current.onerror = (e: any) => {
        setError(e.error || "Recognition error");
        setListening(false);
      };
      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }
  }, [opts?.lang]);

  const start = useCallback(() => {
    if (!supported || !recognitionRef.current) return;
    setTranscript("");
    setError(null);
    try {
      recognitionRef.current!.start();
      setListening(true);
    } catch (e) {
      setError("Unable to start recognition");
      setListening(false);
    }
  }, [supported]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setError(null);
    setListening(false);
  }, []);

  return { listening, supported, transcript, error, start, stop, reset };
}
