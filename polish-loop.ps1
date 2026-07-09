# SovereignAI.llc Landing Page Polish Loop (Windows PowerShell)
# Full process: pull -> experiment branch -> focused rounds -> keep/skip -> merge path
#
# Usage (from repo root):
#   .\polish-loop.ps1
#   .\polish-loop.ps1 -Target "hero section"
#   .\polish-loop.ps1 -Target "architecture nodal stack" -MaxRounds 4 -MaxMinutes 5
#   .\polish-loop.ps1 -Target "inquiry" -AutoKeep -MaxRounds 4 -MaxMinutes 5 -SkipPull -SkipBranchCreate
#   .\polish-loop.ps1 -Target "CTA hierarchy" -MergeWhenDone
#
# Parallel multi-agent (one section each):
#   git worktree add ..\sai-polish-X -b polish-X-$(Get-Date -Format yyyyMMdd-HHmmss) main
#   # in each worktree:
#   .\polish-loop.ps1 -Target "..." -MaxRounds 4 -MaxMinutes 5 -AutoKeep -SkipPull -SkipBranchCreate
#
# Requires: git, grok CLI on PATH. Optional: node/npx for Lighthouse.
#
# Lessons (2026-07-09 multi-agent session):
# - Always pass prompts via --prompt-file (never inline -p with complex text on Windows).
# - Prefer --permission-mode acceptEdits + --max-turns (not bare -p single that drops edits).
# - AutoKeep for unattended worktrees; human gate still required before push to main.
# - Site-files-only restore/commit; never git clean the whole repo.
# - ASCII-safe strings in this script (no fancy em-dashes in double-quoted expressions).

param(
    [string]$Target = "whole page",
    [int]$MaxRounds = 6,
    [int]$MaxMinutes = 0,          # 0 = no wall-clock limit; stop when rounds OR minutes hit first
    [string]$BranchName = "",      # optional fixed branch name (parallel agents)
    [int]$MaxTurns = 30,           # grok agent turns per round
    [switch]$MergeWhenDone,
    [switch]$SkipPull,
    [switch]$SkipBranchCreate,     # already on experiment branch (e.g. git worktree)
    [switch]$AutoKeep,             # non-interactive: commit every pass that has site changes
    [switch]$SkipLighthouseHint
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$SiteFiles = @("index.html", "citadel.css", "citadel.js", "manifesto.html", "privacy.html", "terms.html")
if ($BranchName) {
    $branch = $BranchName
}
else {
    $branch = "polish-experiment-" + (Get-Date -Format "yyyyMMdd-HHmmss")
}
$winners = 0
$skips = 0
$loopStart = Get-Date
$promptDir = Join-Path $PSScriptRoot ".grok"
if (-not (Test-Path $promptDir)) {
    New-Item -ItemType Directory -Path $promptDir -Force | Out-Null
}

function Write-Banner {
    param([string]$Text, [string]$Color = "Cyan")
    Write-Host ""
    Write-Host $Text -ForegroundColor $Color
}

function Assert-GitRepo {
    if (-not (Test-Path (Join-Path $PSScriptRoot ".git"))) {
        throw "Not a git repository: $PSScriptRoot"
    }
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        throw "git not found on PATH"
    }
    if (-not (Get-Command grok -ErrorAction SilentlyContinue)) {
        throw "grok CLI not found on PATH"
    }
}

function Get-DirtySiteFiles {
    $status = git status --porcelain -- @SiteFiles 2>$null
    if (-not $status) { return @() }
    return @($status)
}

function Discard-SiteChanges {
    foreach ($f in $SiteFiles) {
        if (Test-Path $f) {
            git restore --worktree --staged --source=HEAD -- $f 2>$null
        }
    }
    git clean -fd -- @SiteFiles 2>$null | Out-Null
}

