# Design Specification: DataFlow — Analytics SaaS Landing Page

## Design Reference
Based on modern premium SaaS landing pages (dark theme, high contrast, gradients).
Style: Similar to Linear.app, Vercel, Raycast — clean, tech-forward, premium feel.

## Color Palette
- Background primary: #09090b (near black)
- Background secondary: #18181b (zinc 900)
- Card background: #1c1c1f (slightly lighter)
- Border: #27272a (zinc 800)
- Text primary: #fafafa (near white)
- Text secondary: #a1a1aa (zinc 400)
- Accent/CTA: #6366f1 (indigo)
- Accent gradient: linear-gradient(135deg, #6366f1, #8b5cf6)
- Success green: #22c55e
- Warning orange: #f97316

## Typography
- Font: Inter (Google Fonts)
- Headings: 800 weight
- Body: 400 weight
- H1: 3.5rem (hero)
- H2: 2.25rem (section titles)
- H3: 1.25rem (card titles)
- Body: 1rem
- Small: 0.875rem

## Sections (10 total — moderately complex)

### 1. Navbar
- Fixed, glassmorphism effect (blur + semi-transparent bg)
- Logo left: "DataFlow" with chart icon
- Nav links center: Product, Features, Pricing, Blog
- Right: "Sign In" text link + "Get Started" gradient button
- Mobile: hamburger menu

### 2. Hero
- Badge: "✨ Now with AI-powered analytics"
- H1: "Turn data into decisions."
- Subtext: "DataFlow helps teams track, analyze, and act on their data in real-time. No SQL required."
- Two CTA buttons: "Start Free Trial" (gradient) + "Watch Demo" (outlined with play icon)
- Below: Dashboard mockup image (CSS-only: dark card with chart bars, stats cards, line graph)
- Background: subtle grid pattern + radial gradient glow

### 3. Logos/Trust Bar
- "Trusted by 500+ companies"
- Row of 6 placeholder company logos (use styled text)

### 4. Features (6 cards)
- 3-column grid, icon + title + description
- Cards have subtle border, glow on hover
- Features:
  1. Real-time Analytics — Track metrics as they happen
  2. Custom Dashboards — Build views that matter to you
  3. Smart Alerts — Get notified when things change
  4. Team Collaboration — Share insights with your team
  5. API Access — Connect your existing tools
  6. Data Security — Enterprise-grade encryption

### 5. Feature Showcase (alternating)
- Two large feature blocks, image left/text right then reversed
- Block 1: "Analytics that feel like magic" + dashboard mockup
- Block 2: "Collaborate in real-time" + team collaboration mockup

### 6. Pricing (3 tiers + toggle)
- Monthly/Annual toggle switch (annual shows "Save 20%")
- 3 cards: Starter ($0), Pro ($29/mo), Enterprise (Custom)
- Pro card highlighted with gradient border
- "Most Popular" badge on Pro
- Feature checklist per tier

### 7. Testimonials (3 cards)
- Quote, name, role, company, star rating
- Cards with subtle background, quote icon

### 8. Stats Bar
- Dark section with 4 big numbers:
  - 50M+ Events/day
  - 99.99% Uptime
  - 500+ Integrations
  - 4.9★ Rating

### 9. FAQ
- 6 accordion items
- Smooth expand/collapse animation
- Chevron rotates on toggle

### 10. CTA + Footer
- CTA: "Ready to get started?" with email input + button
- Footer: 4 columns (Product, Company, Resources, Legal) + social icons

## Interactions
- Smooth scroll navigation
- Pricing toggle (monthly/annual) updates prices
- FAQ accordion
- Feature cards glow on hover
- Navbar blur on scroll
- Mobile hamburger menu
- Counter animation for stats

## Responsive
- Desktop: multi-column layouts
- Tablet (1024px): 2-column grids
- Mobile (768px): single column, hamburger menu, stacked layout

## Files to Generate
- index.html
- css/style.css
- js/app.js
