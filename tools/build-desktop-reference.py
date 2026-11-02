#!/usr/bin/env python3
"""Build the committed desktop placeholder reference for verify_pack.py.

`locales/_keys.desktop.json` carries keys only, and the desktop values live in
TypeScript, so the pack had no way to check desktop placeholders without the
generator fork. This snapshots just the placeholder shape of the English bundle
(one entry per key that has any), which is all the check needs — a few KB
instead of the 500 KB full bundle.

Run with the English bundle emitted by emit-en.mjs:

    node tools/emit-en.mjs desktop <en-desktop.json>
    python tools/build-desktop-reference.py <en-desktop.json> tools/reference/en.desktop.placeholders.json <sha>
"""

import json
import re
import sys
from pathlib import Path

src, out, ref = sys.argv[1], sys.argv[2], sys.argv[3]
PH = re.compile(r"\{([0-9]+|[A-Za-z_][A-Za-z0-9_]*)\}")

bundle = json.loads(Path(src).read_text(encoding="utf-8"))
placeholders = {}
for key, value in bundle.items():
    found = [m.group(1) for m in PH.finditer(value)]
    if found:
        placeholders[key] = found

doc = {
    "_comment": (
        "Placeholder shape of the English desktop bundle, emitted by "
        "tools/emit-en.mjs at the revision in `ref`. Used by tools/verify_pack.py "
        "to check the desktop surface; regenerate it on every desktop resync."
    ),
    "ref": ref,
    "placeholders": dict(sorted(placeholders.items())),
}
Path(out).parent.mkdir(parents=True, exist_ok=True)
Path(out).write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8", newline="\n")
print(f"{len(placeholders)} keys with placeholders out of {len(bundle)} -> {out}")
