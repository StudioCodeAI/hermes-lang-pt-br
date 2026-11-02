# hermes-lang-pt-br

Brazilian Portuguese (**Português do Brasil**) language pack for Hermes Agent — the core
CLI/gateway, the Ink TUI and the Desktop app, in `pt-br`.

Text-only plugin: no Python, no `desktop/plugin.js`, no network, no permissions. Just catalogs.

What changed in each release: [CHANGELOG.md](CHANGELOG.md).

## Install

```bash
hermes plugins install StudioCodeAI/hermes-lang-pt-br
hermes plugins enable hermes-lang-pt-br
```

Then pick the language in Desktop settings, or set it in config:

```bash
hermes config set display.language pt-br
```

Restart the Desktop app (or start a new session) so the catalogs are picked up.

## What's covered

| Surface | File | Keys | Coverage |
|---|---|---|---|
| Core (CLI, gateway, approvals, tips) | `locales/pt-br.yaml` | 3,515 | **100%** of the English core catalog at `main` @ `25b50015` |
| TUI (`hermes --tui`) | `locales/pt-br.tui.yaml` | 1,390 | **100%** of the English TUI catalog at `main` @ `25b50015` |
| Desktop (app) | `locales/pt-br.desktop.yaml` | 5,517 | **99.9%** — every translatable string at `main` @ `25b50015`; the 4 remaining reference keys are arrays/structured values a text pack cannot carry |

The core and TUI catalogs mirror the `pt` locale already bundled upstream; `pt-br` is registered as a
real variant so it always wins over the `pt`/`pt-BR` alias. The Desktop catalog is the original
contribution — before this pack the Desktop app had no Portuguese at all.

The catalogs track `NousResearch/hermes-agent@main`, which moves every day — so every figure on this
page names the revision it was measured against, and `python tools/drift.py` prints the gap against the
current `main`. At the last resync every translatable key existed and every value was translated;
function-valued entries are carried as strings with positional `{0}` placeholders, and array- or
object-valued entries stay in TypeScript, because a text pack cannot carry them. On a
*release* older than the latest `main`,
`hermes plugins validate` lists the keys upstream added since that release as "not in the English
catalog (ignored at runtime)" — those are warnings, never errors, and the strings are simply not
reached until the release that introduces them. Building against an older release instead would carry
keys upstream has since deleted, which is worse.


## Where the translations come from

