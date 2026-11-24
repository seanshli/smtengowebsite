<template>
  <main class="cx">
    <section class="cx-head" aria-labelledby="cx-title">
      <div class="cx-wrap">
        <h1 id="cx-title" class="cx-title">{{ lt(ask.title) }}</h1>
        <p class="cx-lede">{{ lt(ask.lede) }}</p>
        <p v-if="currentSol" class="cx-asking">
          <span class="cx-swatch" :class="'tone-' + currentSol.tone" aria-hidden="true"></span>
          {{ lt(ask.asking) }}：{{ lt(currentSol.area) }}<template v-if="currentSol.product"> · {{ currentSol.product }}</template>
        </p>
      </div>
    </section>

    <div class="cx-wrap cx-body">
      <form class="cx-form" novalidate @submit.prevent="submitForm">
        <!-- 1. What it is about: the five solution areas, then the everyday reasons people write in. -->
        <fieldset class="cx-block">
          <legend id="cf-interest" class="cx-h">{{ lt(ask.areaLabel) }} <span class="cx-req">({{ $t('required') }})</span></legend>
          <p class="cx-group">{{ lt(ask.groupSolutions) }}</p>
          <div class="cx-chips">
            <label v-for="s in sols" :key="s.id" class="cx-chip">
              <input type="radio" name="interest" :value="s.interest" v-model="interest" />
              <span class="cx-swatch" :class="'tone-' + s.tone" aria-hidden="true"></span>{{ lt(s.area) }}
            </label>
          </div>
          <p class="cx-group">{{ lt(ask.groupOther) }}</p>
          <div class="cx-chips">
            <label v-for="o in ask.other" :key="o.id" class="cx-chip">
              <input type="radio" name="interest" :value="o.id" v-model="interest" />{{ lt(o.label) }}
            </label>
          </div>
        </fieldset>

        <!-- 2. A few questions for that area: each answer is one tap. -->
        <fieldset v-for="q in questions" :key="q.id" class="cx-block cx-q">
          <legend class="cx-h cx-h-sm">{{ lt(q.label) }}<span v-if="q.multi" class="cx-many">（{{ lt(ask.pickMany) }}）</span></legend>
          <div class="cx-chips">
            <label v-for="o in q.options" :key="o.id" class="cx-chip">
              <input v-if="q.multi" type="checkbox" :value="o.id" v-model="multi[q.id]" />
              <input v-else type="radio" :name="q.id" :value="o.id" v-model="single[q.id]" />{{ lt(o.label) }}
            </label>
          </div>
        </fieldset>

        <div v-if="interest === 'product'" class="cx-block cx-pair">
          <div class="cx-field">
            <label for="cf-messagetype">{{ $t('messagetypePlaceholder') }} <span class="cx-req">({{ $t('required') }})</span></label>
            <select id="cf-messagetype" name="messagetype" v-model="messagetype">
              <option value="" disabled>{{ $t('messagetypePlaceholder') }}</option>
              <option value="engosystem">{{ $t('msgType1') }}</option>
              <option value="waterfilter">{{ $t('msgType2') }}</option>
            </select>
          </div>
          <div class="cx-field">
            <label for="cf-plan">{{ $t('planPlaceholder') }} <span class="cx-req">({{ $t('required') }})</span></label>
            <select id="cf-plan" name="plan" v-model="plan">
              <option value="" disabled>{{ $t('planPlaceholder') }}</option>
              <option v-for="(item, index) in planOptions" :key="index" :value="item.id">{{ item.name }}</option>
            </select>
          </div>
        </div>

        <!-- 3. In their own words. -->
        <div class="cx-block">
          <h2 class="cx-h">{{ lt(ask.situationTitle) }}</h2>
          <div class="cx-field">
            <label for="cf-message">{{ lt(ask.situationLabel) }}</label>
            <p id="cf-message-hint" class="cx-hint">{{ lt(ask.situationHint) }}</p>
            <textarea id="cf-message" name="message" rows="4" maxlength="1000" aria-describedby="cf-message-hint" v-model="situation"></textarea>
          </div>
          <fieldset class="cx-q cx-q-inline">
            <legend class="cx-h cx-h-sm">{{ lt(ask.contactTime.label) }}</legend>
            <div class="cx-chips">
              <label v-for="o in ask.contactTime.options" :key="o.id" class="cx-chip">
                <input type="radio" name="contactTime" :value="o.id" v-model="contactTime" />{{ lt(o.label) }}
              </label>
            </div>
          </fieldset>
        </div>

        <!-- 4. Who to call back. -->
        <div class="cx-block">
          <h2 class="cx-h">{{ lt(ask.contactTitle) }}</h2>
          <div class="cx-pair">
            <div class="cx-field">
              <label for="cf-name">{{ $t('name') }} <span class="cx-req">({{ $t('required') }})</span></label>
              <input id="cf-name" type="text" name="name" autocomplete="name" v-model="name" />
            </div>
            <div class="cx-field">
              <label for="cf-phone">{{ $t('phone') }} <span class="cx-req">({{ $t('required') }})</span></label>
              <input id="cf-phone" type="tel" name="phone" autocomplete="tel" inputmode="tel" aria-describedby="cf-phone-hint" v-model="phone" />
              <p id="cf-phone-hint" class="cx-hint">{{ lt(ask.phoneHint) }}</p>
            </div>
          </div>
          <div class="cx-field">
            <label for="cf-email">{{ $t('email') }} <span class="cx-req">({{ $t('required') }})</span></label>
            <input id="cf-email" type="email" name="email" autocomplete="email" inputmode="email" v-model="email" />
          </div>
          <div class="cx-pair cx-pair-city">
            <div class="cx-field">
              <label for="cf-city">{{ $t('city') }} <span class="cx-req">({{ $t('required') }})</span></label>
              <select id="cf-city" name="city" v-model="city">
                <option value="" disabled>{{ $t('city') }}</option>
                <option v-for="c in cities" :key="c" :value="$t(c)">{{ $t(c) }}</option>
              </select>
            </div>
            <div class="cx-field">
              <label for="cf-address">{{ $t('address') }}</label>
              <input id="cf-address" type="text" name="address" autocomplete="street-address" v-model="address" />
            </div>
          </div>
        </div>

        <p id="form-error-message" class="cx-error" role="alert" aria-live="assertive">{{ errorMessage }}</p>
        <button type="submit" class="cx-submit" :disabled="sending" :aria-busy="sending">{{ sending ? lt(ask.sending) : $t('submitForm') }}</button>
      </form>

      <aside class="cx-desk" :aria-label="tx('其他聯絡方式', '其他联系方式', 'Other ways to reach us', { ja: 'その他のお問い合わせ方法', fr: 'Autres moyens de nous joindre', es: 'Otras formas de contactarnos' })">
        <p class="cx-desk-title">{{ lt(ask.deskTitle) }}</p>
        <p class="cx-desk-lede">{{ lt(ask.deskLede) }}</p>
        <div class="cx-desk-block">
          <h2 class="cx-desk-h">{{ tx('直接來電', '直接来电', 'Call us', { ja: 'お電話', fr: 'Appelez-nous', es: 'Llámenos' }) }}</h2>
          <a class="cx-desk-phone" href="tel:+886-2-27510218" data-track="contact:phone">{{ $t('footer.phone') }}</a>
          <p class="cx-desk-note">{{ $t('footer.time') }}</p>
        </div>
        <div class="cx-desk-block">
          <h2 class="cx-desk-h">LINE</h2>
          <button type="button" class="cx-line" @click="jumpToLine">{{ $t('contactOnLine') }} <IconArrow external /></button>
        </div>
        <div v-if="showrooms.length" class="cx-desk-block">
          <h2 class="cx-desk-h">{{ tx('展示間', '展示间', 'Showrooms', { ja: 'ショールーム', fr: 'Salles d’exposition', es: 'Salas de exhibición' }) }}</h2>
          <ul class="cx-rooms">
            <li v-for="s in showrooms" :key="s.id">
              <router-link :to="'/cases/' + s.id">{{ lt(s.title) }}</router-link>
              <span>{{ lt(s.location) }}</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useLocaleText } from '@/composables/useLocaleText'
