<template>
  <main class="lg">
    <!-- ─── Head (white) ─────────────────────────────────────────── -->
    <section class="lg-tile lg-tile-white">
      <div class="lg-wrap lg-center">
        <h1 class="lg-title">{{ T.title }}</h1>
        <p class="lg-lead">{{ T.lead }}</p>
        <p class="lg-fine">{{ T.updatedNote }}</p>
      </div>
    </section>

    <!-- ─── By audience (parchment) ──────────────────────────────── -->
    <section id="audiences" class="lg-tile lg-tile-parchment">
      <div class="lg-wrap">
        <header class="lg-head lg-center">
          <h2 class="lg-h2">{{ T.byAudience }}</h2>
          <p class="lg-sub">{{ T.byAudienceSub }}</p>
        </header>
        <div class="lg-grid">
          <article v-for="a in audiences" :key="a.id" :id="'audience-' + a.id" class="lg-card">
            <h3 class="lg-h3">{{ pick(a.label) }}</h3>
            <p class="lg-body">{{ pick(a.who) }}</p>
            <ul class="lg-list">
              <li v-for="d in docsFor(a)" :key="d.id">
                <a :href="pick(d.href)" class="lg-link" :data-track="'legal:' + a.id + ':' + d.id">{{ pick(d.title) }}<span class="lg-chev" aria-hidden="true">›</span></a>
                <span class="lg-meta">{{ d.docNo }} · {{ T.rev }} {{ d.revision }} · {{ d.issued }}</span>
              </li>
            </ul>
            <button type="button" class="lg-pill lg-pill-ghost" @click="startAck(a.id)">{{ T.ackFor }}</button>
          </article>
        </div>
      </div>
    </section>

    <!-- ─── All documents (white) ────────────────────────────────── -->
    <section id="documents" class="lg-tile lg-tile-white">
      <div class="lg-wrap">
        <header class="lg-head lg-center">
          <h2 class="lg-h2">{{ T.allDocs }}</h2>
          <p class="lg-sub">{{ T.allDocsSub }}</p>
        </header>
        <div class="lg-docs">
          <article v-for="d in documents" :key="d.id" :id="'doc-' + d.id" class="lg-doc">
            <div class="lg-doc-main">
              <h3 class="lg-h3">{{ pick(d.title) }}</h3>
              <p class="lg-body">{{ pick(d.summary) }}</p>
              <p class="lg-meta">{{ d.docNo }} · {{ T.rev }} {{ d.revision }} · {{ T.issued }} {{ d.issued }} · {{ T.appliesTo }} {{ d.audiences.map(audienceLabel).join('、') }}</p>
            </div>
            <div class="lg-doc-actions">
              <a :href="d.href.zh" class="lg-pill lg-pill-primary" :data-track="'legal:open:' + d.id + ':zh'">繁體中文</a>
              <a :href="d.href.en" class="lg-pill lg-pill-ghost" :data-track="'legal:open:' + d.id + ':en'">English</a>
            </div>
          </article>
        </div>
        <p class="lg-fine lg-center">{{ T.languageNote }}</p>
      </div>
    </section>

    <!-- ─── Review & acknowledge (dark) ──────────────────────────── -->
    <section id="acknowledge" class="lg-tile lg-tile-dark">
      <div class="lg-wrap lg-form-wrap">
        <header class="lg-head lg-center">
          <h2 class="lg-h2">{{ T.ackTitle }}</h2>
          <p class="lg-sub">{{ T.ackSub }}</p>
        </header>

        <form v-if="!done" class="lg-form" @submit.prevent="submit" novalidate>
          <div class="lg-field">
            <label for="la-audience">{{ T.fAudience }} <span class="lg-req">({{ T.required }})</span></label>
            <select id="la-audience" v-model="form.audience" required>
              <option v-for="a in audiences" :key="a.id" :value="a.id">{{ pick(a.label) }}</option>
            </select>
          </div>
          <div class="lg-row">
            <div class="lg-field">
              <label for="la-name">{{ T.fName }} <span class="lg-req">({{ T.required }})</span></label>
              <input id="la-name" v-model.trim="form.name" type="text" maxlength="100" required autocomplete="name" />
            </div>
            <div class="lg-field">
              <label for="la-org">{{ T.fOrg }} <span v-if="orgRequired" class="lg-req">({{ T.required }})</span></label>
              <input id="la-org" v-model.trim="form.organization" type="text" maxlength="200" :required="orgRequired" autocomplete="organization" />
            </div>
          </div>
          <div class="lg-row">
            <div class="lg-field">
              <label for="la-email">{{ T.fEmail }} <span class="lg-req">({{ T.required }})</span></label>
              <input id="la-email" v-model.trim="form.email" type="email" maxlength="254" required autocomplete="email" />
            </div>
            <div class="lg-field">
              <label for="la-phone">{{ T.fPhone }}</label>
              <input id="la-phone" v-model.trim="form.phone" type="tel" maxlength="40" autocomplete="tel" />
            </div>
          </div>
          <fieldset class="lg-field lg-fieldset">
            <legend>{{ T.fDocs }} <span class="lg-req">({{ T.required }})</span></legend>
            <label v-for="d in docsForId(form.audience)" :key="d.id" class="lg-check">
              <input type="checkbox" :value="d.id" v-model="form.documents" />
              <span>{{ pick(d.title) }} <em>{{ d.docNo }} {{ d.revision }}</em></span>
            </label>
          </fieldset>
          <div class="lg-field">
            <label for="la-note">{{ T.fNote }}</label>
            <textarea id="la-note" v-model.trim="form.note" rows="3" maxlength="2000"></textarea>
          </div>
          <label class="lg-check lg-accept">
            <input type="checkbox" v-model="form.accepted" required />
            <span>{{ T.fAccept }}</span>
          </label>
          <p v-if="error" class="lg-error" role="alert">{{ error }}</p>
          <div class="lg-actions">
            <button type="submit" class="lg-pill lg-pill-primary" :disabled="submitting">{{ submitting ? T.sending : T.submit }}</button>
            <a href="https://lin.ee/THIUSjW" target="_blank" rel="noopener" class="lg-link lg-link-on-dark" data-track="legal:line">{{ T.askLine }}<span class="lg-chev" aria-hidden="true">›</span></a>
          </div>
          <p class="lg-fine lg-fine-on-dark">{{ T.ackFine }}</p>
        </form>

        <div v-else class="lg-done lg-center">
          <p class="lg-h3">{{ T.doneTitle }}</p>
          <p class="lg-body">{{ T.doneBody }} <code>{{ doneId }}</code></p>
          <button type="button" class="lg-pill lg-pill-ghost lg-pill-ghost-dark" @click="reset">{{ T.another }}</button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import legal from '@/data/legal.json'
