// App shell: global theme, Head, provider for audio/theme settings.
import "../styles/veraTheme.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { createContext, useState } from "react";

type VeraSettings = {
  speakerOn: boolean;
  setSpeakerOn: (v: boolean) => void;
  theme: "light" | "dark";
  setTheme: (v: "light" | "dark") => void;
};
export const VeraContext = createContext<VeraSettings>({
  speakerOn: true,
  setSpeakerOn: () => {},
  theme: "dark",
  setTheme: () => {},
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const [speakerOn, setSpeakerOn] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  return (
    <VeraContext.Provider value={{ speakerOn, setSpeakerOn, theme, setTheme }}>
      <Head>
        <title>VERA – Your Companion</title>
        <meta name="description" content="VERA – Your AI nervous system companion for somatic wellness, chat, and voice." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0A0E27" />
      </Head>
      <Component {...pageProps} />
    </VeraContext.Provider>
  );
}
