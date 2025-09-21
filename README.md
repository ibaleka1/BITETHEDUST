# VERA – Your Companion

Educational wellness chat app with voice in/out, breathing/swaying orbs, grounding and mismatch tools, features/pricing/methodology/exercises sections, and serverless API routes for speech, feedback, and checkout. **Deploys on Vercel.**

---

## Quick Start

1. **Clone & install:**
   ```sh
   pnpm i
   # or
   npm install
   # or
   yarn install
   ```

2. **Set required env vars (see below).**

3. **Run locally:**
   ```sh
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

4. **Production build:**
   ```sh
   pnpm build && pnpm start
   # or
   npm run build && npm run start
   # or
   yarn build && yarn start
   ```

5. **Deploy to Vercel:**
   - Import project at [https://vercel.com/import](https://vercel.com/import)
   - Set Environment Variables in Vercel dashboard before deploy.

---

## Required Environment Variables

| Name                     | Description                                           | Example                 |
|--------------------------|-------------------------------------------------------|-------------------------|
| NEXT_PUBLIC_USE_SERVER_TTS | Use ElevenLabs TTS via API (`true` or `false`)      | true                    |
| ELEVENLABS_API_KEY         | ElevenLabs API key (if using server TTS)            | sk-...                  |
| SLACK_WEBHOOK_URL          | Slack webhook for feedback (optional)               | https://hooks.slack...  |
| STRIPE_SECRET_KEY          | Stripe secret key (for checkout)                    | sk_live_...             |
| NEXT_PUBLIC_PRICE_ID       | Stripe price ID for VERA Monthly plan               | price_123...            |

---

## Features

- Accessible, mobile-first, no console errors, strict TypeScript.
- Chat with VERA (voice in/out, language select, speaker toggle).
- Interactive breathing/swaying/neuron orbs.
- Grounding tool & somatic mismatch journal.
- Features/pricing/methodology/exercises/heart sections.
- API routes for speech (TTS), feedback, Stripe checkout.
- All styling in CSS files; no Tailwind.

---

## Project Structure

```
public/
  android-chrome-*.png
  apple-touch-icon.png
  favicon-*.png
  favicon.ico
  site.webmanifest
  vera-chime.mp3

src/
  components/
    *.tsx, *.css
  pages/
    api/
      create-checkout.ts
      feedback.ts
      speak.ts
    _app.tsx
    index.tsx
  styles/
    veraTheme.css
  utils/
    useSpeechRecognition.ts
```

---

## Vercel Deploy

1. Push repo to GitHub (or import to Vercel directly).
2. Set env vars in Vercel dashboard.
3. Deploy—no code edits needed.

---

## License

MIT
