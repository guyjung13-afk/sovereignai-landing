# SovereignAI — Landing Page PRD

## Original Problem Statement
Transform the SovereignAI landing page into a "Sovereign-Industrial" masterpiece that feels like high-end defense hardware.
- Visuals: Deep Obsidian (#05070A) base, Cold Steel (#8E9AAF) borders, Industrial Gold (#D4AF37) accents
- Typography: Inter/SF Pro headlines (wide spacing), JetBrains Mono body (system fallbacks, NO Google Fonts)
- Features: hex-fortress sigil (pulse + scroll rotation), module blocks, hardware grid, Clandestine Briefing terminal form
- Constraint: ultra-optimized frontend, zero heavy dependencies, no external CDNs

## Phase 2 Brief (June 2026) — Deep-Immersion Industrial Experience
User choices: raw GLSL (no libs), pure rAF momentum scroll (no Lenis), live backend for preview + standalone SQLite artifact, generated high-entropy Sovereign-Key.

## Implemented (all tested, iteration_1.json: 100% backend + frontend)
1. **Sigil S-curve corrected** — path orientation reversed to standard "S" flow (`SovereignSigil.jsx`); weighted spring-based scroll rotation (inertia via velocity/damping rAF loop in `LandingPage.jsx`).
2. **WebGL Resonant Field** — raw GLSL point-grid background (`components/ResonantField.jsx`), mouse-proximity ripple (963 Hz motif), opaque obsidian clear color, reduced-motion aware. NOTE: never call loseContext() in cleanup (StrictMode remount kills context → white screen; fixed).
3. **Advanced motion** — custom momentum wheel scroll (`hooks/useMomentumScroll.js`), section interlocks with gold seam sweep (`.interlock` + `.seam` in App.css), multi-depth parallax on module blocks + sigil (`hooks/useParallax.js`), shared reveal observer (`hooks/useReveal.js`).
4. **Digital Scramble text reveal** — `components/ScrambleText.jsx` on all H2s + manifesto headings; manifesto paragraphs use `.noise-resolve` blur-in.
5. **Functional bridge** — POST `/api/v1/briefing` in `backend/server.py`: X-Sovereign-Key header check (401), per-IP rate limit 5/60s (429), Pydantic validation (422), stores in Mongo `briefings` collection.
6. **`/app/vault_contract.py`** — standalone FastAPI + SQLite (vault.db) artifact for the user's MS-01 Max deployment (same key/rate-limit contract, GET /api/v1/briefings admin read). Not running in preview; deliverable only.

## Keys / Config
- SOVEREIGN_KEY (backend/.env) = REACT_APP_SOVEREIGN_KEY (frontend/.env) = 75f635bfc726bc10747c396441fbe0ff7fdc391183a39f1076729be9705b3bd5
- No user auth/accounts exist.

## Known accepted trade-offs
- Sovereign-Key is embedded in the SPA bundle (static-site constraint from user); rate limiting mitigates abuse. Future: signed challenge/Turnstile.
- Rate limiter is in-memory (single process); future: Redis if scaled.

## Backlog
- P2: Admin read endpoint/UI for briefings in preview backend (Mongo)
- P2: Email notification (e.g., Resend) on new briefing
- P2: Meta/OG tags + favicon for shareability
