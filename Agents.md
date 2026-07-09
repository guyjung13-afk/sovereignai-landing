# AGENTS.md — SovereignAI.llc Landing Page

## Project Goal
Build and continuously polish the official landing page for SovereignAI.llc — a high-signal, authoritative site that clearly communicates sovereign, on-premise AI for serious operators in energy, defense, healthcare, finance, and other critical sectors.

Core promise: "Your AI. Your Data. Your Privacy." — elegantly simple architecture on operator-owned hardware with zero data egress.

The page must feel **fortified, precise, trustworthy, and professional** — never salesy, hype-driven, or overly flashy. Think Citadel / Enclave / Vault / Spire aesthetic: strong, grounded, high-signal, slightly militaristic in language but clean and modern in execution.

## Success Criteria for "Better" Layout / Polish
When evaluating changes, prioritize (in rough order):
1. **Clarity & Scannability** — Can a busy operator quickly understand the value, principles, architecture, and next step (request briefing) without friction?
2. **Brand Fidelity** — Does it maintain the fortified, sovereign, zero-trust tone? No fluff, no consumer SaaS vibes.
3. **Visual Hierarchy & Breathing Room** — Better section separation, improved typography rhythm, stronger focal points (especially hero and primary CTA) without clutter.
4. **Mobile Experience** — Excellent on phones/tablets. Touch-friendly, no horizontal scroll, readable text sizes, stacked layouts where needed.
5. **Performance & Technical Quality** — Keep the site fast and lightweight. Lighthouse Performance ≥ 95, Accessibility ≥ 95.
6. **CTA Effectiveness** — The "Clandestine Briefing" / private technical briefing form should feel prominent yet appropriate — serious, confidential, low-friction.
7. **Consistency** — All sections feel part of one cohesive "Sovereign Nodal Stack" story.

## Rules for All Edits
- Tone: Precise, authoritative, operator-focused. Keep words like perimeter, enclave, vault, citadel, zero egress, institutional memory.
- No unnecessary visuals or fluff. Additions must improve scannability or reinforce the fortified aesthetic.
- The private briefing form is the main conversion point — keep it professional.
- Performance first: Any change must not hurt load speed.
- Use Plan Mode for any non-trivial layout or messaging change.

## How to Work Here
- Always start with `git pull`.
- Use fresh `grok` sessions — the AGENTS.md acts as memory.
- For layout experiments, use Plan Mode + parallel sub-agents when trying different ideas.
- Capture good patterns as reusable skills later.
- Judge every change against the success criteria above.

## Guard rails for loops
- Only propose changes if they measurably improve at least one success criterion (scannability, mobile, hierarchy, brand tone).
- Always respect the exact language style — no hype words.
- Limit changes to one focused area per round.
- After each edit, run a quick Lighthouse check if possible or clearly state the visual win.
- If no clear improvement, discard and try a different direction.
- Time box: max 30 minutes total or 8 rounds.
- Preserve functional IDs/anchors: `#hero-section`, `#manifesto`, `#architecture`, `#verticals`, `#hardware`, `#inquiry`, and `scramble-target` on section `h2`s.
- Prefer reusable rules in `citadel.css` / `citadel.js` over one-off inline scripts for hero and motion.
- Honor `prefers-reduced-motion` for every new animation.
- Never commit/push from the agent mid-round — the loop human gate decides keep/skip.

## Polish loop (stable process)

**Runners**

| Platform | Command |
|----------|---------|
| Windows  | `.\polish-loop.ps1 -Target "hero section"` |
| bash     | `./polish-loop.sh "hero section"` |
| launcher | `python polish-loop.py "hero section"` |

**End-to-end flow (automated by the scripts)**

1. **Preflight** — require `git` + `grok` CLI; abort if not a git repo.
2. **Sync** — `git checkout main` + `git pull origin main` (unless skip).
3. **Clean slate** — if site files are dirty, offer stash; refuse to clobber silent work.
4. **Experiment branch** — `polish-experiment-YYYYMMDD-HHMM`.
5. **Round loop** (default max 6):
   - Ensure site files match HEAD.
   - `grok -p … --permission-mode acceptEdits --max-turns 30` with AGENTS.md process prompt.
   - Scope: one focused area only; agent applies file edits but does **not** commit.
   - Show `git status` / diffstat for site files only (`index.html`, `citadel.css`, `citadel.js`, subpages).
   - Human gate: **keep** | **skip** | **stop**.
   - **keep** → stage site files only → commit `polish(<target>): round N winner`.
   - **skip** → `git restore` site files only (never `git clean` the whole repo).
6. **Ship** — print merge commands, or use `-MergeWhenDone` / `MERGE_WHEN_DONE=1` to merge to `main` and `git push origin main`.

**After ship:** hard-refresh https://sovereignai.llc (GitHub Pages may lag briefly).

**Optional quality check**

```text
npx --yes serve -l 8080
npx --yes lighthouse http://localhost:8080 --only-categories=performance,accessibility --quiet --chrome-flags=--headless
```

Target Lighthouse: Performance ≥ 95, Accessibility ≥ 95.

<!-- Tailored for SovereignAI.llc landing page — July 2026 -->