import { useAnalytics } from '@/utils/analytics'

type Localized = Record<string, string>
type Doc = { id: string; docNo: string; revision: string; issued: string; title: Localized; summary: Localized; href: Localized; audiences: string[] }
type Audience = { id: string; label: Localized; who: Localized; documents: string[] }

const { locale } = useI18n()
const { trackEvent } = useAnalytics()
const documents = legal.documents as Doc[]
const audiences = legal.audiences as Audience[]

const isZh = () => locale.value.startsWith('zh')
const pick = (o: Localized) => o[locale.value] ?? (isZh() ? o.zh : o.en) ?? o.zh ?? o.en ?? ''
const docsForId = (id: string) => documents.filter((d) => (audiences.find((a) => a.id === id)?.documents ?? []).includes(d.id))
const docsFor = (a: Audience) => docsForId(a.id)
const audienceLabel = (id: string) => pick(audiences.find((a) => a.id === id)?.label ?? { zh: id, en: id })

const form = reactive({ audience: 'shop_buyer', name: '', organization: '', email: '', phone: '', documents: [] as string[], note: '', accepted: false })
const orgRequired = computed(() => form.audience === 'building' || form.audience === 'partner')
const submitting = ref(false)
const error = ref('')
const done = ref(false)
const doneId = ref('')

