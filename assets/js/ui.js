/* Shared render helpers */
window.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
window.RATING = { safe: "✓ Safe for all", casual: "Casual / friends", crude: "⚠ Crude — avoid at work" };
window.entryCard = function (e, full) {
  var rel = (e.rel || []).map(function (r) { return '<a class="chip" href="decoder.html?q=' + encodeURIComponent(r) + '">' + esc(r) + "</a>"; }).join("");
  return '<article class="card entry reveal in" id="n-' + esc(e.n) + '">' +
    '<div class="row"><span class="n">' + esc(e.n) + '</span><span class="badge ' + e.rating + '">' + RATING[e.rating] + '</span><span class="badge">' + esc(e.cat) + "</span></div>" +
    '<div class="zh" lang="zh">' + esc(e.zh) + '</div><div class="py">' + esc(e.py) + "</div>" +
    "<p style=\"margin:0\"><b>" + esc(e.en) + "</b></p>" +
    (full ? '<p class="muted small" style="margin:0">' + esc(e.how) + "</p>" +
      (e.ex && e.ex !== "—" ? '<div class="ex"><span lang="zh">' + esc(e.ex) + '</span><br><span class="muted">' + esc(e.exen) + "</span></div>" : "") +
      (rel ? '<div class="chips" style="margin-top:4px">' + rel + "</div>" : "") : "") +
    '<div class="acts"><button data-copy="' + esc(e.n + " = " + e.en) + '">Copy</button><button data-share="' + esc(e.n + " in Chinese slang = " + e.en + " — decoded on 02333") + '">Share</button>' +
    (full ? "" : '<a class="chip" style="margin-left:auto" href="decoder.html?q=' + encodeURIComponent(e.n) + '">Details →</a>') + "</div></article>";
};
document.addEventListener("click", function (ev) {
  var b = ev.target.closest("[data-copy]"); if (!b) return;
  if (navigator.clipboard) navigator.clipboard.writeText(b.getAttribute("data-copy") + " — " + location.origin + location.pathname.replace(/[^/]*$/, "") + "decoder.html");
  if (window.toast) toast("Copied!");
});
window.numberOfDay = function () {
  var d = new Date(); var i = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
  var pool = SLANG.filter(function (x) { return x.rating === "safe"; }); return pool[i % pool.length];
};
window.countdown = function (el, target) {
  if (!el) return;
  function tick() {
    var ms = Math.max(0, target - new Date()), d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
    el.innerHTML = [["Days", d], ["Hours", h], ["Min", m], ["Sec", s]].map(function (x) { return "<div><b>" + x[1] + '</b><span class="small muted">' + x[0] + "</span></div>"; }).join("");
  }
  tick(); setInterval(tick, 1000);
};
window.monthEnd = function () { var d = new Date(); return new Date(d.getFullYear(), d.getMonth() + 1, 1); };
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-countdown]").forEach(function (el) { countdown(el, monthEnd()); });
});
