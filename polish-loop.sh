#!/usr/bin/env bash
# SovereignAI.llc Landing Page Polish Loop (bash / Git Bash / WSL / macOS)
# Full process: pull -> experiment branch -> focused rounds -> keep/skip -> merge path
#
# Usage:
#   ./polish-loop.sh
#   ./polish-loop.sh "hero section"
#   ./polish-loop.sh "architecture nodal stack" 4
#   MAX_MINUTES=5 AUTO_KEEP=1 SKIP_PULL=1 SKIP_BRANCH_CREATE=1 ./polish-loop.sh "inquiry" 4
#   MERGE_WHEN_DONE=1 ./polish-loop.sh "CTA hierarchy"
#
# Lessons (2026-07-09): use --prompt-file for grok; AutoKeep for worktrees; site-files only.

set -euo pipefail

TARGET="${1:-whole page}"
MAX_ROUNDS="${2:-6}"
MAX_MINUTES="${MAX_MINUTES:-0}"
MAX_TURNS="${MAX_TURNS:-30}"
MERGE_WHEN_DONE="${MERGE_WHEN_DONE:-0}"
SKIP_PULL="${SKIP_PULL:-0}"
SKIP_BRANCH_CREATE="${SKIP_BRANCH_CREATE:-0}"
AUTO_KEEP="${AUTO_KEEP:-0}"
BRANCH_NAME="${BRANCH_NAME:-}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

SITE_FILES=(index.html citadel.css citadel.js manifesto.html privacy.html terms.html)
if [[ -n "$BRANCH_NAME" ]]; then
  BRANCH="$BRANCH_NAME"
else
  BRANCH="polish-experiment-$(date +%Y%m%d-%H%M%S)"
fi
WINNERS=0
SKIPS=0
LOOP_START=$(date +%s)
PROMPT_DIR="$ROOT/.grok"
mkdir -p "$PROMPT_DIR"

die() { echo "ERROR: $*" >&2; exit 1; }

assert_tools() {
  [[ -d "$ROOT/.git" ]] || die "Not a git repository: $ROOT"
  command -v git >/dev/null || die "git not found on PATH"
  command -v grok >/dev/null || die "grok CLI not found on PATH"
}

dirty_site() {
  git status --porcelain -- "${SITE_FILES[@]}" 2>/dev/null || true
}

discard_site() {
  for f in "${SITE_FILES[@]}"; do
    [[ -e "$f" ]] && git restore --worktree --staged --source=HEAD -- "$f" 2>/dev/null || true
  done
  git clean -fd -- "${SITE_FILES[@]}" 2>/dev/null || true
}

show_diff() {
  echo ""
  echo "--- git status (site files) ---"
  git status --short -- "${SITE_FILES[@]}" || true
  echo "--- diffstat ---"
  git diff --stat -- "${SITE_FILES[@]}" || true
  echo "----------------"
}

elapsed_min() {
  local now
  now=$(date +%s)
  echo | awk -v s="$LOOP_START" -v n="$now" 'BEGIN { printf "%.1f", (n - s) / 60 }'
}

