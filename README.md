# hermes-lang-pt-br

Brazilian Portuguese (**Português do Brasil**) language pack for Hermes Agent — the core
CLI/gateway, the Ink TUI and the Desktop app, in `pt-br`.

Text-only plugin: no Python, no `desktop/plugin.js`, no network, no permissions. Just catalogs.

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
| Core (CLI, gateway, approvals, tips) | `locales/pt-br.yaml` | 3,433 | 100% of the English core catalog |
| TUI (`hermes --tui`) | `locales/pt-br.tui.yaml` | 1,301 | 100% of the English TUI catalog |
| Desktop (app) | `locales/pt-br.desktop.yaml` | 4,314 | 84.8% of the English desktop catalog |

The core and TUI catalogs mirror the `pt` locale already bundled upstream; `pt-br` is registered as a
real variant so it always wins over the `pt`/`pt-BR` alias. The Desktop catalog is the original
contribution — before this pack the Desktop app had no Portuguese at all.

Missing Desktop keys fall back to English: a pack is allowed to be partial.

## Where the translations come from

Ported from the renderer-only `pt` catalog in
[StudioCodeAI/hermes-agent `feature/i18n-pt-br`](https://github.com/StudioCodeAI/hermes-agent/tree/feature/i18n-pt-br)
(PR [NousResearch/hermes-agent#92590](https://github.com/NousResearch/hermes-agent/pull/92590)).

`apps/desktop/src/i18n/pt_*.ts` was bundled with esbuild, composed exactly like `pt.ts` does, flattened
to dotted keys, and intersected with the English key export of `upstream/main`
(`locales/_keys.desktop.json`). Keys upstream has since removed are dropped, so the pack never carries
dead strings; the 38 dropped keys are listed when the build script runs.

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
translations".

> **Note:** both repos register the `pt-br` id, and when two packs cover the same key the last one
> loaded wins. Install **one** of them, not both.

## Requirements

Hermes ≥ 0.21 — language packs as plugins (`provides_locales`) landed there. Nothing else.

## Validating

```bash
hermes plugins validate .
```

Checks the manifest, the `provides_locales` declaration against the shipped files, text-only leaves,
and every key against the English reference catalogs.

Verified against `upstream/main`: **0 placeholder/key divergences** on all three surfaces
(core 3,433/3,433 · TUI 1,301/1,301 · Desktop 4,314/4,314 present in the English key export).

The two `caution` hits from the install scanner are false positives on translated prose: a
`… install.sh | sh` URL inside a translated error message, and an "update AGENTS.md" string.

## Placeholders

Entries whose English value is a *function* are written here as strings with positional `{0}`, `{1}`, …
placeholders in argument order. Core (Python) strings keep their **named** placeholders exactly as
English does. Both are substituted at runtime and never reach the screen.

## License

MIT. The core and TUI catalogs mirror Hermes Agent's bundled `pt` locale (MIT, © Nous Research);
the Desktop catalog is © StudioCodeAI.
