#!/usr/bin/env node
// Emit the flattened English desktop catalog of a hermes-agent checkout as JSON,
// so the pack's tooling can diff against the real source strings (the key exports
// carry no text, and function leaves need a positional form).
//
//   node tools/emit-en.mjs desktop <outfile.json>
//
// Needs an English checkout to bundle from and a checkout with node_modules for
// esbuild. Defaults are the sibling directories of this repo:
//   HERMES_EN    the hermes-agent checkout holding the sources   (../hermes-en)
//   HERMES_MAIN  a checkout with node_modules/esbuild installed  (../hermes-agent)
//
// The result feeds tools/build-desktop-reference.py, which keeps only the
// placeholder shape and commits it as tools/reference/en.desktop.placeholders.json.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const PACK = resolve(HERE, '..')
const MAIN = process.env.HERMES_MAIN ?? join(PACK, '..', 'hermes-agent')
const EN = process.env.HERMES_EN ?? join(PACK, '..', 'hermes-en')
const TMP = process.env.HERMES_TMP ?? join(PACK, '.build')

const require = createRequire(join(MAIN, 'package.json'))
const esbuild = require('esbuild')

const surface = process.argv[2]
const outfile = process.argv[3]
if (!surface || !outfile) {
  console.error('usage: node emit-en.mjs desktop|tui <outfile.json>')
  process.exit(2)
}

const app = join(EN, 'apps/desktop')
const alias = {
  '@hermes/shared/ansi': join(EN, 'apps/shared/src/ansi.ts'),
  '@hermes/shared/billing': join(EN, 'apps/shared/src/billing-types.ts'),
  '@hermes/shared/color': join(EN, 'apps/shared/src/color.ts'),
  '@hermes/shared/gateway-text': join(EN, 'apps/shared/src/gateway-text.ts'),
  '@hermes/shared/i18n': join(EN, 'apps/shared/src/i18n.ts'),
  '@hermes/shared/translucency': join(EN, 'apps/shared/src/translucency.ts'),
  '@hermes/shared': join(EN, 'apps/shared/src/index.ts'),
  '@': join(app, 'src')
}

const ENTRIES = {
  desktop: join(app, 'src/i18n/en.ts'),
  tui: join(EN, 'ui-tui/src/i18n/en.ts')
}

const SENTINEL = '\u0001'

/** Render a function-valued leaf as a `{0}`/`{1}` template by invoking it with
 *  sentinels — the only way to see its literal text from the bundle. */
function renderFn(fn) {
  const args = Array.from({ length: 6 }, (_, i) => `${SENTINEL}${i}${SENTINEL}`)
  try {
    const out = fn(...args)
    if (typeof out !== 'string') {
      return null
    }
    return out.replace(/\u0001(\d)\u0001/g, '{$1}')
  } catch {
    return null
  }
}

function flatten(node, prefix = '', out = {}) {
  if (Array.isArray(node)) {
    return out
  }
  if (node !== null && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      flatten(value, prefix ? `${prefix}.${key}` : key, out)
    }
  } else if (typeof node === 'string') {
    out[prefix] = node
  } else if (typeof node === 'function') {
    const rendered = renderFn(node)
    if (rendered !== null) {
      out[prefix] = rendered
    }
  }
  return out
}

async function main() {
  mkdirSync(TMP, { recursive: true })
  const bundled = join(TMP, `en-${surface}-${process.pid}.mjs`)
  await esbuild.build({
    entryPoints: [ENTRIES[surface]],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node22',
    jsx: 'automatic',
    alias,
    nodePaths: [join(MAIN, 'node_modules'), join(MAIN, 'apps/desktop/node_modules')],
    loader: { '.css': 'empty', '.svg': 'empty', '.png': 'empty', '.woff2': 'empty', '.woff': 'empty' },
    logLevel: 'silent',
    outfile: bundled
  })

  const mod = await import(pathToFileURL(bundled).href)
  const flat = flatten(mod.en)
  writeFileSync(outfile, JSON.stringify(flat, null, 0), 'utf8')
  rmSync(bundled, { force: true })

  const strings = Object.values(flat).filter(v => typeof v === 'string').length
  const fns = Object.keys(flat).length - strings
  console.log(`${surface}: ${Object.keys(flat).length} leaves (${strings} text, ${fns} function/closed) -> ${outfile}`)
}

await main()
