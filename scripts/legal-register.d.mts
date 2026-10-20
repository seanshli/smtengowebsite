export const ROOT: string
export const REGISTER_JSON: string
export const REGISTER_MD: string
export function loadRegister(root?: string): any
export function sha256(buf: Buffer | string): string
export function hashDocument(doc: any, root?: string): { zh: string; en: string }
export function today(): string
export function readStamp(html: string): { docNo: string; revision: string; issued: string; metaNo?: string; metaRev?: string; metaIssued?: string } | null
export function applyStamp(html: string, doc: any, lang: 'zh' | 'en'): string
export function verify(root?: string): string[]
export function bump(id: string, revision: string, change: string, opts?: { root?: string; date?: string }): any
export function renderRegister(reg: any): string
export function writeRegisterMd(root?: string): void