import { useAnalytics } from '@/utils/analytics'
import IconArrow from '@/components/IconArrow.vue'
import { isTaiwanPhone } from '@/utils/phone'
import casesData from '@/data/cases.json'
import solutionsData from '@/data/solutions.json'

const d = solutionsData as any
const ask = d.ask
const sols = d.solutions as any[]
const { tm, t } = useI18n()
const { tx, lt } = useLocaleText()
const { trackEvent } = useAnalytics()
const route = useRoute()
const router = useRouter()

const cities = ['tpe', 'ntpe', 'ht', 'tj', 'tn', 'kh', 'hl', 'pd', 'td', 'jh', 'other']
const showrooms = (casesData as any[]).filter((c) => c.category?.en === 'Showroom')
const planOptions = computed(() => tm('planItems') as any[])

const name = ref('')
const email = ref('')
const phone = ref('')
const city = ref('')
const address = ref('')
const messagetype = ref('')
const plan = ref('')
const situation = ref('')
const contactTime = ref('')
const errorMessage = ref('')
const sending = ref(false)

// ?area=<solution id> (home page desk, solution pages, Q&A) preselects the area.
const fromArea = sols.find((s) => s.id === String(route.query.area || ''))
const interest = ref<string>(fromArea ? fromArea.interest : '')
const currentSol = computed(() => sols.find((s) => s.interest === interest.value))
const questions = computed(() => (currentSol.value ? ask.questions[currentSol.value.id] || [] : []))

