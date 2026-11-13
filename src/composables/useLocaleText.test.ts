import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { pickText, pickField } from './useLocaleText'

describe('pickText (tx fallback order)', () => {
  const more = { ja: '日本語', fr: 'Français', es: 'Español' }
  it('keeps zh and zhCN behaviour', () => {
    expect(pickText('zh', '繁', '简', 'en', more)).toBe('繁')
    expect(pickText('zhCN', '繁', '简', 'en', more)).toBe('简')
    expect(pickText('zh', '繁', '简', 'en')).toBe('繁')
    expect(pickText('zhCN', '繁', '简', 'en')).toBe('简')
  })
  it('returns en for en and for unknown locales', () => {
    expect(pickText('en', '繁', '简', 'en', more)).toBe('en')
    expect(pickText('de', '繁', '简', 'en', more)).toBe('en')
  })
  it('returns the ja / fr / es string when it exists', () => {
    expect(pickText('ja', '繁', '简', 'en', more)).toBe('日本語')
    expect(pickText('fr', '繁', '简', 'en', more)).toBe('Français')
    expect(pickText('es', '繁', '简', 'en', more)).toBe('Español')
  })
  it('falls back to English when the ja / fr / es string is missing', () => {
    expect(pickText('ja', '繁', '简', 'en')).toBe('en')
    expect(pickText('fr', '繁', '简', 'en', { ja: 'x' })).toBe('en')
    expect(pickText('es', '繁', '简', 'en', { es: '' })).toBe('en')
  })
})

describe('pickField (lt fallback order)', () => {
  const o = { zh: 'z', zhCN: 'c', en: 'e', ja: 'j', fr: 'f', es: 's', zhBody: 'zb', zhCNBody: 'cb', enBody: 'eb', jaBody: 'jb' }
  it('keeps zh and zhCN behaviour', () => {
    expect(pickField('zh', o)).toBe('z')
    expect(pickField('zhCN', o)).toBe('c')
    expect(pickField('zhCN', { zh: 'z', en: 'e' })).toBe('z')
    expect(pickField('zh', { en: 'e' })).toBe('e')
  })
  it('uses the locale field for ja / fr / es, then en, then zh', () => {
    expect(pickField('ja', o)).toBe('j')
    expect(pickField('fr', o)).toBe('f')
    expect(pickField('es', o)).toBe('s')
    expect(pickField('fr', { zh: 'z', en: 'e' })).toBe('e')
    expect(pickField('es', { zh: 'z' })).toBe('z')
    expect(pickField('ja', { en: 'e', ja: undefined })).toBe('e')
  })
  it('honours the suffix', () => {
    expect(pickField('ja', o, 'Body')).toBe('jb')
    expect(pickField('fr', o, 'Body')).toBe('eb')
    expect(pickField('zhCN', o, 'Body')).toBe('cb')
  })
  it('works on arrays and empty input', () => {
    expect(pickField('fr', { en: ['a'], fr: ['b'] })).toEqual(['b'])
    expect(pickField('fr', undefined)).toBe('')
    expect(pickField('en', {})).toBe('')
  })
})

// ---- source scan: every `tx(` call in src/ must carry ja, fr and es ---------------------------------
const root = resolve(__dirname, '../..')
const walk = (dir: string): string[] =>
  readdirSync(resolve(root, dir)).flatMap((n) => {
    const rel = join(dir, n)
    return statSync(resolve(root, rel)).isDirectory() ? walk(rel) : [rel]
  })

