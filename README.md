# Tesla Model 3 — Next.js + Tailwind

Next.js (App Router) + TypeScript + Tailwind CSS v4 дээр угсарсан landing page. Анх static HTML/CSS/vanilla-JS байдлаар хийгдсэн байсан бөгөөд компонент болон hook болгон дахин загварчилсан. Figma source: https://www.figma.com/design/Xz1OJJ6NSkKJRZKcuSO52F/Student-work?node-id=491-221

## Ажиллуулах

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run lint
```

## Бүтэц

```
src/
├── app/
│   ├── layout.tsx        # Manrope font, Cal.com embed, scroll progress bar
│   ├── page.tsx           # section-уудыг угсрах
│   └── globals.css        # Tailwind theme tokens + motion-эффектийн CSS
├── components/
│   ├── Navbar.tsx, Hero.tsx, FsdCard.tsx, ProductSlider.tsx,
│   │   InfoRow.tsx, InventoryTabs.tsx, MapSection.tsx,
│   │   StatsSection.tsx, Footer.tsx
│   ├── MagneticLink.tsx    # useMagneticButton-той <a> wrapper
│   ├── SpotlightCard.tsx   # useSpotlightHover-той card wrapper
│   ├── ScrollProgressBar.tsx
│   └── CalEmbed.tsx        # Cal.com element-click embed script
├── hooks/
│   ├── useMagneticButton.ts
│   ├── useSpotlightHover.ts
│   ├── useMorphingTabs.ts
│   └── useScrollProgress.ts
└── lib/cal.ts              # Cal.com линк/тохиргоо, data-cal-* attribute helper
public/assets/               # Figma-аас гаргасан зураг, icon-ууд
```

## Дизайны tokens

`src/app/globals.css`-ийн `@theme` блок дотор Tailwind v4-ийн CSS-based тохиргоогоор тодорхойлогдсон: өнгө (`royal-blue`, `neutral-darkest`, scheme-1/3 background-foreground-border), Manrope фонт, heading/text хэмжээнүүд. Эдгээрээс Tailwind автоматаар `bg-royal-blue`, `text-neutral-darkest` мэт utility class үүсгэдэг.

## Motion эффектүүд

Эх static төслийн 4 vanilla-JS enhancement-ийг React hook болгож хөрвүүлсэн — бүгд `prefers-reduced-motion` болон `pointer: fine`-ийг хүндэтгэдэг:

- **`useMagneticButton`** — товч дээр pointer ойртоход зөөлөн татагдаж, гарахад spring-overshoot-той буцдаг.
- **`useSpotlightHover`** — card дээгүүр хулгана хөдлөхөд радиал gradient spotlight дагадаг (бүх card-ыг нэг window listener-ээр төвлөрүүлж хянадаг).
- **`useMorphingTabs`** — "New / Pre-Owned" tab хооронд shared-layout indicator шилжинэ (click + keyboard navigation дэмждэг).
- **`useScrollProgress`** — хуудасны дээд хэсэгт scroll явцын тууз зурдаг, time-bounded ease-тэй.

## Цаг захиалгын холбоос (Cal.com)

`src/lib/cal.ts`-д Cal.com-ийн линк болон namespace тодорхойлогдсон. `calTriggerProps()`-ийг `data-cal-*` attribute болгон "Жолоодож үзэх" товчнуудад дамжуулснаар Cal.com-ийн element-click embed (`CalEmbed.tsx`, `layout.tsx`-д ачаалагдана) тэдгээрийг дарахад popup цаг захиалгын цонх нээдэг.
