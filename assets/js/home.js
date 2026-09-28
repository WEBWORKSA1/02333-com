document.addEventListener("DOMContentLoaded", function () {
  var e = numberOfDay();
  var box = document.getElementById("notd");
  if (box) box.innerHTML = '<div class="n">' + esc(e.n) + '</div><div class="zh" lang="zh">' + esc(e.zh) + '</div><div class="muted" style="font-style:italic">' + esc(e.py) + '</div><p style="margin-top:10px"><b>' + esc(e.en) + '</b></p><p class="muted small">' + esc(e.how) + "</p>";
  var l = document.getElementById("notd-link"); if (l) l.href = "decoder.html?q=" + encodeURIComponent(e.n);
  var pick = ["2333", "520", "666", "1314", "888", "996"];
  var tr = document.getElementById("trending");
  if (tr) tr.innerHTML = pick.map(function (n) { return entryCard(SLANG.filter(function (x) { return x.n === n; })[0], false); }).join("");
  var ar = document.getElementById("home-articles");
  if (ar) ar.innerHTML = ARTICLES.map(function (a) {
    return '<a class="card" href="' + a.url + '"><span class="badge">' + a.tag + '</span> <span class="small muted">' + a.min + ' min read</span><h3 style="margin-top:10px">' + esc(a.t) + '</h3><p class="muted small">' + esc(a.d) + "</p></a>";
  }).join("");
});
