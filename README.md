# Tesla Model 3 — Static Landing Page

Figma design-ийн дагуу угсарсан static HTML/CSS website. Одоогийн байдлаар ямар ч motion, animation, transition, JavaScript interaction ороогүй — цэвэр бүтэц, semantic HTML, plain CSS.

Figma source: https://www.figma.com/design/Xz1OJJ6NSkKJRZKcuSO52F/Student-work?node-id=491-221

## Файлын бүтэц

```
project/
├── assets/
│   ├── images/     # Photographic assets (hero, product cards, map, etc.)
│   └── icons/      # SVG icons (slider arrows, stat badges)
├── index.html
├── styles.css
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

## Хэрэглээ

`index.html`-г шууд browser дээр нээх, эсвэл static server ажиллуулах (жишээ нь `npx serve .`).
