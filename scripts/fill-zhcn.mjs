#!/usr/bin/env node
// Fill the MISSING `zhCN` (Simplified Chinese) values of the localized data files from `zh` (Traditional).
//
//   npm run i18n:zhcn            # write
//   npm run i18n:zhcn -- --dry   # report counts only
//
// Rules
//  - Only objects that have a `zh` string / string[] and no non-empty `zhCN` are touched. An existing
//    (human-written) `zhCN` is never overwritten. Key order is kept: `zhCN` is inserted right after `zh`.
//  - Conversion = OpenCC Taiwan -> Mainland with phrase conversion (`twp`, the "tw2sp" profile) via the
//    `opencc-js` devDependency. Text inside 「…」 is app-UI wording quoted from the screens and only gets the
//    character-level profile (`tw`, "tw2s"), so labels are not reworded.
//  - Protected terms are never rewritten: the store listing name 「enGo智慧管家」 and 「智慧」, which the site
//    keeps in its Simplified copy (the phrase profile would turn it into 「智能」; src/locale/zhCN.ts uses 智慧).
//  - ASCII (enGo, SmartPad, URLs, markdown link targets, {placeholders}) is untouched by OpenCC by construction.
//  - Output formatting matches the file on disk (indent 2 or 4, trailing newline kept or absent).
import { readFileSync, realpathSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Converter } from 'opencc-js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const DATA_FILES = ['cases', 'packages', 'howto', 'knowledge_base', 'faqs', 'news', 'tutorials', 'legal']
// `{ zh, en }` objects that are not translations: file hashes and per-language document URLs in legal.json.
const SKIP_PARENTS = new Set(['sha256', 'href'])

const phrase = Converter({ from: 'twp', to: 'cn' })
const chars = Converter({ from: 'tw', to: 'cn' })

// Terms that must come out exactly as listed. Private-use placeholders survive OpenCC unchanged and are
// replaced by the value after conversion (so a protected term maps to itself unless an override is given).
//  - 「enGo智慧管家」 is the real store listing name; 「智慧」 stays as the existing src/locale/zhCN.ts writes it
//    (the phrase profile would turn it into 「智能」).
//  - 離線 -> 离线 (the phrase profile gives 脱机), 存檔 -> 保存 (it gives 存盘; the screens say 「保存」),
//    執行董事 -> 执行董事 (it gives 运行董事).
const PROTECTED = [
  ['enGo智慧管家', 'enGo智慧管家'],
  ['智慧', '智慧'],
  ['離線', '离线'],
  ['存檔', '保存'],
  ['執行董事', '执行董事'] // the phrase profile gives 运行董事
]
const PUA = PROTECTED.map((_, i) => String.fromCharCode(0xe000 + i))

export function toSimplified(text) {
  let s = text
  PROTECTED.forEach(([from], i) => { s = s.split(from).join(PUA[i]) })
  // Alternate outside / inside 「…」 segments.
  s = s
    .split(/(「[^」]*」)/)
    .map((seg) => (seg.startsWith('「') && seg.endsWith('」') ? chars(seg) : phrase(seg)))
    .join('')
  PROTECTED.forEach(([, to], i) => { s = s.split(PUA[i]).join(to) })
  return s
}

const convert = (v) => (Array.isArray(v) ? v.map(toSimplified) : toSimplified(v))
const isLocalized = (v) => typeof v === 'string' || (Array.isArray(v) && v.every((x) => typeof x === 'string'))
const isEmpty = (v) => v === undefined || v === '' || (Array.isArray(v) && v.length === 0)

// A pre-existing zhCN stays where it is (key order); a missing one is inserted right after `zh`.
function fillKeepOrder(node, stats, parentKey = '') {
  if (Array.isArray(node)) return node.map((n) => fillKeepOrder(n, stats, parentKey))
  if (!node || typeof node !== 'object' || SKIP_PARENTS.has(parentKey)) return node
  const out = {}
  for (const [k, v] of Object.entries(node)) {
    if (k === 'zhCN' && !isEmpty(v)) { out[k] = v; continue }
    out[k] = fillKeepOrder(v, stats, k)
    if (k === 'zh' && isLocalized(v) && v.length !== 0 && isEmpty(node.zhCN)) {
      stats.filled += 1
      out.zhCN = convert(v)
    } else if (k === 'zh' && !isLocalized(v)) {
      stats.skipped += 1
    }
  }
  return out
}
export function run(dry = false) {
  const report = {}
  for (const name of DATA_FILES) {
    const path = resolve(root, 'src/data', `${name}.json`)
    const raw = readFileSync(path, 'utf8')
    const data = JSON.parse(raw)
    const trail = raw.endsWith('\n') ? '\n' : ''
    const body = raw.replace(/\n*$/, '')
    const indent = [2, 4].find((i) => JSON.stringify(data, null, i) === body)
    if (!indent) throw new Error(`${name}.json: formatting is not plain 2/4-space JSON; refusing to rewrite`)
    const stats = { filled: 0, skipped: 0 }
    const next = fillKeepOrder(data, stats)
    report[name] = stats
    if (!dry && stats.filled > 0) writeFileSync(path, JSON.stringify(next, null, indent) + trail)
  }
  return report
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  const dry = process.argv.includes('--dry')
  const report = run(dry)
  for (const [name, s] of Object.entries(report)) console.log(`${name}.json: ${dry ? 'would fill' : 'filled'} ${s.filled} zhCN value(s)${s.skipped ? `, skipped ${s.skipped} non-text zh` : ''}`)
}
