import { describe, it, expect } from 'vitest'
import { zhLocale as zh } from './zh'
import { enLocale as en } from './en'

// /en is an indexed locale (hreflang, sitemap). A key that exists only in zh falls
// back to Chinese on the English page silently, which is how the whole water
// section of /en/product shipped in Chinese until 2026-09-22.
const leaves = (o: any, p = ''): string[] =>
    Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' && v !== null ? leaves(v, p ? `${p}.${k}` : k) : [p ? `${p}.${k}` : k]))

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