function Show-RoundDiff {
    Write-Host ""
    Write-Host "--- git status (site files) ---" -ForegroundColor DarkGray
    git status --short -- @SiteFiles
    Write-Host "--- diffstat ---" -ForegroundColor DarkGray
    git diff --stat -- @SiteFiles
    Write-Host "----------------" -ForegroundColor DarkGray
}

function Build-RoundPrompt {
    param([int]$Round, [string]$Focus)
    # Plain lines only - avoid PowerShell here-string / special-char traps
    $lines = @(
        "You are polishing the SovereignAI.llc static landing page in this repo.",
        "",
        "## Mandatory process (do all of this)",
        "1. Read AGENTS.md guard rails and success criteria first.",
        "2. Inspect the current target only: $Focus",
        "3. Do ONE focused improvement pass - single concern, not a whole-site rewrite.",
        "4. Apply real file edits (index.html / citadel.css / citadel.js as needed). YOU MUST write files when there is a clear win.",
        "5. Preserve functional IDs and anchors: #hero-section, #foundation, #manifesto, #architecture, #verticals, #hardware, #inquiry, scramble-target on section h2s.",
        "6. Respect fortified sovereign tone - precise, operator-focused, no hype, no consumer SaaS language.",
        "7. Prefer clean component CSS (citadel.css) over sprawling one-off Tailwind when building reusable blocks.",
        "8. Honor prefers-reduced-motion for any new animation. Keep performance light.",
        "9. Do not commit, push, or open PRs. Leave changes unstaged for human keep/skip (or AutoKeep outer loop).",
        "10. After edits, briefly self-check: mobile stacking, focus-visible CTAs, no broken anchors, no horizontal overflow.",
        "",
        "## Known fragile areas (do not regress)",
        "- #architecture .nodal-stack: keep rail/spine INSIDE the panel (no negative-left pseudo-elements that overflow/clip).",
        "- #inquiry Secure Channel: keep operator-clear labels (Name/Email/Organization/Briefing Focus); keep local .hidden utility; do not break FormSubmit AJAX or field ids.",
        "- Prefer .card / .inquiry / .nodal-stack design systems in citadel.css.",
        "",
        "## Quality bar",
        "- Must improve at least one of: scannability, hierarchy, brand fidelity, mobile, CTA clarity, code cleanliness, reliability/fix.",
        "- If you cannot find a clear win, make no file changes and say KEEP: no.",
        "",
        "## Output format (end of turn - nothing after)",
        "CHANGES: [files + 1-line each]",
        "SCORES_BEFORE: [scannability / brand / mobile / CTA - rough]",
        "SCORES_AFTER: [same dimensions + perf/a11y note]",
        "KEEP: yes/no + short reason",
        "",
        "Round: $Round of focused polish on: $Focus"
    )
    return ($lines -join "`n")
}

function Invoke-GrokRound {
    param([string]$PromptText, [int]$Round)
    $promptFile = Join-Path $promptDir ("polish-round-{0:D2}.txt" -f $Round)
    # UTF-8 no BOM for CLI stability
    [System.IO.File]::WriteAllText($promptFile, $PromptText, [System.Text.UTF8Encoding]::new($false))

    Write-Host "Running grok via --prompt-file (acceptEdits, max-turns $MaxTurns)..." -ForegroundColor DarkGray
    Write-Host "Prompt file: $promptFile" -ForegroundColor DarkGray

    # CRITICAL: use --prompt-file, not -p with a huge string (Windows arg splitting breaks on parentheses).
    & grok --prompt-file $promptFile --cwd $PSScriptRoot --permission-mode acceptEdits --max-turns $MaxTurns --output-format plain
    return $LASTEXITCODE
}

# --- Bootstrap ---
Assert-GitRepo
Write-Banner "SovereignAI polish loop" "Cyan"
Write-Host "Target     : $Target"
Write-Host "Max rounds : $MaxRounds"
if ($MaxMinutes -gt 0) {
    Write-Host "Max minutes: $MaxMinutes (stop at first limit hit)"
}
Write-Host "Max turns  : $MaxTurns"
Write-Host "Repo       : $PSScriptRoot"
Write-Host "Branch     : $branch"
Write-Host "AutoKeep   : $AutoKeep"
Write-Host "Guard rails: AGENTS.md"
Write-Host ""

