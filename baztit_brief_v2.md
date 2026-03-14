# Baztit Tech — Landing Page Brief (v2.0)
> Full content plan + visual/interaction specification for site generation  
> Version 2.0 · March 2026 · Hosting: Railway · Language: English

---

## Meta Information

| Field | Value |
|---|---|
| Company | Baztit Tech |
| Domain | baztit.tech |
| Hosting | **Railway** (Node.js + Express serving static files) |
| Primary Language | English |
| Telegram | @volknick |
| WhatsApp | +375255092206 |
| Email | progprogect@gmail.com |
| Pages | `index.html` (main landing) + `solutions.html` (catalog) |
| Tone | Conversational, empathetic, direct. Human — not corporate. |

---

## Railway Deployment Setup

### Project Structure
```
baztit-tech/
├── package.json
├── server.js          ← Express server
├── public/
│   ├── index.html
│   ├── solutions.html
│   ├── css/
│   │   └── main.css
│   ├── js/
│   │   ├── main.js
│   │   └── three-scene.js
│   └── assets/
│       ├── fonts/
│       └── images/
└── .gitignore
```

### server.js (Express static server)
```javascript
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### package.json
```json
{
  "name": "baztit-tech",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": { "node": ">=18.0.0" },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

### Railway Config
- **Start command:** `npm start`
- **Build command:** `npm install`
- **Environment variable:** `PORT` is auto-set by Railway
- **No Dockerfile needed** — Railway detects Node.js automatically

---

## 2026 UX/UI Design Principles Applied

Based on current research, these trends are integrated throughout:

| Trend | How Applied |
|---|---|
| **Immersive 3D / WebGL** | Three.js particle field in hero; interactive rotating geometry |
| **Glassmorphism 2.0** | Frosted glass cards with subtle backdrop-blur and borders |
| **GSAP ScrollTrigger** | Scroll-driven reveals, counters, parallax, pinned sections |
| **Bento Grid Layout** | Services and team sections use modular bento-style blocks |
| **Kinetic / Expressive Typography** | Hero headline splits and animates word-by-word |
| **Custom Cursor** | Magnetic cursor with blend-mode difference |
| **Horizontal Scroll Panel** | Case studies section scrolls horizontally on desktop |
| **Noise/Grain texture** | Subtle CSS grain overlay on dark backgrounds for depth |
| **Lenis Smooth Scroll** | Buttery smooth scrolling across the whole page |
| **Reduced Motion Respect** | All animations respect `prefers-reduced-motion` |
| **Accessibility** | WCAG AA contrast, keyboard nav, semantic HTML, ARIA labels |

---

## CDN Libraries (All Free, No Build Step Required)

```html
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">

<!-- Three.js r165 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- GSAP 3.12 + ScrollTrigger (free since Webflow acquisition 2024) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<!-- Lenis smooth scroll -->
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"></script>
```

---

## Visual WOW Effects — Detailed Specification

### 🌌 EFFECT 1: Three.js Hero Particle Field
**Section:** Hero background  
**Library:** Three.js (CDN)  
**Description:** 3,000–5,000 small particles arranged in a flowing field. Particles drift slowly. On `mousemove`, a subtle magnetic distortion ripples outward from the cursor position. Color palette: muted cyan/teal (#00E5FF at 30% opacity) on dark background.

**Implementation approach:**
```javascript
// Particle system with BufferGeometry for performance
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3);
// Populate with random positions in a sphere
// Add mouse repulsion in animation loop
// requestAnimationFrame render loop
```

**Performance:** Use `BufferGeometry`, limit to 3000 points on mobile, disable on `prefers-reduced-motion`.

---

### 🔢 EFFECT 2: Animated Counter Numbers
**Section:** Hero stats (50+, 10+, $1000, 1–2 weeks)  
**Library:** GSAP  
**Trigger:** When `.hero-numbers` enters viewport  
**Description:** Numbers count up from 0 to final value over 2 seconds with ease-out. Staggered 0.2s between each counter.

```javascript
gsap.to(counter, {
  innerText: targetValue,
  duration: 2,
  ease: "power2.out",
  snap: { innerText: 1 },
  scrollTrigger: { trigger: ".hero-numbers", start: "top 80%" }
});
```

---

### 📜 EFFECT 3: GSAP ScrollTrigger Reveal Animations
**Library:** GSAP + ScrollTrigger  
**Applied to:** Every section, card, headline  
**Types:**
- `fade-up`: opacity 0→1, y 40→0, stagger 0.1s for card grids
- `clip-reveal`: text revealed by expanding clip-path rect
- `line-by-line`: headings split into lines, each animates independently (SplitText-style via manual `<span>` wrapping)

```javascript
// Section headings — line reveal
gsap.fromTo(".section-title span", 
  { y: "110%", opacity: 0 },
  { y: "0%", opacity: 1, stagger: 0.08, duration: 0.9, ease: "power3.out",
    scrollTrigger: { trigger: ".section-title", start: "top 85%" }
  }
);

// Cards stagger
gsap.fromTo(".pain-card",
  { y: 60, opacity: 0 },
  { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power2.out",
    scrollTrigger: { trigger: ".pain-grid", start: "top 75%" }
  }
);
```

---

### 🖱️ EFFECT 4: Magnetic Custom Cursor
**Section:** Entire page  
**Pure CSS + JS — no library**  
**Description:** Custom dot cursor (8px, accent color) + outer ring (32px, 1px border). Ring lags behind cursor with lerp. On hover over buttons/cards: ring scales to 48px, switches to mix-blend-mode: difference creating an inversion effect.

```javascript
// Lerp cursor ring
let cx = 0, cy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function lerp(a, b, t) { return a + (b - a) * t; }
function tick() {
  cx = lerp(cx, mx, 0.1); cy = lerp(cy, my, 0.1);
  ring.style.transform = `translate(${cx-16}px, ${cy-16}px)`;
  requestAnimationFrame(tick);
}
```

---

### ↔️ EFFECT 5: Horizontal Scroll — Case Studies
**Section:** Case Studies (Block 05)  
**Library:** GSAP + ScrollTrigger  
**Description:** On desktop, the case studies section pins vertically while the cards scroll horizontally as user scrolls down. Creates a "drag through cases" cinematic experience.

```javascript
gsap.to(".cases-track", {
  x: () => -(casesTrack.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".cases-section",
    pin: true,
    scrub: 1,
    start: "top top",
    end: () => `+=${casesTrack.scrollWidth - window.innerWidth}`
  }
});
```
**Mobile fallback:** Normal vertical scroll, cards stacked.

---

### 🔢 EFFECT 6: Typing / Typewriter Hero Tagline
**Section:** Hero — below headline  
**Pure JS**  
**Description:** The subheadline types itself out character by character at 40ms/char after page load (1 second delay). Cursor blinks while typing.

---

### 🌊 EFFECT 7: Lenis Smooth Scroll
**Library:** Lenis v1.1 (CDN)  
**Description:** Replaces native scroll with smooth interpolated scrolling. Integrates with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`.

```javascript
const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10*t)) });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
```

---

### ✨ EFFECT 8: Glassmorphism Cards
**Section:** Pain cards, Team, Solutions preview  
**Pure CSS**

```css
.glass-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  transition: border-color 0.3s, transform 0.3s, background 0.3s;
}
.glass-card:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(232, 255, 71, 0.3);
  transform: translateY(-6px);
}
```

---

### 🎭 EFFECT 9: CSS Grain Noise Overlay
**Section:** Hero, section backgrounds  
**Pure CSS**

```css
/* Subtle film grain for depth */
body::before {
  content: '';
  position: fixed; inset: 0; z-index: 9999;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
```

---

### 📊 EFFECT 10: Animated Stats Progress Bars
**Section:** About Us / Why Different  
**Library:** GSAP + ScrollTrigger  
**Description:** Three horizontal progress bars showing expertise levels animate from 0% to full width on scroll. Labels: "Architecture & Systems", "AI & Automation", "Delivery Speed".

---

### ⚡ EFFECT 11: Marquee Ticker
**Section:** Between Hero and Pain section  
**Pure CSS animation**  
**Description:** Horizontal infinite scroll ticker with brand differentiators. Fast, bold, accent-colored text on dark strip.

```css
.ticker-track { animation: marquee 18s linear infinite; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

---

### 🔵 EFFECT 12: Bento Grid — Services Section
**Section:** What We Build  
**Description:** Asymmetric bento-style grid. Large featured card (CTA) spans 2 columns. Smaller cards in the grid. On hover: card lifts, border glows accent color. Grid uses CSS Grid with `grid-template-areas` for precise control.

---

## Color System

```css
:root {
  /* Backgrounds */
  --bg-primary:    #0C0C0E;   /* main dark */
  --bg-secondary:  #111116;   /* section alt */
  --bg-tertiary:   #18181F;   /* card bg */
  --bg-glass:      rgba(255,255,255,0.04);

  /* Accents */
  --accent:        #E8FF47;   /* yellow-green — primary CTA */
  --accent-dim:    rgba(232,255,71,0.15);
  --accent2:       #FF5C3A;   /* orange-red — urgency, step 4 */
  --accent3:       #00E5FF;   /* cyan — Three.js particles, links */

  /* Typography */
  --text-primary:  #F0F0F6;
  --text-muted:    #7A7A8E;
  --text-faint:    #4A4A58;

  /* Borders */
  --border:        rgba(255,255,255,0.07);
  --border-hover:  rgba(232,255,71,0.25);
}
```

---

## Typography

```css
/* Headlines */
font-family: 'Unbounded', sans-serif;
/* Hero H1 */     font-size: clamp(42px, 7vw, 88px); font-weight: 900; line-height: 1.0; letter-spacing: -0.03em;
/* Section H2 */  font-size: clamp(28px, 4vw, 52px);  font-weight: 900; line-height: 1.05;
/* Card title */  font-size: 16–18px; font-weight: 700;

/* Body */
font-family: 'Manrope', sans-serif;
/* Body text */   font-size: 16–18px; font-weight: 400; line-height: 1.7;
/* Small / tag */ font-size: 11–12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
```

---

## Target Audience

**Segment 1 — Small Business Owners**  
Owners of shops, clinics, salons, agencies, wholesalers, service businesses. 5–50 employees. They manage processes themselves and feel the pain of every wasted hour and every expensive tool that doesn't fit.

**Segment 2 — Operations / Department Heads**  
COOs, heads of sales, HR, logistics, finance. They know what needs fixing but can't justify a $50k development budget. They want fast, affordable, reliable solutions — without hiring an IT team.

---

## Core Pains to Hit

> Every pain must appear on the landing. The reader must think: *"That's exactly me."*

| # | Pain | Counter |
|---|---|---|
| 1 | Agencies charge a fortune ($15k+ for one tool) | We do it for $300–1000, 1–2 weeks |
| 2 | Subscriptions that don't fit your process | Own it forever. No recurring fees. |
| 3 | The right tool doesn't exist on the market | We build exactly what you need |
| 4 | Routine kills your team's time | Show hours saved per week |
| 5 | AI devs after a 30-day course deliver broken products | 11 years IT, 50+ shipped projects, production systems |

---

## Page Blocks — Full Copy

---

### NAV — Navigation

**Logo:** `Baztit Tech` — wordmark, Unbounded font, white  
**Links:** How We Work · Experience · What We Build · Solutions · Team · Contact  
**Nav CTA:** `Get a Free Prototype` → accent button → scrolls to #contact  
**Behavior:** Transparent at top → `backdrop-filter: blur(20px)` + border on scroll

---

### BLOCK 01 — Hero

**Badge:**
```
● 50+ completed projects · 10+ years of real IT experience
```

**Headline (H1) — animated word-by-word:**
```
We automate
your business
in 1–2 weeks
for under $1,000
```

**Subheadline (typewriter effect):**
```
We're a small team of engineers with 10+ years of hands-on IT experience.
Custom software, bots, CRM integrations, and automations —
at prices that used to be available only to enterprises.
We show you a working prototype first. You pay only if you love it.
```

**CTA buttons:**
- Primary: `Get a Free Prototype →` (accent background, dark text)
- Secondary: `See Our Work` (ghost border, white text)

**Scarcity line:**
```
🔥 Only 1 spot available this month (March 2026). Next slots open in April.
```
> ⚠️ Update the month manually each month.

**Stats row (counter animation):**

| Animated Value | Label |
|---|---|
| 50+ | completed projects |
| 10+ | years in IT |
| $1,000 | max for most solutions |
| 14 days | prototype delivery |

**Background:** Three.js particle field (Effect 1). No image needed.

---

### BLOCK 02 — Ticker (between Hero and Pain)

Infinite scrolling marquee strip, accent yellow background, dark text:

```
CUSTOM SOFTWARE · NO SUBSCRIPTIONS · PROTOTYPE FIRST · PAY AFTER · 
10+ YEARS IN IT · 50+ PROJECTS SHIPPED · RAILWAY HOSTED · FROM $300 ·
```

---

### BLOCK 03 — Pain Section

**Section tag:** `// the problem`  
**Headline:** `You've probably been here before`

**6 pain cards (glassmorphism, stagger reveal):**

---
**Card 1** — 💸 Agencies charge like it's rocket science  
> You asked for a quote. You got a $15,000 proposal and a 4-month timeline. For one workflow tool. With no guarantee it'll even fit how you work.

**Card 2** — 🔁 Paying subscriptions for tools that don't fit  
> Bitrix, Zapier, Monday, HubSpot — paying monthly, using 10% of the features. The one thing you actually need? Missing.

**Card 3** — 🧩 The tool you need simply doesn't exist  
> You've searched. Nothing fits your process. Every existing solution is too generic, too rigid, or too expensive to adapt.

**Card 4** — ⏱️ Routine is destroying your team's focus  
> Managers copy data between systems, build Excel reports by hand, answer the same questions 20 times a day. That's not their job — that's lost revenue.

**Card 5** — 🤖 You tried AI automation — it was terrible  
> Someone said they do AI development. The result broke under load, couldn't handle edge cases, and was basically a chatbot with a nice UI. You got burned.

**Card 6** — 🔌 Your systems don't talk to each other  
> Website, CRM, warehouse, payments — all separate islands. Data copied manually. Errors, duplicates, clients lost.

---

### BLOCK 04 — About Us

**Section tag:** `// why we're different`  
**Headline:**
```
We're not beginners who learned AI last month.
We built complex systems before ChatGPT existed.
```

**Body (3 paragraphs):**

**P1:**
> Baztit Tech is a small team of engineers with real production experience. Our technical lead Nikita has 11+ years as CTO and tech lead — building everything from corporate websites to distributed ERP platforms. That's 20,000+ hours of actual development work.

**P2:**
> We use AI as an acceleration layer — not a replacement for engineering judgment. Architecture, code review, and reliability testing are done by us. That's why our systems work under real load and don't collapse in production — unlike products churned out by people who completed a 30-day AI course.

**P3:**
> Our portfolio includes projects for McDonald's (computer vision queue analytics), Huawei (ML video smoothing), medical FHIR data platforms, ERP systems, and AI-powered sales agents. We know what it takes to ship something that actually works.

**4 differentiators (animated stats bars + icons):**
- ⚙️ **AI is our tool, not our crutch** — Architecture and code review always done by humans
- 📦 **50+ shipped projects** — From mobile apps to computer vision pipelines
- 💬 **Small team = you talk to builders** — No account managers, no bureaucracy
- 💰 **SMB-affordable pricing** — What used to cost $50k now costs $300–1,000

---

### BLOCK 05 — How We Work

**Section tag:** `// the process`  
**Headline:**
```
We show first.
You pay after.
```

**Subheadline:**
```
No upfront payment. No risk. You only pay when you've seen it working and said yes.
```

**4 steps (horizontal scroll on desktop, vertical on mobile):**

**Step 01** `FREE`
### Tell us your task
30-minute Telegram chat or call. You describe what you want to automate or what tool you need. We ask questions and propose a solution. No 20-page proposals.

**Step 02** `FREE`
### We build a prototype in 7–14 days
A working prototype — not a presentation, not a mockup. An actual working version you can test with your real data.

**Step 03** `FREE`
### You review and decide
We demo it to you and your team. If it doesn't fit — no hard feelings. The prototype joins our ready-made solutions library. That's valuable for us too.

**Step 04** `PAID`
### Final build, setup & handover
We agree on scope, price, and timeline. We finish the system, train your team, connect everything. 30 days of post-launch support included.

> **Key message (quote callout):**  
> *"If you see the prototype and decide it's not for you — that's completely fine. We actually benefit from building prototypes because they grow our ready-made solutions library. So send us your tasks. Seriously."*

---

### BLOCK 06 — Case Studies (Horizontal Scroll)

**Section tag:** `// real work`  
**Headline:** `What we've built — and why it works`  
**Layout:** Horizontally scrolling cards track (GSAP pinned), 5 cards visible

---

**Case 1 — AI Agent for Sales & Recruiting**

> Task: Automate communication with leads and candidates across sales, support, and recruiting.

> Built: Not a chatbot. A digital employee — understands free text, qualifies leads, pushes data to CRM, moves clients through the funnel. Works with product docs and images for accurate answers.

> Result: Live and stable in production. Response time: seconds. Manager workload reduced. Lost leads minimized — without adding headcount.

> Link: https://progprogect.github.io/AI-Agents-CRM-LP

---

**Case 2 — Production & Warehouse Tracking**

> Task: Track product status through manufacturing — line load, warehouse movement, order reservation.

> Built: Full production and inventory system from scratch. Integrated with client's existing workflow.

> **Result: Cost $2,000 · Delivered in 2 weeks · Competing quotes: $50,000+ · Savings: 96%**

---

**Case 3 — CRM for Trade & Delivery (CIS)**

> Task: Automate shipment processing, document generation and tracking for CIS logistics market.

> Built: Ready-made CRM tailored to CIS market. Auto-generates transport docs, tracks statuses, integrates with couriers.

> **Result: Available for $300 one-time. No monthly fees.**

---

**Case 4 — McDonald's Queue Analytics**

> Client: McDonald's (via partner)  
> Built: Computer vision system for real-time queue monitoring across restaurant locations.  
> Stack: Computer Vision, ML, video analytics

---

**Case 5 — Huawei Video ML**

> Client: Huawei  
> Built: ML model for predictive smoothing of video streams.  
> Result: Reduced latency and visual artifacts in live video delivery.

---

**Other Notable Projects (logos / list):**
- AMC Networks — ML content placement timing model
- Medical FHIR Platform — healthcare data ingestion and exchange
- Inkhub — AI summarization from 5M+ sources
- KNOX — IPFS distributed storage
- ERP System — manufacturing inventory and production planning
- Photoseparator IoT — real-time impurity detection on production lines
- Anti-Counterfeit AI — brand authenticity recognition
- ShuttleDelivery.co.kr — food delivery app (React / Node.js / Java)
- IoT Healthcare Apps — diagnosis and pregnancy monitoring
- 10+ Corporate Websites (rplaza.by, mastera-zamkoff.ru, bulbashcompany.com, brs.by, comforthotel.by, gik.by, elporta.by, life-coaching.by, saryarka.by)

---

### BLOCK 07 — What We Build (Bento Grid)

**Section tag:** `// what we build`  
**Headline:** `Three ways we can help`

**Bento layout (CSS Grid):**
- Large card (2-col span): Custom Development
- Medium card: Adapt Existing Platforms
- Medium card: Ready-Made Solutions
- Small card: Integrations

---

**Custom Development** *(featured large card)*
> We build from scratch what doesn't exist on the market. Designed around your logic, your processes, your integrations. We architect it — no blind AI generation.

**Adapt & Extend Existing Platforms**
- CRM: Zoho CRM, Odoo, AmoCRM, Bitrix24
- Payments: Stripe, PayPal, Crypto
- Messaging: Telegram bots, WhatsApp Business API
- Analytics: Google Sheets, Metabase, Power BI

**Ready-Made Solutions**
> 50+ tools already built. Buy as-is or with light adaptation — faster and cheaper than custom.  
> → `Browse Solutions` link → /solutions

**Integrations**
> Connect your existing tools. Make them talk to each other. Eliminate manual data transfer.

---

### BLOCK 08 — Ready Solutions Preview

**Section tag:** `// ready to ship`  
**Headline:** `Already built — take it and use it`

**Subheadline:**
```
Every solution is a real shipped project, tested in production.
Buy as-is or adapt — significantly cheaper than custom development.
```

**Preview cards (4, glassmorphism style):**

| Icon | Name | What it does | Price |
|---|---|---|---|
| 🤖 | AI Sales Agent | Lead qualification, Q&A, CRM push. 24/7. | from $300 |
| 📦 | CRM for CIS Delivery | Document automation, tracking, courier integrations | $300 one-time |
| 📊 | Analytics Dashboard | Revenue, clients, funnel — auto-updated | from $200 |
| 🤝 | Telegram Intake Bot | Receives requests, routes to managers, logs to CRM | from $150 |

**CTA:** `View All Solutions →` → /solutions page

---

### BLOCK 09 — Team

**Section tag:** `// the team`  
**Headline:** `Who's behind this`

---

**Nikita Volkunovich — Founder & CTO**
> 11+ years as CTO and tech lead. 20,000+ hours of real development. Built projects from corporate websites to distributed ML platforms. Deep cross-domain expertise.

Key work: McDonald's Analytics, Huawei Video ML, FHIR Medical Platform, ERP systems, AI Sales Agents.

---

**Vitaly — Full Stack Developer**
> 5 years of development at outsourcing companies. Frontend and backend. Delivers fast and clean.

---

**Julia — Business Analyst & Designer**
> Translates business requirements into technical specs. Designs user flows and interfaces.

---

**UX Partner Team**
> Dedicated UX design partners — brought in on projects that need them.

---

### BLOCK 10 — Offer + Scarcity

**Section tag:** `// our promise`  
**Headline:**
```
Try it risk-free —
first prototype is on us
```

**Body:**
```
Tell us your task. We'll build a working prototype and show you how it works —
no upfront payment. If it fits, we'll agree on the full build.
If not — you lose nothing. We gain another solution for our library.
```

**3 guarantee tiles:**
- 🔒 **No upfront payment** — We don't invoice until you've seen it and said yes
- ⚡ **Prototype in 7–14 days** — Working version, testable with real data
- 💬 **30 days support included** — Post-launch fixes, questions, and training

**Scarcity callout (accent2 border, animated pulse):**
```
🔥 Only 1 spot available this month (March 2026).
New projects start from April. Apply now.
```

---

### BLOCK 11 — Comparison Table

**Headline:** `Baztit Tech vs Traditional Agencies`

| | ✦ Baztit Tech | Agencies & Studios |
|---|---|---|
| Cost | $300 – $1,000 | $5,000 – $50,000+ |
| Upfront payment | None. Prototype first. | 50% deposit upfront |
| Time to first result | 7–14 days to prototype | 2–6 months |
| Risk | Zero — pay after seeing it | High — pay before results |
| Fit | Built around your process | Template solutions |
| Communication | Direct: Telegram/WhatsApp | Manager chain |
| AI expertise | 10+ years IT + AI as accelerator | Often just AI, no engineering |
| Post-launch support | 30 days included | Separate support contract |

---

### BLOCK 12 — Contact Form

**Section tag:** `// let's talk`  
**Headline:**
```
Tell us your task —
we'll show you the prototype
```

**Subheadline:**
```
Leave a request. We'll respond within a few hours, clarify details,
and show you a working solution in 7–14 days. No upfront payment.
```

**Form fields:**

| Field | Type | Placeholder | Required |
|---|---|---|---|
| Name | text | `Alex` | Yes |
| Telegram or WhatsApp | text | `@username or +1...` | Yes |
| Business type | select | `Select your industry...` | No |
| Describe your task | textarea (4 rows) | `E.g. we manually track orders in Excel and want it automated with notifications...` | Yes |

**Dropdown options:**
- Retail / E-commerce
- Services (salon, clinic, studio)
- Construction / Renovation
- Wholesale / Distribution
- Food & Delivery
- Manufacturing
- IT / Digital / Agency
- Other

**Submit button:** `Get My Free Prototype →`  
**Success state:** `✓ Request sent! We'll reply today.`

**Form backend:**
- Method: `POST`
- Service: Formspree (`https://formspree.io/f/{ID}`) OR EmailJS
- Fallback email: progprogect@gmail.com

**Fine print:** `By submitting you agree to data processing. No spam — project talk only.`

---

### BLOCK 13 — Footer

**Left:** `Baztit Tech` + tagline: *"Custom automation for growing businesses"*

**Contacts:**
- Telegram: @volknick
- WhatsApp: +375255092206
- Email: progprogect@gmail.com

**Links:** Home · Ready Solutions · Contact

**Copyright:** `© 2026 Baztit Tech · All rights reserved`

---

## /solutions Page Structure

Standalone expandable catalog page.

**Hero:**
```
Ready-Made Solutions — Take It & Adapt
```
Sub:
```
Every tool in our library is a real shipped project, tested in production.
Buy as-is or with customization — faster and cheaper than building from scratch.
```

**Category filters:** All · AI Agents · CRM · Analytics · Bots · Integrations

**Solution card fields:**
- Icon + category tag
- Name
- Short description (2–3 sentences)
- What it solves
- Price (or "Request quote")
- `Learn More` button → modal

**Starter catalog:**

| Name | Category | Price |
|---|---|---|
| AI Sales & Lead Qualification Agent | AI Agents | from $300 |
| CRM for Trade & Delivery (CIS) | CRM | $300 one-time |
| Production & Warehouse Tracking System | ERP / Warehouse | from $1,500 |
| Auto Analytics Dashboard | Analytics | from $200 |
| Telegram Intake Bot | Bots | from $150 |
| CRM + Messenger Integration | Integrations | from $200 |

**Bottom CTA:** `Don't see what you need? We'll build it for you.` → form

---

## Performance & Accessibility Requirements

- Lighthouse score target: **90+** on desktop, **80+** on mobile
- All images: WebP format, lazy-loaded
- Three.js: disabled on `prefers-reduced-motion`, reduced particles on mobile (≤1000)
- Fonts: `font-display: swap`
- Form: accessible labels, error states, keyboard navigable
- Color contrast: WCAG AA minimum
- `<meta>` tags: OG image, description, title for social sharing

---

## Generation Checklist

- [ ] Company: **Baztit Tech**
- [ ] Hosting: **Railway** (Express static server, see server.js above)
- [ ] Form email: **progprogect@gmail.com**
- [ ] Telegram: **@volknick**
- [ ] WhatsApp: **+375255092206**
- [ ] Scarcity month: **update manually each month** (currently March 2026)
- [ ] Three.js particle hero: **Effect 1 spec above**
- [ ] GSAP ScrollTrigger: **Effects 2, 3, 5, 10**
- [ ] Lenis smooth scroll: **Effect 7**
- [ ] Custom cursor: **Effect 4**
- [ ] Horizontal scroll cases: **Effect 5 / GSAP pin**
- [ ] Glassmorphism cards: **Effect 8 CSS**
- [ ] Grain overlay: **Effect 9 CSS**
- [ ] Marquee ticker: **Effect 11**
- [ ] Bento grid services: **Effect 12**
- [ ] Case study link: https://progprogect.github.io/AI-Agents-CRM-LP
- [ ] Two output files: **index.html** + **solutions.html** in `/public`
- [ ] Railway files: **server.js** + **package.json** in root

---

## Cursor Prompt (ready to paste)

```
Build a two-page website for Baztit Tech based on the brief in this file.

Output files:
- public/index.html  (main landing)
- public/solutions.html  (solutions catalog)
- server.js  (Express static server for Railway)
- package.json  (with "start": "node server.js")

Visual WOW requirements (ALL must be implemented):
1. Three.js particle field in hero background — 3000 particles, mouse repulsion
2. GSAP ScrollTrigger reveal animations — fade-up, stagger, counter numbers
3. Horizontal scroll pinned case studies section (GSAP ScrollTrigger scrub)
4. Custom magnetic cursor with blend-mode difference
5. Lenis smooth scroll integrated with GSAP ScrollTrigger
6. Typewriter effect on hero subheadline
7. Glassmorphism cards (backdrop-filter blur)
8. CSS grain overlay for texture
9. Infinite marquee ticker strip
10. Bento grid layout for services section

CDN libraries to use:
- Google Fonts: Unbounded + Manrope
- Three.js: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
- GSAP: https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
- ScrollTrigger: https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js
- Lenis: https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js

Tech:
- Vanilla JS + HTML + CSS (no build step)
- Railway deployment: PORT from process.env.PORT
- Form via Formspree (placeholder action URL, user replaces ID)
- Fully responsive (mobile-first)
- prefers-reduced-motion: disable Three.js and GSAP animations
- All copy from brief — do not invent new text
- Scarcity: "Only 1 spot available this month (March 2026)"
```
