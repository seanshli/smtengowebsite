import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { zhLocale as zh } from './zh'
import { zhCNLocale as zhCN } from './zhCN'
import { enLocale as en } from './en'
import { frLocale as fr } from './fr'
import { jaLocale as ja } from './ja'
import { esLocale as es } from './es'
import { traditionalIn } from './scriptPurity'

// /en is an indexed locale (hreflang, sitemap). A key that exists only in zh falls
// back to Chinese on the English page silently, which is how the whole water
// section of /en/product shipped in Chinese until 2026-09-22.
const leaves = (o: any, p = ''): string[] =>
    Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' && v !== null ? leaves(v, p ? `${p}.${k}` : k) : [p ? `${p}.${k}` : k]))
const get = (o: any, path: string): any => path.split('.').reduce((a, c) => a?.[c], o)

describe('English locale covers every customer-facing zh key', () => {
    const enKeys = new Set(leaves(en))
    const customerFacing = leaves(zh).filter((k) => !k.startsWith('admin.'))
    it('product.* has no zh-only keys', () => {
        const missing = customerFacing.filter((k) => k.startsWith('product.') && !enKeys.has(k))
        expect(missing, missing.join(', ')).toEqual([])
    })
    it('lists the remaining zh-only keys so the gap cannot grow unnoticed', () => {
        const missing = customerFacing.filter((k) => !enKeys.has(k))
        // Known leftovers: paragraph1 (en uses paragraphEn), paragraph2-4 and threeCoreValue1-3 (unused on en pages). Anything new fails here.
        expect(missing.sort()).toEqual(['paragraph1', 'paragraph2', 'paragraph3', 'paragraph4', 'threeCoreValue1', 'threeCoreValue2', 'threeCoreValue3'])
    })
})

describe('Simplified Chinese locale covers every customer-facing zh key', () => {
    it('zhCN has every non-admin zh key', () => {
        const zhCNKeys = new Set(leaves(zhCN))
        const missing = leaves(zh).filter((k) => !k.startsWith('admin.') && !zhCNKeys.has(k))
        expect(missing, missing.join(', ')).toEqual([])
    })
})

describe('Japanese, French and Spanish locales cover every customer-facing zh key', () => {
    // paragraph1-4 and threeCoreValue1-3 are zh-only legacy keys, the same list en leaves out.
    const ZH_ONLY = new Set(['paragraph1', 'paragraph2', 'paragraph3', 'paragraph4', 'threeCoreValue1', 'threeCoreValue2', 'threeCoreValue3'])
    it.each([['ja', ja], ['fr', fr], ['es', es]] as const)('%s has every non-admin zh key', (_n, loc) => {
        const keys = new Set(leaves(loc))
        const missing = leaves(zh).filter((k) => !k.startsWith('admin.') && !ZH_ONLY.has(k) && !keys.has(k))
        expect(missing, missing.join(', ')).toEqual([])
    })
    it.each([['ja', ja], ['fr', fr], ['es', es]] as const)('%s has no English placeholder in the vision block', (_n, loc) => {
        const sun = get(loc, 'vision.sun.title')
        expect(sun).not.toBe(get(en, 'vision.sun.title'))
    })
})

describe('no locale renders a raw key', () => {
    it.each([
        ['zh', zh], ['zhCN', zhCN], ['en', en], ['fr', fr], ['ja', ja], ['es', es]
    ] as const)('%s defines chatbot.online and login', (_n, loc) => {
        expect(typeof get(loc, 'chatbot.online')).toBe('string')
        expect(get(loc, 'chatbot.online')).not.toBe('')
        expect(typeof get(loc, 'login')).toBe('string')
        expect(get(loc, 'login')).not.toBe('')
    })
})

// ---- data files -------------------------------------------------------------------------------------
const root = resolve(__dirname, '../..')
const readJson = (f: string) => JSON.parse(readFileSync(resolve(root, 'src/data', `${f}.json`), 'utf-8'))
const DATA = ['cases', 'packages', 'howto', 'knowledge_base', 'faqs', 'news', 'tutorials', 'legal']
// `{ zh, en }` objects in legal.json that are file hashes / per-language document URLs, not translations.
const NOT_TRANSLATIONS = new Set(['sha256', 'href'])

