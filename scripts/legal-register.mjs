// Legal document register — revision control for the controlled documents listed in
// src/data/legal.json (ISO 27001 7.5 documented information).
//
//   node scripts/legal-register.mjs check                      verify stamps, hashes, history, register.md
//   node scripts/legal-register.mjs bump <id> <A.n> "<change>" new revision: restamp HTML, hash, append history
//   node scripts/legal-register.mjs register                   rewrite docs/LEGAL_DOCUMENT_REGISTER.md
//
// The test suite runs `check`, so a change to public/<doc>.html without a bump fails CI.
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
export const ROOT = resolve(HERE, '..')
export const REGISTER_JSON = 'src/data/legal.json'
export const REGISTER_MD = 'docs/LEGAL_DOCUMENT_REGISTER.md'
const LANGS = ['zh', 'en']
const DOC_NO_RE = /^ENGO-LG-\d{3}$/
const REV_RE = /^[A-Z]\.\d+$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export const loadRegister = (root = ROOT) => JSON.parse(readFileSync(join(root, REGISTER_JSON), 'utf8'))
const saveRegister = (reg, root = ROOT) => writeFileSync(join(root, REGISTER_JSON), JSON.stringify(reg, null, 2) + '\n')
const docPath = (root, doc, lang) => join(root, 'public', doc.href[lang].replace(/^\//, ''))
export const sha256 = (buf) => createHash('sha256').update(buf).digest('hex')
export const hashDocument = (doc, root = ROOT) =>
  Object.fromEntries(LANGS.map((l) => [l, sha256(readFileSync(docPath(root, doc, l)))]))

const addMonths = (iso, months) => {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCMonth(d.getUTCMonth() + months)
  return d.toISOString().slice(0, 10)
}
export const today = () => new Date().toISOString().slice(0, 10)

// ── Stamps inside the published HTML ────────────────────────────────────────
const stampText = (doc, lang) =>
  lang === 'zh'
    ? `文件編號 ${doc.docNo}｜版次 ${doc.revision}｜發行日期 ${doc.issued}`
    : `Document No. ${doc.docNo} | Rev. ${doc.revision} | Issued ${doc.issued}`
const stampP = (doc, lang) =>
  `<p class="doc-control" data-doc-no="${doc.docNo}" data-doc-rev="${doc.revision}" data-doc-issued="${doc.issued}">${stampText(doc, lang)}</p>`
const metaBlock = (doc) =>
  `<meta name="engo-doc-no" content="${doc.docNo}">\n<meta name="engo-doc-rev" content="${doc.revision}">\n<meta name="engo-doc-issued" content="${doc.issued}">`
const STAMP_CSS = `  .doc-control {\n    color: var(--muted);\n    font-size: 0.85rem;\n    letter-spacing: 0.01em;\n    margin: 0 0 1.5rem;\n  }\n`

export const readStamp = (html) => {
  const m = html.match(/<p class="doc-control" data-doc-no="([^"]+)" data-doc-rev="([^"]+)" data-doc-issued="([^"]+)">/)
  const meta = (name) => html.match(new RegExp(`<meta name="engo-doc-${name}" content="([^"]+)">`))?.[1]
  return m ? { docNo: m[1], revision: m[2], issued: m[3], metaNo: meta('no'), metaRev: meta('rev'), metaIssued: meta('issued') } : null
}

export const applyStamp = (html, doc, lang) => {
  let out = html
  if (/<meta name="engo-doc-no"/.test(out)) {
    out = out.replace(/<meta name="engo-doc-no"[^\n]*\n<meta name="engo-doc-rev"[^\n]*\n<meta name="engo-doc-issued"[^\n]*/, metaBlock(doc))
  } else {
    out = out.replace(/(<meta name="viewport"[^>]*>)/, `$1\n${metaBlock(doc)}`)
  }
  if (/<p class="doc-control"/.test(out)) {
    out = out.replace(/<p class="doc-control"[^>]*>[^<]*<\/p>/, stampP(doc, lang))
  } else {
    out = out.replace(/(\n(\s*)<p class="effective">[\s\S]*?<\/p>\n)/, (m, line, indent) => `${line}${indent}${stampP(doc, lang)}\n`)
  }
  if (!/\.doc-control \{/.test(out)) out = out.replace(/\n<\/style>/, `\n${STAMP_CSS}</style>`)
  return out
}

// ── Verification (the test calls this) ──────────────────────────────────────
export const verify = (root = ROOT) => {
  const reg = loadRegister(root)
  const problems = []
  const seen = new Set()
  for (const doc of reg.documents) {
    const at = `${doc.id}`
    if (!DOC_NO_RE.test(doc.docNo || '')) problems.push(`${at}: docNo must match ENGO-LG-NNN`)
    if (seen.has(doc.docNo)) problems.push(`${at}: duplicate docNo ${doc.docNo}`)
    seen.add(doc.docNo)
    if (!REV_RE.test(doc.revision || '')) problems.push(`${at}: revision must match A.n`)
    if (!DATE_RE.test(doc.issued || '')) problems.push(`${at}: issued must be YYYY-MM-DD`)
    if (doc.nextReview !== addMonths(doc.issued, reg.register.reviewCycleMonths)) problems.push(`${at}: nextReview must be issued + ${reg.register.reviewCycleMonths} months`)
    const last = doc.history?.[doc.history.length - 1]
    if (!last) { problems.push(`${at}: history is empty (run legal:bump)`); continue }
    if (last.revision !== doc.revision) problems.push(`${at}: latest history entry is ${last.revision}, document says ${doc.revision}`)
    if (last.date !== doc.issued) problems.push(`${at}: latest history date ${last.date} != issued ${doc.issued}`)
    if (!last.change) problems.push(`${at}: latest history entry has no change description`)
    const revs = doc.history.map((h) => h.revision)
    if (new Set(revs).size !== revs.length) problems.push(`${at}: duplicate revision in history`)
    for (const lang of LANGS) {
      const file = docPath(root, doc, lang)
      if (!existsSync(file)) { problems.push(`${at}/${lang}: ${doc.href[lang]} missing`); continue }
      const html = readFileSync(file)
      const hash = sha256(html)
      if (last.sha256?.[lang] !== hash) problems.push(`${at}/${lang}: ${doc.href[lang]} changed since ${doc.revision} (bump the revision)`)
      const s = readStamp(html.toString('utf8'))
      if (!s) { problems.push(`${at}/${lang}: no doc-control stamp`); continue }
      for (const [k, v] of [['docNo', doc.docNo], ['revision', doc.revision], ['issued', doc.issued]]) {
        if (s[k] !== v) problems.push(`${at}/${lang}: stamp ${k} is ${s[k]}, register says ${v}`)
      }
      if (s.metaNo !== doc.docNo || s.metaRev !== doc.revision || s.metaIssued !== doc.issued) problems.push(`${at}/${lang}: meta tags out of sync with stamp`)
    }
  }
  const mdPath = join(root, REGISTER_MD)
  if (!existsSync(mdPath)) problems.push(`${REGISTER_MD} missing (run legal:register)`)
  else if (readFileSync(mdPath, 'utf8') !== renderRegister(reg)) problems.push(`${REGISTER_MD} is stale (run legal:register)`)
  return problems
}

// ── Bump ────────────────────────────────────────────────────────────────────
export const bump = (id, revision, change, { root = ROOT, date = today() } = {}) => {
  const reg = loadRegister(root)
  const doc = reg.documents.find((d) => d.id === id)
  if (!doc) throw new Error(`unknown document id "${id}" (${reg.documents.map((d) => d.id).join(', ')})`)
  if (!REV_RE.test(revision)) throw new Error('revision must look like A.2')
  if (!change || !change.trim()) throw new Error('a change description is required')
  if (doc.history.some((h) => h.revision === revision)) throw new Error(`${doc.docNo} already has revision ${revision}`)
  if (doc.history.length && revision === doc.revision) throw new Error(`${doc.docNo} is already at ${revision}; pick the next revision`)
  doc.revision = revision
  doc.issued = date
  doc.nextReview = addMonths(date, reg.register.reviewCycleMonths)
  for (const lang of LANGS) {
    const file = docPath(root, doc, lang)
    writeFileSync(file, applyStamp(readFileSync(file, 'utf8'), doc, lang))
  }
  doc.history.push({ revision, date, change: change.trim(), sha256: hashDocument(doc, root) })
  saveRegister(reg, root)
  writeRegisterMd(root)
  return doc
}

// ── Human-readable register ─────────────────────────────────────────────────
export const renderRegister = (reg) => {
  const lines = []
  lines.push('# 法務文件登錄表 Legal Document Register', '')
  lines.push('<!-- generated by scripts/legal-register.mjs — do not edit by hand; run `npm run legal:register` -->', '')
  lines.push(`文件編號規則：\`${reg.register.scheme}\`。版次規則：${reg.register.revisionRule}`)
  lines.push(`審查週期：${reg.register.reviewCycleMonths} 個月。以繁體中文版為準（\`governingLanguage: ${reg.register.governingLanguage}\`）。`)
  lines.push(`歷史版次封存：${reg.register.archive}`, '')
  lines.push('| 文件編號 | 文件名稱 | 版次 | 發行日期 | 生效日 | 下次審查 | 文件所有人 | 核准（日期） | 機密等級 | 適用對象 | 繁中 | 英文 |')
  lines.push('|---|---|---|---|---|---|---|---|---|---|---|---|')
  const aud = Object.fromEntries(reg.audiences.map((a) => [a.id, a.label.zh]))
  for (const d of reg.documents) {
    lines.push(`| ${d.docNo} | ${d.title.zh}（${d.title.en}） | ${d.revision} | ${d.issued} | ${d.effective} | ${d.nextReview} | ${d.owner ?? '[待確認]'} | ${d.approvedBy ? `${d.approvedBy}（${d.approvedOn ?? '[待確認]'}）` : '[待確認]'} | ${d.classification} | ${d.audiences.map((a) => aud[a]).join('、')} | \`${d.href.zh}\` | \`${d.href.en}\` |`)
  }
  lines.push('', '## 版次歷史 Revision history', '')
  for (const d of reg.documents) {
    lines.push(`### ${d.docNo} ${d.title.zh}`, '')
    lines.push('| 版次 | 日期 | 變更 | SHA-256（繁中） | SHA-256（英文） |', '|---|---|---|---|---|')
    for (const h of d.history) lines.push(`| ${h.revision} | ${h.date} | ${h.change} | \`${h.sha256.zh}\` | \`${h.sha256.en}\` |`)
    lines.push('')
  }
  lines.push('## 變更程序 Change procedure', '')
  lines.push('1. 修改 `public/<文件>.html`（繁中與英文一起改；以繁中為準）。')
  lines.push('2. 執行 `npm run legal:bump -- <id> <新版次> "<變更說明>"`：重寫文件內的文件控制章、重算 SHA-256、追加版次歷史、重產本表。')
  lines.push('3. 在 `src/data/legal.json` 填入 `owner` 與 `approvedBy`（核准人），一併提交 PR 審核後合併；合併即發行。')
  lines.push('4. 將發行版複製到歷史版次封存資料夾 `<文件編號>_<版次>/`。')
  lines.push('5. 未執行步驟 2 而改動文件內容時，`npm run test:unit` 會失敗（`legalRegister.test.ts`）。', '')
  lines.push('每筆審閱確認（`legal_acknowledgements.versions`）由伺服器記錄當時生效的文件編號、版次與 SHA-256，不信任瀏覽器送來的版本。', '')
  return lines.join('\n')
}
export const writeRegisterMd = (root = ROOT) => {
  mkdirSync(join(root, 'docs'), { recursive: true })
  writeFileSync(join(root, REGISTER_MD), renderRegister(loadRegister(root)))
}

// ── CLI ─────────────────────────────────────────────────────────────────────
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, ...args] = process.argv.slice(2)
  if (cmd === 'check') {
    const problems = verify()
    if (problems.length) { console.error(problems.map((p) => ' - ' + p).join('\n')); process.exit(1) }
    console.log('legal register OK')
  } else if (cmd === 'bump') {
    const [id, rev, ...rest] = args
    const doc = bump(id, rev, rest.join(' '))
    console.log(`${doc.docNo} → ${doc.revision} (${doc.issued})`)
  } else if (cmd === 'register') {
    writeRegisterMd()
    console.log(`wrote ${REGISTER_MD}`)
  } else {
    console.error('usage: legal-register.mjs check | bump <id> <A.n> "<change>" | register')
    process.exit(2)
  }
}
