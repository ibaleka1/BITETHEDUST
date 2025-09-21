# BITETHEDUST — VERA Voice Orb Demo

This project is a minimal example of a VERA voice orb with a chime, built for a Next.js (or React) app.  
The orb animates and plays a chime sound when activated (clicked).

---

## 📁 Project Structure

```
BITETHEDUST/
├── public/
│   └── vera-chime.mp3             # Chime sound file (upload your own)
├── src/
│   ├── components/
│   │   ├── VERAOrb.tsx            # VERA orb React component
│   │   └── VERAOrb.css            # Orb styling
│   ├── pages/
│   │   └── index.tsx              # Home page, shows the orb
│   └── ...
├── README.md
└── ...
```

---

## 🚀 Quick Start

1. **Upload your chime sound:**
   - Place your `vera-chime.mp3` in the `public/` folder.

2. **Add the code:**
   - Use the provided files for `src/components/VERAOrb.tsx`, `src/components/VERAOrb.css`, and `src/pages/index.tsx`.

3. **Run your app:**
   - If using Next.js:
     ```bash
     npm run dev
     ```
   - Open [http://localhost:3000](http://localhost:3000)

4. **Try it out!**
   - Click the VERA orb on your homepage to see it animate and hear the chime.

---

## 🛠️ Customization

- **Chime sound:** Replace `vera-chime.mp3` in `public/` with any mp3 you like.
- **Orb style:** Tweak `VERAOrb.css` for different colors or animation.
- **Actions:** Replace the click handler in `VERAOrb.tsx` to trigger voice recognition or other features.

---

## 🧑‍💻 Requirements

- Node.js (v18+ recommended)
- Next.js (or compatible React setup)
- Typescript (for provided code)

---

## 📣 Credits

- Design and code: [Your Name or Team]
- Chime sound: [Attribution if required, or “public domain/free sound from freesound.org”]

---

Happy building!