type Hit = { path: string; node: any }
const localized = (data: any): Hit[] => {
    const out: Hit[] = []
    const walk = (o: any, path: string, parent: string): void => {
        if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${path}[${i}]`, parent))
        if (!o || typeof o !== 'object') return
        if (!NOT_TRANSLATIONS.has(parent) && (typeof o.zh === 'string' || Array.isArray(o.zh)) && o.zh.length > 0) out.push({ path, node: o })
        for (const [k, v] of Object.entries(o)) walk(v, `${path}.${k}`, k)
    }
    walk(data, '', '')
    return out
}
const filled = (v: any) => (Array.isArray(v) ? v.length > 0 && v.every((x) => typeof x === 'string') : typeof v === 'string' && v.trim() !== '')

describe('data files carry zh, zhCN and en for every localized value', () => {
    it.each(DATA)('%s.json', (name) => {
        const hits = localized(readJson(name))
        expect(hits.length).toBeGreaterThan(0)
        const bad = hits.filter((h) => !filled(h.node.zhCN) || !filled(h.node.en)).map((h) => h.path)
        expect(bad, bad.slice(0, 10).join('\n')).toEqual([])
    })
})

describe('data files carry ja, fr and es for every localized value', () => {
    it.each(DATA)('%s.json', (name) => {
        const hits = localized(readJson(name))
        const bad = hits.flatMap((h) => ['ja', 'fr', 'es'].filter((l) => !filled(h.node[l])).map((l) => `${l} ${h.path}`))
        expect(bad, bad.slice(0, 10).join('\n')).toEqual([])
    })
})

// A key that is present but still holds the English text passes the presence test above, so compare values too.
describe('ja / fr / es data strings are translated, not copies of the English value', () => {
    const FILES = ['cases', 'howto', 'knowledge_base', 'faqs', 'news']
    // Proper nouns (project, partner and product names) that are written the same way in every language.
    const SAME_AS_EN = new Set([
        'Aiox AI Smart Water Purifier', 'Taipei Nangang Tain', 'Taichung (Huayu Daju)', 'Hong Sheng Xin', 'Chang Yi Nan Qing Shan',
        'Lihpao Life Science', 'Taya Kitchen', 'He-Ye Wood', 'Taichung Cathay+', 'enGo AI Smart Hub', 'enGo Control Tablet'
    ])
    const englishWords = (s: string) => s.split(/\s+/).filter((w) => /[a-z]{2}/.test(w)).length
    it.each(FILES)('%s.json', (name) => {
        const bad: string[] = []
        for (const h of localized(readJson(name))) {
            const en: string[] = ([] as string[]).concat(h.node.en ?? [])
            for (const l of ['ja', 'fr', 'es']) {
                const val: string[] = ([] as string[]).concat(h.node[l] ?? [])
                en.forEach((e, i) => {
                    if (typeof e === 'string' && val[i] === e && englishWords(e) >= 3 && !SAME_AS_EN.has(e)) bad.push(`${l} ${h.path} ${e.slice(0, 40)}`)
                })
            }
        }
        expect(bad.slice(0, 10).join('\n')).toBe('')
    })
})

// ---- script purity ------------------------------------------------------------------------------------
// Characters that exist only in Traditional Chinese: see ./scriptPurity.
const stringsOf = (o: any): string[] => {
    if (typeof o === 'string') return [o]
    if (Array.isArray(o)) return o.flatMap((x) => stringsOf(x))
    if (o && typeof o === 'object') return Object.entries(o).filter(([k]) => k !== 'keywords').flatMap(([, v]) => stringsOf(v))
    return []
}

describe('Simplified Chinese copy contains no Traditional-only characters', () => {
    it('src/locale/zhCN.ts', () => {
        const bad = stringsOf(zhCN).map((s) => ({ s, c: traditionalIn(s) })).filter((x) => x.c.length)
        expect(bad.map((x) => `${x.c.join('')}: ${x.s.slice(0, 50)}`)).toEqual([])
    })
    it.each(DATA)('%s.json zhCN values', (name) => {
        const bad = localized(readJson(name))
            .flatMap((h) => stringsOf(h.node.zhCN).map((s) => ({ path: h.path, s, c: traditionalIn(s) })))
            .filter((x) => x.c.length)
        expect(bad.slice(0, 8).map((x) => `${x.path} ${x.c.join('')}: ${x.s.slice(0, 40)}`)).toEqual([])
    })
    it('inline zhCN strings in templates (tx() second argument, zhCN: fields)', () => {
        const walk = (d: string): string[] => readdirSync(resolve(root, d)).flatMap((n) => {
            const rel = join(d, n)
            return statSync(resolve(root, rel)).isDirectory() ? walk(rel) : [rel]
        })
        const files = [...walk('src/views'), ...walk('src/components'), ...walk('src/layout')].filter((f) => f.endsWith('.vue'))
        const bad: string[] = []
        for (const f of files) {
            const src = readFileSync(resolve(root, f), 'utf-8')
            const found = [
                ...[...src.matchAll(/\btx\(\s*'(?:[^'\\]|\\.)*'\s*,\s*'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1]),
                ...[...src.matchAll(/\bzhCN\w*:\s*'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1]),
                ...[...src.matchAll(/\bzhCN\w*:\s*\[((?:\s*'(?:[^'\\]|\\.)*'\s*,?)+)\]/g)].map((m) => m[1])
            ]
            for (const s of found) {
                const c = traditionalIn(s)
                if (c.length) bad.push(`${f}: ${c.join('')} in ${s.slice(0, 40)}`)
            }
        }
        expect(bad).toEqual([])
    })
})

// ---- English must be English --------------------------------------------------------------------------
const CJK = /[㐀-鿿　-〿]/   // ideographs + CJK punctuation; fullwidth forms such as ｜ are not Chinese text
// Allow-list (each entry is a real name, quoted on purpose):
//  - 「enGo智慧管家」 / 「enGo 智慧管家」: the live App Store / Google Play listing name and the YouTube channel name.
//  - 「enGo AI智慧中控系統」: the Chinese product name, given as a gloss for "enGo HMS".
const ENGLISH_NAMES = ['enGo智慧管家', 'enGo 智慧管家', 'enGo AI智慧中控系統']
// App and Shop screens are Chinese, so the how-to/FAQ/KB English quotes the on-screen label verbatim
// next to its English gloss, e.g. 「Inventory (庫存)」. Only these exact labels are tolerated, and only in
// howto.json / faqs.json / knowledge_base.json; any other CJK in an English value fails.
const SCREEN_LABELS = [
    '加盟主資料與銀行帳戶', '退款處理中，款項將退回原付款方式', '不追蹤庫存（接單生產）', '另有 N 件保留給未付款訂單', '缺貨／待補貨', '全部標為已讀',
    '已登記到貨通知', '查看分機資訊', '價格與庫存', '庫存數量', '庫存不足', '加盟店財務', '結算撥款', '設定庫存', '到貨通知我', '加入購物車', '前往付款',
    '電鈴通知', '電鈴紀錄', '操作紀錄', '查看攝影機', '繼續付款', '申請退貨', '申請退款', '取消訂單', '送出申請', '已送達大廳', '帳號註銷', '銀行驗證',
    '接單生產', '我的訂單', '全部', '已下單', '已付款', '備貨中', '配送中', '已送達', '購物車', '結帳', '倉儲', '庫存', '場景', '家庭', '工單', '預約', '訊息',
    '設置', '登出', '公告', '告警', '通知', '更多', '訂單', '配送', '訂閱', '提醒', '我的'
]
const UI_LABEL_FILES = new Set(['howto', 'faqs', 'knowledge_base'])
const enValues = (data: any): string[] => localized(data).flatMap((h) => [].concat(h.node.en ?? []) as string[]).filter((x) => typeof x === 'string')

describe('English copy contains no Chinese', () => {
    it('src/locale/en.ts values', () => {
        const bad = stringsOf(en).map((s) => ENGLISH_NAMES.reduce((a, w) => a.split(w).join(''), s)).filter((s) => CJK.test(s))
        expect(bad).toEqual([])
    })
    it.each(DATA)('%s.json en values', (name) => {
        const allowed = [...ENGLISH_NAMES, ...(UI_LABEL_FILES.has(name) ? SCREEN_LABELS : [])].sort((a, b) => b.length - a.length)
        const bad = enValues(readJson(name))
            .map((s) => allowed.reduce((a, w) => a.split(w).join(''), s))
            .filter((s) => CJK.test(s))
        expect(bad.map((s) => s.slice(0, 80))).toEqual([])
    })
})

describe('knowledge-base video titles are shown in the visitor\'s language', () => {
    const videos = readJson('knowledge_base').youtube as { title: string; titles: { zhCN: string; en: string } }[]
    it('every video has a Simplified and an English display title without Traditional-only or Chinese characters', () => {
        expect(videos.length).toBeGreaterThan(0)
        for (const v of videos) {
            expect(v.titles.zhCN, v.title).toBeTruthy()
            expect(traditionalIn(v.titles.zhCN), v.title).toEqual([])
            expect(v.titles.en, v.title).toBeTruthy()
            expect(ENGLISH_NAMES.reduce((a, w) => a.split(w).join(''), v.titles.en), v.title).not.toMatch(CJK)
        }
    })
})
