# Tesla Model 3 — Static Landing Page

Figma design-ийн дагуу угсарсан static HTML/CSS website. Үндсэн бүтэц нь цэвэр semantic HTML + plain CSS; motion/interaction-уудыг тусад нь, бүтцийг эвдэхгүйгээр давхарлаж нэмдэг (доор "Motion enhancements" хэсгийг үзнэ үү).

Figma source: https://www.figma.com/design/Xz1OJJ6NSkKJRZKcuSO52F/Student-work?node-id=491-221

## Файлын бүтэц

```
project/
├── assets/
│   ├── images/     # Photographic assets (hero, product cards, map, etc.)
│   └── icons/      # SVG icons (slider arrows, stat badges)
├── index.html
├── styles.css
├── motion-magnetic-button.css   # opt-in enhancement, see below
├── motion-magnetic-button.js    # opt-in enhancement, see below
├── motion-spotlight-hover.css   # opt-in enhancement, see below
├── motion-spotlight-hover.js    # opt-in enhancement, see below
├── motion-morphing-tabs.css     # opt-in enhancement, see below
├── motion-morphing-tabs.js      # opt-in enhancement, see below
└── README.md
```

## Section-ийн жагсаалт (Figma frame дараалалтай ижил)

1. **Navbar** — logo, 5 nav link, primary CTA button
2. **Hero (Header)** — Model 3 full-bleed image, heading, subtitle, 2 CTA
3. **Full Self-Driving feature card** — text/stat block + image, split card
4. **Product slider #1** — 3 vehicle cards (Model Y L, Model 3, Model Y), horizontally scrollable, dots + arrow controls
5. **Offers / Inventory** — 2-column info card row
6. **Map / Contact** — full-width map image card
7. **Stats ("Find Your Charge")** — text block + 2 stat counters with icons
8. **Product slider #2** — 2 energy product cards (Solar Panels, Powerwall)
9. **Footer** — divider + link row

## Дизайны tokens

Бүх өнгө, фонт, spacing, radius утгуудыг Figma variables-аас шууд CSS custom properties болгон `:root`-д тодорхойлсон (`styles.css` эхэнд):

- Colors: `--color-royal-blue`, `--color-scheme-1-*`, `--color-scheme-3-*`
- Typography: Manrope font, heading/text scale (`--heading-1` … `--heading-6`, `--text-small` … `--text-medium`)
- Layout: `--page-padding` (64px), `--container-large` (1280px), `--section-padding-large` (112px)
- Radius: `--radius-large` (8px)

## Motion-д бэлэн байдал

- Section бүр `class`-аараа тодорхой ялгагдана (`.hero`, `.fsd-card`, `.product-slider`, `.stats`, гэх мэт) — тиймээс шинэ motion/animation-ийг тухайн class дээр чөлөөтэй нэмж болно.
- Slider-ууд (`.product-slider__track`) одоогоор CSS `overflow-x: auto` scroll ашигладаг — JS-т суурилсан carousel behavior-оор сольж болно (dots/arrows аль хэдийн markup дотор бэлэн байгаа, зөвхөн `aria-label`-тай `<button>` тул click handler холбоход бэлэн).
- Bounding structure (container/section hierarchy) өөрчлөгдөхгүйгээр `transition`, `@keyframes`, `IntersectionObserver`-based reveal, зэргийг чөлөөтэй нэмж болно.
- Comment эсвэл inline style нэмэгдээгүй — цэвэр static markup учир aggresive өөрчлөлт хийхэд саад болохгүй.

## Motion enhancements

### Magnetic Button (`motion-magnetic-button.css` / `.js`)

Cursor товчны influence area-д ороход товчийг pointer руу зөөлөн татдаг, `pointerleave` үед 420–520ms spring-overshoot-той анхны байрлалд буцдаг interaction. Зөвхөн `[data-motion-target~="magnetic-button"]` attribute-тай element-үүдэд үйлчилнэ (одоогоор бүх `.btn`).

- Dependency-гүй, vanilla JS. `requestAnimationFrame` + `transform` (`translate3d`) л ашигладаг.
- X/Y тэнхлэг тус бүр хамгийн ихдээ ±8px, товчны label 40% parallax-аар дагана.
- `prefers-reduced-motion: reduce` эсвэл coarse/touch pointer үед бүрэн идэвхгүй (script эхэндээ л буцна, ямар ч listener бүртгэгдэхгүй).
- Click behavior, keyboard focus, accessible name, хэмжээс өөрчлөгдөөгүй — зөвхөн `transform` нэмэгддэг тул reflow/layout shift үүсгэхгүй.
- **Бүрэн тусгаарлагдсан**: `index.html`-аас `motion-magnetic-button.css`-ийн `<link>`, `motion-magnetic-button.js`-ийн `<script>` мөрүүдийг устгаад (эсвэл 2 файлыг устгаад) сайт яг анхны static байдалдаа буцна — `data-motion-target` attribute үлдсэн ч байсан engine байхгүй бол ямар ч нөлөө үзүүлэхгүй.

### Spotlight Hover (`motion-spotlight-hover.css` / `.js`)

