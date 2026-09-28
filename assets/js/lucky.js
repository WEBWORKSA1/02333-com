document.addEventListener("DOMContentLoaded", function () {
  var out = document.getElementById("lk-out"), inp = document.getElementById("lk-n");
  document.getElementById("digit-table").innerHTML = Object.keys(DIGITS).map(function (d) {
    var s = DIGITS[d].s; return '<div class="card"><div class="row" style="display:flex;gap:10px;align-items:center"><span class="score" style="font-size:2.4rem">' + d + '</span><span class="badge ' + (s > 0 ? "safe" : s < 0 ? "crude" : "") + '">' + (s > 0 ? "Lucky +" + s : s < 0 ? "Unlucky " + s : "Neutral") + '</span></div><p class="small muted" style="margin:8px 0 0">' + esc(DIGITS[d].w) + "</p></div>";
  }).join("");

  function analyze(raw) {
    var d = raw.replace(/\D/g, ""); if (!d) return null;
    var base = 0; d.split("").forEach(function (c) { base += DIGITS[c].s; });
    var found = [], bonus = 0;
    COMBOS.forEach(function (c) { var i = d.indexOf(c.p); if (i > -1) { found.push(c); bonus += c.s; } });
    var last = DIGITS[d[d.length - 1]].s; // ending digit matters most
    var raw10 = (base / d.length) * 12 + bonus * 5 + last * 4;
    var score = Math.round(Math.max(1, Math.min(99, 50 + raw10)));
    return { d: d, score: score, found: found };
  }
  function better(d) {
    var alts = [];
    var a = d.replace(/4/g, "8"); if (a !== d) alts.push(a);
    var b = d.replace(/4/g, "6"); if (b !== d && alts.indexOf(b) < 0) alts.push(b);
    var c = d.slice(0, -1) + "8"; if (c !== d && alts.indexOf(c) < 0) alts.push(c);
    return alts.slice(0, 3);
  }
  function verdict(s) {
    if (s >= 85) return ["大吉 Very auspicious", "A number many Chinese buyers would pay extra for."];
    if (s >= 65) return ["吉 Lucky", "Positive associations. Safe for business use."];
    if (s >= 45) return ["平 Neutral", "Nothing alarming. A tweak or two could lift it."];
    if (s >= 25) return ["小凶 Slightly unlucky", "Some customers may notice. Consider an alternative."];
    return ["凶 Unlucky", "Heavy with 4s or negative combos. Avoid for launches, prices or addresses."];
  }
  function render(r) {
    var v = verdict(r.score);
    var tiles = r.d.split("").map(function (c) { var s = DIGITS[c].s; return '<div class="dg ' + (s > 0 ? "pos" : s < 0 ? "neg" : "") + '" title="' + esc(DIGITS[c].w) + '"><b>' + c + "</b><small>" + (s > 0 ? "+" + s : s) + "</small></div>"; }).join("");
    var combos = r.found.length ? "<ul>" + r.found.map(function (c) { return "<li><b>" + c.p + "</b> — " + esc(c.w) + ' <span class="badge ' + (c.s > 0 ? "safe" : "crude") + '">' + (c.s > 0 ? "+" : "") + c.s + "</span></li>"; }).join("") + "</ul>" : '<p class="muted small">No special combinations found.</p>';
    var alts = r.score < 70 ? better(r.d) : [];
    out.innerHTML = '<span class="eyebrow">Your result</span><div style="display:flex;align-items:end;gap:14px;flex-wrap:wrap"><div class="score">' + r.score + '</div><div><b style="font-size:1.2rem">' + v[0] + '</b><br><span class="muted small">' + v[1] + "</span></div></div>" +
      '<div class="meter" aria-hidden="true"><i style="left:calc(' + r.score + '% - 2px)"></i></div>' +
      '<h3 style="margin-top:16px">Digit breakdown</h3><div class="digits">' + tiles + "</div>" +
      '<h3 style="margin-top:16px">Combinations spotted</h3>' + combos +
      (alts.length ? '<h3>Luckier alternatives</h3><div class="chips">' + alts.map(function (a) { return '<button class="chip" data-alt="' + a + '">' + a + "</button>"; }).join("") + "</div>" : "") +
      '<div class="btns" style="margin-top:16px"><button class="btn btn-gold" data-share="My number scored ' + r.score + '/99 on the Chinese Lucky Number Analyzer — try yours at 02333">Share my score</button><a class="btn btn-ghost" href="#a-n">Email full report</a></div>';
    document.getElementById("lk-hidden").value = r.d + " (score " + r.score + ", " + document.getElementById("lk-type").value + ")";
    if (window.gtag) gtag("event", "lucky_check", { value: r.score });
  }
  out.addEventListener("click", function (e) { var b = e.target.closest("[data-alt]"); if (b) { inp.value = b.getAttribute("data-alt"); go(); } });
  function go() { var r = analyze(inp.value); if (r) render(r); else out.innerHTML = '<p class="muted">Please enter at least one digit.</p>'; }
  document.getElementById("lk-form").addEventListener("submit", function (e) { e.preventDefault(); go(); history.replaceState(null, "", "?n=" + encodeURIComponent(inp.value)); });
  var p = new URLSearchParams(location.search).get("n"); if (p) { inp.value = p; go(); }
});
