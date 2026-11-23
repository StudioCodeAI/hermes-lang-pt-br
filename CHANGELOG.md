# Changelog

What changed, newest first. The pack tracks `NousResearch/hermes-agent@main`; every release names the
revision its figures were measured against. Coverage is `matched / reference` per surface — a text pack
cannot carry array- or object-valued entries, so the Desktop ceiling is 5,517 of 5,521 keys.

## 1.2.5 — 2026-11-24

- **Full resync across all three surfaces against `main` @ `352b249f`**: 158 new keys translated, 10 stale keys dropped, and 4 structured overrides removed. **Additive only** — no translation that shipped in 1.2.4 is modified.
- **Core (100.0% — 3,577/3,577)**: added 47 keys — `gateway.context` (13), `platform.shared` (10), `platform.telegram` (7), `gateway.exec_approval` (5), `cli.gateway_restart` (3), `gateway.debug` (3), `gateway.busy` (2), plus `gateway.moa`, `gateway.reset` and `gateway.shared`. Dropped 5 stale keys (`gateway.notify.turn_error_detailed`, `gateway.notify.turn_error_no_details`, `gateway.topic.system_topic_intro`, `gateway.topic.system_topic_name`, `platform.discord.limits.response_truncated`).
- **TUI (100.0% — 1,445/1,445)**: unchanged — upstream added and dropped nothing on this surface.
- **Desktop (99.9% — 5,694 keys)**: added 115 keys — `settings.backup` (52), `assistant.approval` (15), `notifications.native` (8), `settings.notifications` (7), `settings.gateway` (5), `webhooks.signatureOptions` (4) and others. Dropped 5 stale keys (`composer.wakingProfile`, `skills.hub.pickerBrowse`, `skills.hub.pickerHide`, `skills.hub.pickerHint`, `skills.hub.pickerTitle`).
- **Removed 4 entries a text-only pack must not carry** — upstream defines them as arrays or functions, and a scalar override makes the Desktop fail at runtime: `settings.backup.keeps` and `settings.backup.replaces` (arrays fed to `PlainList.items.map`), `intro.custom` (a function returning greeting bodies) and `sidebar.projects.branchOff` (a function returning `{ before, after }`).
- **Wording corrected on 31 keys** found in review: the text described the wrong flow — backup presented as a terminal command and as a manual CLI transfer (it is the automatic Hermes Cloud transfer), a permanent permission described as single-session, a signature-scheme selector described as a secret header, and the public-paste disclosure missing its contents and retention warning.
- **Desktop placeholder reference regenerated** against `main` @ `352b249f` (788 keys checked, 0 mismatches) — `tools/emit-en.mjs` + `tools/build-desktop-reference.py`.
- Closes #10 (i18n drift).

## 1.2.4 — 2026-11-07

- **Full resync across all three surfaces against `main` @ `a9ff9799`**: 150 new keys translated, 4 stale keys dropped.
- **Core (100.0% — 3,535/3,535)**: added 22 keys (`cli.backtrack.*` transcript rewind, `slash.rewind.*`, Feishu clarification, rollback undo notices). Dropped 2 stale Yuanbao keys.
- **TUI (100.0% — 1,445/1,445)**: added 55 keys (queue management `/queue`, rewind flow `/rewind`, plugin updates status, paste section chips).
- **Desktop (99.9% — 5,588/5,592)**: added 73 keys (Team Gateway relay links, credential vault filling, plugin auto-update & update-all, conversation compacting, Daybreak routing). Dropped 2 stale skills hub keys.
- **Desktop placeholder reference updated**: snapshot regenerated against `a9ff9799` (764 keys checked, 0 mismatches).
- Closes #6 (i18n drift).

## 1.2.3 — 2026-11-02

- **Desktop resynced to 100% of the translatable English catalog** at `main` @ `25b50015`: 398 keys
  translated (settings, catalog, billing, cron, terminal drops, plugin folder/script access, subagent
  routing), 53 keys upstream had retired dropped. 5,517/5,521 keys, 99.9%.
- **The generator fork is gone.** `tools/build-desktop-pack.mjs` and the
  `StudioCodeAI/hermes-agent@feature/i18n-pt-br` dependency are removed — that PR (#92590) was closed
  unmerged upstream, and the fork was 5,064 commits behind. `locales/pt-br.desktop.yaml` is now the
  source of truth.
- **The Desktop surface gained placeholder verification.** `tools/reference/en.desktop.placeholders.json`
  commits the placeholder shape of the 741 English keys that have one, and `tools/verify_pack.py`
  checks it — offline, with no fork and no build step. The first run surfaced **22 real divergences**
  in the Desktop catalog (provider/model placeholders dropped or invented), all fixed here.
- `tools/emit-en.mjs` moved into the repo, with repo-relative defaults.

## 1.2.2 — 2026-11-02

- **Core and TUI resynced to 100%** against `main` @ `25b50015`: 42 core keys (`cli.billing.keep_going_*`,
  `plan_usage.*`, `gateway.model.reset_*`, `platform.discord.approval.*`) and 40 TUI keys
  (`billing.keepGoing.*`, `libText.billingDialog.limit*`, `pickers.model.plan.*`, `userMessages.rpc.*`).
  Both were seeded from the upstream `pt` catalog — which carries all 3,515 core and 1,390 TUI keys — and
  passed through a pt-BR wording review.
- 20 keys upstream had retired were dropped (13 `cli.commands.browser.*`,
  `cli.model.normalized_copilot_model`, 5 `slashCmd.ops.browser.*`, `prompt.approval.moreLines`).
- README: coverage figures are now anchored to the revision they were measured against, and the desktop
  numerator counts matched keys.

## 1.2.1 — 2026-10-22

- Core resynced: the 8 `cli.queue.*` notices and the 2 new `gateway.errors.*` notices
  (`cron_session_read_only`, `workspace_unavailable`). 3,487/3,487 keys.

## 1.2.0 — 2026-10-19

- Core and TUI resynced with `main` (51 strings), the pt-PT → pt-BR wording pass merged (#3), and the
  catalogue entry moved to this version (`NousResearch/hermes-agent#141675`).
- Core 3,477/3,477 · TUI 1,356/1,356 · Desktop 5,172/5,176.

## Earlier

Versions before 1.2.0 predate this file; see [AUTHORS.md](AUTHORS.md) for the timeline and the commit
log for the detail.