if (-not $SkipPull) {
    Write-Host "Pulling latest main..." -ForegroundColor DarkGray
    git checkout main
    if ($LASTEXITCODE -ne 0) { throw "Could not checkout main" }
    git pull origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Warning: git pull failed - continuing with local main" -ForegroundColor Yellow
    }
}

$preExisting = Get-DirtySiteFiles
if ($preExisting.Count -gt 0) {
    Write-Host "Uncommitted site-file changes detected:" -ForegroundColor Yellow
    $preExisting | ForEach-Object { Write-Host "  $_" }
    if ($AutoKeep) {
        git stash push -m ("polish-loop pre-run " + (Get-Date -Format o)) -- @SiteFiles
        Write-Host "Auto-stashed (AutoKeep). Restore later with: git stash pop" -ForegroundColor Yellow
    }
    else {
        $cont = Read-Host "Stash them and continue? (y/N)"
        if ($cont.Trim().ToLowerInvariant() -ne "y") {
            Write-Host "Aborting. Commit or stash your work first." -ForegroundColor Red
            exit 1
        }
        git stash push -m ("polish-loop pre-run " + (Get-Date -Format o)) -- @SiteFiles
        Write-Host "Stashed. Restore later with: git stash pop" -ForegroundColor Yellow
    }
}

if (-not $SkipBranchCreate) {
    git checkout -b $branch
    if ($LASTEXITCODE -ne 0) {
        throw "Could not create branch $branch"
    }
}
$onBranch = git branch --show-current
Write-Host "On branch $onBranch" -ForegroundColor Green

if (-not $SkipLighthouseHint) {
    Write-Host ""
    Write-Host "Optional baseline (serve site in another terminal):" -ForegroundColor DarkGray
    Write-Host "  npx --yes serve -l 8080"
    Write-Host '  npx --yes lighthouse http://localhost:8080 --only-categories=performance,accessibility --quiet --chrome-flags="--headless"'
}

