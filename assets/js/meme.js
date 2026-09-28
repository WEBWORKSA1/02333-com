document.addEventListener("DOMContentLoaded", function () {
  var cv = document.getElementById("m-canvas"), ctx = cv.getContext("2d"), sel = document.getElementById("m-code");
  var STY = { red: ["#d7261e", "#8f1510", "#ffd65c", "#fff"], gold: ["#f2b705", "#b98a00", "#1c1917", "#1c1917"], ink: ["#1c1917", "#000", "#ff4d42", "#fff"], jade: ["#0f8a6a", "#075440", "#ffd65c", "#fff"] };
  var style = "red", img = null;
  sel.innerHTML = SLANG.filter(function (e) { return e.rating !== "crude"; }).map(function (e) { return '<option value="' + esc(e.n) + '">' + esc(e.n) + " — " + esc(e.en) + "</option>"; }).join("");
  sel.value = "2333";
  function wrap(t, x, y, max, lh) {
    var w = t.split(" "), line = "", lines = [];
    w.forEach(function (word) { var test = line + word + " "; if (ctx.measureText(test).width > max && line) { lines.push(line.trim()); line = word + " "; } else line = test; });
    lines.push(line.trim()); lines.forEach(function (l, k) { ctx.strokeText(l, x, y + k * lh); ctx.fillText(l, x, y + k * lh); });
  }
  function draw() {
    var s = STY[style], e = SLANG.filter(function (x) { return x.n === sel.value; })[0];
    var g = ctx.createLinearGradient(0, 0, 1080, 1080); g.addColorStop(0, s[0]); g.addColorStop(1, s[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1080);
    if (img) { var r = Math.max(1080 / img.width, 1080 / img.height); ctx.globalAlpha = .55; ctx.drawImage(img, (1080 - img.width * r) / 2, (1080 - img.height * r) / 2, img.width * r, img.height * r); ctx.globalAlpha = 1; }
    ctx.textAlign = "center"; ctx.lineJoin = "round";
    ctx.font = "800 300px 'Space Grotesk', Inter, sans-serif"; ctx.fillStyle = s[2]; ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 10;
    var fs = 300; while (ctx.measureText(e.n).width > 960 && fs > 80) { fs -= 10; ctx.font = "800 " + fs + "px 'Space Grotesk', Inter, sans-serif"; }
    ctx.strokeText(e.n, 540, 640); ctx.fillText(e.n, 540, 640);
    ctx.font = "700 44px Inter, 'PingFang SC', 'Microsoft YaHei', sans-serif"; ctx.fillStyle = s[3]; ctx.lineWidth = 0;
    ctx.fillText(e.zh + "  ·  " + e.en, 540, 730);
    ctx.font = "800 64px Inter, sans-serif"; ctx.lineWidth = 8; ctx.strokeStyle = "rgba(0,0,0,.55)"; ctx.fillStyle = "#fff";
    wrap(document.getElementById("m-top").value.toUpperCase(), 540, 130, 980, 74);
    wrap(document.getElementById("m-bot").value.toUpperCase(), 540, 890, 980, 74);
    ctx.font = "700 28px Inter, sans-serif"; ctx.lineWidth = 0; ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.fillText("02333.com", 540, 1050);
  }
  ["m-code", "m-top", "m-bot"].forEach(function (id) { document.getElementById(id).addEventListener("input", draw); });
  document.getElementById("m-style").addEventListener("click", function (e) { var b = e.target.closest("[data-s]"); if (!b) return; style = b.dataset.s; $$("#m-style .chip").forEach(function (c) { c.classList.toggle("on", c === b); }); draw(); });
  document.getElementById("m-img").addEventListener("change", function (e) { var f = e.target.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { img = new Image(); img.onload = draw; img.src = r.result; }; r.readAsDataURL(f); });
  document.getElementById("m-dl").addEventListener("click", function () { var a = document.createElement("a"); a.download = "02333-meme-" + sel.value + ".png"; a.href = cv.toDataURL("image/png"); a.click(); if (window.gtag) gtag("event", "meme_download"); });
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(draw); draw();
});
