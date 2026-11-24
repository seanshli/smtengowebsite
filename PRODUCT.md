# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Visitors arrive from one of four areas of need. They start where their own situation is, then go deeper into what enGo has for it (Sean, 2026-11-24: "we started with those 4 areas... pending on what they need, they do deep dive to see what we have").

- **Home**: households living with enGo HMS (wall tablet, phone app, devices in the home).
- **Building and property**: developers (建商), management committees (管委會) and property-management companies (物業) running a building or community (enGo BMS).
- **Care**: long-term-care and day-care operators (長照・日照) and their staff (enGo Care). Hospitals are named as a target by Sean; no hospital deployment or feature exists yet.
- **Retail and channel**: merchants, dealers and distributors managing sales, inventory and promotions (enGo Shop), and companies that need the above connected to their ERP/CRM.

Every visitor's underlying job is the same: run daily life or daily operations with less effort.

## Product Purpose

enGo makes day-to-day life easier and friendlier. It simplifies life, frees up time, and helps people do things better. It is about daily life, not gadgets and not hard-core technology: enGo works quietly behind what people already have (Sean, 2026-11-24).

The offer is a solution per area, each combining management software, apps and connected hardware (devices on MQTT).

## Positioning

"We hide behind what you have already." enGo fits into the home, building, care site or store as it is. It adds the management layer and the connections, without asking people to change how they live or work. The claim is daily-life ease, not technology.

## Operating Context

- **Home:** the enGo wall tablet, the enGo智慧管家 app (iOS / Android) and devices on a Matter gateway, MQTT, RS-485 and IR.
- **Community services in the app:** announcements, repair requests, facility booking, parcel notices and doorbell.
- **Care:** staff use enGo Care in the browser (care.smtengo.com). It imports export files from existing care-record systems, exercise devices and entry logs, and turns them into daily dashboards, alerts, evaluation indicators and a monthly evidence PDF.
- **Shop:** enGo 安購商城 (shoph5.smtengo.com) is a multi-merchant marketplace with subscriptions and the 「enGo 幣」 points.
- **Sales path:** contact form, LINE, phone, two showrooms.

## Capabilities and Constraints

Status per line is recorded in `文件-網站回饋/2026-11-24_產品事實表/` (BMS.md, Care.md, Shop.md, ERP-CRM整合.md). Website copy may only claim what those sheets mark 已上線.

- **enGo HMS:** live. Facts come from KB-001 and UM-001, with the content rulings below.
- **enGo Care:** live at care.smtengo.com for staff: login with mandatory two-factor authentication, encrypted personal data, an audit log, file imports, dashboards, evaluation indicators, alerts, goals and the monthly evidence pack.
  - There is **no AI in Care**.
  - It has no integration with HMS, BMS or ERP/CRM.
  - It has no hospital features.
  - There must be no diagnostic, screening, prediction or treatment wording.
  - The senior portal is built but switched off, pending Legal.
- **enGo BMS:**
  - All features are in development. Nothing is deployed to a production tenant.
  - The code is being merged into Shop; the cutover has not run.
  - The community features that are live today run inside the enGo app on a separate backend.
- **enGo Shop:** live.
  - **Shipped:** multi-merchant store, card payment with e-invoice, orders and refunds, subscriptions, 團長 group buy, coupons, promotion slots, franchise finance, iOS/Android apps.
  - **Built but behind flags** (state unconfirmed): enGo 幣, tier benefits, per-store shipping, inquiry mode, dealer map and console.
  - **Inventory:** stock control and holds exist; no multi-warehouse and no ERP stock sync.
  - **AI:** only a customer-service bot, whose production activation is unconfirmed.
- **ERP/CRM integration:** no customer-facing connector exists. At most it may be described as project-based integration that is still being planned. The foundations are Shop's own API, CSV import/export and a device-activation link that is still in development. Never list ERP or CRM vendors, "open API" or "real-time sync".
- **"AI":** claim it only where a sheet shows a live AI feature. Sean's positioning does not rest on AI.
- **Standing rules** (memory: engo-website-content-rulings):
  - no vendor names;
  - no door locks;
  - no Alexa;
  - no standby photo wall;
  - voice only on the wall tablet;
  - offline scenes not claimed;
  - no invented reviews, prices, customer counts or certifications;
  - brand is enGo; the store is 「enGo 安購商城」 / enGo Shop.

## Brand Commitments

- **Brand:** enGo.
- **Company:** 智管家科技股份有限公司 / Smart enGo Home Technology Corp.
- **Patents:** 24.
- **Tone:** easier, friendlier, everyday. Not technical, not gadget-led.
- **Human face:** the team as the voice, plus role scenes for each solution (a resident, a property manager, a caregiver, a shop owner). Customers are added later, only with written permission.
- **Languages:** zh-Hant (default), zh-Hans, en, ja, fr, es-MX.

## Evidence on Hand

- Real app and tablet screenshots in `public/images/screens/`.
- Case studies (`src/data/cases.json`): place names only, no customer names or budgets.
- Two showrooms.
- Care: 17 synthetic design screenshots in the engo-care repo (`docs/design/screens/`), with no real-use imagery.
- BMS: demo screenshots, gitignored and needing review; no production imagery.
- **Absent:** customer testimonials, ratings, usage counts and certifications. Future work must not fabricate any of them.

## Product Principles

1. Start from the visitor's situation, not from our products.
2. Ease over technology: describe what gets easier, not what the system is.
3. Claim only what is live; label everything else honestly or leave it out.
4. People, not gadgets: real team voices and real daily roles.
5. One enGo: the same account and the same feel across home, building, care and shop, where that is actually true.

## Accessibility & Inclusion

- WCAG 2.2 AA.
- Older readers: Care and family audiences need large type and clear contrast.
- All motion is disabled under `prefers-reduced-motion`.
- Mobile-first for the Taiwan audience.
