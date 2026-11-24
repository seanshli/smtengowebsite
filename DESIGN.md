---
version: alpha
name: enGo Building World
description: A dusk photograph of one ordinary Taiwanese mixed-use building, lit window by window, with terrazzo-paper rooms beneath it. Noto Sans TC set large and calm; one orange action colour; every generated photo labelled 示意圖. The Apple-profile tiles below the rooms are a legacy layer awaiting migration.

colors:
  # ── Building world (hero, solution rooms, /solutions/*): sampled from the photograph
  sky-ink: "#0b121c"
  window-light: "#f26b21"
  window-glow: "#ffd2a6"
  action: "#c94f12"
  action-hover: "#b3460f"
  terrazzo-paper: "#fbf8f2"
  terrazzo-band: "#e6e0d5"
  world-ink: "#1e2a25"
  world-muted: "#4a5650"
  grille-green: "#2f4a3e"
  tile-mint: "#7fb7a4"
  tile-butter: "#f2d37a"
  tile-salmon: "#e7a596"
  tile-terrazzo: "#cfc7b8"
  label-glass: "rgba(8, 13, 18, 0.74)"
  on-photo: "#ffffff"
  # ── Legacy layer (Apple profile, values read from src/css/utils/_variables.scss)
  legacy-ink: "#1d1d1f"
  legacy-ink-80: "#333333"
  legacy-ink-48: "#7a7a7a"
  legacy-ink-prompt: "#6e6e73"
  legacy-canvas: "#ffffff"
  legacy-parchment: "#f5f5f7"
  legacy-tile-dark: "#272729"
  legacy-tile-dark-2: "#2a2a2c"
  legacy-hairline: "#e0e0e0"
  legacy-on-dark-muted: "#cccccc"
  legacy-accent-text: "#b8431f"
  legacy-accent-on-dark: "#FE8B05"

typography:
  # ── Building world: Noto Sans TC, headings 700, labels 500-700
  world-display:
    fontFamily: "Noto Sans TC, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.14
    letterSpacing: "-0.02em"
  world-heading:
    fontFamily: "Noto Sans TC, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.022em"
  world-room-title:
    fontFamily: "Noto Sans TC, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(1.6rem, 2.6vw, 2.35rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.022em"
  world-section-title:
    fontFamily: "Noto Sans TC, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  world-lede:
    fontFamily: "Noto Sans TC, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(1rem, 1.25vw, 1.15rem)"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "-0.022em"
  world-point:
    fontFamily: "Noto Sans TC, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "-0.022em"
  world-role:
    fontFamily: "Noto Sans TC, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.88rem"
    fontWeight: 700
    lineHeight: 1.47
    letterSpacing: "-0.022em"
  world-status:
    fontFamily: "Noto Sans TC, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.6
    letterSpacing: "-0.022em"
  world-caption:
    fontFamily: "Noto Sans TC, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: "-0.022em"
  # ── Legacy layer (global base ladder plus homepage tiles)
  legacy-display-xl:
    fontFamily: "Noto Sans TC, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(2.6rem, 6.4vw, 5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  legacy-display:
    fontFamily: "Noto Sans TC, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(2rem, 3.6vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  legacy-lead:
    fontFamily: "Noto Sans TC, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(1.15rem, 1.7vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "-0.005em"
  legacy-body:
    fontFamily: "Noto Sans TC, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: "-0.022em"
  legacy-fine:
    fontFamily: "Noto Sans TC, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "-0.022em"

rounded:
  swatch: "3px"
  label: "12px"
  panel: "14px"
  card: "16px"
  photo: "20px"
  pill: "999px"
  dot: "50%"
  legacy-sm: "8px"
  legacy-lg: "18px"
  legacy-pill: "9999px"

spacing:
  touch-min: "44px"
  content-max: "1248px"
  gutter: "clamp(20px, 6vw, 96px)"
  section-y: "clamp(64px, 9vw, 120px)"
  room-gap: "clamp(56px, 8vw, 112px)"
  point-gap: "12px"
  label-pad: "10px 14px 11px"
  desk-pad: "16px 18px"
  legacy-wrap-max: "1240px"
  legacy-wrap-gutter: "clamp(20px, 5vw, 64px)"
  legacy-tile-y: "clamp(64px, 9vw, 112px)"

components:
  window-dot:
    backgroundColor: "{colors.window-light}"
    rounded: "{rounded.dot}"
    size: "22px"
  window-label:
    backgroundColor: "{colors.label-glass}"
    textColor: "{colors.on-photo}"
    typography: "{typography.world-point}"
    rounded: "{rounded.label}"
    padding: "{spacing.label-pad}"
  desk-card:
    backgroundColor: "{colors.terrazzo-paper}"
    textColor: "{colors.world-ink}"
    rounded: "{rounded.panel}"
    padding: "{spacing.desk-pad}"
  area-chip:
    backgroundColor: "transparent"
    textColor: "{colors.world-ink}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  area-chip-on:
    backgroundColor: "{colors.world-ink}"
    textColor: "{colors.terrazzo-paper}"
    rounded: "{rounded.pill}"
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-photo}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "{spacing.touch-min}"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
    textColor: "{colors.on-photo}"
    rounded: "{rounded.pill}"
  button-room-link:
    backgroundColor: "transparent"
    textColor: "{colors.world-ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "{spacing.touch-min}"
  button-room-link-hover:
    backgroundColor: "{colors.world-ink}"
    textColor: "{colors.terrazzo-paper}"
    rounded: "{rounded.pill}"
  button-ghost-on-green:
    backgroundColor: "transparent"
    textColor: "{colors.window-glow}"
    rounded: "{rounded.pill}"
    height: "{spacing.touch-min}"
  status-pill:
    backgroundColor: "transparent"
    textColor: "{colors.world-muted}"
    typography: "{typography.world-status}"
    rounded: "{rounded.pill}"
  status-pill-live:
    backgroundColor: "{colors.tile-mint}"
    textColor: "{colors.world-ink}"
    typography: "{typography.world-status}"
    rounded: "{rounded.pill}"
  room-photo:
    rounded: "{rounded.photo}"
  ask-panel:
    backgroundColor: "{colors.grille-green}"
    textColor: "{colors.terrazzo-paper}"
    rounded: "{rounded.card}"
    padding: "24px"
  others-band:
    backgroundColor: "{colors.terrazzo-band}"
    textColor: "{colors.world-ink}"
  legacy-pill-primary:
    backgroundColor: "{colors.legacy-accent-text}"
    textColor: "{colors.on-photo}"
    typography: "{typography.legacy-body}"
    rounded: "{rounded.legacy-pill}"
    padding: "11px 22px"
    height: "{spacing.touch-min}"
  legacy-pill-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.legacy-accent-text}"
    typography: "{typography.legacy-body}"
    rounded: "{rounded.legacy-pill}"
    padding: "11px 22px"
  legacy-tile-white:
    backgroundColor: "{colors.legacy-canvas}"
    textColor: "{colors.legacy-ink}"
  legacy-tile-parchment:
    backgroundColor: "{colors.legacy-parchment}"
    textColor: "{colors.legacy-ink}"
  legacy-tile-dark:
    backgroundColor: "{colors.legacy-tile-dark}"
    textColor: "{colors.on-photo}"
  legacy-nav-dropdown:
    backgroundColor: "{colors.legacy-canvas}"
    textColor: "{colors.legacy-ink}"
    rounded: "{rounded.legacy-sm}"
