/* 02333.com — core site behaviour */
(function () {
  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  window.$$ = $$;

  /* Theme */
  var t = store("theme"); if (t) document.documentElement.setAttribute("data-theme", t);
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-theme-toggle]"); if (!b) return;
    var cur = document.documentElement.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var nx = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nx); store("theme", nx);
  });

  /* Mobile menu */
  var mb = $(".menu-btn"), nav = $(".nav");
  if (mb && nav) mb.addEventListener("click", function () {
    var o = nav.classList.toggle("open"); mb.setAttribute("aria-expanded", o);
  });

  /* Toast */
  window.toast = function (msg) {
    var el = $(".toast"); if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add("show"); clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove("show"); }, 2600);
  };

  /* Share / copy helpers */
  window.shareIt = function (title, url) {
    url = url || location.href;
    if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); }
    else if (navigator.clipboard) { navigator.clipboard.writeText(title + " " + url); toast("Link copied!"); }
  };
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-share]"); if (b) { e.preventDefault(); shareIt(b.getAttribute("data-share") || document.title); }
  });

  /* Reveal on scroll */
  if ("IntersectionObserver" in window && !/bot|crawl|spider|Lighthouse/i.test(navigator.userAgent)) {
    document.documentElement.classList.add("js-anim");
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { threshold: .08 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else $$(".reveal").forEach(function (el) { el.classList.add("in"); });

  /* Year */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Lite YouTube embeds */
  window.renderVideos = function (el, list) {
    if (!el) return;
    el.innerHTML = list.map(function (v) {
      return '<div><div class="yt" data-yt="' + v.id + '" role="button" tabindex="0" aria-label="Play: ' + v.t.replace(/"/g, "") + '">' +
        '<img loading="lazy" src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg" alt="">' +
        '<span class="play"><b>▶</b></span></div><div class="vt">' + v.t + '</div></div>';
    }).join("");
  };
  function playYT(el) {
    var id = el.getAttribute("data-yt");
    el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  }
  document.addEventListener("click", function (e) { var y = e.target.closest(".yt[data-yt]"); if (y && !y.querySelector("iframe")) playYT(y); });
  document.addEventListener("keydown", function (e) { if (e.key === "Enter") { var y = e.target.closest && e.target.closest(".yt[data-yt]"); if (y && !y.querySelector("iframe")) playYT(y); } });
  $$("[data-videos]").forEach(function (el) {
    var n = parseInt(el.getAttribute("data-videos"), 10) || 99;
    renderVideos(el, (window.VIDEOS || []).slice(0, n));
  });

  /* Donation links: fall back to the pledge form when not configured */
  $$("[data-donate]").forEach(function (a) {
    var k = a.getAttribute("data-donate"), u = S.donate && S.donate[k];
    if (u) { a.href = u; a.target = "_blank"; a.rel = "noopener"; }
    else { a.href = a.getAttribute("href") || "support.html#pledge"; }
  });
  $$("[data-aff]").forEach(function (a) {
    var u = S.affiliates && S.affiliates[a.getAttribute("data-aff")];
    if (u) { a.href = u; a.target = "_blank"; a.rel = "sponsored noopener"; } else a.style.display = "none";
  });
  $$("[data-social]").forEach(function (a) {
    var u = S.social && S.social[a.getAttribute("data-social")];
    if (u) { a.href = u; a.target = "_blank"; a.rel = "noopener"; } else a.parentNode && a.parentNode.tagName === "LI" ? a.parentNode.remove() : a.remove();
  });

  /* ---------- Forms: private relay (address never exposed in markup) ---------- */
  function relayURL() { return "https://formsubmit.co/ajax/" + window.__relay(); }
  $$("form.js-form").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = f.querySelector(".form-msg");
      if (f.querySelector('[name="_honey"]') && f.querySelector('[name="_honey"]').value) return;
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var data = {};
      new FormData(f).forEach(function (v, k) { if (k === "_honey") return; data[k] = data[k] ? data[k] + ", " + v : v; });
      data._subject = "[02333.com] " + (f.getAttribute("data-subject") || "Website form") + (data.name ? " — " + data.name : "");
      data._template = "table"; data._captcha = "false";
      data.page = location.href; data.submitted = new Date().toISOString();
      var btn = f.querySelector('[type="submit"]'); var old = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      fetch(relayURL(), { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === "false" || j.success === false) throw new Error(j.message || "Failed"); }); })
        .then(function () {
          if (msg) { msg.className = "form-msg ok"; msg.textContent = f.getAttribute("data-ok") || "Thank you! We received your message and will reply within 1–2 business days."; }
          f.reset(); if (window.gtag) gtag("event", "generate_lead", { form: f.getAttribute("data-subject") });
          if (f._onok) f._onok();
        })
        .catch(function () {
          if (msg) { msg.className = "form-msg err"; msg.innerHTML = 'Something went wrong. Please try again, or use our <a href="https://web.works/contact" target="_blank" rel="noopener">contact page</a>.'; }
        })
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = old; } });
    });
  });

  /* Multi-step forms */
  $$("[data-steps]").forEach(function (f) {
    var steps = $$(".step", f), bars = $$(".steps span", f), i = 0;
    function go(n) {
      if (n > i) { var inv = $$("input,select,textarea", steps[i]).filter(function (x) { return !x.checkValidity(); }); if (inv.length) { inv[0].reportValidity(); return; } }
      i = Math.max(0, Math.min(steps.length - 1, n));
      steps.forEach(function (s, k) { s.classList.toggle("on", k === i); });
      bars.forEach(function (b, k) { b.classList.toggle("on", k <= i); });
    }
    f.addEventListener("click", function (e) {
      if (e.target.closest("[data-next]")) { e.preventDefault(); go(i + 1); }
      if (e.target.closest("[data-prev]")) { e.preventDefault(); go(i - 1); }
    });
    f._onok = function () { go(0); };
    go(0);
  });

  /* ---------- Consent, AdSense & analytics ---------- */
  function loadScript(src, attrs) { var s = document.createElement("script"); s.async = true; s.src = src; for (var k in (attrs || {})) s.setAttribute(k, attrs[k]); document.head.appendChild(s); }
  function fillAds(personal) {
    var client = S.adsense && S.adsense.client;
    $$(".ad[data-slot]").forEach(function (box) {
      var slot = S.adsense && S.adsense.slots && S.adsense.slots[box.getAttribute("data-slot")];
      if (client && slot) {
        box.innerHTML = '<span class="ad-label">Advertisement</span><ins class="adsbygoogle" style="display:block" data-ad-client="' + client + '" data-ad-slot="' + slot + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
        (window.adsbygoogle = window.adsbygoogle || []);
        if (!personal) window.adsbygoogle.requestNonPersonalizedAds = 1;
        try { window.adsbygoogle.push({}); } catch (e) {}
      } else {
        box.innerHTML = '<div class="ad-ph"><span class="ad-label">Ad space</span>Reach a global audience curious about China. <a href="advertise.html">Advertise here →</a></div>';
      }
    });
    if (client) loadScript("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + client, { crossorigin: "anonymous" });
  }
  function loadGA() {
    if (!S.ga4) return;
    loadScript("https://www.googletagmanager.com/gtag/js?id=" + S.ga4);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", S.ga4, { anonymize_ip: true });
  }
  var consent = store("consent");
  function applyConsent(c) { fillAds(c === "all"); if (c === "all") loadGA(); }
  if (consent) applyConsent(consent);
  else {
    fillAds(false);
    var cb = document.createElement("div"); cb.className = "cookie show"; cb.setAttribute("role", "dialog"); cb.setAttribute("aria-label", "Cookie consent");
    cb.innerHTML = '<p class="small" style="margin-bottom:10px"><b>Cookies & ads.</b> We use cookies for ads (Google AdSense), analytics and to remember your settings. See our <a href="privacy.html">Privacy Policy</a>.</p><div class="btns"><button class="btn btn-red" data-c="all">Accept all</button><button class="btn btn-ghost" data-c="essential">Essential only</button></div>';
    document.body.appendChild(cb);
    cb.addEventListener("click", function (e) { var b = e.target.closest("[data-c]"); if (!b) return; var c = b.getAttribute("data-c"); store("consent", c); cb.remove(); if (c === "all") { loadGA(); } });
  }
})();
