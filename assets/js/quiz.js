document.addEventListener("DOMContentLoaded", function () {
  var box = document.getElementById("quiz"), i = 0, score = 0, qs = QUIZ.slice().sort(function () { return Math.random() - .5; });
  var TITLES = [[9, "666 Master 🏆", "You read Chinese internet like a native netizen."], [7, "1314 Loyal Fan", "Strong! A few codes still to collect."], [4, "2333 Giggler", "You get the jokes, mostly. Keep decoding."], [0, "886 Newbie", "Everyone starts somewhere. Hit the decoder and try again."]];
  function show() {
    if (i >= qs.length) return done();
    var q = qs[i];
    box.innerHTML = '<div class="steps">' + qs.map(function (_, k) { return '<span class="' + (k <= i ? "on" : "") + '"></span>'; }).join("") + '</div><p class="muted small">Question ' + (i + 1) + " of " + qs.length + "</p><h2>" + esc(q.q) + "</h2>" +
      q.a.map(function (a, k) { return '<button class="q-opt" data-k="' + k + '">' + esc(a) + "</button>"; }).join("");
  }
  box.addEventListener("click", function (e) {
    var b = e.target.closest(".q-opt"); if (!b || box.dataset.lock) return;
    box.dataset.lock = 1; var k = +b.dataset.k, c = qs[i].c;
    if (k === c) { score++; b.classList.add("right"); } else { b.classList.add("wrong"); $$(".q-opt", box)[c].classList.add("right"); }
    setTimeout(function () { delete box.dataset.lock; i++; show(); }, 850);
  });
  function done() {
    var t = TITLES.filter(function (x) { return score >= x[0]; })[0];
    box.innerHTML = '<span class="eyebrow">Your result</span><div class="score">' + score + "/10</div><h2>" + t[1] + '</h2><p class="muted">' + t[2] + "</p>" +
      '<div class="btns"><button class="btn btn-gold" data-share="I scored ' + score + '/10 and I\'m a ' + t[1] + ' on the Chinese slang quiz at 02333!">Share my result</button><button class="btn btn-ghost" id="again">Try again</button><a class="btn btn-ghost" href="decoder.html">Study the codes</a></div>' +
      '<hr style="border:0;border-top:1px solid var(--line);margin:22px 0"><h3>Get a new code every day</h3><form class="js-form" data-subject="Newsletter signup (quiz)" id="qnl"><input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true"><input type="hidden" name="quiz_score" value="' + score + '"><div class="search" style="max-width:none"><label class="sr" for="qe">Email</label><input id="qe" type="email" name="email" placeholder="you@email.com" required><button class="btn btn-red" type="submit">Subscribe</button></div><div class="form-msg" role="status"></div></form>';
    document.getElementById("again").onclick = function () { i = 0; score = 0; qs.sort(function () { return Math.random() - .5; }); show(); };
    bindForm(document.getElementById("qnl"));
    if (window.gtag) gtag("event", "quiz_complete", { value: score });
  }
  function bindForm(f) { // late-bound form (main.js binds forms present at load)
    f.addEventListener("submit", function (e) {
      e.preventDefault(); var m = f.querySelector(".form-msg"); var d = {}; new FormData(f).forEach(function (v, k) { if (k !== "_honey") d[k] = v; });
      if (f._honey && f._honey.value) return;
      d._subject = "[02333.com] Newsletter signup (quiz)"; d._captcha = "false"; d._template = "table";
      fetch("https://formsubmit.co/ajax/" + window.__relay(), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(d) })
        .then(function (r) { if (!r.ok) throw 0; m.className = "form-msg ok"; m.textContent = "Subscribed! See you tomorrow."; f.reset(); })
        .catch(function () { m.className = "form-msg err"; m.textContent = "Couldn't subscribe right now — please try again."; });
    });
  }
  show();
});