build_prompt() {
  local round="$1"
  cat <<EOF
You are polishing the SovereignAI.llc static landing page in this repo.

## Mandatory process (do all of this)
1. Read AGENTS.md guard rails and success criteria first.
2. Inspect the current target only: $TARGET
3. Do ONE focused improvement pass - single concern, not a whole-site rewrite.
4. Apply real file edits (index.html / citadel.css / citadel.js as needed). YOU MUST write files when there is a clear win.
5. Preserve functional IDs and anchors: #hero-section, #foundation, #manifesto, #architecture, #verticals, #hardware, #inquiry, scramble-target on section h2s.
6. Respect fortified sovereign tone - precise, operator-focused, no hype, no consumer SaaS language.
7. Prefer clean component CSS (citadel.css) over sprawling one-off Tailwind when building reusable blocks.
8. Honor prefers-reduced-motion for any new animation. Keep performance light.
9. Do not commit, push, or open PRs. Leave changes unstaged for human keep/skip (or AutoKeep outer loop).
10. After edits, briefly self-check: mobile stacking, focus-visible CTAs, no broken anchors, no horizontal overflow.

## Known fragile areas (do not regress)
- #architecture .nodal-stack: keep rail/spine INSIDE the panel (no negative-left pseudo-elements that overflow/clip).
- #inquiry Secure Channel: keep operator-clear labels (Name/Email/Organization/Briefing Focus); keep local .hidden utility; do not break FormSubmit AJAX or field ids.
- Prefer .card / .inquiry / .nodal-stack design systems in citadel.css.

## Quality bar
- Must improve at least one of: scannability, hierarchy, brand fidelity, mobile, CTA clarity, code cleanliness, reliability/fix.
- If you cannot find a clear win, make no file changes and say KEEP: no.

## Output format (end of turn - nothing after)
CHANGES: [files + 1-line each]
SCORES_BEFORE: [scannability / brand / mobile / CTA - rough]
SCORES_AFTER: [same dimensions + perf/a11y note]
KEEP: yes/no + short reason

Round: $round of focused polish on: $TARGET
EOF
}

assert_tools

echo "SovereignAI polish loop"
echo "Target     : $TARGET"
echo "Max rounds : $MAX_ROUNDS"
if [[ "$MAX_MINUTES" != "0" ]]; then
  echo "Max minutes: $MAX_MINUTES (stop at first limit hit)"
fi
echo "Max turns  : $MAX_TURNS"
echo "Repo       : $ROOT"
echo "Branch     : $BRANCH"
echo "AutoKeep   : $AUTO_KEEP"
echo "Guard rails: AGENTS.md"
echo ""

if [[ "$SKIP_PULL" != "1" ]]; then
  echo "Pulling latest main..."
  git checkout main
  git pull origin main || echo "Warning: git pull failed - continuing with local main"
fi

if [[ -n "$(dirty_site)" ]]; then
  echo "Uncommitted site-file changes detected:"
  dirty_site
  if [[ "$AUTO_KEEP" == "1" ]]; then
    git stash push -m "polish-loop pre-run $(date -Iseconds 2>/dev/null || date)" -- "${SITE_FILES[@]}"
    echo "Auto-stashed (AUTO_KEEP). Restore later with: git stash pop"
  else
    read -r -p "Stash them and continue? (y/N) " cont
    if [[ "${cont,,}" != "y" ]]; then
      die "Aborting. Commit or stash your work first."
    fi
    git stash push -m "polish-loop pre-run $(date -Iseconds 2>/dev/null || date)" -- "${SITE_FILES[@]}"
    echo "Stashed. Restore later with: git stash pop"
  fi
fi

if [[ "$SKIP_BRANCH_CREATE" != "1" ]]; then
  git checkout -b "$BRANCH"
fi
echo "On branch $(git branch --show-current)"

echo ""
echo "Optional baseline (serve site in another terminal):"
echo "  npx --yes serve -l 8080"
echo "  npx --yes lighthouse http://localhost:8080 --only-categories=performance,accessibility --quiet --chrome-flags=--headless"

