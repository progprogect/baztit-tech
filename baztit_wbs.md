# Baztit Tech Website — Work Breakdown Structure (WBS)
> Project: baztit.tech landing + solutions page  
> Hosting: Railway · Stack: Vanilla JS / HTML / CSS + Node.js/Express  
> March 2026

---

## WBS Summary

| Phase | Tasks | Est. Hours |
|---|---|---|
| 1. Setup & Architecture | 4 tasks | 3–4 h |
| 2. Base Styles & Design System | 5 tasks | 4–6 h |
| 3. WOW Visual Effects | 12 tasks | 10–16 h |
| 4. Landing Page Blocks | 13 blocks | 14–20 h |
| 5. Solutions Page | 4 tasks | 4–6 h |
| 6. Backend & Form | 3 tasks | 2–3 h |
| 7. Railway Deployment | 4 tasks | 2–3 h |
| 8. QA & Performance | 5 tasks | 4–6 h |
| **TOTAL** | | **43–64 h** |

---

## Phase 1 — Project Setup & Architecture

### 1.1 Repository & Structure
- [ ] Create GitHub repository `baztit-tech`
- [ ] Initialize `package.json` with `name`, `version`, `engines: { node: ">=18" }`
- [ ] Add `express` dependency, `.gitignore`, `README.md`
- [ ] Create folder structure:
  ```
  /public/index.html
  /public/solutions.html
  /public/css/main.css
  /public/js/main.js
  /public/js/three-scene.js
  /public/assets/
  server.js
  package.json
  ```

### 1.2 Express Server (Railway-ready)
- [ ] Write `server.js`:
  - `express.static('public')`
  - Catch-all route → `index.html`
  - `PORT = process.env.PORT || 3000`
- [ ] Test locally: `npm start` → `localhost:3000` serves `index.html`

### 1.3 HTML Scaffolding
- [ ] `index.html` — semantic structure with all `<section id="">` anchors
- [ ] `solutions.html` — page scaffold with filter and cards grid
- [ ] Add all `<meta>` tags (OG, description, title, viewport)
- [ ] Link CSS, CDN scripts in correct order (Fonts → Three.js → GSAP → Lenis → main.js)

### 1.4 CDN Libraries Integration
- [ ] Verify all CDN links load without errors:
  - Google Fonts: Unbounded + Manrope
  - Three.js r128 (Cloudflare CDN)
  - GSAP 3.12.5 + ScrollTrigger (Cloudflare CDN)
  - Lenis 1.1.14 (jsDelivr CDN)
- [ ] `gsap.registerPlugin(ScrollTrigger)` in `main.js`
- [ ] Initialize Lenis + connect to GSAP ticker

---

## Phase 2 — Design System & Base Styles

