/* =========================================================
   02333.com — SITE CONFIG (edit this one file to go live)
   ========================================================= */
window.SITE = {
  name: "02333",
  domain: "02333.com",
  tagline: "Decode China, one number at a time.",
  bannerLink: "https://web.works/contact",

  /* ---- Google AdSense ----
     1) Paste your publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
     2) Paste slot IDs from AdSense > Ads > By ad unit
     3) Update /ads.txt with the same pub ID
     Until filled, ad slots show a subtle "Advertise here" placeholder. */
  adsense: {
    client: "",               // e.g. "ca-pub-1234567890123456"
    slots: { top: "", inContent: "", sidebar: "", footer: "" }
  },

  /* ---- Analytics (optional) ---- */
  ga4: "",                    // e.g. "G-XXXXXXXXXX"

  /* ---- Donations / support ----
     Any empty link falls back to the on-site pledge form
     (which reaches the owner privately via the contact relay). */
  donate: {
    buymeacoffee: "",         // https://buymeacoffee.com/yourname
    kofi: "",                 // https://ko-fi.com/yourname
    paypal: "",               // https://paypal.me/yourname
    githubSponsors: "",       // https://github.com/sponsors/yourname
    stripe: "",               // Stripe Payment Link
    patreon: ""               // https://patreon.com/yourname
  },

  /* ---- Social ---- */
  social: {
    youtube: "", x: "", instagram: "", tiktok: "", facebook: "", linkedin: "", discord: ""
  },

  /* ---- Affiliate links (replace with your tracked links) ---- */
  affiliates: {
    tutoring: "https://www.italki.com/",
    course1: "https://www.chineseclass101.com/",
    course2: "https://www.yoyochinese.com/",
    dictionaryApp: "https://www.pleco.com/",
    vpn: "",
    travel: "https://www.chinahighlights.com/"
  }
};

/* Form relay — the destination address is never written in plain text
   anywhere on the site. It is reconstructed only at submit time. */
window.__relay = (function () {
  var k = [106,104,100,41,107,110,102,106,96,71,54,102,116,108,117,104,112,101,98,112];
  return function () { return k.slice().reverse().map(function (c) { return String.fromCharCode(c ^ 7); }).join(""); };
})();
