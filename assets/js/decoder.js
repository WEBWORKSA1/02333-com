document.addEventListener("DOMContentLoaded", function () {
  var q = document.getElementById("dq"), res = document.getElementById("results"), cnt = document.getElementById("count"),
      fb = document.getElementById("fallback"), cats = document.getElementById("cats"), hide = document.getElementById("hide-crude");
  var CATS = { all: "All", reaction: "Reactions", love: "Love", praise: "Praise", luck: "Luck & money", chat: "Chat", work: "Work life", insult: "Insults" };
  var cur = "all";
  cats.innerHTML = Object.keys(CATS).map(function (k) { return '<button class="chip' + (k === "all" ? " on" : "") + '" data-cat="' + k + '">' + CATS[k] + "</button>"; }).join("");
  cats.addEventListener("click", function (e) { var b = e.target.closest("[data-cat]"); if (!b) return; cur = b.getAttribute("data-cat"); $$(".chip", cats).forEach(function (c) { c.classList.toggle("on", c === b); }); run(); });
  hide.addEventListener("change", run);

  function digitReading(num) {
    var d = num.replace(/\D/g, ""); if (!d) return "";
    var parts = d.split("").map(function (c) { return "<li><b>" + c + "</b> — " + esc(DIGITS[c].w) + "</li>"; }).join("");
    return '<div class="card" style="margin-bottom:18px"><h3>No fixed slang meaning for “' + esc(d) + '” yet</h3><p class="muted">Here is a digit-by-digit reading based on Chinese sound-alikes:</p><ul>' + parts +
      '</ul><div class="btns"><a class="btn btn-red" href="lucky-numbers.html?n=' + d + '">Check its luck score →</a><a class="btn btn-ghost" href="#s-n">Suggest a meaning</a></div></div>';
  }
  function run() {
    var term = (q.value || "").trim().toLowerCase();
    var list = SLANG.filter(function (e) {
      if (cur !== "all" && e.cat !== cur) return false;
      if (hide.checked && e.rating === "crude") return false;
      if (!term) return true;
      var digits = term.replace(/\s/g, "");
      if (/^\d+$/.test(digits)) return e.n.indexOf(digits) === 0 || e.n === digits;
      return (e.n + " " + e.zh + " " + e.py + " " + e.en + " " + e.how).toLowerCase().indexOf(term) > -1;
    });
    var exact = SLANG.filter(function (e) { return e.n.toLowerCase() === term; });
    if (exact.length) list = exact.concat(list.filter(function (e) { return e !== exact[0]; }));
    res.innerHTML = list.map(function (e) { return entryCard(e, true); }).join("");
    fb.innerHTML = (!exact.length && /^\d+$/.test(term)) ? digitReading(term) : "";
    cnt.textContent = list.length + (list.length === 1 ? " code" : " codes") + (term ? " matching “" + term + "”" : "");
    if (!list.length && !fb.innerHTML) res.innerHTML = '<div class="empty">No match. Try a number like 520 or a word like “love”.</div>';
    if (window.gtag && term) gtag("event", "search", { search_term: term });
  }
  document.getElementById("dec-form").addEventListener("submit", function (e) {
    e.preventDefault(); history.replaceState(null, "", "?q=" + encodeURIComponent(q.value)); run();
  });
  q.addEventListener("input", run);
  document.getElementById("rand").addEventListener("click", function () {
    var pool = SLANG.filter(function (e) { return !hide.checked || e.rating !== "crude"; });
    q.value = pool[Math.floor(Math.random() * pool.length)].n; run(); window.scrollTo({ top: res.offsetTop - 120, behavior: "smooth" });
  });
  var p = new URLSearchParams(location.search).get("q"); if (p) q.value = p;
  run();
});
