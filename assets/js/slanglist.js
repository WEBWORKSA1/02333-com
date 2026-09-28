document.addEventListener("DOMContentLoaded", function () {
  var el = document.getElementById("slang-table"); if (!el) return;
  var G = { reaction: "Reactions", love: "Love & romance", praise: "Praise", luck: "Luck & money", chat: "Everyday chat", work: "Work life", insult: "Insults (avoid)" };
  el.innerHTML = Object.keys(G).map(function (g) {
    var rows = SLANG.filter(function (e) { return e.cat === g; });
    if (!rows.length) return "";
    return "<h2>" + G[g] + "</h2><table><thead><tr><th>Code</th><th>Chinese</th><th>Meaning</th><th>Use</th></tr></thead><tbody>" +
      rows.map(function (e) { return '<tr><td><a href="decoder.html?q=' + encodeURIComponent(e.n) + '"><b>' + esc(e.n) + '</b></a></td><td lang="zh">' + esc(e.zh) + "<br><small>" + esc(e.py) + "</small></td><td>" + esc(e.en) + '</td><td><span class="badge ' + e.rating + '">' + e.rating + "</span></td></tr>"; }).join("") + "</tbody></table>";
  }).join("");
});