const startAck = (id: string) => {
  form.audience = id
  form.documents = docsForId(id).map((d) => d.id)
  document.getElementById('acknowledge')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const submit = async () => {
  error.value = ''
  if (!form.name || !form.email || !form.documents.length || !form.accepted || (orgRequired.value && !form.organization)) {
    error.value = T.value.errFields
    return
  }
  submitting.value = true
  try {
    const versions: Record<string, string> = {}
    for (const id of form.documents) versions[id] = documents.find((d) => d.id === id)?.revision ?? ''
    const res = await fetch('/api/legal/acknowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, organization: form.organization || undefined, phone: form.phone || undefined, note: form.note || undefined, versions, locale: locale.value }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      error.value = res.status === 429 ? T.value.errRate : res.status === 409 ? T.value.errStale : (data?.error || T.value.errServer)
      return
    }
    doneId.value = String(data?.id ?? '')
    done.value = true
    trackEvent('legal_acknowledge', { audience: form.audience, documents: form.documents.join(',') })
  } catch {
    error.value = T.value.errServer
  } finally {
    submitting.value = false
  }
}

const reset = () => {
  done.value = false
  doneId.value = ''
  form.name = ''; form.organization = ''; form.email = ''; form.phone = ''; form.documents = []; form.note = ''; form.accepted = false
}

// Copy: states what the documents are and what an acknowledgement means. It is a
// record of review, not an electronic signature (KB: legal sign-off stays with 專人).
const COPY: Record<string, Record<string, string>> = {
  zh: {
    title: '法務文件中心', lead: '商城買家、住戶、建案與社區、合作夥伴適用的全部法律文件，集中在這一頁。看完可以在下方留下審閱確認，我們的專人會據此聯繫後續簽署。',
    updatedNote: '所有文件以繁體中文版為準，英文版為方便閱讀的翻譯。', byAudience: '依對象查看', byAudienceSub: '先找到您的身分，再看適用的文件。',
    allDocs: '全部文件', allDocsSub: '每份文件都有繁體中文與英文版本，連結直接開啟全文。', rev: '版次', issued: '發行', appliesTo: '適用對象：', errStale: '文件已更新版次，請重新整理頁面後再審閱一次。',
    languageNote: '文件以繁體中文版為準；英文版為方便閱讀的翻譯，條文解釋以中文為準。', ackFor: '審閱確認',
    ackTitle: '審閱確認', ackSub: '填寫後我們會記錄您已審閱的文件與版本，並由專人安排後續合作或簽署事宜。這不是電子簽章。',
    fAudience: '我的身分', fName: '姓名', fOrg: '公司／單位', fEmail: 'Email', fPhone: '電話', fDocs: '已審閱的文件', fNote: '備註或問題',
    fAccept: '我已審閱勾選的文件，並同意 enGo 依上述文件所載方式處理我的資料。', required: '必填',
    submit: '送出審閱確認', sending: '送出中', askLine: '有問題先用 LINE 問我們', ackFine: '送出後會記錄時間、身分、文件版本與聯絡方式；我們不會公開這些資料。',
    doneTitle: '已收到您的審閱確認。', doneBody: '專人會在上班時間與您聯繫。紀錄編號：', another: '再送一份',
    errFields: '請填妥必填欄位、至少勾選一份文件，並勾選同意。', errRate: '送出太頻繁，請稍後再試。', errServer: '送出失敗，請稍後再試或改用 LINE 聯絡我們。',
  },
  zhCN: {
    title: '法务文件中心', lead: '商城买家、住户、建案与社区、合作伙伴适用的全部法律文件，集中在这一页。看完可以在下方留下审阅确认，我们的专人会据此联系后续签署。',
    updatedNote: '所有文件以繁体中文版为准，英文版为方便阅读的翻译。', byAudience: '依对象查看', byAudienceSub: '先找到您的身份，再看适用的文件。',
    allDocs: '全部文件', allDocsSub: '每份文件都有繁体中文与英文版本，链接直接打开全文。', rev: '版次', issued: '发行', appliesTo: '适用对象：', errStale: '文件已更新版次，请刷新页面后再审阅一次。',
    languageNote: '文件以繁体中文版为准；英文版为方便阅读的翻译，条文解释以中文为准。', ackFor: '审阅确认',
    ackTitle: '审阅确认', ackSub: '填写后我们会记录您已审阅的文件与版本，并由专人安排后续合作或签署事宜。这不是电子签章。',
    fAudience: '我的身份', fName: '姓名', fOrg: '公司／单位', fEmail: 'Email', fPhone: '电话', fDocs: '已审阅的文件', fNote: '备注或问题',
    fAccept: '我已审阅勾选的文件，并同意 enGo 依上述文件所载方式处理我的资料。', required: '必填',
    submit: '送出审阅确认', sending: '送出中', askLine: '有问题先用 LINE 问我们', ackFine: '送出后会记录时间、身份、文件版本与联系方式；我们不会公开这些资料。',
    doneTitle: '已收到您的审阅确认。', doneBody: '专人会在上班时间与您联系。记录编号：', another: '再送一份',
    errFields: '请填妥必填栏位、至少勾选一份文件，并勾选同意。', errRate: '送出太频繁，请稍后再试。', errServer: '送出失败，请稍后再试或改用 LINE 联系我们。',
  },
  en: {
    title: 'Legal Center', lead: 'Every legal document that applies to store customers, households, developments and communities, and partners, on one page. Once you have read them, leave a review acknowledgement below and our team will follow up on any signing.',
    updatedNote: 'The Traditional Chinese text governs; English versions are convenience translations.', byAudience: 'By audience', byAudienceSub: 'Find who you are, then the documents that apply.',
    allDocs: 'All documents', allDocsSub: 'Each document is available in Traditional Chinese and English; links open the full text.', rev: 'Rev.', issued: 'Issued', appliesTo: 'Applies to:', errStale: 'A document has a newer revision. Reload the page and review it again.',
    languageNote: 'The Traditional Chinese text governs; English versions are convenience translations.', ackFor: 'Acknowledge review',
    ackTitle: 'Review acknowledgement', ackSub: 'We record which documents and versions you reviewed, and our team arranges any follow-up or signing. This is not an electronic signature.',
    fAudience: 'I am a', fName: 'Name', fOrg: 'Company / organisation', fEmail: 'Email', fPhone: 'Phone', fDocs: 'Documents reviewed', fNote: 'Notes or questions',
    fAccept: 'I have reviewed the documents ticked above and agree that enGo may process my data as those documents describe.', required: 'required',
    submit: 'Send acknowledgement', sending: 'Sending', askLine: 'Ask us on LINE first', ackFine: 'We record the time, audience, document versions and your contact details; none of it is published.',
    doneTitle: 'Acknowledgement received.', doneBody: 'Our team will contact you during business hours. Reference:', another: 'Send another',
    errFields: 'Fill in the required fields, tick at least one document, and tick the agreement.', errRate: 'Too many submissions; please try again later.', errServer: 'Could not send. Try again later or reach us on LINE.',
  },
}
const T = computed(() => COPY[locale.value] ?? COPY.en)
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

.lg { background: #fff; color: $ink; font-family: $display-font; }
.lg-wrap { max-width: 1240px; margin: 0 auto; padding-inline: clamp(20px, 5vw, 64px); }
.lg-center { text-align: center; }
.lg-tile { padding: clamp(64px, 9vw, 112px) 0; }
.lg-tile-white { background: #fff; }
.lg-tile-parchment { background: $parchment; }
.lg-tile-dark { background: $tile-dark; color: #fff; .lg-h2, .lg-h3 { color: #fff; } .lg-sub, .lg-body { color: $on-dark-muted; } }

.lg-title { font-weight: 600; letter-spacing: -.03em; line-height: 1.05; font-size: clamp(2.6rem, 6.4vw, 5rem); margin: 0; color: inherit; }
.lg-lead { font-size: clamp(1.15rem, 1.7vw, 1.5rem); font-weight: 300; line-height: 1.4; max-width: 34em; margin: 18px auto 0; }
.lg-h2 { font-weight: 600; letter-spacing: -.02em; line-height: 1.1; font-size: clamp(2rem, 3.6vw, 3rem); margin: 0; color: inherit; }
.lg-h3 { font-weight: 600; letter-spacing: -.01em; font-size: 1.3125rem; line-height: 1.25; margin: 0; color: inherit; }
.lg-sub { font-size: clamp(1.1rem, 1.5vw, 1.3rem); line-height: 1.4; margin: 12px auto 0; max-width: 40em; }
.lg-head { margin-bottom: clamp(32px, 4vw, 56px); }
.lg-body { font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; margin: 10px 0 0; color: $ink-80; }
.lg-meta { font-size: .875rem; line-height: 1.43; color: $ink-80; }
.lg-fine { font-size: .875rem; line-height: 1.43; color: $ink-80; margin: 24px 0 0; }
.lg-fine-on-dark { color: $on-dark-muted; }
.lg-req { color: $ink-80; font-weight: 400; }
.lg-tile-dark .lg-req { color: $on-dark-muted; }

.lg-link { color: $brand-orange-text; text-decoration: none; font-size: 1.0625rem; letter-spacing: -.022em; &:hover { text-decoration: underline; } }
.lg-link-on-dark { color: $orange2; }
.lg-chev { margin-left: .25em; }
.lg-pill {
  display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; text-decoration: none; cursor: pointer;
  font: inherit; font-size: 1.0625rem; letter-spacing: -.022em; padding: 11px 22px; min-height: 44px; border-radius: 9999px; border: 1px solid transparent;
  transition: transform .15s ease, background .2s ease; &:active { transform: scale(.95); } &:disabled { opacity: .6; cursor: default; }
}
.lg-pill-primary { background: $brand-orange-text; color: #fff; &:hover { background: darken($brand-orange-text, 6%); } }
.lg-pill-ghost { color: $brand-orange-text; border-color: $brand-orange-text; background: transparent; &:hover { background: rgba($brand-orange, .06); } }
.lg-pill-ghost-dark { color: #fff; border-color: rgba(255, 255, 255, .55); }

.lg-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; @media (max-width: 1024px) { grid-template-columns: 1fr 1fr; } @media (max-width: 640px) { grid-template-columns: 1fr; } }
.lg-card { background: #fff; border: 1px solid $hairline; border-radius: 18px; padding: 28px; display: flex; flex-direction: column; gap: 14px; .lg-pill { align-self: flex-start; margin-top: auto; } }
.lg-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; li { display: flex; flex-direction: column; gap: 2px; padding: 12px 0; border-top: 1px solid $hairline; } }
.lg-docs { display: flex; flex-direction: column; gap: 20px; }
.lg-doc { display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: center; background: $parchment; border: 1px solid $hairline; border-radius: 18px; padding: 28px; @media (max-width: 834px) { grid-template-columns: 1fr; } }
.lg-doc-actions { display: flex; gap: 10px; flex-wrap: wrap; }

.lg-form-wrap { max-width: 820px; }
.lg-form { display: flex; flex-direction: column; gap: 18px; }
.lg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; @media (max-width: 640px) { grid-template-columns: 1fr; } }
.lg-field { display: flex; flex-direction: column; gap: 8px; label, legend { font-size: 1.0625rem; font-weight: 600; letter-spacing: -.022em; } }
.lg-field input, .lg-field select, .lg-field textarea {
  font: inherit; font-size: 1.0625rem; color: $ink; background: #fff; border: 1px solid $hairline; border-radius: 8px; padding: 10px 14px; min-height: 44px; width: 100%; box-sizing: border-box;
  &:focus-visible { outline: 2px solid $orange2; outline-offset: 2px; }
}
.lg-fieldset { border: 0; padding: 0; margin: 0; }
.lg-check { display: flex; align-items: flex-start; gap: 10px; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; padding: 8px 0; input { width: 20px; height: 20px; margin-top: 3px; accent-color: $brand-orange-text; flex: none; } em { font-style: normal; color: $on-dark-muted; margin-left: 6px; } }
.lg-accept { border-top: 1px solid rgba(255, 255, 255, .18); padding-top: 18px; }
.lg-actions { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.lg-error { color: $orange2; font-weight: 600; margin: 0; }
.lg-done { display: flex; flex-direction: column; gap: 14px; align-items: center; code { font-family: inherit; color: $on-dark-muted; } .lg-pill { margin-top: 10px; } }
</style>