// One answer slot per question: a single id for single-choice, a list for "choose any".
const single = reactive<Record<string, string>>({})
const multi = reactive<Record<string, string[]>>({})
watch(questions, (qs) => { for (const q of qs) if (q.multi && !multi[q.id]) multi[q.id] = [] }, { immediate: true })

// The team reads the enquiry in the admin list as one message, in Traditional Chinese
// whatever the visitor's language: area, each answer, their own words, best time to call.
const zh = (o: any) => (o && (o.zh || o.en)) || ''
const composeMessage = () => {
  const areaLabel = currentSol.value ? zh(currentSol.value.area) : zh(ask.other.find((o: any) => o.id === interest.value)?.label)
  const answers = questions.value
    .map((q: any) => {
      const picked = q.multi ? multi[q.id] || [] : single[q.id] ? [single[q.id]] : []
      const labels = q.options.filter((o: any) => picked.includes(o.id)).map((o: any) => zh(o.label))
      return labels.length ? `${zh(q.label)}：${labels.join('、')}` : ''
    })
    .filter(Boolean)
  const time = ask.contactTime.options.find((o: any) => o.id === contactTime.value)
  return [
    `【${areaLabel}】${answers.join('；')}`,
    situation.value.trim() ? `情況：${situation.value.trim()}` : '',
    time ? `方便聯絡：${zh(time.label)}` : '',
  ].filter(Boolean).join('\n')
}