/** Index of the matching close bracket for the bracket at `open`, skipping string literals. */
function closeOf(src: string, open: number): number {
  let depth = 0
  for (let i = open; i < src.length; i++) {
    const c = src[i]
    if (c === "'" || c === '"' || c === '`') {
      i++
      while (i < src.length && src[i] !== c) {
        if (src[i] === '\\') i++
        i++
      }
      continue
    }
    if (c === '(' || c === '[' || c === '{') depth++
    else if (c === ')' || c === ']' || c === '}') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}

/** Split a call's argument source at top-level commas. */
function splitArgs(inner: string): string[] {
  const args: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i]
    if (c === "'" || c === '"' || c === '`') {
      i++
      while (i < inner.length && inner[i] !== c) {
        if (inner[i] === '\\') i++
        i++
      }
      continue
    }
    if (c === '(' || c === '[' || c === '{') depth++
    else if (c === ')' || c === ']' || c === '}') depth--
    else if (c === ',' && depth === 0) {
      args.push(inner.slice(start, i))
      start = i + 1
    }
  }
  args.push(inner.slice(start))
  return args.map((a) => a.trim()).filter((a, i, all) => a !== '' || i < all.length - 1)
}

const SKIP = (f: string) => /\.test\.ts$/.test(f) || f.endsWith('composables/useLocaleText.ts')
const sources = walk('src').filter((f) => /\.(vue|ts)$/.test(f) && !SKIP(f))

/** Every tx( call in a source file, as { line, args }. Template and script are both scanned. */
function txCalls(src: string) {
  const out: { line: number; args: string[] }[] = []
  const re = /(?<![\w.$])tx\(/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    const open = m.index + m[0].length - 1
    const close = closeOf(src, open)
    expect(close, `unbalanced tx( at index ${m.index}`).toBeGreaterThan(open)
    out.push({ line: src.slice(0, m.index).split('\n').length, args: splitArgs(src.slice(open + 1, close)) })
  }
  return out
}

describe('inline copy covers ja / fr / es', () => {
  it('the scanner sees multi-line calls and quoted commas', () => {
    const calls = txCalls("x(tx('a, b', 'c', 'd (e)',\n  { ja: 'j', fr: 'f', es: 's' }))")
    expect(calls).toHaveLength(1)
    expect(calls[0].args).toHaveLength(4)
  })

  it('every tx( call in src/ passes ja, fr and es', () => {
    const bad: string[] = []
    let total = 0
    for (const f of sources) {
      for (const c of txCalls(readFileSync(resolve(root, f), 'utf-8'))) {
        total++
        const more = c.args[3] ?? ''
        const missing = (['ja', 'fr', 'es'] as const).filter(
          (l) => !new RegExp(`\\b${l}\\s*:\\s*(['"\`])(?:\\\\.|(?!\\1).)+\\1`).test(more)
        )
        if (c.args.length !== 4 || missing.length) bad.push(`${f}:${c.line} missing ${missing.join('/') || 'fourth argument'}`)
      }
    }
    expect(total).toBeGreaterThan(50)
    expect(bad).toEqual([])
  })

  it('inline { zh, zhCN, en } objects in .vue files carry ja / fr / es too', () => {
    // Count the key families once the tx( calls (which also contain ja:/fr:/es:) are cut out.
    const bad: string[] = []
    for (const f of sources.filter((p) => p.endsWith('.vue'))) {
      let src = readFileSync(resolve(root, f), 'utf-8')
      if (!/useLocaleText/.test(src)) continue
      const cuts = txCalls(src).length
      // remove tx( calls from the end
      const re = /(?<![\w.$])tx\(/g
      const spans: [number, number][] = []
      let m: RegExpExecArray | null
      while ((m = re.exec(src))) {
        const open = m.index + m[0].length - 1
        spans.push([m.index, closeOf(src, open) + 1])
      }
      for (const [a, b] of spans.reverse()) src = src.slice(0, a) + src.slice(b)
      expect(spans.length).toBe(cuts)
      const count = (re: RegExp) => (src.match(re) ?? []).length
      const zhCN = count(/\bzhCN(?:Body|Role)?\??\s*:/g)
      for (const l of ['ja', 'fr', 'es']) {
        const n = count(new RegExp(`\\b${l}(?:Body|Role)?\\??\\s*:`, 'g'))
        if (n !== zhCN) bad.push(`${f}: ${zhCN} zhCN fields but ${n} ${l} fields`)
      }
    }
    expect(bad).toEqual([])
  })
})