### 2.1 CSS Variables (Design Tokens)
- [ ] Define all `:root` CSS variables:
  - Backgrounds: `--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--bg-glass`
  - Accents: `--accent` (#E8FF47), `--accent2` (#FF5C3A), `--accent3` (#00E5FF)
  - Typography: `--text-primary`, `--text-muted`, `--text-faint`
  - Borders: `--border`, `--border-hover`
  - Spacing scale: `--space-xs` through `--space-xxl`
  - Radius: `--radius-sm`, `--radius-md`, `--radius-lg`

### 2.2 Typography Scale
- [ ] Apply Unbounded to all headings (H1–H4)
- [ ] Apply Manrope to body, labels, buttons
- [ ] Set fluid type scale using `clamp()`:
  - H1: `clamp(42px, 7vw, 88px)`
  - H2: `clamp(28px, 4vw, 52px)`
  - H3: `clamp(20px, 2.5vw, 28px)`
  - Body: `clamp(15px, 1.1vw, 18px)`
- [ ] Section tag style (uppercase, tracked, muted, small)

### 2.3 Base Components
- [ ] `.btn-primary` — accent background, dark text, hover lift + glow shadow
- [ ] `.btn-secondary` — ghost border, hover fill
- [ ] `.section-tag` — `// label` style, muted color, mono uppercase
- [ ] `.glass-card` — glassmorphism base (backdrop-filter, border, border-radius)
- [ ] `.badge` — inline pill (free / paid variants)

### 2.4 Layout System
- [ ] Max-width container: `1140px`, centered, responsive padding
- [ ] CSS Grid utility classes for 2-col, 3-col, bento layouts
- [ ] Mobile-first breakpoints: 480 / 768 / 1024 / 1280px

### 2.5 Global Resets & Accessibility
- [ ] CSS reset (box-sizing, margin, padding)
- [ ] `scroll-behavior: smooth` (as CSS fallback; Lenis handles runtime)
- [ ] Focus styles for keyboard navigation
- [ ] `@media (prefers-reduced-motion: reduce)` — disable all animations

---

## Phase 3 — WOW Visual Effects

### 3.1 Three.js Hero Particle Field
- [ ] Create `three-scene.js`
- [ ] Set up Scene, Camera (PerspectiveCamera, FOV 75), Renderer (WebGLRenderer, alpha: true)
- [ ] Create `BufferGeometry` with 3000 particles in random sphere distribution
- [ ] Set particle material: `PointsMaterial`, size 0.015, color `#00E5FF`, transparent, opacity 0.6
- [ ] Animation loop: slow rotation + drift on Y axis
- [ ] Mouse move listener: calculate normalized mouse XY → apply subtle distortion to particle positions
- [ ] Resize handler: update camera aspect + renderer size
- [ ] **Mobile:** reduce to 1000 particles below 768px
- [ ] **Accessibility:** skip entire Three.js init if `prefers-reduced-motion: reduce`

### 3.2 GSAP Counter Animation (Hero Stats)
- [ ] Wrap stat values in `<span class="counter" data-target="50">`
- [ ] GSAP tween: `innerText` 0 → target, duration 2s, `ease: "power2.out"`, `snap: 1`
- [ ] ScrollTrigger: `trigger: ".hero-numbers"`, `start: "top 80%"`, `once: true`
- [ ] Stagger 0.15s between each counter

### 3.3 GSAP Scroll Reveal — Fade Up
- [ ] Add `.reveal` class to all section headings, body text, images
- [ ] Add `.reveal-stagger` to card grids
- [ ] GSAP batch: `fromTo({ y: 40, opacity: 0 }, { y: 0, opacity: 1 })`, stagger 0.1s
- [ ] ScrollTrigger: `start: "top 85%"`, `once: true`

### 3.4 Headline Word-by-Word Animation
- [ ] Split H1 text into `<span>` per word (manual or via JS `split(' ')`)
- [ ] Wrap each word in `<span class="word"><span class="word-inner">text</span></span>`
- [ ] GSAP: `y: "110%", opacity: 0` → `y: "0%", opacity: 1`, stagger 0.08s, duration 0.9s
- [ ] Trigger on page load (not scroll), 300ms delay after DOMContentLoaded

### 3.5 Typewriter Effect (Hero Subheadline)
- [ ] Plain JS typewriter: iterate characters, append to DOM, 35ms interval
- [ ] Start after headline animation completes (1200ms delay)
- [ ] Add blinking cursor `|` that disappears after typing is done
- [ ] **Accessibility:** show full text immediately if `prefers-reduced-motion`

### 3.6 Custom Magnetic Cursor
- [ ] Create `<div class="cursor-dot">` and `<div class="cursor-ring">` in HTML
- [ ] CSS: `position: fixed`, `pointer-events: none`, `z-index: 9999`
- [ ] JS: Track `mousemove`, update dot position directly (no lag)
- [ ] Ring: lerp to mouse position at 0.1 factor via `requestAnimationFrame`
- [ ] Hover state: add `.cursor-hover` class on interactive elements → ring scales to 48px
- [ ] `mix-blend-mode: difference` on cursor dot for inversion effect
- [ ] Hide on mobile (touch devices)

### 3.7 Lenis Smooth Scroll Setup
- [ ] Initialize: `new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10*t)) })`
- [ ] Connect: `lenis.on('scroll', ScrollTrigger.update)`
- [ ] Add to GSAP ticker: `gsap.ticker.add(time => lenis.raf(time * 1000))`
- [ ] `gsap.ticker.lagSmoothing(0)`
- [ ] Test: all anchor links still work with Lenis active

### 3.8 Horizontal Scroll — Case Studies (GSAP Pin)
- [ ] Wrap cases in `.cases-section` (outer) + `.cases-track` (inner flex container)
- [ ] Cards: fixed width `380px`, no shrink
- [ ] GSAP ScrollTrigger:
  ```javascript
  gsap.to(".cases-track", {
    x: () => -(casesTrack.scrollWidth - window.innerWidth + 96),
    ease: "none",
    scrollTrigger: {
      trigger: ".cases-section",
      pin: true, scrub: 1,
      start: "top top",
      end: () => `+=${casesTrack.scrollWidth - window.innerWidth}`
    }
  });
  ```
- [ ] Mobile breakpoint (`<768px`): disable horizontal scroll, show vertical stack

### 3.9 Glassmorphism Cards
- [ ] Apply `.glass-card` CSS to: pain cards, team cards, solution preview cards
- [ ] Base: `background: rgba(255,255,255,0.04)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.08)`
- [ ] Hover: `border-color: rgba(232,255,71,0.3)`, `transform: translateY(-6px)`, `background: rgba(255,255,255,0.07)`
- [ ] Transition: `0.3s ease` on all properties
- [ ] Test on Safari (add `-webkit-backdrop-filter`)

### 3.10 CSS Grain / Noise Overlay
- [ ] Add `body::before` with SVG fractalNoise data URI
- [ ] `position: fixed`, `inset: 0`, `pointer-events: none`, `z-index: 9999`, `opacity: 0.035`
- [ ] Test: doesn't interfere with click events or scroll

### 3.11 Infinite Marquee Ticker
- [ ] HTML: `.ticker-wrap > .ticker-track` with items duplicated (2× for seamless loop)
- [ ] CSS: `animation: marquee 18s linear infinite`
- [ ] Content: `CUSTOM SOFTWARE · NO SUBSCRIPTIONS · PROTOTYPE FIRST · PAY AFTER · 10+ YEARS IN IT · 50+ PROJECTS SHIPPED · FROM $300 ·`
- [ ] Pause on hover: `animation-play-state: paused` on `.ticker-wrap:hover .ticker-track`

### 3.12 Animated Progress Bars (About Section)
- [ ] Three bars: "Architecture & Systems", "AI & Automation", "Delivery Speed"
- [ ] HTML: `<div class="bar" data-width="95">` etc.
- [ ] GSAP: animate `width` from `0%` to `data-width%` on ScrollTrigger enter
- [ ] Accent color fill with label + percentage counter

---

## Phase 4 — Landing Page Blocks

> One task per block. Each task = write HTML + CSS + wire up JS animations.

### 4.1 NAV
- [ ] HTML: `<nav>` with logo, menu links, CTA button
- [ ] CSS: fixed positioning, transparent → frosted glass on scroll (JS class toggle)
- [ ] JS: `window.addEventListener('scroll', ...)` → toggle `.scrolled` class
- [ ] Mobile: hamburger menu (CSS-only or minimal JS toggle)

### 4.2 HERO (Block 01)
- [ ] Three.js canvas as absolute background
- [ ] Badge, H1 (word spans), subheadline (typewriter target), CTA buttons
- [ ] Stats row with counter spans
- [ ] Scarcity line with blinking dot
- [ ] Layout: min-height 100vh, flexbox centered content

### 4.3 TICKER (Block 02)
- [ ] Full-width accent strip between hero and pain section
- [ ] Dark text on `--accent` background

### 4.4 PAIN SECTION (Block 03)
- [ ] Section tag + headline
- [ ] 3-column grid of 6 cards (2-col on tablet, 1-col on mobile)
- [ ] Each card: icon, bold title, description
- [ ] Stagger fade-up reveal

### 4.5 ABOUT US (Block 04)
- [ ] Two-column layout: text left, stats/bars right
- [ ] 3 body paragraphs
- [ ] 4 differentiator bullets with icons
- [ ] 3 animated progress bars (Effect 3.12)

### 4.6 HOW WE WORK (Block 05)
- [ ] 4-step horizontal flow (desktop: inline, mobile: stacked)
- [ ] Step number (large, faded), badge (FREE / PAID), title, description
- [ ] Quote callout box (accent-bordered)
- [ ] Step connector lines (CSS ::after)

### 4.7 CASE STUDIES (Block 06)
- [ ] Pinned section wrapper + horizontal scrolling track
- [ ] 5 case cards (380px wide, glassmorphism)
- [ ] "Notable Projects" collapsible or logo grid below
- [ ] Mobile: vertical stack

### 4.8 WHAT WE BUILD (Block 07)
- [ ] CSS Grid bento layout with `grid-template-areas`
- [ ] 4 cards: large featured (custom dev), 3 smaller
- [ ] Hover: card lifts + accent border glow

### 4.9 READY SOLUTIONS PREVIEW (Block 08)
- [ ] 2×2 card grid (4 cards)
- [ ] Each card: icon, name, description, price, hover state
- [ ] CTA link to /solutions

### 4.10 TEAM (Block 09)
- [ ] 4 cards (Nikita, Vitaly, Julia, UX Partners)
- [ ] Card: name, role, bio, key projects (for Nikita)
- [ ] Stagger reveal on scroll

### 4.11 OFFER + SCARCITY (Block 10)
- [ ] Centered section, max-width 800px
- [ ] 3 guarantee tiles (side by side)
- [ ] Scarcity box with pulsing dot animation (CSS `@keyframes pulse`)
- [ ] CTA button to form

### 4.12 COMPARISON TABLE (Block 11)
- [ ] Responsive HTML table
- [ ] Header row: empty, Baztit Tech (accent), Agencies (muted)
- [ ] ✓ green for us, ✗ strikethrough for them
- [ ] Mobile: scroll-x on table

### 4.13 CONTACT FORM (Block 12)
- [ ] Form fields: name, contact, select, textarea
- [ ] Formspree POST action (placeholder ID)
- [ ] Submit button with loading state (spinner) + success state
- [ ] Client-side validation (required fields, non-empty)
- [ ] Accessible: `<label for>`, error messages, `aria-required`

### 4.14 FOOTER (Block 13)
- [ ] Logo + tagline, contact links, nav links, copyright
- [ ] Mobile: stacked layout

---

## Phase 5 — Solutions Page (/solutions)

### 5.1 Page Hero
- [ ] Headline + subheadline
- [ ] No Three.js (keep page light); subtle CSS animated gradient background instead

### 5.2 Category Filter
- [ ] Horizontal pill filter: All / AI Agents / CRM / Analytics / Bots / Integrations
- [ ] JS filter: toggle `.active` on pills, show/hide cards by `data-category` attribute
- [ ] Smooth show/hide: GSAP `fromTo` opacity + y on filter change

### 5.3 Solutions Grid
- [ ] 3-column grid (2 on tablet, 1 on mobile)
- [ ] 6 starter cards with all fields
- [ ] `Learn More` → modal popup with expanded description
- [ ] Modal: accessible (focus trap, ESC to close, aria-modal)

### 5.4 Bottom CTA
- [ ] "Don't see what you need?" section
- [ ] Link to index.html#contact
- [ ] Footer (same as index.html, shared component via JS include or copy)

---

## Phase 6 — Backend & Form

### 6.1 Formspree Setup
- [ ] Create Formspree account, add new form
- [ ] Get form endpoint URL
- [ ] Replace placeholder `action` in HTML with real Formspree URL
- [ ] Configure redirect to `?success=true` or use AJAX submit
- [ ] Test: submit form → email arrives at progprogect@gmail.com

### 6.2 AJAX Form Submission
- [ ] Replace default form submit with `fetch()` POST to Formspree
- [ ] On success: animate button to success state, show thank-you message
- [ ] On error: show error message, re-enable submit button
- [ ] Loading state: disable button, show spinner during request

### 6.3 Form Validation
- [ ] Required fields: name, contact, task description
- [ ] Inline error messages (below each field)
- [ ] Validate on blur + on submit attempt
- [ ] Clear errors on successful re-input

---

## Phase 7 — Railway Deployment

### 7.1 Railway Project Setup
- [ ] Create new Railway project
- [ ] Connect GitHub repository
- [ ] Set deployment: auto-deploy on push to `main`
- [ ] Verify `PORT` env var is automatically set by Railway

### 7.2 Build & Start Config
- [ ] Confirm `package.json` has `"start": "node server.js"`
- [ ] Confirm `package.json` has `"engines": { "node": ">=18.0.0" }`
- [ ] No Dockerfile needed (Railway detects Node.js automatically)
- [ ] Test: Railway build succeeds, no missing dependency errors

### 7.3 Custom Domain
- [ ] Add `baztit.tech` domain in Railway project settings
- [ ] Update DNS: CNAME `baztit.tech` → Railway-provided domain
- [ ] Verify HTTPS auto-provisioned by Railway (Let's Encrypt)
- [ ] Test: https://baztit.tech loads correctly

### 7.4 Environment Variables
- [ ] `NODE_ENV=production` — set in Railway dashboard
- [ ] Formspree endpoint: no secret needed (client-side)
- [ ] Verify `process.env.PORT` is used in `server.js`

---

## Phase 8 — QA & Performance

### 8.1 Cross-Browser Testing
- [ ] Chrome (latest) — all effects work
- [ ] Firefox (latest) — backdrop-filter, Three.js, GSAP
- [ ] Safari (latest) — `-webkit-backdrop-filter`, cursor behavior
- [ ] Edge (latest) — full pass
- [ ] Mobile Chrome (Android) — Three.js disabled/reduced, cursor hidden
- [ ] Mobile Safari (iOS) — scroll behavior, form usability

### 8.2 Responsive Testing
- [ ] 375px (iPhone SE) — all blocks readable, no overflow
- [ ] 768px (iPad) — grid collapses correctly
- [ ] 1024px — desktop layout kicks in
- [ ] 1440px+ — max-width container, no stretched layouts
- [ ] Horizontal scroll cases: only on desktop, vertical on mobile

### 8.3 Performance Audit (Lighthouse)
- [ ] Run Lighthouse on Railway-deployed URL
- [ ] Target: Performance ≥ 90 desktop / ≥ 80 mobile
- [ ] Optimize: compress images (WebP), minify CSS/JS if needed
- [ ] Check: Three.js particle count, GSAP animation count
- [ ] Check: font `display: swap` active

### 8.4 Accessibility Audit
- [ ] Run axe DevTools or WAVE on both pages
- [ ] Fix any critical WCAG AA violations
- [ ] Keyboard navigation: Tab through all interactive elements
- [ ] Screen reader: all images have `alt`, form fields have labels
- [ ] `prefers-reduced-motion`: test with OS setting → all animations off

### 8.5 Form End-to-End Test
- [ ] Submit form on production Railway URL
- [ ] Verify email received at progprogect@gmail.com
- [ ] Test with missing required fields → validation errors shown
- [ ] Test success state renders correctly
- [ ] Test error state (disconnect network) → graceful error message

---

## Timeline Estimate

| Phase | Who | Days |
|---|---|---|
| Phase 1: Setup | Nikita | 0.5 |
| Phase 2: Design System | Nikita / Vitaly | 0.5–1 |
| Phase 3: WOW Effects | Nikita / Vitaly | 2–3 |
| Phase 4: Landing Blocks | Vitaly + Julia (copy review) | 3–4 |
| Phase 5: Solutions Page | Vitaly | 1 |
| Phase 6: Form / Backend | Nikita | 0.5 |
| Phase 7: Railway Deploy | Nikita | 0.5 |
| Phase 8: QA | All | 1–2 |
| **Total** | | **9–13 working days** |

> If using AI-assisted generation (Cursor), Phase 3–4 can be compressed to 3–5 days with prompt-driven iteration.

---

## Definition of Done

A task is **done** when:
1. Code is committed to `main` branch
2. Feature works on Railway production URL
3. Responsive on mobile and desktop
4. No console errors
5. Passes accessibility check for that component
6. Reviewed by at least one other team member (or self-reviewed after 24h)
