document.addEventListener("DOMContentLoaded", function () {
  var el = document.getElementById("art-list");
  if (el) el.innerHTML = ARTICLES.map(function (a) {
    return '<a class="card" href="' + a.url + '"><span class="badge">' + a.tag + '</span> <span class="small muted">' + a.min + ' min read</span><h3 style="margin-top:10px">' + esc(a.t) + '</h3><p class="muted small">' + esc(a.d) + '</p><span class="small" style="color:var(--red);font-weight:700">Read guide →</span></a>';
  }).join("");
});
