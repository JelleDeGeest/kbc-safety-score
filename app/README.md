# Cyber Safety Score (PWA prototype)

Vite + React + TypeScript + `vite-plugin-pwa`, with React Router (hash routes, so it works on any static host).

```bash
npm install
npm run dev -- --host   # open the Network URL on your phone (same Wi-Fi)
npm run build && npm run preview   # production build with service worker
```

Install it on a phone via the browser's "Add to Home Screen". The service worker only runs in the production build, and needs HTTPS (or localhost), so deploy `dist/` to Netlify, Vercel or GitHub Pages to install from a phone.

## Flow

`/` Start → `/cyber/intro` enrich profile → `/cyber/questions` Kate chat → `/cyber/score` score, tips & articles → `/cyber/insurance` plan picker → `/cyber/insurance/done`

- Scoring, questions, tips, articles and pricing all live in `src/data.ts`.
- Profile state (answers, completed tips, Kate Coins, policy) is kept in `localStorage` (`src/state.tsx`). Use **Reset demo** at the bottom of the score page to start over.
- On desktop, the app renders inside a phone frame. On phones, it's full screen with safe-area insets.