# --- Rounds ---
for ($round = 1; $round -le $MaxRounds; $round++) {
    if ($MaxMinutes -gt 0) {
        $elapsed = ((Get-Date) - $loopStart).TotalMinutes
        $elapsedRounded = [math]::Round($elapsed, 1)
        if ($elapsed -ge $MaxMinutes) {
            Write-Banner "Time box hit ($elapsedRounded min >= $MaxMinutes min) - stopping before round $round" "Yellow"
            break
        }
        Write-Host "Elapsed: $elapsedRounded / $MaxMinutes min" -ForegroundColor DarkGray
    }

    Write-Banner "=== Round $round / $MaxRounds - $Target ===" "Green"

    $dirty = Get-DirtySiteFiles
    if ($dirty.Count -gt 0) {
        Write-Host "Clearing leftover site-file dirt before round..." -ForegroundColor Yellow
        Discard-SiteChanges
    }

    $prompt = Build-RoundPrompt -Round $round -Focus $Target
    $grokCode = Invoke-GrokRound -PromptText $prompt -Round $round
    if ($grokCode -ne 0) {
        Write-Host "grok exited with code $grokCode" -ForegroundColor Red
    }

    Show-RoundDiff
    $changed = Get-DirtySiteFiles
    if ($changed.Count -eq 0) {
        Write-Host "No site-file changes this round." -ForegroundColor Yellow
        if ($AutoKeep) {
            Write-Host "AutoKeep: skip empty round." -ForegroundColor DarkGray
            $skips++
            continue
        }
        $decision = Read-Host "Type skip to continue, or stop to end loop"
        if ($decision.Trim().ToLowerInvariant() -eq "stop") { break }
        $skips++
        continue
    }

    Write-Host ""
    Write-Host "Review the diff above (and browser hard-refresh if serving)." -ForegroundColor Cyan
    if (-not $SkipLighthouseHint) {
        Write-Host "Optional: npx lighthouse http://localhost:8080 --only-categories=performance,accessibility --quiet"
    }

    if ($AutoKeep) {
        $decision = "keep"
        Write-Host "AutoKeep: committing round $round as pass candidate." -ForegroundColor Cyan
    }
    else {
        $decision = Read-Host "keep / skip / stop"
        $decision = $decision.Trim().ToLowerInvariant()
    }

    if ($decision -eq "stop") {
        Write-Host "Stopping loop. Discarding uncommitted round changes..." -ForegroundColor Yellow
        Discard-SiteChanges
        break
    }

    if ($decision -eq "keep") {
        git add -- @SiteFiles
        $msg = "polish($Target): round $round winner (AGENTS.md)"
        git commit -m $msg
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Commit failed - is there nothing staged?" -ForegroundColor Red
        }
        else {
            $winners++
            $bn = git branch --show-current
            Write-Host "Winner committed on $bn" -ForegroundColor Green
        }
    }
    else {
        Write-Host "Discarding round $round changes..." -ForegroundColor Yellow
        Discard-SiteChanges
        $skips++
        Write-Host "Skipped. Next round will try a different angle." -ForegroundColor DarkGray
    }

    if ($MaxMinutes -gt 0) {
        $elapsed = ((Get-Date) - $loopStart).TotalMinutes
        $elapsedRounded = [math]::Round($elapsed, 1)
        if ($elapsed -ge $MaxMinutes) {
            Write-Banner "Time box hit after round $round ($elapsedRounded min) - stopping" "Yellow"
            break
        }
    }

    if ($round -lt $MaxRounds -and $decision -ne "stop") {
        if ($AutoKeep) { $pause = 1 } else { $pause = 3 }
        Write-Host "Pause ${pause}s (Ctrl+C to abort loop)..." -ForegroundColor DarkGray
        Start-Sleep -Seconds $pause
    }
}

# --- Finish ---
Write-Banner "Loop finished" "Cyan"
$currentBranch = git branch --show-current
$totalElapsed = [math]::Round(((Get-Date) - $loopStart).TotalMinutes, 1)
Write-Host "Branch   : $currentBranch"
Write-Host "Winners  : $winners"
Write-Host "Skips    : $skips"
Write-Host "Elapsed  : $totalElapsed min"
Write-Host ""
Write-Host "Log:" -ForegroundColor DarkGray
git log main..HEAD --oneline 2>$null
if ($LASTEXITCODE -ne 0) {
    git log --oneline -8
}

if ($winners -eq 0) {
    Write-Host ""
    Write-Host "No winners. Safe to delete branch:" -ForegroundColor Yellow
    Write-Host "  git checkout main; git branch -D $currentBranch"
    exit 0
}

if ($MergeWhenDone) {
    Write-Host ""
    Write-Host "Merging $currentBranch into main and pushing..." -ForegroundColor Cyan
    git checkout main
    git pull origin main 2>$null
    git merge --ff-only $currentBranch
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Fast-forward failed; attempting merge commit..." -ForegroundColor Yellow
        git merge $currentBranch -m "Merge $currentBranch - polish winners"
    }
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Pushed to origin/main. Hard-refresh https://sovereignai.llc" -ForegroundColor Green
    }
    else {
        Write-Host "Push failed - resolve remote and retry: git push origin main" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host ""
    Write-Host "To ship winners:" -ForegroundColor Cyan
    Write-Host "  git checkout main"
    Write-Host "  git pull origin main"
    Write-Host "  git merge $currentBranch"
    Write-Host "  git push origin main"
    Write-Host ""
    Write-Host "Or re-run with -MergeWhenDone next time after reviewing."
    Write-Host "Parallel agents: cherry-pick/section-merge carefully - citadel.css conflicts are common."
}
