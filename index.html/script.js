const W0 = [
  ["过", "guo", "đã từng", "🚶"],
  ["商场", "shāngchǎng", "trung tâm thương mại", "🏬"],
  ["进去", "jìnqù", "đi vào", "🚪"],
  ["条", "tiáo", "cái, chiếc (quần, váy)", "📏"],
  ["裤子", "kùzi", "quần", "👖"],
  ["白色", "báisè", "màu trắng", "⚪"],
  ["因为", "yīnwèi", "bởi vì", "🤔"],
  ["试", "shì", "thử", "👗"],
  ["红色", "hóngsè", "màu đỏ", "🔴"],
  ["所以", "suǒyǐ", "cho nên", "👉"],
  ["书包", "shūbāo", "cặp sách", "🎒"],
  ["过去", "guòqù", "đi sang", "🏃"],
  ["绿色", "lǜsè", "màu xanh lá cây", "🟢"],
  ["黑色", "hēisè", "màu đen", "⚫"],
  ["更", "gèng", "càng, hơn", "⬆️"],
];
const PETS = ["🐱", "🐶", "🐰", "🐼", "🐸", "🐥", "🦊", "🐻", "🐨", "🐯"];
const OKS = [
  "Giỏi Nhỉ!",
  "Chính xác! Vỗ tay nào 👏",
  "Tuyệt vời!",
  "Bạn Thì Kinh Rồi!",
];
const NO = [
  "Tiếc quá, cùng nhớ lại nhé!",
  "Chưa đúng rồi, Thử lại đi bạn êiii!",
  "Không sao, học từ này thôi!",
];
const $ = (id) => document.getElementById(id);
const shuf = (a) => {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const pick = (a) => a[Math.floor(Math.random() * a.length)];
function speak(t) {
  try {
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "zh-CN";
    u.rate = 0.8;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) {}
}

/* Âm thanh bằng WebAudio */
let AC = null;
function note(f, t, d, type, v) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(),
      g = AC.createGain(),
      s = AC.currentTime + t;
    o.type = type || "triangle";
    o.frequency.value = f;
    g.gain.setValueAtTime(0, s);
    g.gain.linearRampToValueAtTime(v || 0.25, s + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, s + d);
    o.connect(g);
    g.connect(AC.destination);
    o.start(s);
    o.stop(s + d + 0.05);
  } catch (e) {}
}
function cheer() {
  [523, 659, 784, 1047].forEach((f, i) => note(f, i * 0.11, 0.35));
  [1047, 1319, 1568].forEach((f, i) =>
    note(f, 0.5 + i * 0.09, 0.4, "sine", 0.2),
  );
}
function aww() {
  [392, 330, 262].forEach((f, i) => note(f, i * 0.2, 0.4, "sine", 0.22));
}
function fanfare() {
  [523, 523, 523, 659, 784, 659, 784, 1047].forEach((f, i) =>
    note(f, i * 0.15, 0.4, "triangle", 0.28),
  );
  [1047, 1319, 1568, 2093].forEach((f, i) =>
    note(f, 1.3 + i * 0.1, 0.5, "sine", 0.2),
  );
}
function fx(a, n) {
  for (let i = 0; i < (n || 28); i++) {
    const s = document.createElement("span");
    s.className = "fx";
    s.textContent = a[i % a.length];
    s.style.left = Math.random() * 95 + "vw";
    s.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 2800);
  }
}

let cfg = { mode: 2, r: 10, time: 20 },
  G = null,
  tm = null;