const fail = (field: string, msg: string) => {
  errorMessage.value = msg
  trackEvent('form_validation_error', { field, error: msg })
  return false
}
const required = () => {
  if (!interest.value) return fail('interest', `${t('enterEmpty')}"${lt(ask.areaLabel)}"`)
  if (interest.value === 'product' && !messagetype.value) return fail('messagetype', `${t('enterEmpty')}"${t('messagetype')}"`)
  if (interest.value === 'product' && !plan.value) return fail('plan', `${t('enterEmpty')}"${t('plan')}"`)
  if (!name.value.trim()) return fail('name', `${t('enterEmpty')}"${t('name')}"`)
  if (!phone.value.trim()) return fail('phone', `${t('enterEmpty')}"${t('phone')}"`)
  if (!email.value.trim()) return fail('email', `${t('enterEmpty')}"${t('email')}"`)
  if (!city.value) return fail('city', `${t('enterEmpty')}"${t('city')}"`)
  return true
}
const validEmail = (v: string) => /^[^\s@<>()[\]\\,;:"]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/.test(v.trim())

const jumpToLine = () => {
  trackEvent('click_contact_line')
  window.open('https://lin.ee/THIUSjW')
}

const submitForm = async () => {
  if (sending.value) return
  errorMessage.value = ''
  trackEvent('form_submit_attempt', { area: interest.value })
  if (!required()) return
  if (!isTaiwanPhone(phone.value)) return fail('phone', lt(ask.phoneError))
  if (!validEmail(email.value)) return fail('email', t('enterValidMail'))
  const productType = interest.value === 'product' && messagetype.value ? `product,${messagetype.value}` : interest.value
  sending.value = true
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value.trim(), email: email.value.trim(), phone: phone.value.trim(), region: '', city: city.value,
        address: address.value.trim(), servicePlanId: interest.value === 'product' ? plan.value : '', productType, message: composeMessage(),
      }),
    })
    if (!response.ok) throw new Error(String(response.status))
    trackEvent('form_submit_success', { productType })
    router.push({ name: 'success' })
  } catch {
    errorMessage.value = tx('發生錯誤，請稍後再試。', '发生错误，请稍后再试。', 'Something went wrong. Please try again later.', { ja: 'エラーが発生しました。しばらくしてからもう一度お試しください。', fr: 'Une erreur s’est produite. Veuillez réessayer plus tard.', es: 'Ocurrió un error. Inténtelo de nuevo más tarde.' })
    trackEvent('form_submit_error', { error: errorMessage.value })
  } finally {
    sending.value = false
  }
}
</script>

<style scoped lang="scss">
// Building world: terrazzo paper, ink type, grille-green desk, one action colour.
$ink: #1e2a25;
$muted: #4a5650;
$paper: #fbf8f2;
$terrazzo: #e6e0d5;
$grille: #2f4a3e;
$glow: #ffd2a6;
$action: #c94f12;

.cx { background: $paper; color: $ink; }
.cx-wrap { max-width: 1248px; margin: 0 auto; padding-left: clamp(20px, 6vw, 96px); padding-right: clamp(20px, 6vw, 96px); }
.cx-head { padding-top: clamp(112px, 12vw, 160px); padding-bottom: clamp(28px, 4vw, 48px); }
.cx-title { margin: 0; color: inherit; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; line-height: 1.2; letter-spacing: -.01em; text-wrap: balance; }
.cx-lede { margin: 14px 0 0; max-width: 40em; font-size: clamp(1rem, 1.3vw, 1.125rem); line-height: 1.75; color: $muted; }
.cx-asking { display: inline-flex; align-items: center; gap: 10px; margin: 18px 0 0; padding: 6px 14px; border-radius: 999px; background: $terrazzo; font-weight: 600; }

.cx-body { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 72px); align-items: start; padding-bottom: clamp(64px, 9vw, 120px); }
.cx-form { display: grid; gap: 4px; }
.cx-block { margin: 0; padding: 24px 0; border: 0; border-top: 1px solid rgba($ink, .14); min-width: 0; }
.cx-block:first-child { border-top: 0; padding-top: 0; }
.cx-q { padding-top: 16px; padding-bottom: 16px; }
.cx-q-inline { border: 0; margin: 20px 0 0; padding: 0; }
.cx-h { display: block; margin: 0 0 14px; padding: 0; color: inherit; font-size: 1.25rem; font-weight: 700; line-height: 1.4; letter-spacing: 0; }
.cx-h-sm { font-size: 1.02rem; margin-bottom: 10px; }
// A legend sits on its fieldset's top border by default; floating it puts the rule above the question instead.
fieldset > legend.cx-h { float: left; width: 100%; }
fieldset > legend.cx-h ~ * { clear: both; }
.cx-many { font-weight: 500; color: $muted; font-size: .9rem; }
.cx-req { font-weight: 500; font-size: .85rem; color: $muted; }
.cx-group { margin: 6px 0 8px; font-size: .9rem; font-weight: 600; color: $muted; }