---

# Design System: enGo Building World

> **Scope and precedence (merge, 2026-11-24).** This file has two layers. The **building world** (everything from Overview through Do's and Don'ts) governs the home-page hero (`BuildingHero.vue`), the solution rooms (`SolutionRooms.vue`), the `/solutions/*` pages (`solution.vue`, data in `src/data/solutions.json`) and the 解決方案 menu in `layout/header.vue`. The **Legacy Layer** at the end (Apple profile, adopted 2026-10-18, PR #61) still governs every home-page section below the rooms and every other page. The legacy sections migrate into the building world in later PRs; until a section migrates, it keeps legacy rules. Where the layers disagree, the Conflict Register at the start of the Legacy Layer says which wins and where.

## Overview

**Creative North Star: "The Lit Window"**

One ordinary tiled Taiwanese building at dusk holds every enGo solution, and the light behind a window is enGo. The system is photographic rather than illustrated: a full-bleed 16:9 dusk photograph with orange dots on four windows, then paper-coloured rooms that open each floor as a larger photograph beside a short list. Colour is sampled from the photograph (sky ink, window glow, mosaic tile, terrazzo, grille green) so interface and image read as one place. Type is Noto Sans TC set large, heavy at headline size and calm everywhere else.

The mood is quiet and domestic, never glossy. There is exactly one action colour, used rarely; nearly all structure is carried by photograph, paper ground, ink text and thin outlines. Depth comes from the photograph and from soft shadows under surfaces that rest on it (the desk card, label glass, room photos).

**Key Characteristics:**
- Photograph first: the hero stage keeps the photo's exact 16:9 ratio so window hotspots (percentage coordinates in `solutions.json`) stay on their windows.
- Dark dusk hero, warm terrazzo-paper rooms, grille-green accents; no white tile and no cool grey inside the world.
- One action colour (enGo orange), one ink (#1e2a25), one muted ink (#4a5650).
- Honesty is visual: every generated photo carries 示意圖; status is an outlined pill, "in use" is a mint pill.
- No text above headings. Role and product sit beneath the room title, never as a kicker.
- Motion is one authored moment (the windows light up in sequence) plus scroll-driven depth, on transform and opacity, and off under reduced motion.

## Colors

The palette is the photograph plus two neutrals: dusk and window light above, terrazzo and ink below.

### Primary
- **Window Light** (#f26b21, `{colors.window-light}`): the lit-window dot, its halo ring, the bullet before each room point. Always a non-text mark and always on a dark ground (6.17:1 on dusk ink). Never a text colour, never a fill under white text (3.04:1).
- **Action Orange** (#c94f12, `{colors.action}`): the only fill for primary buttons (開始諮詢, 送出諮詢). White label on it measures 4.55:1. Hover is **Burnt Orange** (#b3460f, `{colors.action-hover}`, 5.53:1 with white). #b3460f is also the text-link colour on paper (5.21:1).
- **Window Glow** (#ffd2a6, `{colors.window-glow}`): text on the dusk ground and on grille green: role names, the hint line, status pills on dark, ghost button outline (13.44:1 on dusk ink, 6.92:1 on grille green).

### Secondary
- **Grille Green** (#2f4a3e, `{colors.grille-green}`): the 鐵窗花 colour. The ask panel on solution pages and the "iron" role swatch. Paper text on it is 9.13:1.

### Tertiary (role swatches, from the mosaic tiles)
- **Tile Mint** (#7fb7a4, `{colors.tile-mint}`): 住戶 / home swatch, and the fill of the 已在用 (in use) pill.
- **Tile Butter** (#f2d37a, `{colors.tile-butter}`): 照護 / care swatch.
- **Tile Salmon** (#e7a596, `{colors.tile-salmon}`): 物業 / building swatch.
- **Tile Terrazzo** (#cfc7b8, `{colors.tile-terrazzo}`): 店家 / shop swatch.
- Swatches are 14px, 3px-radius squares beside a role name. They mark roles; they never fill a section and never carry text.

### Neutral
- **Dusk Ink** (#0b121c, `{colors.sky-ink}`): hero and photo-hero ground and scrim.
- **Terrazzo Paper** (#fbf8f2, `{colors.terrazzo-paper}`): the ground of the rooms and solution pages, and the desk card.
- **Terrazzo Band** (#e6e0d5, `{colors.terrazzo-band}`): the "other solutions" band that closes a solution page.
- **Floor Ink** (#1e2a25, `{colors.world-ink}`): all text on paper (14.02:1). Also the selected-chip fill and outline-button stroke.
- **Wall Muted** (#4a5650, `{colors.world-muted}`): role lines, status-pill text and outline on paper (7.24:1).
- **Label Glass** (rgba(8, 13, 18, 0.74), `{colors.label-glass}`): the blurred panel behind window labels on the photograph. A legibility device over photography only.

### Named Rules
**The Sampled Colour Rule.** A colour enters the world only if it can be found in the photograph (sky, window, tile, terrazzo, grille) or is ink on paper. New hues need a photographic source.

**The One Action Rule.** #c94f12 fills one primary action per surface and always carries a white label. Orange text on paper uses #b3460f. #f26b21 is light, not ink: it marks windows and bullets on dark grounds and is never set behind or as text.

## Typography

**Display, Body, Label Font:** Noto Sans TC (variable 300 to 700 from Google Fonts; fallback system-ui, -apple-system, BlinkMacSystemFont, sans-serif). One family only; set in `src/css/base/_typography.scss`, body 17px at 1.47 with -0.022em tracking.

**Character:** Heavy, close-set headlines (700, -0.02em) over a calm 400 body at generous line height (1.6 to 1.75). The weight contrast comes from 700 against 400 to 500, not from a second face.

### Hierarchy
- **Display** (700, `clamp(2rem, 4vw, 3.75rem)`, 1.14): hero headline, left over the dark sky, max 34vw wide (520px cap); solution page title uses `clamp(2rem, 4.4vw, 3.75rem)` at 1.16. Line breaks come from the data (`white-space: pre-line`), balanced with `text-wrap: balance`.
- **Heading** (700, `clamp(1.75rem, 3vw, 2.5rem)`, 1.25): the rooms section title.
- **Room title** (700, `clamp(1.6rem, 2.6vw, 2.35rem)`, 1.25): each room's headline beside its photo.
- **Section title** (700, 1.35rem): sub-heads on solution pages (points, products, ask, other solutions).
- **Lede** (400, `clamp(1rem, 1.25vw, 1.15rem)`, 1.75): hero and solution-page intro, max about 30 to 40em, 86 to 90% white on photo.
- **Point** (500, 1.05rem, 1.6): room and solution bullets.
- **Role** (700, 0.88rem): role name on a window label, in Window Glow.
- **Status** (700, 0.75rem): pill text; see Components.
- **Caption** (400, 0.75rem): the 示意圖 label on photographs, solid white on a 55% black pill.

### Named Rules
**The Inherit Rule.** Global `h1` to `h6` carry `color: #1d1d1f` (`_typography.scss`), which would make headings vanish on dusk and green. Every heading in a world component therefore sets `color: inherit`. Do the same for any new world heading.

**The No Kicker Rule.** No eyebrow, label or counter sits above a heading. The role-and-product line (`sr-who`) sits beneath the room title. The breadcrumb on solution pages is navigation and keeps its small size; it is not a kicker and must not take caps, tracking or accent colour.

## Layout

The home page opens on a **stage**: a 16:9 photograph at full width, never cropped taller, with the headline at left over the sky, window labels placed by percentage, and the desk card ("管理室") on the street. The rooms follow as a vertical sequence of two-column article rows (photo 1.15fr, text 1fr), alternating sides, 1248px max, with `clamp(56px, 8vw, 112px)` between rooms and `clamp(64px, 9vw, 120px)` above and below the section. Solution pages run hero (the room photo, or the dusk facade for 系統整合, min-height `min(78svh, 760px)`), then a 1.4fr / 1fr body (points beside the ask panel), then the terrazzo band of other solutions in an auto-fit grid (minimum 220px).

Responsive behaviour is a restructure, not a shrink:
- **1280px and up:** the desk card sits at street level, bottom right (left 68%, 380px max).
- **901 to 1279px:** the stage is short, so the desk moves to the quiet street under the headline and the headline moves to the top.
- **900px and below:** the stage dissolves (`display: contents`): the photo recropped to 4:3, words, desk (inside the first screen), a hint line, then the floors as a list of 44px-minimum rows with a 14px dot and a 76px right gutter that clears the floating chat button. Window labels and the scrim are hidden; the 示意圖 label sits at the photo's bottom right, below the fixed header. Rooms and solution bodies become one column, photo first. The photo's scroll-driven animation is disabled.
- **Header:** the global header is legacy chrome (white frosted bar). The 解決方案 dropdown lists the five areas as "area · product" plus a 產品與設備 link, using the legacy dropdown (white, 8px radius, hairline border, 14px text).

Spacing is generous and rhythmic: 12px between bullets, 14px to 18px inside stacked label content, 24px inside the ask panel. Content gutter is `clamp(20px, 6vw, 96px)`. Touch targets are 44px minimum on every action.

## Elevation & Depth

Hybrid: tonal ground change plus soft shadows beneath surfaces that rest on a photograph or on paper. No shadow decorates text, and none appears on flat paper rows.

### Shadow Vocabulary
- **Window dot** (`box-shadow: 0 0 0 6px rgba(242,107,33,.28), 0 6px 18px rgba(0,0,0,.35)`; hover ring widens to 10px at .32): a halo ring plus a drop, on the dark photograph only.
- **Label glass** (`box-shadow: 0 12px 30px rgba(0,0,0,.3)`, `backdrop-filter: blur(12px)`): window labels.
- **Desk card** (`box-shadow: 0 18px 44px rgba(0,0,0,.38)`): the 管理室 card resting on the street.
- **Room photo** (`box-shadow: 0 24px 48px -18px rgba(30,42,37,.45)`): the photo resting on paper.
- **Scrim** (linear gradient from dusk ink at .82 to 0 across the left 52% of the hero; bottom-up .05 to .82 on solution heroes): a legibility layer over photography only, never a background fill.

### Named Rules
**The Resting Surface Rule.** A shadow belongs only to a surface that sits on a photograph or paper (dot, label, desk, room photo). Flat rows, pills and bands carry none.

## Shapes

Soft and domestic, scaled by object size: swatches 3px, window labels 12px, the desk card 14px, the ask panel 16px, photographs 20px, every button, chip and status pill a full pill (999px), the window dot a circle. A hairline is an outline of the item's own ink (1px at 14% to 18% of Floor Ink for row dividers; 1px to 1.5px full-ink strokes on outline buttons and chips). Photographs are clipped to their radius with the image at `aspect-ratio: 3 / 2`; the hero stage itself is square-cornered and full bleed.

## Components

### Window Hotspot (signature)
A 22px Window Light dot with a 3px white border and halo, offset so its centre is on the window, followed by a Label Glass panel (240px or 16vw wide, 12px radius, 10px 14px padding) holding the role in Window Glow, one line in white, and the product in 82% white with an arrow. Hover or focus scales the dot to 1.15 and lifts the label 2px; focus adds a 2px Window Glow ring. The whole hotspot is one link to that floor's solution page. On load the dots scale in and the labels rise in sequence (0.22s stagger).

### Desk Card (管理室)
Terrazzo Paper card, 14px radius, ink text: bold title, a radio-group of area chips (pill, 1px ink at 50% outline, 0.8rem; selected fills Floor Ink with paper text), and the primary button. The chips are real radios (`role="radio"`, `aria-checked`).

### Buttons
- **Primary:** Action Orange fill, white 700 label, full pill, 44px minimum height, padding 0 22px (10px 22px in the desk). Hover Burnt Orange. Focus: 2px Floor Ink outline offset 3px on paper; 2px Window Glow offset 3px on grille green.
- **Room link (outline):** transparent, 1.5px Floor Ink stroke, Floor Ink label, 44px, padding 0 20px, trailing arrow. Hover fills Floor Ink with paper text (0.25s).
- **Ghost on green:** transparent, 1.5px Window Glow stroke and label; hover adds a 12% Window Glow wash.

### Status Pills (honesty convention)
Outlined, no fill, 1px stroke in the text colour, full pill, 0.75rem 700, no wrap. Colour is Wall Muted on paper and Window Glow on dark. They label **接受試點** (pilot), **開發中** (in development) and **依專案洽詢** (project-based). The exception is **已在用** (in use) on solution pages: a Tile Mint fill, Floor Ink text, no outline. In the room rows an in-use point carries no pill at all, so absence reads as "available now". Every other state must be visible in the pill, never softened by colour alone. Labels are localised in `solutions.json` (`statusLabel`).

### Room Row
Photo (20px radius, resting shadow, 示意圖 caption pill bottom right, `loading="lazy"`), beside the room title, the role-and-product line with its swatch, up to three points each led by an 8px Window Light dot, and the outline room link. Rows alternate sides; on phones the photo leads.

### Solution Page
Photo hero (系統整合, which has no floor of its own, uses the whole dusk facade) with breadcrumb, title, lede and a product-and-status line, then a points list ruled by 14% ink hairlines with a status pill per point, a product-link list (burnt-orange underlined links), the grille-green ask panel with the primary button and a LINE ghost button, and the terrazzo band of other areas, each led by its swatch.

### Honest Image Label (示意圖)
Every generated photograph carries the label 示意圖 (localised: Illustrative image, イメージ図, and so on) at 0.75rem, solid white on a rgba(0,0,0,.55) pill, in a corner of the photo, and the same words are appended to the image's alt text. Each shipped raster in `public/images/building/` has a `.webp.json` provenance sidecar recording the prompt and date. When a real photograph replaces a generated one, remove the label and the sidecar for that image.

### Navigation
The 解決方案 dropdown (see Layout) is the main entry into the world. The header itself is legacy chrome.

## Do's and Don'ts

### Do:
- **Do** set every world heading to `color: inherit`.
- **Do** keep orange as one fill (#c94f12, white label) per surface and as link text only at #b3460f on paper.
- **Do** put the 示意圖 label on every generated photograph, in its alt text and in a provenance sidecar.
- **Do** show pilot, in-development and project-based states as outlined pills and in-use as the mint pill.
- **Do** keep entry and scroll motion on `transform` and `opacity`, wrapped in `prefers-reduced-motion: no-preference`, with scroll-driven effects inside `@supports (animation-timeline: view())`.
- **Do** place hotspots by percentage on the exact 16:9 stage.
- **Do** keep every action at 44px or taller.

### Don't:
- **Don't** put a kicker, eyebrow, counter or caps label above a heading.
- **Don't** use Window Light (#f26b21) as text or under white text.
- **Don't** introduce a colour with no source in the photograph.
- **Don't** let a generated photo ship without 示意圖.
- **Don't** soften pilot, in-development or project-based states into an in-use look, or hide them.
- **Don't** fill a section with Label Glass or a scrim; they exist to keep text legible on a photograph.

### Defects the build carries (recorded, not canonized)
These exist in the code and are not rules for new surfaces:
- Status-pill sizes differ across surfaces (0.72rem 500 on hero labels, 0.75rem 700 in rooms, 0.8rem 700 on the solution hero). One size (0.75rem 700) is the token.
- The entry animation `bh-light` and the dot and label hover transitions animate `box-shadow` and `background-color`, not only `transform` and `opacity`.

## Legacy Layer: Apple profile (pending migration)

> **Status: legacy, still in force below the rooms and on all other pages.** Adopted 2026-10-18 (PR #61). It will be migrated into the building world in later PRs, section by section. Do not use these rules for the hero, solution rooms or `/solutions/*`; do use them for anything not yet migrated. Section grammar: `.hm-tile` edge-to-edge tiles, `clamp(64px, 9vw, 112px)` padding, `.hm-wrap` 1240px, tiles alternating white / parchment / dark.

### Conflict Register (merge resolutions, checked against code on 2026-11-24)

| # | Topic | Building world | Legacy layer | Resolution |
|---|---|---|---|---|
| 1 | Action colour | #c94f12 fill, #b3460f hover and link text; window light #f26b21 | #b8431f pill fill (5.44:1) and link text; hover `darken(#b8431f, 6%)` = #9e391b; #FE8B05 links on dark tiles | **Unresolved.** Two close oranges serve one role. World wins inside the world; legacy keeps its own until migration. Adopt #c94f12 / #b3460f site-wide when the last legacy tile migrates. |
| 2 | "Action Blue" #0066cc and SF Pro in the profile below | not present | The profile text names them, but code never uses them (see its own addendum) | Profile values were wrong for this site. Frontmatter now holds the real code values (`legacy-accent-text`, Noto Sans TC). Read the profile prose below as design intent only. |
| 3 | Headline weight | 700 | 600 (`-0.02em` to `-0.03em`) | Both are Noto Sans TC (variable 300 to 700 loaded). World 700, legacy 600, by zone. |
| 4 | Shadows | resting-surface shadows on dot, label, desk, room photo | "the ONLY shadow" is `$product-shadow` under device imagery | World may use its vocabulary; legacy tiles may not. |
| 5 | Gradients and glows | scrim gradient over photographs; halo ring on the dot | no gradients, no glows | Scrim and halo are world-only legibility devices; legacy bans stand elsewhere. |
| 6 | Coloured bands | grille-green ask panel; terrazzo band | no coloured section bands | World-only. |
| 7 | Grounds | paper #fbf8f2, terrazzo #e6e0d5, dusk #0b121c | white #fff, parchment #f5f5f7, dark #272729 | **Unresolved seam.** The rooms (paper #fbf8f2) are immediately followed by the legacy parchment tile (#f5f5f7): two near-identical light grounds, warm then cool. The first migrated section after the rooms should break the adjacency. |
| 8 | Header | the 解決方案 dropdown content only | white frosted bar, ink text, hairline | Header stays legacy chrome. |
| 9 | Headings colour | `color: inherit` required | `.hm-tile-dark .hm-h2 { color: #fff }` set locally | Both work around the same global `#1d1d1f` heading rule. |

The profile below is preserved from the previous DESIGN.md. Heading levels are demoted by one so it does not collide with the canonical order above, and `{token}` references now point to the `legacy-*` frontmatter keys where one exists (otherwise they appear in backticks as profile names with no code token).

### Overview

Apple's web presence is a masterclass in **reverent product photography framed by near-invisible UI**. Every page is a stack of edge-to-edge product "tiles" — alternating light and dark canvases, each centered on a hero headline, a one-line tagline, two tiny blue pill CTAs, and an impossibly crisp product render. Nothing competes with the product. Typography is confident but quiet; color is either pure white, an off-white parchment, or a near-black tile; interactive elements are a single, quiet blue.

Density is unusually low even by contemporary SaaS standards. Each tile occupies roughly one viewport, and there is no decorative chrome — no borders, no gradients, no decorative frames, no shadows on headlines. Elevation appears only when a product image rests on a surface (a single soft `rgba(0, 0, 0, 0.22) 3px 5px 30px` drop for visual weight). The result is a catalog that feels more like a museum gallery: the wall disappears and the artifact takes over.

Store and shop surfaces retain the same chassis but switch modes. The product configurator (iPhone 17 Pro, accessories grid) introduces a tight grid of white utility cards at `{rounded.legacy-lg}` (18px) radius with a thin border, paired with a persistent thin sub-nav strip. The environment page leans darker and more editorial. Across all five surfaces the typographic system, spacing rhythm, and the single blue accent are consistent — this is one design language expressed at different volumes.

**Key Characteristics:**
- Photography-first presentation; UI recedes so the product can speak.
- Alternating full-bleed tile sections: white/parchment ↔ near-black, with the color change itself acting as the section divider.
- Single blue accent (`{colors.legacy-accent-text}` — #b8431f (the profile said #0066cc)) carries every interactive element. No second brand color exists.
- Two button grammars: tiny blue pill CTAs (`{rounded.legacy-pill}`) and compact utility rects (`{rounded.legacy-sm}`).
- SF Pro Display + SF Pro Text — negative letter-spacing at display sizes for the signature "Apple tight" headline feel.
- Whisper-soft elevation used only when a product image needs to breathe — exactly one drop-shadow in the entire system.
- Tight two-row nav: slim ``profile:component.global-nav`` + product-specific ``profile:component.sub-nav-frosted`` with persistent right-aligned primary CTA.
- Section rhythm across multiple pages: light hero → dark product tile → light utility tile → dark tile → parchment footer — a predictable pulse.

### Colors

> **Source pages analyzed:** homepage, environment, store, iPhone 17 Pro buy page, accessories index. The color system is identical across all five surfaces; only the surface-mode mix differs.

#### Brand & Accent
- **Action Blue** (`{colors.legacy-accent-text}` — #b8431f (the profile said #0066cc)): The single brand-level interactive color. All text links, all blue pill CTAs ("Learn more", "Buy"), and the focus ring root. This is Apple's quiet but universal "click me" signal. Press state shifts to a slightly darker variant via the active scale transform rather than a hex change.
- **Focus Blue** (``profile:colors.primary-focus`` — #0071e3): A marginally brighter sibling of Action Blue, reserved for the keyboard focus ring on buttons (`outline: 2px solid`).
- **Sky Link Blue** (`{colors.legacy-accent-on-dark}` — #2997ff): A brighter blue used on dark surfaces for in-copy links and inline callouts, where Action Blue would disappear against the tile background.

#### Surface
- **Pure White** (`{colors.legacy-canvas}` — #ffffff): The dominant canvas. Content, utility cards, store tiles, configurator grids.
- **Parchment** (`{colors.legacy-parchment}` — #f5f5f7): The signature Apple off-white. Used for alternating light tiles, footer region, and the default page canvas in store utility sections. Just different enough from white to create rhythm.
- **Pearl Button** (``profile:colors.surface-pearl`` — #fafafc): A near-white used as the fill for secondary "ghost" buttons — lighter than the parchment canvas so the button still reads as a button against `{colors.legacy-parchment}`.
- **Near-Black Tile 1** (`{colors.legacy-tile-dark}` — #272729): The primary dark-tile surface on the homepage product grid.
- **Near-Black Tile 2** (`{colors.legacy-tile-dark-2}` — #2a2a2c): A micro-step lighter — used where a dark tile sits directly above or below Tile 1 to create the faintest separation.
- **Near-Black Tile 3** (``profile:colors.surface-tile-3`` — #252527): A micro-step darker — used at the bottom of the stack and in embedded video/player frames.
- **Pure Black** (``profile:colors.surface-black`` — #000000): Reserved for true void — video player backgrounds, edge-to-edge photographic overlays, the global nav bar background.
- **Translucent Chip Gray** (``profile:colors.surface-chip-translucent`` — #d2d2d7): The base hex of the translucent gray chip used over photography for circular control buttons. In production, applied at ~64% alpha as `rgba(210, 210, 215, 0.64)`.

#### Text
- **Near-Black Ink** (`{colors.legacy-ink}` — #1d1d1f): The voice of every headline, every body paragraph, and the dark utility button's fill. Chosen instead of pure black to keep the page feeling photographic rather than printed.
- **Body** (`{colors.legacy-ink}` — #1d1d1f): Same hex as ink — Apple uses one near-black tone for all text on light surfaces.
- **Body On Dark** (``profile:colors.body-on-dark`` — #ffffff): All text on dark tiles and on the global nav bar.
- **Body Muted** (`{colors.legacy-on-dark-muted}` — #cccccc): Secondary copy on dark tiles where pure white would be too loud.
- **Ink Muted 80** (`{colors.legacy-ink-80}` — #333333): Body text on the white Pearl Button surface — slightly softer than pure black.
- **Ink Muted 48** (`{colors.legacy-ink-48}` — #7a7a7a): Disabled button text and legal fine-print.

#### Hairlines & Borders
- **Divider Soft** (``profile:colors.divider-soft`` — #f0f0f0): The "border" tone on secondary buttons — functions as a ring shadow rather than a hard line. In production, often applied as `rgba(0, 0, 0, 0.04)`.
- **Hairline** (`{colors.legacy-hairline}` — #e0e0e0): The 1px hairline border on store utility cards and configurator chips.

#### Brand Gradient
**No decorative gradients.** Atmospheric depth on product photography (the iPhone 17 Pro camera plate, the Apple Watch bands, AirPods reflections) is inherent to the imagery, not a CSS gradient overlay. The environment page's hero uses photographic atmosphere (mountain vista at dawn) but no gradient tokens are defined. Apple is the rare luxury-brand site with zero gradient-based design tokens.

### Typography

#### Font Family
- **Display**: `SF Pro Display, system-ui, -apple-system, sans-serif` — Apple's proprietary display face, optimized for sizes ≥ 19px. Defines the voice of every headline.
- **Body / UI**: `SF Pro Text, system-ui, -apple-system, sans-serif` — the text-optimized variant used for body copy, captions, buttons, and links below 20px.
- **OpenType features**: `font-variant-numeric: numerator` is enabled on numeric links (pricing tables, spec sheets). Display sizes rely on tight tracking rather than contextual ligatures.

#### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| ``profile:typography.hero-display`` | 56px | 600 | 1.07 | -0.28px | Hero headline; the signature "Apple tight" tracking |
| ``profile:typography.display-lg`` | 40px | 600 | 1.10 | 0 | Tile headlines atop every product tile |
| ``profile:typography.display-md`` | 34px | 600 | 1.47 | -0.374px | Section heads (SF Pro Text at display proportions) |
| ``profile:typography.lead`` | 28px | 400 | 1.14 | 0.196px | Product tile subcopy |
| ``profile:typography.lead-airy`` | 24px | 300 | 1.5 | 0 | Environment-page lead paragraphs (the rare weight 300) |
| ``profile:typography.tagline`` | 21px | 600 | 1.19 | 0.231px | Sub-tile tagline; sub-nav category name |
| ``profile:typography.body-strong`` | 17px | 600 | 1.24 | -0.374px | Inline strong emphasis |
| ``profile:typography.body`` | 17px | 400 | 1.47 | -0.374px | Default paragraph |
| ``profile:typography.dense-link`` | 17px | 400 | 2.41 | 0 | Footer / store utility link lists (relaxed leading) |
| ``profile:typography.caption`` | 14px | 400 | 1.43 | -0.224px | Secondary captions, button text |
| ``profile:typography.caption-strong`` | 14px | 600 | 1.29 | -0.224px | Emphasized captions |
| ``profile:typography.button-large`` | 18px | 300 | 1.0 | 0 | Store hero CTAs (the rare weight 300) |
| ``profile:typography.button-utility`` | 14px | 400 | 1.29 | -0.224px | Utility/nav button labels |
| ``profile:typography.fine-print`` | 12px | 400 | 1.0 | -0.12px | Fine-print, footer body |
| ``profile:typography.micro-legal`` | 10px | 400 | 1.3 | -0.08px | Micro legal disclaimers |
| ``profile:typography.nav-link`` | 12px | 400 | 1.0 | -0.12px | Global nav menu items |

#### Principles

- **Negative letter-spacing at display sizes.** Every headline at 17px and up carries a slight tracking tighten (`-0.12 → -0.374px`). This produces the iconic "Apple tight" headline cadence. Never used at 12px or below.
- **Body copy at 17px, not 16px.** Apple breaks the SaaS convention and runs paragraph text at 17px. The extra pixel gives the page an unmistakable "reading, not scanning" pace.
- **Weight 300 is real and rare.** Used deliberately on a handful of large-size reads (``profile:typography.button-large`` at 18px/300 and ``profile:typography.lead-airy`` at 24px/300). It's not an accident — it's a light-atmosphere cue reserved for moments where the content should feel airy.
- **Weight 600, not 700, for headlines.** Apple's headlines sit at weight 600. Weight 700 is used sparingly for ``profile:typography.tagline`` (21px) when a touch more assertion is needed.
- **Line-height is context-specific.** Display sizes use 1.07–1.19 (tight). Body uses 1.47. Utility link stacks in the footer/store use an unusually relaxed 2.41 (``profile:typography.dense-link``). The 2.41 is not a bug — it's how the footer's dense link columns breathe.
- **Weight 500 is deliberately absent.** The ladder is 300 / 400 / 600 / 700. Mid-weight readings always use 600.

#### Note on Font Substitutes
SF Pro is Apple's proprietary system font. When building off-system:

- Use `system-ui, -apple-system, BlinkMacSystemFont` as the first stack entry — on macOS/iOS/Safari this resolves to the real SF Pro.
- For non-Apple platforms, **Inter** (Google Fonts, variable) is the closest open-source equivalent. Inter at weight 600 with `font-feature-settings: "ss03"` approximates SF Pro's rounded "a" character.
- Nudge `letter-spacing` down by `-0.01em` on display sizes to re-create the Apple tight feel; Inter's default tracking runs slightly wider than SF Pro.
- For body text, tighten line-height by `0.03` (from 1.47 → 1.44) when substituting Inter — Inter's taller x-height needs less leading.

### Layout

#### Spacing System
- **Base unit:** 8px. Sub-base values (2, 4, 5, 6, 7) are used for tight typographic adjustments; structural layout snaps to 8/12/16/20/24.
- **Tokens:** ``profile:spacing.xxs`` 4px · ``profile:spacing.xs`` 8px · ``profile:spacing.sm`` 12px · ``profile:spacing.md`` 17px · ``profile:spacing.lg`` 24px · ``profile:spacing.xl`` 32px · ``profile:spacing.xxl`` 48px · ``profile:spacing.section`` 80px.
- **Section vertical padding:** ``profile:spacing.section`` (80px) inside a product tile; tiles stack edge-to-edge with 0 gap (the color change provides the break).
- **Card padding:** ``profile:spacing.lg`` (24px) inside utility grid cards.
- **Button padding:** 8–11px vertical, 15–22px horizontal.
- **Universal rhythm constants:** the 17px body line-height multiplier (~25px line) and 21px tagline size show up on every analyzed page.

#### Grid & Container
- **Max content width:** ~980px on text-heavy sections (environment), ~1440px on product grids (store, accessories), full-bleed for product tiles (homepage).
- **Column patterns:** 3 to 5 column utility card grid on store/accessories; 2-column side-by-side tiles on homepage occasional sections; single-column centered stack on product tile heroes.
- **Gutters:** 20–24px between cards in a utility grid.

#### Whitespace Philosophy
Apple's whitespace is the product's pedestal. Every tile begins with at least 64px of air above its headline and 48–64px below. Product renders are never crowded; the nearest content to a product image is at least 40px away. The footer is the only area that breaks this — there, Apple goes deliberately dense to make the full information architecture visible at a glance.

### Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Full-bleed tiles, global nav, footer, body sections |
| Soft hairline | 1px `rgba(0, 0, 0, 0.08)` border | Utility cards, sub-nav frosted-glass separator |
| Backdrop blur | `backdrop-filter: blur(N)` on Parchment 80% | Sub-nav and the iPhone buy floating sticky bar |
| Product shadow | `rgba(0, 0, 0, 0.22) 3px 5px 30px 0` | Product renders resting on a surface (the only true "shadow" in the system) |

**Shadow philosophy.** Apple uses **exactly one** drop-shadow, and it is applied to photographic product imagery — never to cards, never to buttons, never to text. Elevation in the UI comes from (a) surface-color change (light tile ↔ dark tile) and (b) backdrop-blur on sticky bars. The single shadow is about giving the product weight, not about UI hierarchy.

#### Decorative Depth
- **Atmospheric imagery** on the environment page (photographic vista) supplies mood; no CSS gradient involved.
- **Edge-to-edge tile alternation** creates rhythm without borders or shadows — the color change itself is the divider.
- **Backdrop-filter blur** on ``profile:component.sub-nav-frosted`` and ``profile:component.floating-sticky-bar`` creates a "floating over content" effect that's functional, not decorative.

### Shapes

#### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| ``profile:rounded.none`` | 0px | Full-bleed product tiles (no corner rounding) |
| ``profile:rounded.xs`` | 5px | Inline links when styled as subtle chips (rare) |
| `{rounded.legacy-sm}` | 8px | Dark utility buttons (Sign In, Bag), inline card imagery |
| ``profile:rounded.md`` | 11px | White Pearl Button capsules |
| `{rounded.legacy-lg}` | 18px | Store utility cards, accessories grid cards |
| `{rounded.legacy-pill}` | 9999px | Primary blue pill CTAs, sub-nav buy button, configurator option chips, search input — the signature Apple pill |
| `{rounded.legacy-pill}` | 9999px / 50% | Circular control chips floating over photography |

#### Photography Geometry
- **Hero imagery**: full-bleed, 21:9 or taller on the homepage; 16:9 on environment and shop pages. Product renders are photographic-realistic, often shot on a tinted surface that becomes the tile background.
- **Product renders**: PNG/WebP with transparency; rest on a surface tile and pick up the system shadow.
- **Accessory grid**: square 1:1 crops at `{rounded.legacy-lg}` (18px) radius, light neutral backgrounds, product centered with 20–40px internal padding.
- **No rounded imagery in hero tiles** — images are full-bleed rectangular. Rounding (`{rounded.legacy-sm}`, `{rounded.legacy-lg}`) appears only on inline card imagery.
- Lazy-loading via responsive `srcset` and `sizes` across all breakpoints; CDN-optimized WebP.

### Components

#### Top Navigation

**`global-nav`** — Persistent, ultra-thin black nav bar pinned to the top of every page. Background ``profile:colors.surface-black``, height 44px, text `{colors.on-photo}` in ``profile:typography.nav-link`` (12px / 400 / -0.12px tracking). Links are quiet, spaced ~20px apart, running edge-to-edge across the top. Right-aligned cluster: Search, Bag icons — always visible. On mobile, collapses to hamburger at ~834px and the Apple logo centers.

**`sub-nav-frosted`** — Surface-specific nav that sticks below the global nav. Background `{colors.legacy-parchment}` at 80% opacity with backdrop-filter blur, creating a frosted-glass effect. Height 52px. Content on left: product category name ("iPhone", "Store", "Accessories") in ``profile:typography.tagline`` (21px / 600). Content right: inline nav links in ``profile:typography.button-utility`` (14px), ending in a persistent ``profile:component.button-primary`` ("Buy") or a utility link.

#### Buttons

**`button-primary`** — The signature Apple action. Background `{colors.legacy-accent-text}` (Action Blue #b8431f (the profile said #0066cc)), text `{colors.on-photo}` in ``profile:typography.body`` (SF Pro Text 17px / 400), rounded `{rounded.legacy-pill}` (full pill — capsule-shaped), padding 11px × 22px. The full-pill radius IS the brand action signal.
- Active state: ``profile:component.button-primary-active`` — `transform: scale(0.95)` (the system-wide micro-interaction).
- Focus state: ``profile:component.button-primary-focus`` — 2px solid ``profile:colors.primary-focus`` outline.

**`button-secondary-pill`** — Used as the second CTA when two blue pills appear together ("Learn more" / "Buy"). Background transparent, text `{colors.legacy-accent-text}`, 1px solid `{colors.legacy-accent-text}` border, rounded `{rounded.legacy-pill}`, padding 11px × 22px. Reads as a "ghost pill."

**`button-dark-utility`** — Global nav actions (Sign In, Bag, language selector). Background `{colors.legacy-ink}` (#1d1d1f), text `{colors.on-photo}` in ``profile:typography.button-utility`` (14px / 400 / -0.224px tracking), rounded `{rounded.legacy-sm}` (8px), padding 8px × 15px. Active state shrinks via `transform: scale(0.95)`.

**`button-pearl-capsule`** — Product-card secondary button. Background ``profile:colors.surface-pearl`` (#fafafc), text `{colors.legacy-ink-80}` in ``profile:typography.caption`` (14px), 3px solid ``profile:colors.divider-soft`` border (functions as a soft ring rather than a visible line), rounded ``profile:rounded.md`` (11px), padding 8px × 14px.

**`button-store-hero`** — A larger primary CTA used on store hero surfaces. Same Action Blue + Paper White as ``profile:component.button-primary``, but with ``profile:typography.button-large`` (18px / 300 — note the rare weight 300) and slightly more padding (14px × 28px). Used sparingly on the store landing.

**`button-icon-circular`** — Floats over photography. 44 × 44px, background ``profile:colors.surface-chip-translucent`` at ~64% alpha, icon in `{colors.legacy-ink}`, rounded `{rounded.legacy-pill}`. Used for carousel controls, close buttons, and in-image controls (product image thumbnails on the iPhone buy page).

**`text-link`** — Inline body links in `{colors.legacy-accent-text}` (Action Blue). Underlined or non-underlined per context.

**`text-link-on-dark`** — Inline body links on dark tiles in `{colors.legacy-accent-on-dark}` (Sky Link Blue #2997ff) — Action Blue would disappear against `{colors.legacy-tile-dark}`.

#### Cards & Containers

**`product-tile-light`** — Full-bleed light tile. Background `{colors.legacy-canvas}` (white), text `{colors.legacy-ink}`, rounded ``profile:rounded.none`` (0 — tiles touch edges), vertical padding ``profile:spacing.section`` (80px). Centered stack: product name in ``profile:typography.display-lg`` (40px / 600) → one-line tagline in ``profile:typography.lead`` (28px / 400) → two ``profile:component.button-primary`` CTAs ("Learn more" / "Buy") → product render resting on the surface with the system shadow.

**`product-tile-parchment`** — Same as ``profile:component.product-tile-light`` but on `{colors.legacy-parchment}` (#f5f5f7). Used to break two consecutive white tiles.

**`product-tile-dark`** — Full-bleed dark tile. Background `{colors.legacy-tile-dark}` (#272729), text `{colors.on-photo}`, rounded ``profile:rounded.none``, vertical padding ``profile:spacing.section`` (80px). Same content stack as the light tile but with ``profile:component.text-link-on-dark`` for inline copy and ``profile:component.button-primary`` (Action Blue still works on the dark surface). Used on the homepage product grid as the alternating dark band.

**`product-tile-dark-2`** — Variant on `{colors.legacy-tile-dark-2}` (#2a2a2c). Used where a dark tile sits directly above or below ``profile:component.product-tile-dark`` to create the faintest separation through micro-step lightness change.

**`product-tile-dark-3`** — Variant on ``profile:colors.surface-tile-3`` (#252527). Used at the bottom of the stack and in embedded video/player frames.

**`store-utility-card`** — Used in store grid and accessories grid. Background `{colors.legacy-canvas}` (white), 1px solid `{colors.legacy-hairline}` border, rounded `{rounded.legacy-lg}` (18px), padding ``profile:spacing.lg`` (24px). Top: product image (1:1 crop with `{rounded.legacy-sm}` (8px) inner image radius). Below: product name in ``profile:typography.body-strong`` (17px / 600), price in ``profile:typography.body`` (17px / 400), and a ``profile:component.text-link`` ("Buy" or "Learn more"). No shadow by default; product render itself carries the system product-shadow.

**`configurator-option-chip`** — Pill-shaped tappable cell used in the iPhone 17 Pro buy page. Background `{colors.legacy-canvas}`, text `{colors.legacy-ink}` in ``profile:typography.caption``, rounded `{rounded.legacy-pill}`, padding 12px × 16px. Contains a small product thumbnail + label + price delta. Arranged in a grid of 4–5 options per row.

**`configurator-option-chip-selected`** — Selected state. Border upgrades to 2px solid ``profile:colors.primary-focus``. Same shape, same content.

**`environment-quote-card`** — A photographic-canvas hero specific to the environment page. Dark photographic backdrop (mountain vista at dawn) with `{colors.legacy-tile-dark}` as the fallback color, centered white-text headline in ``profile:typography.display-lg`` (40px), small green "Apple 2030" pictographic logo above the headline, single ``profile:component.button-primary`` below. Padding ``profile:spacing.section`` (80px).

**`floating-sticky-bar`** — Floats at the bottom of the viewport on the iPhone 17 Pro buy page during scroll. Background `{colors.legacy-parchment}` at 80% opacity with `backdrop-filter: blur(N)`, height 64px, padding 12px × 32px. Left: running price total in ``profile:typography.body``. Right: ``profile:component.button-primary`` ("Add to Bag").

#### Inputs & Forms

**`search-input`** — The accessories search input. Background `{colors.legacy-canvas}`, text `{colors.legacy-ink}` in ``profile:typography.body`` (17px), 1px solid `rgba(0, 0, 0, 0.08)` border, rounded `{rounded.legacy-pill}` (full pill — search is also pill-shaped, matching the CTA grammar), padding 12px × 20px, height 44px. Leading icon: search glyph at 14px, muted tint.

Error and validation states were not surfaced in the analyzed pages.

#### Footer

**`footer`** — Background `{colors.legacy-parchment}` (#f5f5f7), text `{colors.legacy-ink-80}`. Link columns in ``profile:typography.dense-link`` (17px / 400 / 2.41 line-height — the relaxed leading is what makes the dense columns scannable). Column headings in ``profile:typography.caption-strong`` (14px / 600). Legal row at the very bottom in ``profile:typography.fine-print`` (12px / 400) with `{colors.legacy-ink-48}` text. Vertical padding 64px.

### Do's and Don'ts

#### Do
- Use `{colors.legacy-accent-text}` (Action Blue #b8431f (the profile said #0066cc)) for every interactive element — links, pill CTAs, focus signals — and nothing else. The single accent is non-negotiable.
- Set headlines in ``profile:typography.hero-display`` or ``profile:typography.display-lg`` with negative letter-spacing (`-0.28 → -0.374px`) to get the signature "Apple tight" cadence.
- Run body copy at ``profile:typography.body`` (17px / 400 / 1.47 / -0.374px) — not 16px. The extra pixel defines the brand's reading pace.
- Alternate ``profile:component.product-tile-light`` (or parchment) and ``profile:component.product-tile-dark`` for full-bleed section rhythm. The color change IS the divider.
- Reserve `{rounded.legacy-pill}` for the primary blue CTA and any other element that should read as an "action" (configurator chips, search input, sticky bar CTA).
- Apply the single product-shadow (`rgba(0, 0, 0, 0.22) 3px 5px 30px`) only to product renders resting on a surface — never on cards, buttons, or text.
- Use `transform: scale(0.95)` as the active/press state on every button — it's the system-wide micro-interaction.
- Keep the global nav ``profile:colors.surface-black`` (true black) — it's the only place pure black appears on most pages.

#### Don't
- Don't introduce a second accent color; every "click me" signal is `{colors.legacy-accent-text}` (Action Blue).
- Don't add shadows to cards, buttons, or text — shadow is reserved for product imagery.
- Don't use gradients as decorative backgrounds; atmosphere comes from photography.
- Don't set body copy at weight 500 — Apple's ladder is 300 / 400 / 600 / 700, with 500 deliberately absent. Body is always 400; strong inline is 600; display is 600.
- Don't round full-bleed tiles — tiles are rectangular and edge-to-edge; the color change is the divider.
- Don't tighten line-height below 1.47 for body copy — the editorial leading is part of the brand.
- Don't mix radii grammars — use `{rounded.legacy-sm}` for compact utility, `{rounded.legacy-lg}` for utility cards, `{rounded.legacy-pill}` for pills, and nothing in between (except the rare ``profile:rounded.md`` Pearl Button).
- Don't use `{colors.legacy-accent-on-dark}` (Sky Link Blue) on light surfaces — it's the dark-tile-only variant. Action Blue is for light surfaces.

### Responsive Behavior

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Small phone | ≤ 419px | Single-column tiles; sub-nav collapses to category name + primary CTA only; hero typography drops to 28px |
| Phone | 420–640px | Single-column stack; product renders scale to 80% of tile width; hero h1 drops to 34px |
| Large phone | 641–735px | Tiles transition to tighter padding (48px vertical vs 80px); fine-print wraps |
| Tablet portrait | 736–833px | Global nav collapses to hamburger; sub-nav hides category chips, keeps primary CTA |
| Tablet landscape | 834–1023px | Global nav returns fully expanded; 3-column utility grids become 2-column |
| Small desktop | 1024–1068px | Product tiles use 2/3 width with margin gutters; hero h1 stays at 40px |
| Desktop | 1069–1440px | Full layout; 4–5 column store grids; 1440px content max |
| Wide desktop | ≥ 1441px | Content locks at 1440px, margins absorb extra width |

The structural breakpoints that matter for agents: 1440px (content lock), 1068px (small-desktop), 833px (tablet landscape switch), 734px (tablet portrait), 640px (phone), 480px (small phone).

#### Touch Targets
- Minimum 44 × 44px. ``profile:component.button-primary`` lands at ~44 × 100px (with the full-pill radius making the visible hit area more generous than the label suggests).
- ``profile:component.button-icon-circular`` is exactly 44 × 44px.
- Global nav utility links are smaller (~32 × 80px) — they deliberately sit at a tighter target because they're precision desktop actions, and the mobile hamburger replaces them at ≤ 833px.

#### Collapsing Strategy
- **Global nav**: full horizontal link row on desktop → collapses to Apple logo + hamburger + bag icon at 834px and below.
- **Sub-nav**: category name + inline links + primary CTA → category name + primary CTA only at mobile; inline links move into a hamburger tray.
- **Product tiles**: stack from 2-column to 1-column at 834px; vertical padding tightens from 80px → 48px at small-phone.
- **Utility grids** (store, accessories): 5-col → 4-col (1440px) → 3-col (1068px) → 2-col (834px) → 1-col (640px).
- **Hero typography**: ``profile:typography.hero-display`` (56px) → ``profile:typography.display-lg`` (40px) at 1068px → 34px at 640px → 28px at 419px.

#### Image Behavior
- All product imagery uses responsive `srcset` with breakpoint-matched crops.
- Hero photography may switch art direction at mobile (e.g., the environment page's vista crops to a taller aspect ratio on mobile, framing the subject differently).
- Product renders maintain their 1:1 or 4:3 aspect ratios across breakpoints; only scale changes.
- Lazy-loading is default; the above-fold hero loads eagerly.

### Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key directly (``profile:component.product-tile-dark``, ``profile:component.search-input``).
2. Variants of an existing component (`-active`, `-focus`, `-2`, `-3`) live as separate entries in `components:`.
3. Use `{token.refs}` everywhere — never inline hex.
4. Never document hover. Default and Active/Pressed states only.
5. Display headlines stay SF Pro Display 600 with negative letter-spacing. Body stays SF Pro Text 400 at 17px. The boundary is unbreakable.
6. The single drop-shadow (`rgba(0, 0, 0, 0.22) 3px 5px 30px`) is reserved for product photography only.
7. When in doubt about emphasis: alternate surface (light → dark tile) before adding chrome.

### Known Gaps

- Form validation and error states were not surfaced on the analyzed pages; only the neutral search input is documented.
- The homepage's embedded video/player frame uses ``profile:colors.surface-black``; interior player controls are not documented (they're a platform widget, not a web-design token).
- Some component imagery is dynamic (rotating product hero) and its specific copy varies per surface — component specs name the structure, not the rotating content.
- Dark-mode counterparts for store and accessories utility cards were not surfaced on the analyzed pages; the system documented is the daytime/light-dominant variant Apple ships by default.
- Atmospheric photography (environment page mountain vista) is a content asset, not a design token; the documented ``profile:component.environment-quote-card`` describes the structural surface only.
- The exact backdrop-filter blur radius on ``profile:component.sub-nav-frosted`` and ``profile:component.floating-sticky-bar`` is platform-dependent; production CSS uses `saturate(180%) blur(20px)` as a typical baseline but the value isn't formalized as a token.

---

### enGo addendum (adopted 2026-10-18, Sean: "apple.com as reference, consistent fonts, one accent")

This file is the design contract for www.smtengo.com. The Apple profile above supplies layout, rhythm, type ladder, elevation and the do/don't lists. These substitutions are mandatory:

| Profile token | enGo value (src/css/utils/_variables.scss) | Note |
|---|---|---|
| `{colors.legacy-accent-text}` Action Blue | `$brand-orange-text` #b8431f for pill fills and links on light surfaces; `$orange2` #FE8B05 for links on dark tiles | Never Apple blue. Never `$brand-orange` #e05a35 under white text (3.7:1). |
| `{colors.legacy-ink}` | `$ink` #1d1d1f | all headings and body on light surfaces |
| `{colors.legacy-ink-80}` | `$ink-80` #333333 | secondary / captions / fine print (AA) |
| `{colors.legacy-ink-48}` | `$ink-48` #7a7a7a | disabled text only |
| `{colors.legacy-parchment}` | `$parchment` #f5f5f7 | alternating light tile, cards, footer |
| `{colors.surface-tile-1/2}` | `$tile-dark` #272729 / `$tile-dark-2` #2a2a2c | dark tiles |
| `{colors.legacy-hairline}` | `$hairline` #e0e0e0 | 1px border on utility cards (radius 18) only |
| `{colors.legacy-on-dark-muted}` | `$on-dark-muted` #cccccc | secondary text on dark tiles |
| SF Pro Display / Text | `$display-font` Noto Sans TC: 600 display with `letter-spacing: -.02em` to `-.03em`, 400 body 17px / 1.47 / `-.022em`, 300 for airy leads | Noto Serif TC is retired site-wide. index.html loads 300/400/500/600/700. |
| product shadow | `$product-shadow` | the only shadow allowed; device / product imagery resting on a surface |

Section grammar (copy the homepage, src/views/index.vue): `.hm-tile` = edge-to-edge tile, `clamp(64px, 9vw, 112px)` vertical padding, content in a 1240px `hm-wrap`, centered head (`h2` + lead), then the section's own composition. Tiles alternate white / parchment / dark; never two of the same in a row. No gradient backgrounds, no grain, no glows, no card shadows, no coloured section bands, no teal (`$signal`/`$gold`) or navy (`$grey-blue*`) as colour: navy only survives where it is a brand mark (logo, favicon). Device frames: the brushed-titanium `metal-frame` mixin from the homepage with `$product-shadow`.

Keep untouched: routes, nav labels, tracking attributes (`data-track`, `trackEvent`), i18n keys, copy facts (KB-001 A.17), the `designTells.test.ts` guards (no `$t('brandJournal')` eyebrows above page titles, no 01/02/03 counters, no kicker pills, no `tag` class on product, no `business-model-icon`), no vendor names, no Alexa, no 建案 names on the homepage.