function setup() {
  clearInterval(tm);
  const o = (k, v) =>
    v
      .map(
        (x) =>
          `<button class="${cfg[k] === x[0] ? "on" : ""}" onclick="cfg.${k}=${x[0]};setup()">${x[1]}</button>`,
      )
      .join("");
  $("app").innerHTML =
    `<div class="card"><div class="parade">🐱🐶🐰🐼</div><h1>MINI - GAME</h1>
  <p style="font-size:18px">Tập trung chơi game nào, thống nhất đáp án rồi chọn nhíeee!</p>
  <div class="lab">Chọn kiểu câu hỏi</div><div class="opt">${o("mode", [
    [0, "A. Xem nghĩa → chọn chữ Hán"],
    [1, "B. Xem chữ Hán → chọn nghĩa"],
    [2, "C. All in"],
  ])}</div>
  <div class="lab">Chọn số câu</div><div class="opt">${o("r", [
    [5, "A. 5 câu"],
    [10, "B. 10 câu"],
    [15, "C. 15 từ"],
  ])}</div>
  <div class="lab">Thời gian mỗi câu</div><div class="opt">${o("time", [
    [0, "Không giới hạn"],
    [20, "20 giây"],
    [10, "10 giây"],
  ])}</div>
  <button class="btn" onclick="begin()">▶ Start now!</button></div>`;
}
function begin() {
  note(1, 0, 0.01);
  G = {
    qs: shuf(W0)
      .slice(0, cfg.r)
      .map((w) => ({
        w,
        t: cfg.mode === 2 ? Math.floor(Math.random() * 2) : cfg.mode,
      })),
    i: 0,
    ok: 0,
    miss: [],
    done: false,
  };
  show();
}
function show() {
  clearInterval(tm);
  const q = G.qs[G.i],
    w = q.w;
  G.done = false;
  G.t = cfg.time;
  q.opts = shuf([w, ...shuf(W0.filter((x) => x !== w)).slice(0, 3)]);
  const body =
    q.t === 0
      ? `<div class="em">${w[3]}</div><div class="mn">${w[2]}</div><div class="py" id="py">&nbsp;</div>`
      : `<div class="hz">${w[0]}</div><div class="py">${w[1]}</div>`;
  const ask =
    q.t === 0 ? "Từ nào có nghĩa như vậy?" : "Từ này nghĩa là gì nhỉ?";
  $("app").innerHTML =
    `<div class="top"><span class="pill">Câu ${G.i + 1}/${G.qs.length}</span><div class="prog"><i style="width:${(G.i / G.qs.length) * 100}%"></i></div><span class="pill">✅ ${G.ok}</span></div>
  <div class="card"><div class="host"><div class="m">${pick(PETS)}</div><div class="say" id="say">${ask}</div></div>
  <div class="q">${body}</div>
  ${cfg.time ? `<div class="timer"><i id="tb" style="width:100%"></i></div>` : ""}
  <div class="ans">${q.opts.map((o, k) => `<button class="a a${k}" id="a${k}" onclick="choose(${k})"><b>${"ABCD"[k]}</b><span>${q.t === 0 ? o[0] : o[2]}</span></button>`).join("")}</div>
  <div class="ctl" id="ctl"></div><div class="info">Phím tắt: A B C D hoặc 1 2 3 4 để chọn, Enter để sang câu tiếp.</div></div>`;
  if (cfg.time)
    tm = setInterval(() => {
      G.t -= 0.1;
      const b = $("tb");
      if (b) b.style.width = Math.max(0, (G.t / cfg.time) * 100) + "%";
      if (G.t <= 0) choose(-1);
    }, 100);
}
function choose(k) {
  if (G.done) return;
  G.done = true;
  clearInterval(tm);
  const q = G.qs[G.i],
    w = q.w,
    right = k >= 0 && q.opts[k] === w;
  q.opts.forEach((o, j) => {
    const b = $("a" + j);
    if (o === w) b.classList.add("right");
    else if (j === k) b.classList.add("wrong");
    else b.classList.add("dim");
  });
  const py = $("py");
  if (py) py.innerHTML = w[0] + " · " + w[1];
  if (right) {
    G.ok++;
    cheer();
    fx(["🎉", "⭐", "🎊", "✨"]);
    $("say").textContent = pick(OKS);
  } else {
    G.miss.push(w);
    aww();
    fx(["💪", "🌈"], 10);
    $("say").textContent =
      k < 0 ? "Hết giờ rồi! Đáp án là " + (q.t === 0 ? w[0] : w[2]) : pick(NO);
  }
  setTimeout(() => speak(w[0]), 900);
  $("ctl").innerHTML =
    `<button class="btn" onclick="speak('${w[0]}')">🔊 Nghe</button><button class="btn" style="background:#3bc47f" onclick="next()">${G.i + 1 >= G.qs.length ? "Xem kết quả 🏆" : "Câu tiếp theo ▶"}</button>`;
}
function next() {
  if (!G.done) return;
  if (G.i + 1 >= G.qs.length) {
    final();
    return;
  }
  G.i++;
  show();
}
function final() {
  clearInterval(tm);
  fanfare();
  fx(["🏆", "🎉", "⭐", "🎊"], 40);
  const n = G.qs.length,
    p = G.ok / n,
    st = p >= 0.9 ? "⭐⭐⭐" : p >= 0.6 ? "⭐⭐" : "⭐";
  $("app").innerHTML =
    `<div class="card"><div class="parade">${pick(PETS)}${pick(PETS)}${pick(PETS)}</div><h1>Hoàn thành! 🎉</h1>
  <div class="big">${G.ok}/${n}</div><div style="font-size:44px">${st}</div>
  <p style="font-size:20px;font-weight:800">${p >= 0.9 ? "Ai trả lời giỏi vậy ta!" : p >= 0.6 ? "Rất tốt, 1 chút xíu nữa là good good roài!" : "Chơi dở quá, chơi lại để nhớ lâu hơn nào!"}</p>
  ${G.miss.length ? `<b>Các từ cần ôn lại:</b><div class="rv">${G.miss.map((w) => `${w[3]} <b>${w[0]}</b> (${w[1]}) = ${w[2]}`).join("<br>")}</div>` : ""}
  <div class="ctl"><button class="btn" onclick="begin()">🔁 Chơi lại</button><button class="btn g" onclick="setup()">⚙ Cài đặt</button></div></div>`;
}
document.addEventListener("keydown", (e) => {
  if (!G || !$("a0")) return;
  const k = "abcd".indexOf(e.key.toLowerCase()),
    n = +e.key - 1;
  if (k >= 0) choose(k);
  else if (n >= 0 && n < 4) choose(n);
  else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    next();
  }
});
setup();

