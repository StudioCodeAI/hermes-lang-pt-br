#!/usr/bin/env python3
"""Report how far this pack is from hermes-agent@main and from the latest release.

Runs ``tools/verify_pack.py --json`` once per reference and prints a Markdown
summary. Exit code is always 0 — drift is information, not a failure; the
workflow that runs it decides what to do with ``--drift``.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
VERIFY = HERE / "verify_pack.py"
REPO = "NousResearch/hermes-agent"


def latest_release() -> str:
    try:
        out = subprocess.run(
            ["gh", "api", f"repos/{REPO}/releases/latest", "--jq", ".tag_name"],
            capture_output=True,
            text=True,
            timeout=30,
            check=True,
        ).stdout.strip()
        return out or "main"
    except Exception:
        return "main"


def run_report(ref: str) -> dict:
    done = subprocess.run(
        [sys.executable, str(VERIFY), "--json", "--ref", ref, "--repo", REPO],
        capture_output=True,
        text=True,
        cwd=HERE.parent,
    )
    try:
        return json.loads(done.stdout)
    except json.JSONDecodeError:
        return {"ok": False, "errors": [done.stderr.strip() or "no JSON"], "surfaces": {}}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--drift", action="store_true", help="exit 1 when any reference drifted")
    args = parser.parse_args()

    release = latest_release()
    refs = ["main"] + ([release] if release != "main" else [])
    reports = {ref: run_report(ref) for ref in refs}

    drifted = False
    lines = ["| reference | surface | keys | coverage | missing | unknown | orphans |", "|---|---|---|---|---|---|---|"]
    for ref, report in reports.items():
        for surface, entry in sorted(report.get("surfaces", {}).items()):
            if entry.get("error"):
                lines.append(f"| `{ref}` | {surface} | — | — | — | — | {entry['error']} |")
                drifted = True
                continue
            missing = entry["reference_keys"] - (entry["keys"] - entry["unknown_count"])
            unknown = entry["unknown_count"]
            orphans = entry.get("orphans")
            orphans = len(orphans) if isinstance(orphans, list) else 0
            if missing or unknown or orphans:
                drifted = True
            lines.append(
                f"| `{ref}` | {surface} | {entry['keys']} | {entry['coverage']:.1%} | "
                f"{missing} | {unknown} | {orphans} |"
            )

    print("## hermes-lang-pt-br — drift report\n")
    print("\n".join(lines))
    print(
        "\n`missing` = English keys the pack does not translate yet · "
        "`unknown` = pack keys this reference no longer has · `orphans` = same, counted per file.\n"
    )
    print("**drift detected**" if drifted else "**in sync**")

    if drifted and args.drift:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