.cx-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.cx-chip {
  position: relative; display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 8px 16px;
  border-radius: 999px; border: 1px solid rgba($ink, .35); background: #fff; color: $ink; font-size: .95rem; font-weight: 500; cursor: pointer;
  transition: background-color .2s, color .2s, border-color .2s;
  input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }
  &:hover { border-color: $ink; }
  &:has(input:checked) { background: $ink; border-color: $ink; color: $paper; }
  &:has(input:focus-visible) { outline: 2px solid $action; outline-offset: 2px; }
}
.cx-swatch { flex: none; display: inline-block; width: 14px; height: 14px; border-radius: 3px; }
.tone-mint { background: #7fb7a4; } .tone-butter { background: #f2d37a; } .tone-salmon { background: #e7a596; } .tone-terrazzo { background: #cfc7b8; } .tone-iron { background: #2f4a3e; }
.cx-chip:has(input:checked) .tone-iron { box-shadow: 0 0 0 1px rgba($paper, .7); }

.cx-field { display: grid; gap: 6px; margin-top: 14px; min-width: 0;
  label { font-weight: 600; font-size: .95rem; }
  input, select, textarea {
    font: inherit; font-size: 1rem; color: $ink; width: 100%; min-height: 48px; padding: 10px 14px;
    border-radius: 12px; border: 1px solid rgba($ink, .3); background: #fff;
    &:focus-visible { outline: 2px solid $action; outline-offset: 1px; border-color: $ink; }
  }
  textarea { min-height: 120px; line-height: 1.7; resize: vertical; }
}
.cx-hint { margin: 0; font-size: .875rem; line-height: 1.6; color: $muted; }
.cx-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
.cx-pair-city { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); }
.cx-block.cx-pair { grid-template-columns: 1fr 1fr; }

.cx-error { min-height: 1.5em; margin: 8px 0 0; color: #a33a14; font-weight: 600; }
.cx-submit {
  font: inherit; font-weight: 700; font-size: 1.05rem; justify-self: start; min-height: 52px; padding: 0 40px; margin-top: 6px;
  border: 0; border-radius: 999px; background: $action; color: #fff; cursor: pointer;
  &:hover:not(:disabled) { background: #b3460f; }
  &:focus-visible { outline: 2px solid $ink; outline-offset: 3px; }
  &:disabled { opacity: .6; cursor: progress; }
}

.cx-desk { position: sticky; top: 96px; padding: 24px; border-radius: 16px; background: $grille; color: $paper; }
.cx-desk-title { margin: 0; font-weight: 700; font-size: 1.1rem; }
.cx-desk-lede { margin: 8px 0 0; line-height: 1.7; color: rgba($paper, .88); }
.cx-desk-block { margin-top: 20px; padding-top: 18px; border-top: 1px solid rgba($paper, .18); }
.cx-desk-h { margin: 0 0 6px; color: $glow; font-size: .95rem; font-weight: 700; letter-spacing: 0; }
.cx-desk-phone { color: $paper; font-size: 1.6rem; font-weight: 700; text-decoration: none; font-variant-numeric: tabular-nums; &:focus-visible { outline: 2px solid $glow; outline-offset: 3px; } }
.cx-desk-note { margin: 4px 0 0; color: rgba($paper, .8); font-size: .9rem; }
.cx-line {
  font: inherit; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 0 20px;
  border-radius: 999px; border: 1.5px solid $glow; background: none; color: $glow; cursor: pointer;
  &:hover { background: rgba($glow, .12); }
  &:focus-visible { outline: 2px solid $glow; outline-offset: 3px; }
}
.cx-rooms { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px;
  li { display: flex; justify-content: space-between; gap: 12px; }
  a { color: $paper; text-decoration: underline; text-underline-offset: 4px; &:focus-visible { outline: 2px solid $glow; outline-offset: 2px; } }
  span { color: rgba($paper, .8); }
}

@media (prefers-reduced-motion: reduce) { .cx-chip { transition: none; } }
@media (max-width: 900px) {
  .cx-body { grid-template-columns: 1fr; }
  .cx-desk { position: static; }
  .cx-pair, .cx-pair-city, .cx-block.cx-pair { grid-template-columns: 1fr; }
  .cx-submit { width: 100%; justify-self: stretch; }
}
</style>
