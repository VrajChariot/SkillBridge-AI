# SkillBridge frontend

React 18 + TypeScript + Vite + Tailwind 3. Compares a resume (PDF/DOCX) with a pasted job posting and shows a match report: score ruler, score breakdown, ranked edits, keywords to add, strengths and ATS formatting tips.

## Run

```bash
npm install
npm run dev            # http://localhost:5173, /api proxied to http://localhost:8000
```

Start the backend first (see `../BE/README.md`). To point the proxy elsewhere:

```bash
API_PROXY_TARGET=http://localhost:8011 npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with the API proxy |
| `npm run build` | Type check and production build to `dist/` |
| `npm test` | Unit tests (vitest + jsdom) |
| `npm run lint` | ESLint, zero warnings allowed |
| `npm run typecheck` | `tsc --noEmit` |

`VITE_API_URL` sets the API base for builds (default `/api`, which the Vercel rewrite in `../vercel.json` serves).

## Structure

```
src/
  App.tsx                 Picks the screen from the analysis state; keeps the draft between screens
  app/                    App-wide concerns
    analysisReducer.ts      idle → uploading → analyzing → done | failed (pure, tested)
    useAnalysis.ts          Runs a comparison: upload progress, cancel, refresh-safe report
    reportStorage.ts        Keeps the latest report in sessionStorage
    useServiceHealth.ts     Backend health check
    AppHeader / AppFooter / ServiceNotice
  features/
    intake/               Job posting + resume form, validation, upload/analysis progress
    report/               Verdict, score ruler, breakdown, edit checklist, keywords, tips, print layout
  services/
    api.ts                  analyzeResume (XHR for upload progress, abortable), checkHealth
    errors.ts               Error contract with the backend and the copy shown for each failure
  ui/                     Button, Notice, Mark (highlighter)
  types/ats.ts            Report shape returned by the backend
```

Each feature exports its screen from `index.ts`. Pure logic (validation, formatting, score bands, edit grouping) lives in plain `.ts` modules next to its tests.

## Error contract

Failed requests return `{ "detail": string, "code": string }`. `services/errors.ts` maps each code to a message that says what happened and how to fix it. A server error without a `code` means something in front of the backend answered (proxy, gateway), and is shown as the analysis service being unreachable.

## Design system

Tokens live in `tailwind.config.js`; the default Tailwind palette is replaced.

| Token | Hex | Use |
|---|---|---|
| `paper` | `#F7F8FA` | Page background |
| `sheet` | `#FFFFFF` | Document surfaces |
| `ink` | `#17203A` | Text, primary actions |
| `graphite` | `#5B6478` | Secondary text |
| `rule` | `#D9DDE5` | Borders |
| `highlighter` | `#F2DF4A` | Only for things to add: missing keywords, the score gain |
| `correction` | `#C8323C` | Problems, high-impact edits, errors |
| `matched` | `#1F7A55` | Strengths, completed edits |

- Type: Schibsted Grotesk Variable (self-hosted via Fontsource), classical scale 12/14/16/18/21/24/36/48/60/72.
- Icons: Phosphor (`@phosphor-icons/react`).
- Radii encode hierarchy: 3px chips, 6px controls, 10px sheets. No shadows.
- Motion: one moment, the score ruler drawing in on the report. Disabled under `prefers-reduced-motion`.