The **Desktop** catalog started as a port of the renderer-only `pt` catalog in
[StudioCodeAI/hermes-agent `feature/i18n-pt-br`](https://github.com/StudioCodeAI/hermes-agent/tree/feature/i18n-pt-br)
(PR [NousResearch/hermes-agent#92590](https://github.com/NousResearch/hermes-agent/pull/92590)), which
was closed unmerged upstream. That fork is **no longer part of the pipeline**: since v1.2.3
`pt-br.desktop.yaml` is the source of truth and is maintained directly, key by key, against the English
export of `main`.

Two tools support that: `tools/emit-en.mjs` flattens the English bundle (the Desktop values live in
TypeScript) when a resync needs it, and `tools/reference/en.desktop.placeholders.json` records the
placeholder shape of the 741 keys that have one — so `tools/verify_pack.py` checks the Desktop surface
with no fork and no build step.

## Credits and timeline

The **Desktop** catalog is this pack's original contribution, and it started with StudioCodeAI:

| Date | What |
|---|---|
| 2026-08-23 | StudioCodeAI opens [PR #92590](https://github.com/NousResearch/hermes-agent/pull/92590) — the first Desktop pt-BR proposal |
| 2026-09-16 | commit `0bbc800f55e` **creates** `apps/desktop/src/i18n/pt.ts`; before it the Desktop app had no Portuguese at all |
| 2026-09-28 | [#126296](https://github.com/NousResearch/hermes-agent/pull/126296) moves i18n to pluggable, layered language packs — an in-tree TS catalog stops being the supported shape |
| 2026-10-13 | the catalog is ported here, in the layout the loader and `hermes plugins validate` expect |

The core and TUI catalogs mirror the `pt` locale Hermes already bundles upstream (added by other
contributors); they are re-registered here under the real `pt-br` id so it wins over the `pt` / `pt-BR`
alias.

Credit where it is due: [henrickgu/hermes-lang-pt-br](https://github.com/henrickgu/hermes-lang-pt-br)
independently reused the keys from PR #92590 — "every valid key from this PR plus 1,501 new
translations". His upstream proposal for the same surface
([#98933](https://github.com/NousResearch/hermes-agent/pull/98933)) was opened after #92590 and closed
unmerged; **this** repository is the catalogue entry and the only one that ships versioned releases.
The full provenance record — including who wrote each surface — is in [AUTHORS.md](AUTHORS.md).

> **Note:** both repos register the `pt-br` id, and when two packs cover the same key the last one
> loaded wins. Install **one** of them, not both.

## Staying in sync

Hermes moves fast. `.github/workflows/drift.yml` runs weekly (and on demand) and reports how far the
pack is from `main` and from the latest release, opening a single issue when `main` has keys we do not
translate yet or no longer has keys we carry.

```bash
python tools/drift.py            # the same report, locally
python tools/drift.py --drift    # non-zero exit when something drifted
```

The routine when it fires:

1. Translate the newly missing keys (the report lists them).
2. Drop the keys the report marks stale — `main` no longer has them.
3. If the Desktop surface moved, refresh its placeholder reference from an English checkout:
   `node tools/emit-en.mjs desktop <out.json>`, then
   `python tools/build-desktop-reference.py <out.json> tools/reference/en.desktop.placeholders.json <sha>`.
4. `python tools/verify_pack.py --ref main` and `hermes plugins validate .` — both must pass.
5. Commit, then open a **SHA-bump PR** for `plugin-catalog/hermes-lang-pt-br.yaml` in
   `NousResearch/hermes-agent` (catalogue rule 4: a SHA bump is a new PR).

Nothing updates an installed copy on its own — by design, a listed plugin may not self-update
(catalogue rule 3), so users pick the new pin up with `hermes plugins update hermes-lang-pt-br`.

## Requirements

Hermes ≥ 0.21 — language packs as plugins (`provides_locales`) landed there. Nothing else.

## Validating

```bash
hermes plugins validate .
```

Checks the manifest, the `provides_locales` declaration against the shipped files, text-only leaves,
and every key against the English reference catalogs.

`tools/verify_pack.py` is the standalone twin, and CI runs it on every push and pull request
(`.github/workflows/verify.yml`). It needs no Hermes install and no clone — it fetches the reference
files from `NousResearch/hermes-agent` over HTTPS and checks, per surface:

1. every catalog parses and every leaf is text;
2. every key exists in the English reference for that surface;
3. placeholders keep the English shape — core against `locales/en.yaml`, Desktop against the committed
   `tools/reference/en.desktop.placeholders.json`;
4. braces are balanced in every value;
5. no duplicate keys.

```bash
python tools/verify_pack.py                        # against hermes-agent@main
python tools/verify_pack.py --ref v0.21.6          # against a release tag
python tools/verify_pack.py --json                 # machine-readable report
python tools/verify_pack.py --min-desktop-coverage 0.80
```

Current result against `main` @ `25b50015` (2026-11-02): **PASS**, no warnings, 0 errors.

```
- core     locales/pt-br.yaml:         3515 key(s), 100.0% of the English catalog, 0 unknown, 0 placeholder mismatch(es)
- tui      locales/pt-br.tui.yaml:     1390 key(s), 100.0% of the English catalog, 0 unknown, 0 placeholder mismatch(es)
- desktop  locales/pt-br.desktop.yaml: 5517 key(s),  99.9% of the English catalog, 0 unknown, 0 placeholder mismatch(es)
```

Verified against that revision: **0 unknown keys and 0 placeholder divergences** on all three surfaces
(core 3,515/3,515 · TUI 1,390/1,390 · Desktop 5,517/5,521 — the 4 remaining reference keys are arrays
or structured values a text pack cannot carry: `composer.followUpPlaceholders`,
`composer.newSessionPlaceholders`, `intro.custom`, `sidebar.projects.branchOff`).

The two `caution` hits from the install scanner are false positives on translated prose: a
`… install.sh | sh` URL inside a translated error message, and an "update AGENTS.md" string.

## Placeholders

Entries whose English value is a *function* are written here as strings with positional `{0}`, `{1}`, …
placeholders in argument order. Core (Python) strings keep their **named** placeholders exactly as
English does. Both are substituted at runtime and never reach the screen.

## License

MIT. The core and TUI catalogs mirror Hermes Agent's bundled `pt` locale (MIT, © Nous Research);
the Desktop catalog is © StudioCodeAI.
