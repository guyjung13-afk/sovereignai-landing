#!/usr/bin/env python3
"""
SovereignAI polish-loop launcher.

The real loop lives in:
  - polish-loop.ps1  (Windows PowerShell — recommended on this machine)
  - polish-loop.sh   (bash / Git Bash / WSL / macOS)

This file only dispatches so `python polish-loop.py` does not silently fail.
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

    if is_windows:
        ps1 = ROOT / "polish-loop.ps1"
        if not ps1.exists():
            print("ERROR: polish-loop.ps1 missing", file=sys.stderr)
            return 1
        # Map: python polish-loop.py "hero" 4  →  -Target hero -MaxRounds 4
        cmd = [
            "powershell",
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            str(ps1),
        ]
        if args:
            cmd.extend(["-Target", args[0]])
        if len(args) > 1:
            cmd.extend(["-MaxRounds", args[1]])
        if "--merge" in args or os.environ.get("MERGE_WHEN_DONE") == "1":
            cmd.append("-MergeWhenDone")
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
    cmd = [bash, str(sh), *args]
    print(f"Dispatching: {' '.join(cmd)}")
    return subprocess.call(cmd, cwd=str(ROOT))


if __name__ == "__main__":
    raise SystemExit(main())
