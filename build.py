#!/usr/bin/env python3
"""02333.com static builder: wraps src/pages/*.html in the shared layout.
Usage: python3 build.py   (writes the finished pages to the repo root)
Each page starts with a meta comment:
<!--meta
title: Page title
desc: Meta description
scripts: decoder.js, other.js
-->
"""
import os, re, glob, json, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE_URL = "https://02333.com/"
BANNER = ('<div class="topbar" role="note">Contact, if you are interested in this '
          '<b>website / domain name / Sponsorship / Advertisement / Partnership</b> &rarr; '
          '<a href="https://web.works/contact" target="_blank" rel="noopener">Contact us</a></div>')

NAV = [("decoder.html", "Decoder"), ("lucky-numbers.html", "Lucky Numbers"), ("quiz.html", "Quiz"),
       ("meme-maker.html", "Meme Maker"), ("learn.html", "Learn"), ("videos.html", "Videos"),
       ("contests.html", "Contests"), ("support.html", "Support")]

def header(cur):
    links = "".join('<a href="%s"%s>%s</a>' % (h, ' aria-current="page"' if h == cur else "", t) for h, t in NAV)
    return f'''<a class="skip" href="#main">Skip to content</a>
{BANNER}
<header class="hdr"><div class="wrap">
<a class="logo" href="index.html" aria-label="02333 home"><span class="seal">02</span><span>02<b>333</b></span></a>
<button class="iconbtn menu-btn" aria-label="Open menu" aria-expanded="false">☰</button>
<nav class="nav" aria-label="Main">{links}<a class="cta" href="china-connect.html">China Connect</a>
<button class="iconbtn" data-theme-toggle aria-label="Toggle dark mode"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button></nav>
</div></header>'''

FOOTER = '''<footer class="ftr"><div class="wrap">
<div class="cols">
<div><a class="logo" href="index.html" style="color:#fff"><span class="seal">02</span><span>02<b>333</b></span></a>
<p class="small" style="margin-top:12px;color:#a8a29e">Decode China, one number at a time. Number slang, lucky-number tools, internet culture and practical China-market help — in plain English.</p>
<p class="small"><a href="https://web.works/contact" target="_blank" rel="noopener">Interested in this website or domain? Contact →</a></p></div>
<div><h4>Tools</h4><ul><li><a href="decoder.html">Number Slang Decoder</a></li><li><a href="lucky-numbers.html">Lucky Number Analyzer</a></li><li><a href="quiz.html">Slang Quiz</a></li><li><a href="meme-maker.html">Meme Maker</a></li></ul></div>
<div><h4>Explore</h4><ul><li><a href="learn.html">Learn & Guides</a></li><li><a href="videos.html">Videos</a></li><li><a href="contests.html">Contests & Prizes</a></li><li><a href="china-connect.html">China Connect (Services)</a></li></ul></div>
<div><h4>Work with us</h4><ul><li><a href="advertise.html">Advertise / Sponsor</a></li><li><a href="support.html">Support & Donate</a></li><li><a href="careers.html">Careers & Talent</a></li><li><a href="contact.html">Contact</a></li></ul></div>
<div><h4>Legal</h4><ul><li><a href="about.html">About</a></li><li><a href="privacy.html">Privacy Policy</a></li><li><a href="terms.html">Terms of Use</a></li><li><a href="disclaimer.html">Trademark & Copyright</a></li></ul>
<ul style="margin-top:12px"><li><a data-social="youtube" href="#">YouTube</a></li><li><a data-social="x" href="#">X</a></li><li><a data-social="instagram" href="#">Instagram</a></li><li><a data-social="tiktok" href="#">TikTok</a></li><li><a data-social="discord" href="#">Discord</a></li></ul></div>
</div>
<div class="legal">© <span data-year>2026</span> 02333.com. All rights reserved. “02333” is used as a generic numeric string and internet expression; this site is independent and is not affiliated with, endorsed by, or sponsored by any company, stock exchange, platform, film or character that uses similar numbers. Third-party names and marks belong to their owners. Lucky-number content is cultural entertainment, not financial, legal or professional advice. <a href="disclaimer.html">Full disclosure</a>.</div>
</div></footer>
<a class="btn btn-gold float-support" href="support.html">♥ Support</a>'''

def head(title, desc, path):
    full = title if "02333" in title else f"{title} | 02333"
    canon = SITE_URL + ("" if path == "index.html" else path)
    ld = {"@context": "https://schema.org", "@type": "WebSite", "name": "02333", "url": SITE_URL,
          "description": "Decode China, one number at a time.",
          "potentialAction": {"@type": "SearchAction", "target": SITE_URL + "decoder.html?q={q}", "query-input": "required name=q"}}
    return f'''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{full}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canon}">
<meta name="theme-color" content="#d7261e">
<meta property="og:type" content="website"><meta property="og:site_name" content="02333">
<meta property="og:title" content="{full}"><meta property="og:description" content="{desc}">
<meta property="og:url" content="{canon}"><meta property="og:image" content="{SITE_URL}assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
<script>try{{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}}catch(e){{}}</script>
<script type="application/ld+json">{json.dumps(ld)}</script>
</head><body>'''

def build():
    pages = sorted(glob.glob(os.path.join(ROOT, "src", "pages", "*.html")))
    urls = []
    for p in pages:
        name = os.path.basename(p)
        raw = open(p, encoding="utf-8").read()
        m = re.match(r"\s*<!--meta(.*?)-->", raw, re.S)
        meta = {}
        if m:
            for line in m.group(1).strip().splitlines():
                if ":" in line:
                    k, v = line.split(":", 1); meta[k.strip()] = v.strip()
            raw = raw[m.end():]
        scripts = ['<script src="assets/js/config.js"></script>', '<script src="assets/js/data.js"></script>', '<script src="assets/js/ui.js"></script>']
        for s in [x.strip() for x in meta.get("scripts", "").split(",") if x.strip()]:
            scripts.append(f'<script src="assets/js/{s}"></script>')
        scripts.append('<script src="assets/js/main.js"></script>')
        html = (head(meta.get("title", "02333"), meta.get("desc", ""), name) + header(name) +
                '\n<main id="main">\n' + raw.strip() + '\n</main>\n' + FOOTER + "\n" + "\n".join(scripts) + "\n</body></html>\n")
        open(os.path.join(ROOT, name), "w", encoding="utf-8").write(html)
        if name != "404.html":
            urls.append(name)
    today = datetime.date.today().isoformat()
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        loc = SITE_URL + ("" if u == "index.html" else u)
        sm.append(f"  <url><loc>{loc}</loc><lastmod>{today}</lastmod></url>")
    sm.append("</urlset>")
    open(os.path.join(ROOT, "sitemap.xml"), "w").write("\n".join(sm) + "\n")
    print("built", len(pages), "pages")

if __name__ == "__main__":
    build()
