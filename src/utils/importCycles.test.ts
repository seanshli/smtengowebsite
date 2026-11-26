import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

// main.ts is the app entry point. Anything it imports (router, App, layout, utils)
// importing it back forms a cycle (graph audit 2026-11-26 found main → router →
// seo → main and main → App → header → main). Shared i18n lives in src/i18n.ts.
describe('no module imports the app entry point', () => {
    const src = resolve(__dirname, '..')
    const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
        d.isDirectory() ? walk(resolve(dir, d.name)) : /\.(vue|ts)$/.test(d.name) && !d.name.endsWith('.test.ts') ? [resolve(dir, d.name)] : [])
    const importsMain = /from\s+['"](@\/main|(\.\.?\/)+main)(\.ts)?['"]/
    it('src/** never imports main.ts', () => {
        for (const f of walk(src)) expect(readFileSync(f, 'utf-8'), f).not.toMatch(importsMain)
    })
})
