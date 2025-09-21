// App shell: imports global CSS, sets up Head, provides theme and a simple global state.
import "../styles/veraTheme.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { createContext, useState } from "react";

export type GlobalStore = {
  serverTTS: boolean;
  setServerTTS: (v: boolean) => void;
};
export const VeraContext = createContext<GlobalStore>({
  serverTTS: process.env.NEXT_PUBLIC_USE_SERVER_TTS === "true",
  setServerTTS: () => {},
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const [serverTTS, setServerTTS] = useState(
    process.env.NEXT_PUBLIC_USE_SERVER_TTS === "true"
  );

  return (
    <VeraContext.Provider value={{ serverTTS, setServerTTS }}>
      <Head>
        <title>VERA – Your Companion</title>
        <meta
          name="description"
          content="VERA – Your AI nervous system companion for somatic wellness, chat, and voice."
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0A0E27" />
      </Head>
      <Component {...pageProps} />
    </VeraContext.Provider>
  );
}
