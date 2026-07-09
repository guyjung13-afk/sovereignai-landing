# SovereignAI.llc Landing Page Polish Loop (Windows PowerShell)
# Full process: pull → experiment branch → focused rounds → keep/skip → merge path
#
# Usage (from repo root):
#   .\polish-loop.ps1
#   .\polish-loop.ps1 -Target "hero section"
#   .\polish-loop.ps1 -Target "principles mobile" -MaxRounds 4
#   .\polish-loop.ps1 -Target "CTA hierarchy" -MergeWhenDone
#
# Requires: git, grok CLI on PATH. Optional: node/npx for Lighthouse.

param(
    [string]$Target = "whole page",
    [int]$MaxRounds = 6,
    [switch]$MergeWhenDone,
    [switch]$SkipPull,
    [switch]$SkipLighthouseHint
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$SiteFiles = @("index.html", "citadel.css", "citadel.js", "manifesto.html", "privacy.html", "terms.html")
$branch = "polish-experiment-$(Get-Date -Format 'yyyyMMdd-HHmm')"
$winners = 0
$skips = 0

function Write-Banner([string]$Text, [string]$Color = "Cyan") {
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
        throw "grok CLI not found on PATH (expected C:\Users\<you>\.grok\bin\grok.exe)"
    }
}

function Get-DirtySiteFiles {
    $status = git status --porcelain -- @SiteFiles 2>$null
    if (-not $status) { return @() }
    return @($status)
}

function Discard-SiteChanges {
    # Restore only tracked site files — never wipe unrelated untracked work
    foreach ($f in $SiteFiles) {
        if (Test-Path $f) {
            git restore --worktree --staged --source=HEAD -- $f 2>$null
        }
    }
    # Drop untracked site-file leftovers only if present (rare)
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

function Build-RoundPrompt([int]$Round, [string]$Focus) {
    return @"
You are polishing the SovereignAI.llc static landing page in this repo.

## Mandatory process (do all of this)
1. Read AGENTS.md guard rails and success criteria first.
2. Inspect the current target only: $Focus
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

Round: $Round of focused polish on: $Focus
"@
}

# ——— Bootstrap ———
Assert-GitRepo
Write-Banner "SovereignAI polish loop" "Cyan"
Write-Host "Target     : $Target"
Write-Host "Max rounds : $MaxRounds"
Write-Host "Repo       : $PSScriptRoot"
Write-Host "Branch     : $branch"
Write-Host "Guard rails: AGENTS.md"
Write-Host ""

if (-not $SkipPull) {
    Write-Host "Pulling latest main..." -ForegroundColor DarkGray
    git checkout main
    if ($LASTEXITCODE -ne 0) { throw "Could not checkout main" }
    git pull origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Warning: git pull failed — continuing with local main" -ForegroundColor Yellow
    }
}

$preExisting = Get-DirtySiteFiles
if ($preExisting.Count -gt 0) {
    Write-Host "Uncommitted site-file changes detected:" -ForegroundColor Yellow
    $preExisting | ForEach-Object { Write-Host "  $_" }
    $cont = Read-Host "Stash them and continue? (y/N)"
    if ($cont.Trim().ToLowerInvariant() -ne "y") {
        Write-Host "Aborting. Commit or stash your work first." -ForegroundColor Red
        exit 1
    }
    git stash push -m "polish-loop pre-run $(Get-Date -Format o)" -- @SiteFiles
    Write-Host "Stashed. Restore later with: git stash pop" -ForegroundColor Yellow
}

git checkout -b $branch
if ($LASTEXITCODE -ne 0) {
    throw "Could not create branch $branch"
}
Write-Host "On branch $branch" -ForegroundColor Green

if (-not $SkipLighthouseHint) {
    Write-Host ""
    Write-Host "Optional baseline (serve site in another terminal):" -ForegroundColor DarkGray
    Write-Host "  npx --yes serve -l 8080"
    Write-Host "  npx --yes lighthouse http://localhost:8080 --only-categories=performance,accessibility --quiet --chrome-flags=`"--headless`""
}

# ——— Rounds ———
for ($round = 1; $round -le $MaxRounds; $round++) {
    Write-Banner "=== Round $round / $MaxRounds — $Target ===" "Green"

    # Ensure clean baseline for this round (only site files)
    $dirty = Get-DirtySiteFiles
    if ($dirty.Count -gt 0) {
        Write-Host "Clearing leftover site-file dirt before round..." -ForegroundColor Yellow
        Discard-SiteChanges
    }

    $prompt = Build-RoundPrompt -Round $round -Focus $Target

    Write-Host "Running grok (headless, acceptEdits)..." -ForegroundColor DarkGray
    & grok -p $prompt --cwd $PSScriptRoot --permission-mode acceptEdits --max-turns 30
    $grokCode = $LASTEXITCODE
    if ($grokCode -ne 0) {
        Write-Host "grok exited with code $grokCode" -ForegroundColor Red
    }

    Show-RoundDiff
    $changed = Get-DirtySiteFiles
    if ($changed.Count -eq 0) {
        Write-Host "No site-file changes this round." -ForegroundColor Yellow
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

    $decision = Read-Host "keep / skip / stop"
    $decision = $decision.Trim().ToLowerInvariant()

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
            Write-Host "Commit failed — is there nothing staged?" -ForegroundColor Red
        }
        else {
            $winners++
            Write-Host "Winner committed on $branch" -ForegroundColor Green
        }
    }
    else {
        Write-Host "Discarding round $round changes..." -ForegroundColor Yellow
        Discard-SiteChanges
        $skips++
        Write-Host "Skipped. Next round will try a different angle." -ForegroundColor DarkGray
    }

    if ($round -lt $MaxRounds -and $decision -ne "stop") {
        Write-Host "Pause 3s (Ctrl+C to abort loop)..." -ForegroundColor DarkGray
        Start-Sleep -Seconds 3
    }
}

# ——— Finish ———
Write-Banner "Loop finished" "Cyan"
Write-Host "Branch   : $branch"
Write-Host "Winners  : $winners"
Write-Host "Skips    : $skips"
Write-Host ""
Write-Host "Log:" -ForegroundColor DarkGray
git log main..HEAD --oneline 2>$null
if ($LASTEXITCODE -ne 0) {
    git log --oneline -8
}

if ($winners -eq 0) {
    Write-Host ""
    Write-Host "No winners. Safe to delete branch:" -ForegroundColor Yellow
    Write-Host "  git checkout main; git branch -D $branch"
    exit 0
}

if ($MergeWhenDone) {
    Write-Host ""
    Write-Host "Merging $branch into main and pushing..." -ForegroundColor Cyan
    git checkout main
    git pull origin main 2>$null
    git merge --ff-only $branch
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Fast-forward failed; attempting merge commit..." -ForegroundColor Yellow
        git merge $branch -m "Merge $branch — polish winners"
    }
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Pushed to origin/main. Hard-refresh https://sovereignai.llc" -ForegroundColor Green
    }
    else {
        Write-Host "Push failed — resolve remote and retry: git push origin main" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host ""
    Write-Host "To ship winners:" -ForegroundColor Cyan
    Write-Host "  git checkout main"
    Write-Host "  git pull origin main"
    Write-Host "  git merge $branch"
    Write-Host "  git push origin main"
    Write-Host ""
    Write-Host "Or re-run with -MergeWhenDone next time after reviewing."
}
