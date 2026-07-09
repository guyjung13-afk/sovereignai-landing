#!/usr/bin/env bash
# SovereignAI.llc Landing Page Polish Loop (bash / Git Bash / WSL / macOS)
# Full process: pull → experiment branch → focused rounds → keep/skip → merge path
#
# Usage:
#   ./polish-loop.sh
#   ./polish-loop.sh "hero section"
#   ./polish-loop.sh "principles mobile" 4
#   MERGE_WHEN_DONE=1 ./polish-loop.sh "CTA hierarchy"

set -euo pipefail

TARGET="${1:-whole page}"
MAX_ROUNDS="${2:-6}"
MERGE_WHEN_DONE="${MERGE_WHEN_DONE:-0}"
SKIP_PULL="${SKIP_PULL:-0}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

SITE_FILES=(index.html citadel.css citadel.js manifesto.html privacy.html terms.html)
BRANCH="polish-experiment-$(date +%Y%m%d-%H%M)"
WINNERS=0
SKIPS=0

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

build_prompt() {
  local round="$1"
  cat <<EOF
You are polishing the SovereignAI.llc static landing page in this repo.

## Mandatory process (do all of this)
1. Read AGENTS.md guard rails and success criteria first.
2. Inspect the current target only: $TARGET
3. Do ONE focused improvement pass — single concern, not a whole-site rewrite.
4. Apply real file edits (index.html / citadel.css / citadel.js as needed).
5. Preserve functional IDs and anchors: #hero-section, #manifesto, #architecture, #verticals, #hardware, #inquiry, scramble-target on section h2s.
6. Respect fortified sovereign tone — precise, operator-focused, no hype, no consumer SaaS language.
7. Prefer clean component CSS (citadel.css) over sprawling one-off Tailwind when building reusable blocks.
8. Honor prefers-reduced-motion for any new animation. Keep performance light.
9. Do not commit, push, or open PRs. Leave changes unstaged for human keep/skip.
10. After edits, briefly self-check: mobile stacking, focus-visible CTAs, no broken anchors.

## Quality bar
- Must improve at least one of: scannability, hierarchy, brand fidelity, mobile, CTA clarity, code cleanliness.
- If you cannot find a clear win, make no file changes and say KEEP: no.

## Output format (end of turn — nothing after)
CHANGES: [files + 1-line each]
SCORES_BEFORE: [scannability / brand / mobile / CTA — rough]
SCORES_AFTER: [same dimensions + perf/a11y note]
KEEP: yes/no + short reason

Round: $round of focused polish on: $TARGET
EOF
}

assert_tools

echo "SovereignAI polish loop"
echo "Target     : $TARGET"
echo "Max rounds : $MAX_ROUNDS"
echo "Repo       : $ROOT"
echo "Branch     : $BRANCH"
echo "Guard rails: AGENTS.md"
echo ""

if [[ "$SKIP_PULL" != "1" ]]; then
  echo "Pulling latest main..."
  git checkout main
  git pull origin main || echo "Warning: git pull failed — continuing with local main"
fi

if [[ -n "$(dirty_site)" ]]; then
  echo "Uncommitted site-file changes detected:"
  dirty_site
  read -r -p "Stash them and continue? (y/N) " cont
  if [[ "${cont,,}" != "y" ]]; then
    die "Aborting. Commit or stash your work first."
  fi
  git stash push -m "polish-loop pre-run $(date -Iseconds)" -- "${SITE_FILES[@]}"
  echo "Stashed. Restore later with: git stash pop"
fi

git checkout -b "$BRANCH"
echo "On branch $BRANCH"

echo ""
echo "Optional baseline (serve site in another terminal):"
echo "  npx --yes serve -l 8080"
echo "  npx --yes lighthouse http://localhost:8080 --only-categories=performance,accessibility --quiet --chrome-flags=--headless"

for ((round = 1; round <= MAX_ROUNDS; round++)); do
  echo ""
  echo "=== Round $round / $MAX_ROUNDS — $TARGET ==="

  if [[ -n "$(dirty_site)" ]]; then
    echo "Clearing leftover site-file dirt before round..."
    discard_site
  fi

  echo "Running grok (headless, acceptEdits)..."
  set +e
  grok -p "$(build_prompt "$round")" --cwd "$ROOT" --permission-mode acceptEdits --max-turns 30
  grok_code=$?
  set -e
  if [[ $grok_code -ne 0 ]]; then
    echo "grok exited with code $grok_code"
  fi

  show_diff

  if [[ -z "$(dirty_site)" ]]; then
    echo "No site-file changes this round."
    read -r -p "Type skip to continue, or stop to end loop: " decision
    if [[ "${decision,,}" == "stop" ]]; then break; fi
    SKIPS=$((SKIPS + 1))
    continue
  fi

  echo ""
  echo "Review the diff above (and browser hard-refresh if serving)."
  read -r -p "keep / skip / stop: " decision
  decision="${decision,,}"

  if [[ "$decision" == "stop" ]]; then
    echo "Stopping loop. Discarding uncommitted round changes..."
    discard_site
    break
  fi

  if [[ "$decision" == "keep" ]]; then
    git add -- "${SITE_FILES[@]}"
    git commit -m "polish($TARGET): round $round winner (AGENTS.md)" || echo "Commit failed — nothing staged?"
    WINNERS=$((WINNERS + 1))
    echo "Winner committed on $BRANCH"
  else
    echo "Discarding round $round changes..."
    discard_site
    SKIPS=$((SKIPS + 1))
    echo "Skipped. Next round will try a different angle."
  fi

  if [[ $round -lt $MAX_ROUNDS && "$decision" != "stop" ]]; then
    echo "Pause 3s (Ctrl+C to abort)..."
    sleep 3
  fi
done

echo ""
echo "Loop finished"
echo "Branch   : $BRANCH"
echo "Winners  : $WINNERS"
echo "Skips    : $SKIPS"
echo ""
echo "Log:"
git log main..HEAD --oneline 2>/dev/null || git log --oneline -8

if [[ $WINNERS -eq 0 ]]; then
  echo ""
  echo "No winners. Safe to delete branch:"
  echo "  git checkout main && git branch -D $BRANCH"
  exit 0
fi

if [[ "$MERGE_WHEN_DONE" == "1" ]]; then
  echo ""
  echo "Merging $BRANCH into main and pushing..."
  git checkout main
  git pull origin main || true
  if ! git merge --ff-only "$BRANCH"; then
    git merge "$BRANCH" -m "Merge $BRANCH — polish winners"
  fi
  git push origin main
  echo "Pushed to origin/main. Hard-refresh https://sovereignai.llc"
else
  echo ""
  echo "To ship winners:"
  echo "  git checkout main"
  echo "  git pull origin main"
  echo "  git merge $BRANCH"
  echo "  git push origin main"
  echo ""
  echo "Or: MERGE_WHEN_DONE=1 ./polish-loop.sh \"$TARGET\""
fi
