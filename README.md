# 02333.com — Decode China, one number at a time

A static website covering Chinese number slang, lucky-number tools and internet culture, with a China-business lead funnel. It runs on the **free GitHub Pages plan**, with no server needed.

- **Tools:** Number Slang Decoder · Lucky Number Analyzer · Slang Quiz · Meme Maker
- **Revenue:** Google AdSense slots · YouTube embeds · affiliate links · China Connect lead generation · sponsorships · donations · contests
- **Pages:** 21, including 3 SEO articles and all legal pages (Privacy, Terms, Trademark & Copyright Disclosure)

## Go-live checklist
1. **AdSense:** in `assets/js/config.js`, set `adsense.client` and the slot IDs, then update `ads.txt`.
2. **Donations:** in `config.js → donate`, paste your Buy Me a Coffee, Ko-fi, PayPal, Stripe, GitHub Sponsors and Patreon links. Until you do, the buttons fall back to the pledge form.
3. **Affiliates / social / GA4:** also set in `config.js`.
4. **Forms:** every form posts through the FormSubmit AJAX relay to the owner inbox, which is stored encoded, never in plain text. The **first submission sends an activation email to the owner inbox**. Click *Activate* once and all forms go live.
5. **Custom domain:** add a `CNAME` file containing `02333.com`. At your registrar, create A records for `@` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 and a CNAME record for `www` → `webworksa1.github.io`. Then go to Settings → Pages and turn on *Enforce HTTPS*.

## How publishing works
Page bodies live in `src/pages/*.html`. The shared header, top banner and footer are in `build.py`. On every push to `main`, the GitHub Actions workflow (`.github/workflows/build-deploy.yml`) runs `tools/gen_images.py` and `build.py`, commits the finished pages to `main`, and publishes the site to the `gh-pages` branch, which GitHub Pages serves.

To build locally:

```
python3 build.py
```

Content lives in `assets/js/data.js` (slang entries, quiz, videos, articles).

## Docs
- `docs/RESEARCH.md` — what 02333 means, the ideas scored, and the 27-site benchmark
- `docs/PROMPT.md` — the phase-wise build prompt (Phases 1–10)

## Trademark / copyright
“02333” is used as a generic numeric string and internet expression. This project is not affiliated with any company, exchange, platform or franchise that uses similar numbers. See `disclaimer.html`.