Cursor card-ын дотор шилжихэд pointer-ийг дагасан зөөлөн `radial-gradient` glow гарч ирдэг interaction. Зөвхөн `[data-motion-target~="spotlight-hover"]` attribute-тай card-уудад үйлчилнэ (одоогоор `.fsd-card`, `.info-card` × 2, `.product-card` × 5).

- Dependency-гүй, vanilla JS. Spotlight нь card-ын `::after` pseudo-element дээр `radial-gradient` background-аар render хийгддэг, `pointer-events: none`, card-ын `overflow: hidden`/`border-radius`-аар автоматаар clip хийгдэнэ (markup-д нэмэлт element нэмэгддэггүй).
- Pointer байрлалыг `--spot-x` / `--spot-y` CSS custom property-оор (идэвхтэй card-тай харьцуулсан normalized %) дамжуулдаг, ~260px radius.
- Opacity variant: `data-motion-target="spotlight-hover spotlight-image"` → 0.16 (зурагтай card), `data-motion-target="spotlight-hover spotlight-light"` → 0.08 (цайвар/foreground card) — `--spot-opacity` custom property-оор удирддаг.
- Fade-in 180ms, fade-out 300ms, CSS `transition: opacity` ашигладаг (давхар/permanent glow, нэмэлт border үүсгэдэггүй).
- Update бүрийг нэг `requestAnimationFrame` дотор coalesce хийдэг: бүх card-ын `getBoundingClientRect()` read эхэлж уншигдаад, дараа нь class/style write хийгддэг тул нэг frame дотор давхар layout thrashing үүсгэхгүй. Нэг удаад зөвхөн нэг card идэвхтэй байна.
- Touch/coarse pointer болон `prefers-reduced-motion: reduce` үед `::after`-ийг бүрэн `display: none` болгодог тул анхны static харагдац хэвээр үлдэнэ.
- **Бүрэн тусгаарлагдсан**: `motion-spotlight-hover.css`/`.js`-ийн `<link>`/`<script>` мөрүүд эсвэл 2 файлыг устгавал card-уудын markup, хэмжээс, өнгө, image crop бүгд яг хэвээрээ анхны static байдалдаа буцна.

### Morphing Tabs — shared-layout indicator (`motion-morphing-tabs.css` / `.js`)

Inventory card дотор "New" / "Pre-Owned" хоёр товчийг accessible tablist болгосон interaction. Сонгогдсон tab-ын ард нэг shared white pill indicator `translate` + `scale`-ээр morph хийж шилждэг (width/left animation ашигладаггүй). Зөвхөн `[data-motion-target~="morphing-tabs-shared-layout"]` attribute-тай `role="tablist"` element-үүдэд үйлчилнэ.

- Dependency-гүй, vanilla JS. Indicator нь 1×1px үндсэн хэмжээтэй `<span class="tabs__indicator">`, сонгогдсон tab-ын bounding box-ыг `scale(w, h) translate(x, y)`-аар дуурайдаг — width/left recalculation хийдэггүй тул reflow-гүй, GPU-friendly.
- Markup: `role="tablist"` container, тус бүр нь `role="tab"`, `aria-selected`, `id`/`aria-controls` (`#inventory-panel`-руу), `tabindex` (сонгогдсон нь `0`, бусад нь `-1`) бүхий `<button>`. Panel нь `role="tabpanel"` + `aria-labelledby`-ийг сонголт бүрт шинэчилдэг.
- Keyboard: `ArrowLeft`/`ArrowRight` (wrap-аар зэргэлдээ tab руу), `Home`/`End` (эхний/сүүлийн tab руу) — сонгосон tab шууд focus авна (roving tabindex pattern).
- Default сонголт: **New** (`aria-selected="true"`, indicator анхны paint-д шууд байрлана, transition-гүйгээр).
- Timing: indicator transition 400ms `cubic-bezier(.22,1,.36,1)` (360–440ms хязгаарт), сонгогдсон label-ийн emphasis (opacity+color) 160ms crossfade (140–180ms хязгаарт).
- `ResizeObserver`-оор tablist болон tab бүрийг ажиглаж, хэмжээ өөрчлөгдвөл (жишээ нь mobile breakpoint дээр tab-ууд full-width болох үед) indicator-ийг animation-гүйгээр шууд дахин байрлуулдаг.
- `prefers-reduced-motion: reduce` үед indicator transition-гүйгээр шууд сонгогдсон байрлал руу шилждэг (`transition-duration: 0s`), label crossfade мөн идэвхгүй.
- Focus-ийг royal-blue `outline` (`:focus-visible`)-ээр харуулдаг, эргэн тойрны card content (heading, text, image) хөдлөхгүй.
- **Бүрэн тусгаарлагдсан**: `motion-morphing-tabs.css`/`.js`-ийн `<link>`/`<script>` мөрүүд эсвэл 2 файлыг устгавал tab-ууд энгийн (indicator-гүй, `aria-selected` toggle-гүй) товч хэлбэрээрээ үлдэнэ — markup дахь `role`/`aria-*` attribute-ууд өөрөө хор хөнөөлгүй, зөвхөн CSS/JS engine байхгүй бол тэдгээр нь нөлөөгүй болно.

## Хэрэглээ

`index.html`-г шууд browser дээр нээх, эсвэл static server ажиллуулах (жишээ нь `npx serve .`).
