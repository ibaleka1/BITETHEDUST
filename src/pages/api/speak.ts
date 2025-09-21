import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { text } = req.body;
  const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID!;
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;

  if (!text || !ELEVENLABS_VOICE_ID || !ELEVENLABS_API_KEY)
    return res.status(400).json({ error: "Missing data" });

  const apiRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.7,
        use_speaker_boost: true,
      },
    }),
  });

  if (!apiRes.ok) {
    const err = await apiRes.text();
    return res.status(500).json({ error: err });
  }

  res.setHeader("Content-Type", "audio/mpeg");
  const audioBuffer = await apiRes.arrayBuffer();
  res.send(Buffer.from(audioBuffer));
}
