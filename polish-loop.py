#!/usr/bin/env python3
"""
SovereignAI polish-loop launcher.

The real loop lives in:
  - polish-loop.ps1  (Windows PowerShell — recommended on this machine)
  - polish-loop.sh   (bash / Git Bash / WSL / macOS)

This file only dispatches so `python polish-loop.py` does not silently fail.

Examples:
  python polish-loop.py "hero section"
  python polish-loop.py "architecture" 4
  python polish-loop.py "inquiry" 4 --auto-keep --max-minutes 5 --skip-pull --skip-branch
  python polish-loop.py "CTA" --merge
"""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def main() -> int:
    args = sys.argv[1:]
    is_windows = os.name == "nt"

    # Shared flag parsing (positional target + optional max rounds remain first)
    positionals: list[str] = []
    flags = {
        "merge": False,
        "auto_keep": False,
        "skip_pull": False,
        "skip_branch": False,
        "skip_lh": False,
        "max_minutes": None,
        "max_turns": None,
        "branch_name": None,
    }
    i = 0
    while i < len(args):
        a = args[i]
        if a in ("--merge",):
            flags["merge"] = True
        elif a in ("--auto-keep", "--autokeep"):
            flags["auto_keep"] = True
        elif a in ("--skip-pull",):
            flags["skip_pull"] = True
        elif a in ("--skip-branch", "--skip-branch-create"):
            flags["skip_branch"] = True
        elif a in ("--skip-lighthouse",):
            flags["skip_lh"] = True
        elif a in ("--max-minutes",) and i + 1 < len(args):
            i += 1
            flags["max_minutes"] = args[i]
        elif a in ("--max-turns",) and i + 1 < len(args):
            i += 1
            flags["max_turns"] = args[i]
        elif a in ("--branch-name",) and i + 1 < len(args):
            i += 1
            flags["branch_name"] = args[i]
        elif a.startswith("-"):
            print(f"Unknown flag: {a}", file=sys.stderr)
            return 2
        else:
            positionals.append(a)
        i += 1

    if os.environ.get("MERGE_WHEN_DONE") == "1":
        flags["merge"] = True
    if os.environ.get("AUTO_KEEP") == "1":
        flags["auto_keep"] = True

    if is_windows:
        ps1 = ROOT / "polish-loop.ps1"
        if not ps1.exists():
            print("ERROR: polish-loop.ps1 missing", file=sys.stderr)
            return 1
        cmd = [
            "powershell",
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            str(ps1),
        ]
        if positionals:
            cmd.extend(["-Target", positionals[0]])
        if len(positionals) > 1:
            cmd.extend(["-MaxRounds", positionals[1]])
        if flags["max_minutes"] is not None:
            cmd.extend(["-MaxMinutes", str(flags["max_minutes"])])
        if flags["max_turns"] is not None:
            cmd.extend(["-MaxTurns", str(flags["max_turns"])])
        if flags["branch_name"]:
            cmd.extend(["-BranchName", flags["branch_name"]])
        if flags["merge"]:
            cmd.append("-MergeWhenDone")
        if flags["auto_keep"]:
            cmd.append("-AutoKeep")
        if flags["skip_pull"]:
            cmd.append("-SkipPull")
        if flags["skip_branch"]:
            cmd.append("-SkipBranchCreate")
        if flags["skip_lh"]:
            cmd.append("-SkipLighthouseHint")
        print(f"Dispatching: {' '.join(cmd)}")
        return subprocess.call(cmd, cwd=str(ROOT))

    sh = ROOT / "polish-loop.sh"
    if not sh.exists():
        print("ERROR: polish-loop.sh missing", file=sys.stderr)
        return 1
    bash = shutil.which("bash")
    if not bash:
        print("ERROR: bash not found. Run ./polish-loop.sh directly.", file=sys.stderr)
        return 1
    env = os.environ.copy()
    if flags["merge"]:
        env["MERGE_WHEN_DONE"] = "1"
    if flags["auto_keep"]:
        env["AUTO_KEEP"] = "1"
    if flags["skip_pull"]:
        env["SKIP_PULL"] = "1"
    if flags["skip_branch"]:
        env["SKIP_BRANCH_CREATE"] = "1"
    if flags["max_minutes"] is not None:
        env["MAX_MINUTES"] = str(flags["max_minutes"])
    if flags["max_turns"] is not None:
        env["MAX_TURNS"] = str(flags["max_turns"])
    if flags["branch_name"]:
        env["BRANCH_NAME"] = flags["branch_name"]
    cmd = [bash, str(sh), *positionals]
    print(f"Dispatching: {' '.join(cmd)}")
    return subprocess.call(cmd, cwd=str(ROOT), env=env)


if __name__ == "__main__":
    raise SystemExit(main())