for ((round = 1; round <= MAX_ROUNDS; round++)); do
  if [[ "$MAX_MINUTES" != "0" ]]; then
    el=$(elapsed_min)
    # bash float compare via awk
    over=$(awk -v e="$el" -v m="$MAX_MINUTES" 'BEGIN { print (e+0 >= m+0) ? 1 : 0 }')
    if [[ "$over" == "1" ]]; then
      echo ""
      echo "Time box hit ($el min >= $MAX_MINUTES min) - stopping before round $round"
      break
    fi
    echo "Elapsed: $el / $MAX_MINUTES min"
  fi

  echo ""
  echo "=== Round $round / $MAX_ROUNDS - $TARGET ==="

  if [[ -n "$(dirty_site)" ]]; then
    echo "Clearing leftover site-file dirt before round..."
    discard_site
  fi

  prompt_file="$PROMPT_DIR/polish-round-$(printf '%02d' "$round").txt"
  build_prompt "$round" >"$prompt_file"
  echo "Running grok via --prompt-file (acceptEdits, max-turns $MAX_TURNS)..."
  echo "Prompt file: $prompt_file"
  set +e
  grok --prompt-file "$prompt_file" --cwd "$ROOT" --permission-mode acceptEdits --max-turns "$MAX_TURNS" --output-format plain
  grok_code=$?
  set -e
  if [[ $grok_code -ne 0 ]]; then
    echo "grok exited with code $grok_code"
  fi

  show_diff

  if [[ -z "$(dirty_site)" ]]; then
    echo "No site-file changes this round."
    if [[ "$AUTO_KEEP" == "1" ]]; then
      echo "AutoKeep: skip empty round."
      SKIPS=$((SKIPS + 1))
      continue
    fi
    read -r -p "Type skip to continue, or stop to end loop: " decision
    if [[ "${decision,,}" == "stop" ]]; then break; fi
    SKIPS=$((SKIPS + 1))
    continue
  fi

  echo ""
  echo "Review the diff above (and browser hard-refresh if serving)."
  if [[ "$AUTO_KEEP" == "1" ]]; then
    decision="keep"
    echo "AutoKeep: committing round $round as pass candidate."
  else
    read -r -p "keep / skip / stop: " decision
    decision="${decision,,}"
  fi

  if [[ "$decision" == "stop" ]]; then
    echo "Stopping loop. Discarding uncommitted round changes..."
    discard_site
    break
  fi

  if [[ "$decision" == "keep" ]]; then
    git add -- "${SITE_FILES[@]}"
    git commit -m "polish($TARGET): round $round winner (AGENTS.md)" || echo "Commit failed - nothing staged?"
    WINNERS=$((WINNERS + 1))
    echo "Winner committed on $(git branch --show-current)"
  else
    echo "Discarding round $round changes..."
    discard_site
    SKIPS=$((SKIPS + 1))
    echo "Skipped. Next round will try a different angle."
  fi

  if [[ "$MAX_MINUTES" != "0" ]]; then
    el=$(elapsed_min)
    over=$(awk -v e="$el" -v m="$MAX_MINUTES" 'BEGIN { print (e+0 >= m+0) ? 1 : 0 }')
    if [[ "$over" == "1" ]]; then
      echo "Time box hit after round $round ($el min) - stopping"
      break
    fi
  fi

  if [[ $round -lt $MAX_ROUNDS && "$decision" != "stop" ]]; then
    if [[ "$AUTO_KEEP" == "1" ]]; then pause=1; else pause=3; fi
    echo "Pause ${pause}s (Ctrl+C to abort)..."
    sleep "$pause"
  fi
done

echo ""
echo "Loop finished"
echo "Branch   : $(git branch --show-current)"
echo "Winners  : $WINNERS"
echo "Skips    : $SKIPS"
echo "Elapsed  : $(elapsed_min) min"
echo ""
echo "Log:"
git log main..HEAD --oneline 2>/dev/null || git log --oneline -8

if [[ $WINNERS -eq 0 ]]; then
  echo ""
  echo "No winners. Safe to delete branch:"
  echo "  git checkout main && git branch -D $(git branch --show-current)"
  exit 0
fi

if [[ "$MERGE_WHEN_DONE" == "1" ]]; then
  cur=$(git branch --show-current)
  echo ""
  echo "Merging $cur into main and pushing..."
  git checkout main
  git pull origin main || true
  if ! git merge --ff-only "$cur"; then
    git merge "$cur" -m "Merge $cur - polish winners"
  fi
  git push origin main
  echo "Pushed to origin/main. Hard-refresh https://sovereignai.llc"
else
  cur=$(git branch --show-current)
  echo ""
  echo "To ship winners:"
  echo "  git checkout main"
  echo "  git pull origin main"
  echo "  git merge $cur"
  echo "  git push origin main"
  echo ""
  echo "Or: MERGE_WHEN_DONE=1 ./polish-loop.sh \"$TARGET\""
  echo "Parallel agents: cherry-pick carefully - citadel.css conflicts are common."
fi
