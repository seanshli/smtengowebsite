---
version: 1
slug: "src-views-index-vue"
primary_target: "src/views/index.vue"
related_targets: ["src/views/product.vue"]
---

# Surface brief: home (/) and solution pages

Scope: home page plus the solution pages (/solutions/home, /solutions/building, /solutions/care, /solutions/shop, /solutions/integration). Visitor mode: Persuade.
Audience: residents, developers / 管委會 / 物業, care operators, merchants and dealers. Job: see that daily life or operations get easier, find their area, then ask.
Action: the enquiry ("Tell us your building / site / store"), pre-set to the chosen area; LINE and phone beside it.
Proof: real app, tablet and Care screens; showrooms; cases with place names. BMS is described as taking pilot projects and integration as project-based; no AI claims except live ones.
Navigation: 「解決方案」 is the main menu (Sean 2026-11-24): Home / Building and 物業 / Care / Shop and channel, plus System integration. Products sit under each solution as "what it runs on".
Unresolved: hospital wording, dealer and enGo 幣 switch states, team photos and consent.

## Direction contract

Revised 2026-11-24 after Sean rejected the illustrated comp ("it is NOT animation.. should be more realistic view") and approved the photoreal comp in Figma (file z1gXkFOsiVNEpsl3PEKL0T, frames 24:176 and 24:234: "go ahead, keep generated photos for now").

THESIS: One ordinary Taiwanese mixed-use building already holds every enGo solution: the corner shop, the homes upstairs, the lobby desk, the day-care floor. enGo is the light behind the windows. Refuses the hero-plus-four-cards solutions grid.
OWN-WORLD: Photographic, not illustrated. A dusk photograph of a tiled 4-storey building with 鐵窗花 grilles; generated photos labelled 示意 until real ones exist. Colours come from the photo: dusk ink #0b121c, window glow #ffd2a6, terrazzo paper #fbf8f2, ink #1e2a25, grille green #2f4a3e, with mint/butter/salmon tile swatches as role markers. Window light, enGo orange #f26b21 / action #c94f12, is the only action colour. Noto Sans TC, set large and calm.
STORY: The visitor sees their own building, finds their floor (their role), reads what gets easier, opens that floor's room photo and solution page, and asks at the 管理室 desk.
FIRST VIEWPORT: A full-bleed dusk photo of the building at exactly 16:9. Four lit windows carry orange dots with blurred labels (role, one line about what gets easier, product). The headline 「讓日子更輕鬆，就藏在您已經有的地方。」 sits left over the dark sky. The 管理室 desk card holds the primary action 「開始諮詢」 with an area picker: at street level right from 1280 px, under the words from 901 to 1279 px. Mobile: photo, then words, then the floors as a list, then the desk.
FORM: candidate 5 of 7 (Taiwanese tiled facade), realised photographically. seed:130e16ea617dc346. Signature interaction: the windows light up one after another on load; each lit window opens its role's solution page. Motion grammar: light and depth (dot scale-in and label rise; scroll-driven photo depth and copy lift; room photos settle on scroll), transform and opacity only, all off under reduced motion.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
