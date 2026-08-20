# Our Story ❤️ — Phase 1

A private, cinematic website telling your story. Phase 1 covers the
foundation: design system, loading screen, landing sequence, navigation
shell, animation system, and folder structure. Chapters come in the next
phase.

## Running it locally

You need [Node.js](https://nodejs.org) installed (any recent version).

```bash
npm install
npm run dev
```

This opens the site at `http://localhost:5173` and hot-reloads as you edit.

To build a static, shareable version later:

```bash
npm run build
npm run preview   # preview the production build locally
```

## Where to put your own content

**You never need to touch anything inside `/src`.** That's the code. Your
personal content lives in two places:

### 1. Text → `/content/*.json`

- `content/landing.json` — her name and (optionally) how long each opening
  line stays on screen. Already filled in with a placeholder name — change
  `"name"` to what you want the final line to say.
- `content/chapters.json` — a skeleton for chapter order, not used yet.
  Nothing to do here until the next phase.

### 2. Photos, screenshots, audio, video → `/assets`

```
assets/
├── photos/
│   ├── landing/         ← optional background/hero imagery for the opening
│   ├── how-we-met/
│   └── memories/
├── screenshots/         ← chat screenshots, etc.
├── audio/
│   ├── voice-notes/
│   └── background-music/
└── video/
```

Drop files in with clear names (e.g. `first-photo.jpg`, `voice-note-1.mp3`).
Nothing currently references these — they'll be wired into chapters in the
next phase, and this structure is ready for them.

When a chapter later references an image at, say,
`assets/photos/memories/beach.jpg`, it will be reachable in the site at
the URL path `/photos/memories/beach.jpg` (the `assets/` prefix is dropped
automatically — this is handled by the build tool, not something you need
to manage).

## What's built in Phase 1

- **Design system** (`src/style/base.css`) — the full color, type, spacing,
  and motion token set used everywhere from now on.
- **Loading screen** — a minimal breathing ember while the page settles.
- **Landing sequence** — the four scripted lines, timed and animated, ending
  in the "Start Our Story" button.
- **Navigation shell** — a minimal top bar with a scroll-progress line,
  hidden until the reader moves past the landing.
- **Ambient ember field** — the site's signature visual motif: sparse,
  slow-drifting warm light, used instead of generic hearts/confetti.
- **Reusable scroll-animation system** (`src/utils/scrollAnimations.js`) —
  add `data-reveal="fade-up"` to any element in a future chapter and it
  will animate in on scroll automatically, no extra code needed.
- **Placeholder chapter section** — a plain "the rest is being written"
  block so the page doesn't end abruptly. Removed once real chapters exist.

Fully responsive, respects `prefers-reduced-motion`, and keyboard-focusable
throughout.

## Not built yet (next phase)

- Individual chapter components (How We Met, Memories, Funny Moments, etc.)
- Photo galleries, audio player, timeline
- Chapter-to-chapter navigation / jump menu
