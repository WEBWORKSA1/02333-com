# Phase-wise build prompt — 02333.com

> Copy each phase into an AI coding assistant, in order. Every phase builds on the one before it and must pass its acceptance checks before you move on.
> This repository is the finished result of Phases 1–7. Phases 8–10 are the growth roadmap.

---

## Global context (paste first, every session)

```
You are building 02333.com — "Decode China, one number at a time."
Concept: an English-language hub for Chinese number slang (2333 = LOL, 520 = I love you,
666 = awesome), lucky-number culture (8 good, 4 bad), internet memes, and a B2B lead
funnel ("China Connect") for businesses selling to Chinese-speaking customers.
Revenue: Google AdSense, YouTube embeds, affiliate links, lead generation, sponsorships,
donations, contest sponsors.

Hard constraints:
- Static site only (HTML/CSS/vanilla JS) that runs on the FREE GitHub Pages plan.
  No server, no build step required at runtime.
- Every page starts with this banner at the very top:
  "Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership"
  linking to https://web.works/contact
- All forms deliver to ONE owner inbox via an AJAX form relay. The address must NEVER appear
  in plain text in any HTML, JS, CSS or README. Store it encoded (XOR + reversed char codes)
  and decode only at submit time.
- Never claim affiliation with any company, stock exchange, platform, film or character that
  uses similar numbers. Include a full Trademark & Copyright Disclosure page.
- Mobile-first, WCAG AA, light and dark modes, Core Web Vitals green, relative links only
  (so the site works at both username.github.io/02333-com/ and 02333.com).
```

## Phase 1 — Foundation & design system
```
Create the repo structure: src/pages/*.html (page bodies), build.py (wraps them in a shared
head/header/footer and generates sitemap.xml), assets/css/style.css, assets/js/{config,data,ui,main}.js.
Design tokens: warm paper background #fffaf3, lucky red #d7261e, gold #f2b705, ink #1c1917,
jade #0f8a6a. Full dark-mode token set (prefers-color-scheme plus a manual toggle saved in
localStorage). Fonts: Inter (body) and Space Grotesk (numbers and headings).
Components: sticky header with mobile drawer, buttons, cards, chips, badges (safe/casual/crude),
forms, multi-step form, FAQ accordion, countdown, progress bar, toast, cookie banner, floating
Support button, footer with 5 columns and a legal line.
Acceptance: no horizontal scroll at 360px; Lighthouse accessibility ≥ 95.
```

## Phase 2 — Content data & core tools
```
data.js: SLANG[] entries {n, zh, py, en, cat, rating, how, ex, exen, rel[]} (35+ codes),
DIGITS{} folklore scores, COMBOS[] lucky/unlucky patterns, QUIZ[], VIDEOS[] (real YouTube IDs),
ARTICLES[].
Tools:
1. Decoder: live search, category filters, hide-crude toggle, random code, ?q= deep links,
   digit-by-digit fallback for unknown numbers, copy/share buttons, "submit a code" form.
2. Lucky Number Analyzer: score from 1–99 (average digit score + combo bonus + ending digit),
   verdict in Chinese and English, digit tiles, combos found, luckier alternatives, share button,
   ?n= deep link, email-report lead form.
3. Quiz: 10 shuffled questions, instant feedback, result title, share, newsletter capture.
4. Meme Maker: 1080×1080 canvas, 4 styles, optional local background photo, PNG download.
Acceptance: every tool works offline after load; no console errors.
```

## Phase 3 — Monetization layer
```
AdSense: config.js holds the publisher ID and slot IDs. <div class="ad" data-slot="top|inContent|
sidebar|footer"> placeholders become <ins class="adsbygoogle"> after consent, or show
"Advertise here" house ads until IDs are set. Serve non-personalized ads if the user picks
"Essential only". Put ads.txt at the repo root.
YouTube: lite embeds (thumbnail first, youtube-nocookie iframe on click).
Affiliates: data-aff="key" links filled from config and hidden when empty; rel="sponsored".
Optional GA4 (consent-gated) with events: search, lucky_check, quiz_complete,
meme_download, generate_lead.
```

## Phase 4 — Lead generation (highest priority for revenue)
```
China Connect page: hero with value proposition and trust line; 6 service cards;
3-step "how it works"; 3-step form (service picker → project details with budget/timeline
→ contact details with a lead-magnet checkbox and a consent checkbox); FAQ; partner-network link.
Add a quick lead form on the homepage and an email-report capture on the Lucky Number
Analyzer. Every form has a honeypot, required consent, a success/error message, and
subject tags like "LEAD: …" for inbox filtering.
```

## Phase 5 — Community, donations, contests, talent, sponsors
```
Support page: one-time/monthly toggle, tiers $5 / $18 / $88 / $520 (lucky amounts), links to
Buy Me a Coffee, Ko-fi, PayPal, Stripe, GitHub Sponsors and Patreon from config (falling back
to a pledge form), a "where your money goes" split (operations, talent, prizes, promotion),
and a patrons wall.
Contests page: monthly countdown, prizes, 3 categories, entry form, rules summary, hall of fame.
Careers page: roles plus a partner-network application form.
Advertise page: packages, media-kit request form, acquisition option.
```

## Phase 6 — SEO content & legal
```
3 cornerstone articles (what 02333 means; lucky numbers in business; the 2026 number-slang list)
with a table of contents, tables, callouts, internal links and in-content ad slots.
Per-page title/description/canonical/OG tags, WebSite + SearchAction JSON-LD, sitemap.xml,
robots.txt, manifest, favicon, OG image.
Legal pages: Privacy (AdSense cookie language, GDPR/CCPA/PIPEDA/PIPL rights), Terms (contest
rules, donations, referrals), Trademark & Copyright Disclosure (generic use of the numeric
string, non-affiliation, notice-and-takedown), About, Contact, 404.
```

## Phase 7 — QA & deploy on GitHub Pages (free)
```
Run build.py. Playwright checks: every page at 1366px and 390px, zero console errors, zero
horizontal overflow, quiz flow, multi-step form. grep the repo for the owner's email address
and confirm zero matches. Push to github.com/<owner>/02333-com on the main branch.
Settings → Pages → Deploy from branch: main / root. Custom domain: add a CNAME file containing
02333.com and DNS records (A 185.199.108.153, .109, .110, .111; CNAME www → <owner>.github.io),
then turn on Enforce HTTPS.
```

## Phase 8 — Growth content (weeks 1–8)
```
Add 1 slang entry a day and 2 articles a week. Target keywords: "what does 666 mean in chinese",
"chinese lucky numbers for business", "520 meaning", "unlucky numbers china", "chinese number
for i love you". Add one page per code (/n/520.html) generated by build.py from data.js for
long-tail SEO. Add Traditional-Chinese toggles and audio pinyin (Web Speech API).
```

## Phase 9 — New tools (retention and virality)
```
Auspicious Date Finder (weddings, launches); Chinese Zodiac & Lucky Numbers by birth date
(email-gated full report); Brand Name Checker (sound/meaning/number flags, which feeds the
China Connect lead form); flashcards with spaced repetition; an embeddable "Number of the Day"
widget for other sites (for backlinks).
```

## Phase 10 — Scale revenue
```
Premium tier (ad-free, HD meme packs, full reports) through Stripe Payment Links; a paid
directory of vetted China-market specialists; sponsored contest seasons around 520 (May 20),
Double 11 and Chinese New Year; a YouTube channel reusing the decoder entries as Shorts; merch
(520 / 666 / 1314 designs). Watch RPM by page type and move ad slots and CTAs toward the
top-earning templates.
```
