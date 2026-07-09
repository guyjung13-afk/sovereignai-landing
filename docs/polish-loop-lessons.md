# Polish-loop lessons (2026-07-09 multi-agent session)

Durable notes from parallel polish + post-ship repair of sovereignai.llc.

## What worked

1. **Git worktrees** — one section per branch/worktree avoids clobbering shared files mid-run.
2. **Human gate before push** — present picks; only push after approval.
3. **Cherry-pick ordered section series** — architecture r1→rN then inquiry r1→rN; resolve `citadel.css` / `index.html` conflicts carefully.
4. **Section design systems in `citadel.css`** — `.hero-section`, `.card`, `.nodal-stack`, `.inquiry` beat one-off Tailwind soup.

## What failed (and the fix)

| Failure | Cause | Fix |
|---------|--------|-----|
| Nested `grok -p "..."` with long prompts | Windows CLI splits on spaces/`()` | Use `grok --prompt-file path.txt` |
| PowerShell `Start-Process -File` with spaces in paths | Arg mangling at first space | Short 8.3 paths or `-Command` with quoted paths; prefer worktree cwd |
| `polish-loop.ps1` parse errors | Em-dashes / `{0}` format strings misparsed | ASCII-only script strings; simple concatenation |
| 4 nested grok rounds, 0 file edits | Prompt not applied as single agentic edit session | `--prompt-file` + `acceptEdits` + `--max-turns`; insist on real writes in prompt |
| Subagent coordinator unreachable | Platform transient | Fall back to worktree + local edit loop or CLI agents |
| Nodal stack “broke” after polish | Rail `::before`/`::after` with **negative left** overflowed/clipped | Rail nodes **inside** panel; `minmax(0,1fr)` grid; mobile rules |
| Secure Channel “broke” | Cryptic labels (`IDENT_*`), no local `.hidden`, submit `innerHTML` nuked button | Operator labels; `.hidden { display:none !important }`; preserve `.btn-text`; FormSubmit intact |
| Multi-section CSS merge | All agents touch `citadel.css` | Section-scoped CSS blocks; ordered cherry-pick; verify anchors after integrate |

## Parallel multi-agent recipe (Windows)

```powershell
# From clean main
git pull origin main
$ts = Get-Date -Format 'yyyyMMdd-HHmmss'
git worktree add ..\sai-polish-hero -b "polish-hero-$ts" main
# copy polish-loop.ps1 if uncommitted improvements exist
Set-Location ..\sai-polish-hero
.\polish-loop.ps1 -Target "hero section" -MaxRounds 4 -MaxMinutes 5 -AutoKeep -SkipPull -SkipBranchCreate -SkipLighthouseHint
# Orchestrator: pick best commit(s) per branch, cherry-pick onto integrate branch, present, then push main only on approval
```

Flags:

| Flag | Purpose |
|------|---------|
| `-AutoKeep` | Commit every non-empty pass (unattended) |
| `-MaxMinutes N` | Wall-clock stop |
| `-MaxRounds N` | Pass cap (stop at first limit) |
| `-SkipPull` / `-SkipBranchCreate` | Worktree already on experiment branch |
| `-BranchName` | Stable name for parallel agents |
| `-MergeWhenDone` | Only after human review |

## Fragile areas — do not regress

### `#architecture` / `.nodal-stack`

- Keep rail/spine **inside** the panel (no negative-left overflow).
- Preserve CITADEL → ENCLAVE → SPIRE → VAULT order and codes.
- Keep `id="architecture"` + `scramble-target` on h2.

### `#inquiry` Secure Channel

- Badge may say **SECURE CHANNEL**; labels must be operator-clear (Name, Email, Organization & Role, Briefing Focus).
- Primary button: **Request Briefing** (not cryptic transfer jargon).
- Local `.hidden` utility required for success/error.
- Preserve: `id="inquiry"`, `id="briefing-form"`, field ids, FormSubmit to `guy@sovereignai.llc`, `_subject` / `_template` / `_gotcha`.

### Shared

- Never mid-loop push to `main` unless user explicitly requests.
- After ship: hard-refresh https://sovereignai.llc.

## Shipped HEAD reference (session end)

- Multi-section polish + repair series ended at `e0201c4` (inquiry a11y) on top of nodal-stack reliability fixes.
- Loop tooling update ships separately after this note is committed.

## Orchestrator checklist

1. Pull `main`, clean worktree.
2. Spawn N worktrees (one section each) or sequential single-target loops.
3. Run AutoKeep 4×/5min loops.
4. Choose 1 stop-point per agent (or full tip).
5. Integrate via cherry-pick order; verify IDs + FormSubmit + no overflow.
6. Present to human; push only on approve.
