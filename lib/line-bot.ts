// The LINE bot's behaviour, separated from the Vercel handler so it can be
// tested with fake reply/log functions. api/line/webhook.ts only verifies the
// signature and wires the real LINE API and Supabase in.

import knowledgeBase from '../src/data/knowledge_base.json'
import { composeAnswer, type AnswerStrings } from './chatbot-answer.js'
import { detectLocale, toLineText, type LineLocale } from './line.js'

/** Same wording as the website chatbot (src/locale/*.ts → chatbot.*). */
export const LINE_STRINGS: Record<LineLocale, AnswerStrings & { welcome: string; group_hint: string }> = {
  zh: {
    welcome: '你好！我是 enGo 智管家助手。直接輸入問題就可以，例如「斷網可以用嗎」「怎麼新增房間」「商城在哪裡」。需要真人時請撥 02-27510218（週一至週五 09:00-18:00）。',
    found_video: '我為您找到了一段影片：',
    found_info: '我為您找到了一些資訊。您可以點擊這裡查看：',
    specs: '規格',
    features: '特色',
    no_match: '抱歉，這個問題我沒有把握，幫您轉給專人確認會比較準確。請撥 02-27510218（週一至週五 09:00-18:00），或直接在這裡留言，客服上班時間會回覆您。',
    group_hint: '在群組裡請在訊息中提到「enGo」或「智管家」，我才會回答。',
  },
  zhCN: {
    welcome: '你好！我是 enGo 智管家助手。直接输入问题就可以，例如「断网可以用吗」「怎么新增房间」「商城在哪里」。需要真人请拨 02-27510218（周一至周五 09:00-18:00）。',
    found_video: '我为您找到了一段影片：',
    found_info: '我为您找到了一些信息。您可以点击这里查看：',
    specs: '规格',
    features: '特色',
    no_match: '抱歉，这个问题我没有把握，帮您转给专人确认会比较准确。请拨 02-27510218（周一至周五 09:00-18:00），或直接在这里留言，客服上班时间会回复您。',
    group_hint: '在群组里请在信息中提到「enGo」或「智管家」，我才会回答。',
  },
  en: {
    welcome: 'Hello! I am the enGo Assistant. Just type your question, for example "works offline?", "how do I add a room" or "where is the store". For a person, call 02-27510218 (Mon-Fri 09:00-18:00).',
    found_video: 'I found a video for you:',
    found_info: 'I found some information for you. You can open it here:',
    specs: 'Specs',
    features: 'Features',
    no_match: "Sorry, I'm not certain about that one, a specialist can answer it properly. Call 02-27510218 (Mon-Fri 09:00-18:00) or leave your message here and our team will reply during business hours.",
    group_hint: 'In a group, mention "enGo" in your message so I know it is for me.',
  },
  ja: {
    welcome: 'こんにちは！enGoアシスタントです。質問をそのまま入力してください。担当者が必要な場合は 02-27510218（月〜金 09:00-18:00）へお電話ください。',
    found_video: '動画が見つかりました：',
    found_info: '情報が見つかりました。こちらをご確認ください：',
    specs: '製品仕様',
    features: '特長',
    no_match: '申し訳ありません、この質問には確実にお答えできません。02-27510218（月〜金 09:00-18:00）へお電話いただくか、こちらにメッセージを残してください。営業時間内に担当者が返信します。',
    group_hint: 'グループでは「enGo」を含めて送ってください。',
  },
}

export interface LineEvent {
  type: string
  replyToken?: string
  source?: { type?: 'user' | 'group' | 'room'; userId?: string; groupId?: string; roomId?: string }
  message?: { type?: string; text?: string; id?: string }
}

/**
 * In a 1:1 chat every text message is a question. In groups and rooms the bot
 * would otherwise answer every sentence anyone types, so it only speaks when
 * addressed by name.
 */
export function shouldAnswer(event: LineEvent): boolean {
  if (event.type !== 'message' || event.message?.type !== 'text' || !event.replyToken) return false
  const text = event.message.text || ''
  if (!text.trim()) return false
  const kind = event.source?.type || 'user'
  if (kind === 'user') return true
  return /engo|智管家|安購|安购|智管家商城/i.test(text) || text.trimStart().startsWith('@')
}

/** Strip the @mention people use in groups so it does not pollute the query. */
export const cleanQuestion = (text: string): string => text.replace(/^\s*@\S+\s*/, '').trim()

export interface BotDeps {
  reply: (replyToken: string, texts: string[]) => Promise<unknown>
  /** Mirrors the website's chatbot_analytics rows; must never throw into the bot. */
  log?: (keyword: string, locale: string, matchFound: boolean) => Promise<unknown>
}

export interface Handled { event: string; locale?: LineLocale; matched?: boolean; id?: string | null; replied: boolean }

/** Process one webhook delivery (up to ~100 events). Never throws for a single bad event. */
export async function processLineEvents(events: LineEvent[], deps: BotDeps): Promise<Handled[]> {
  const out: Handled[] = []
  for (const ev of events || []) {
    try {
      if (ev.type === 'follow' && ev.replyToken) {
        await deps.reply(ev.replyToken, [LINE_STRINGS.zh.welcome])
        out.push({ event: 'follow', replied: true })
        continue
      }
      if (!shouldAnswer(ev)) { out.push({ event: ev.type, replied: false }); continue }

      const question = cleanQuestion(ev.message!.text!)
      const locale = detectLocale(question)
      const strings = LINE_STRINGS[locale]
      const answer = composeAnswer(knowledgeBase as any, question, locale, strings)
      const text = toLineText(answer.text, locale)

      await deps.reply(ev.replyToken!, [text])
      if (deps.log) {
        try {
          await deps.log(question.slice(0, 500), `line-${locale}`, answer.matched)
          if (answer.matched && answer.id) await deps.log('kb:' + String(answer.id), `line-${locale}`, true)
        } catch (err) {
          console.error('line log failed', err)
        }
      }
      out.push({ event: 'message', locale, matched: answer.matched, id: answer.id, replied: true })
    } catch (err) {
      console.error('line event failed', ev?.type, err)
      out.push({ event: ev?.type || 'unknown', replied: false })
    }
  }
  return out
}
