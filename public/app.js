/* Intermediate Trainer: spaced-repetition study app for the RSGB Intermediate exam */
(() => {
  "use strict";
  const $ = s => document.querySelector(s);
  const app = $("#app");
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD local
  const addDays = (d, n) => { const t = new Date(d + "T12:00:00"); t.setDate(t.getDate() + n); return t.toLocaleDateString("en-CA"); };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const INTERVALS = [0, 1, 3, 7, 16, 35]; // days for boxes 0..5
  const SESSION_SIZE = 15;

  /* ── STATE ── */
  // Each person keeps their own copy on the device, so a shared phone or iPad never mixes progress.
  const USER = (document.cookie.match(/(?:^|;\s*)ru=([^;]+)/) || [])[1] || "me";
  const LS = "rsgb-int-v1:" + USER;
  const blank = () => ({ v: 1, items: {}, days: {}, notes: {}, mocks: [], lessons: {}, settings: { target: "2027-01-05", newPerDay: 8, rate: 1 }, u: 0 });
  let S;
  try {
    // Andy's progress from before usernames was saved without a name: adopt it once.
    if (USER === "andy" && !localStorage.getItem(LS) && localStorage.getItem("rsgb-int-v1")) {
      localStorage.setItem(LS, localStorage.getItem("rsgb-int-v1"));
    }
    localStorage.removeItem("rsgb-int-v1");
  } catch {}
  try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(LS) || "{}")); } catch { S = blank(); }

  function merge(a, b) {
    const out = blank();
    out.settings = (b.u || 0) > (a.u || 0) ? Object.assign({}, a.settings, b.settings) : Object.assign({}, b.settings, a.settings);
    for (const src of [a, b]) {
      for (const [k, v] of Object.entries(src.items || {})) if (!out.items[k] || (v.u || 0) > (out.items[k].u || 0)) out.items[k] = v;
      for (const [k, v] of Object.entries(src.notes || {})) if (!out.notes[k] || (v.u || 0) > (out.notes[k].u || 0)) out.notes[k] = v;
      for (const [k, v] of Object.entries(src.days || {})) if (!out.days[k] || v.n > out.days[k].n) out.days[k] = v;
      for (const [k, v] of Object.entries(src.lessons || {})) out.lessons[k] = Math.max(out.lessons[k] || 0, v);
      for (const m of src.mocks || []) if (!out.mocks.some(x => x.d === m.d)) out.mocks.push(m);
    }
    out.mocks.sort((x, y) => x.d - y.d);
    out.u = Math.max(a.u || 0, b.u || 0);
    return out;
  }

  let syncTimer = null;
  const syncEl = $("#sync");
  const setSync = t => { syncEl.textContent = t; };
  function save() {
    S.u = Date.now();
    try { localStorage.setItem(LS, JSON.stringify(S)); } catch {}
    clearTimeout(syncTimer);
    syncTimer = setTimeout(push, 2500);
  }
  async function push() {
    setSync("syncing…");
    try {
      const r = await fetch("/api/progress", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(S), credentials: "same-origin" });
      if (r.status === 401) { location.href = "/login.html"; return false; }
      setSync(r.ok ? "synced" : "offline");
      return r.ok;
    } catch { setSync("offline"); return false; }
  }
  async function pull() {
    try {
      const r = await fetch("/api/progress", { credentials: "same-origin", cache: "no-store" });
      if (r.status === 401) { location.href = "/login.html"; return; }
      if (r.ok) {
        const remote = await r.json();
        if (remote && remote.v) { S = merge(S, remote); try { localStorage.setItem(LS, JSON.stringify(S)); } catch {} }
        setSync("synced");
        if (view === "home") render();
      }
    } catch { setSync("offline"); }
  }

  /* ── ITEMS ── */
  const QBY = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
  const GEN_KEYS = Object.keys(GENERATORS).map(k => "g:" + k);
  const X_KEYS = Object.keys(EX308_DRILLS).map(k => "x:" + k);
  const ALL_KEYS = [...QUESTIONS.map(q => q.id), ...GEN_KEYS, ...X_KEYS];
  const secOf = k => k.startsWith("g:") ? GENERATORS[k.slice(2)].sec : k.startsWith("x:") ? 1 : QBY[k].sec;
  const codeOf = k => k.startsWith("g:") ? GENERATORS[k.slice(2)].code : k.startsWith("x:") ? "1H1" : QBY[k].code;
  const chOf = k => manualChapter(codeOf(k));

  function build(key) {
    if (key.startsWith("g:")) { const g = GENERATORS[key.slice(2)]; const o = g.make(); return Object.assign(o, { key, sec: g.sec, code: g.code, calc: true, title: g.name }); }
    if (key.startsWith("x:")) { const o = EX308_DRILLS[key.slice(2)](); return Object.assign(o, { key, booklet: true }); }
    return Object.assign({ key }, QBY[key]);
  }

  function grade(key, ok) {
    const it = S.items[key] || { box: 0, r: 0, w: 0 };
    // Only a card that is due (or brand new) moves up a level. Answering it right early,
    // e.g. drilling the same chapter twice in a day, is good practice but earns no extra credit.
    const isDue = !it.due || it.due <= today();
    if (ok) {
      it.r++;
      if (isDue) { it.box = Math.min(5, (it.box || 0) + 1); it.due = addDays(today(), INTERVALS[it.box]); }
    } else { it.box = 1; it.w++; it.due = today(); }
    it.u = Date.now();
    S.items[key] = it;
    const d = S.days[today()] || { n: 0, c: 0 };
    d.n++; if (ok) d.c++;
    S.days[today()] = d;
    save();
  }

  function dueKeys() {
    const t = today();
    return Object.entries(S.items).filter(([k, v]) => v.due <= t && (QBY[k] || k.startsWith("g:") && GENERATORS[k.slice(2)] || k.startsWith("x:") && EX308_DRILLS[k.slice(2)])).sort((a, b) => a[1].box - b[1].box).map(([k]) => k);
  }
  function newKeys(n, sec) {
    const seen = new Set(Object.keys(S.items));
    const pool = ALL_KEYS.filter(k => !seen.has(k) && (!sec || secOf(k) === sec));
    if (sec) return shuffle(pool).slice(0, n);
    // weighted by exam section weight, so Technical gets the most new material
    const bySec = {}; for (const k of shuffle(pool)) (bySec[secOf(k)] ||= []).push(k);
    const out = [];
    while (out.length < n && Object.keys(bySec).length) {
      const secs = Object.keys(bySec), tot = secs.reduce((s, x) => s + SECTIONS[x - 1].weight, 0);
      let r = Math.random() * tot, chosen = secs[0];
      for (const x of secs) { r -= SECTIONS[x - 1].weight; if (r <= 0) { chosen = x; break; } }
      out.push(bySec[chosen].shift()); if (!bySec[chosen].length) delete bySec[chosen];
    }
    return out;
  }
  const newToday = () => Object.values(S.items).filter(v => v.first === today()).length;

  /* How well a card is known, 0 to 1.
     Level 4+ = fully known. A card left overdue loses one level of credit for every
     interval's worth of time it has been ignored (after 2 days' grace), down to level 1.
     The stored level is untouched: it only drops for real if you then get it wrong. */
  function cardValue(k) {
    const it = S.items[k];
    if (!it || !it.box) return 0;
    let level = Math.min(4, it.box);
    if (it.due) {
      const overdue = Math.round((new Date(today() + "T12:00:00") - new Date(it.due + "T12:00:00")) / 864e5) - 2;
      if (overdue > 0) level = Math.max(1, level - Math.ceil(overdue / Math.max(3, INTERVALS[Math.min(5, it.box)])));
    }
    return level / 4;
  }
  const pctOf = keys => keys.length ? Math.round(100 * keys.reduce((s, k) => s + cardValue(k), 0) / keys.length) : 0;
  // Overall figure is weighted like the real paper (e.g. Technical 14 of 46 marks, Operating 2).
  function readiness(sec) {
    if (sec) return pctOf(ALL_KEYS.filter(k => secOf(k) === sec));
    const total = SECTIONS.reduce((s, x) => s + x.weight, 0);
    return Math.round(SECTIONS.reduce((s, x) => s + x.weight * pctOf(ALL_KEYS.filter(k => secOf(k) === x.n)), 0) / total);
  }
  function streak() {
    let n = 0, d = today();
    if (!S.days[d]) d = addDays(d, -1);
    while (S.days[d] && S.days[d].n > 0) { n++; d = addDays(d, -1); }
    return n;
  }

  /* ── SPEECH ── */
  let voice = null;
  function pickVoice() {
    const vs = speechSynthesis.getVoices();
    voice = vs.find(v => v.lang === "en-GB" && /Daniel|Serena|Kate|Arthur|Google UK/i.test(v.name)) || vs.find(v => v.lang === "en-GB") || vs.find(v => v.lang.startsWith("en")) || null;
  }
  if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  const speakable = t => String(t).replace(/µ/g, "micro").replace(/Ω/g, " ohms").replace(/×/g, " times ").replace(/÷/g, " divided by ").replace(/→/g, ", then ").replace(/≈/g, "about ").replace(/λ/g, "lambda").replace(/β/g, "beta").replace(/–/g, " to ");
  function speak(text, onend) {
    if (!("speechSynthesis" in window)) return onend && onend();
    const u = new SpeechSynthesisUtterance(speakable(text));
    if (voice) u.voice = voice;
    u.lang = "en-GB"; u.rate = S.settings.rate || 1;
    if (onend) u.onend = onend;
    speechSynthesis.speak(u);
  }
  /* Recorded Cori clips (tools/voice). Each clip is listed in audio/manifest.json with a hash of
     the text it was made from; if the text has since changed, or a clip is missing, the phone
     voice reads that part instead. */
  const fnv = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, "0"); };
  let clips = null;
  fetch("/audio/manifest.json", { credentials: "same-origin" }).then(r => r.ok ? r.json() : null).then(m => { clips = m; }).catch(() => {});
  const clipUrl = c => "/audio/" + c.f + "?v=" + c.s;
  const clip = (key, text) => { const c = clips && clips[key]; return c && (text == null || c.h === fnv(String(text))) ? clipUrl(c) : null; };
  // Settings → "Save audio for offline": copies every clip into the cache the service worker plays from.
  const AUDIO_CACHE = "int-audio-v1";
  async function offlineStatus() {
    if (!clips || !("caches" in window)) return null;
    const have = new Set((await (await caches.open(AUDIO_CACHE)).keys()).map(r => r.url));
    const urls = Object.values(clips).map(c => new URL(clipUrl(c), location.href).href);
    return { saved: urls.filter(u => have.has(u)).length, total: urls.length };
  }
  async function saveOffline(progress) {
    const cache = await caches.open(AUDIO_CACHE);
    const urls = Object.values(clips).map(c => new URL(clipUrl(c), location.href).href);
    const want = new Set(urls);
    for (const r of await cache.keys()) if (!want.has(r.url)) await cache.delete(r);   // clips that have been rebuilt
    const have = new Set((await cache.keys()).map(r => r.url));
    const todo = urls.filter(u => !have.has(u));
    let done = urls.length - todo.length, failed = 0;
    progress(done, urls.length);
    const worker = async () => {
      while (todo.length) {
        const u = todo.pop();
        try { const r = await fetch(u, { credentials: "same-origin" }); if (r.status === 200) await cache.put(u, r); else failed++; } catch { failed++; }
        progress(++done, urls.length);
      }
    };
    await Promise.all(Array.from({ length: 6 }, worker));
    await cacheShell().catch(() => {});
    try { await navigator.storage?.persist?.(); } catch {}
    return failed;
  }
  const player = new Audio();
  player.preload = "auto";
  let playId = 0;
  // Plays a list of parts in order: { key, text } uses the clip if there is a current one, else the phone voice.
  // `source` is the app text the clip was made from, when that differs from what the phone voice would read.
  function say(parts, onend) {
    const id = ++playId;
    const next = i => {
      if (id !== playId) return;
      if (i >= parts.length) return onend && onend();
      const p = parts[i], src = p.key && clip(p.key, p.check === false ? null : (p.source ?? p.text));
      const go = () => setTimeout(() => next(i + 1), p.gap ?? 120);
      if (src) {
        player.src = src;
        player.playbackRate = S.settings.rate || 1;
        player.onended = go;
        player.onerror = () => { if (id === playId) p.text ? speak(p.text, go) : go(); };
        player.play().then(noteAudioUsed, () => { if (id === playId) p.text ? speak(p.text, go) : go(); });
      } else if (p.text) speak(p.text, go);
      else go();
    };
    next(0);
  }
  // The parts for an option shown with letter L: short answers have the letter baked in.
  const optionParts = (it, o, L) => it.id && clip(`Q:${it.id}:o${o.n}:${L}`, o.t)
    ? [{ key: `Q:${it.id}:o${o.n}:${L}`, source: o.t, text: L + ": " + o.t }]
    : [{ key: `opt:${L}`, check: false, text: L + ":", gap: 150 }, { key: it.id && `Q:${it.id}:o${o.n}`, text: o.t }];
  const questionParts = it => [{ key: it.id && `Q:${it.id}:q`, text: it.q, gap: 350 },
    ...it.order.flatMap((o, i) => [...optionParts(it, o, "ABCD"[i]).slice(0, -1), { ...optionParts(it, o, "ABCD"[i]).slice(-1)[0], gap: 300 }])];
  const explainParts = it => [{ key: it.id && `Q:${it.id}:x`, text: it.x, gap: 450 },
    ...(it.hook ? [{ key: `Q:${it.id}:h`, source: it.hook, text: "Memory hook: " + it.hook }] : [])];
  const hush = () => { playId++; player.pause(); if ("speechSynthesis" in window) speechSynthesis.cancel(); };

  /* ── VIEWS ── */
  let view = "home", ctx = {};
  function go(v, c = {}) { hush(); clearInterval(ctx.timer); view = v; ctx = c; render(); window.scrollTo(0, 0); }

  function render() {
    ({ home, session, card: session, done, lessons, lesson, sections, mock, mockdone, listen, settings, calc }[view] || home)();
  }

  function home() {
    const due = dueKeys().length, fresh = Math.max(0, S.settings.newPerDay - newToday());
    const days = Math.ceil((new Date(S.settings.target + "T09:00:00") - new Date()) / 864e5);
    const doneToday = (S.days[today()] || {}).n || 0;
    const mathsDone = LESSONS.filter(l => l.track === "maths" && S.lessons[l.id]).length;
    const mathsTotal = LESSONS.filter(l => l.track === "maths").length;
    const overall = readiness();
    app.innerHTML = `
      <section class="hero">
        <div class="meter"><svg viewBox="0 0 120 70" aria-hidden="true"><path d="M10 64 A50 50 0 0 1 110 64" class="arc"/><path d="M10 64 A50 50 0 0 1 110 64" class="arc on" style="stroke-dasharray:${157 * overall / 100} 200"/></svg><div class="meter-n">${overall}<small>%</small></div><div class="meter-l">exam ready</div></div>
        <div class="stats">
          <div><b>${streak()}</b><span>day streak</span></div>
          <div><b>${days > 0 ? days : "–"}</b><span>days to target</span></div>
          <div><b>${doneToday}</b><span>cards today</span></div>
        </div>
      </section>
      <button class="go big" data-act="daily"><span>Today's session</span><small>${due} to review · ${fresh} new · about ${Math.max(5, Math.round(Math.min(SESSION_SIZE, due + fresh) * 0.6))} min</small></button>
      ${mathsDone < mathsTotal ? `<button class="go alt" data-go="lessons" data-track="maths"><span>Maths from scratch</span><small>${mathsDone} of ${mathsTotal} lessons · start here</small></button>` : ""}
      <div class="grid">
        <button class="tile" data-go="lessons" data-track="section"><i>▶</i>Listen & learn<small>90-second explainers</small></button>
        <button class="tile" data-go="sections"><i>◧</i>Drill a section<small>9 syllabus sections</small></button>
        <button class="tile" data-go="calc"><i>∑</i>Calc trainer<small>endless fresh sums</small></button>
        <button class="tile" data-act="booklet"><i>⌕</i>EX308 lookups<small>find it fast</small></button>
        <button class="tile" data-go="listen"><i>◉</i>Car mode<small>hands-free audio quiz</small></button>
        <button class="tile" data-go="mock"><i>◷</i>Mock exam<small>46 Qs · 90 min</small></button>
      </div>
      <h2>Section readiness</h2>
      <div class="bars">${SECTIONS.map(s => { const p = readiness(s.n); return `<button class="bar" data-act="drill" data-sec="${s.n}"><span class="bl">${s.n}. ${s.short}</span><span class="bt"><span style="width:${p}%" class="${p >= 70 ? "ok" : p >= 35 ? "mid" : ""}"></span></span><span class="bn">${p}%</span></button>`; }).join("")}</div>
      ${S.mocks.length ? `<h2>Mock results</h2><div class="mocks">${S.mocks.slice(-5).map(m => `<span class="${m.score >= 28 ? "pass" : "fail"}">${m.score}/46</span>`).join("")}</div>` : ""}
      <p class="foot"><button class="link" data-go="settings">Settings</button> · <a href="https://rsgb.services/public/exams/exam-forms/260122_EX308_Intermediate_v1.pdf" target="_blank" rel="noopener">EX308 booklet</a> · <a href="https://rsgb.org/main/clubs-training/training-resources/mock-exams/" target="_blank" rel="noopener">RSGB mock papers</a></p>`;
  }

  /* Session: works for daily review, section drills, calc and booklet drills */
  function startSession(keys, label, opts = {}) {
    if (!keys.length) { go("done", { label, empty: true }); return; }
    go("session", { queue: keys.slice(), label, i: 0, right: 0, total: 0, retry: new Set(), ...opts });
  }
  function session() {
    if (!ctx.cur) {
      const key = ctx.queue.shift();
      if (!key) return go("done", ctx);
      const it = build(key);
      it.order = shuffle(it.opts.map((t, i) => ({ t, ok: i === 0, n: i })));
      ctx.cur = it; ctx.answered = null;
    }
    const it = ctx.cur, sec = SECTIONS[it.sec - 1];
    const left = ctx.queue.length + 1;
    app.innerHTML = `
      <div class="crumb"><button class="link" data-go="home">✕</button><span>${esc(ctx.label)}</span><span>${ctx.total ? `${ctx.right}/${ctx.total} · ` : ""}${left} left</span></div>
      <div class="progress"><span style="width:${100 * ctx.total / (ctx.total + left)}%"></span></div>
      <article class="card">
        <div class="tag">${sec.n}. ${esc(sec.name)} · ${esc(it.code)}${it.calc ? " · calc" : ""}${it.booklet ? " · use EX308" : ""}${manualChapter(it.code) ? ` · 📖 Ch ${manualChapter(it.code)}` : ""}</div>
        <p class="q">${esc(it.q)}</p>
        <button class="say" data-act="sayq" aria-label="Read question aloud">🔊</button>
        <div class="opts">${it.order.map((o, i) => `<button class="opt ${ctx.answered != null ? (o.ok ? "right" : i === ctx.answered ? "wrong" : "dim") : ""}" data-act="ans" data-i="${i}" ${ctx.answered != null ? "disabled" : ""}><b>${"ABCD"[i]}</b><span class="opt-t">${esc(o.t)}</span>${ctx.answered != null && o.ok ? `<span class="mark ok" aria-label="Correct answer">✓</span>` : ctx.answered === i ? `<span class="mark no" aria-label="Your answer, incorrect">✗</span>` : ""}</button>`).join("")}</div>
        ${ctx.answered != null ? `
          <div class="explain ${it.order[ctx.answered].ok ? "good" : "bad"}">
            <strong>${it.order[ctx.answered].ok ? pickPraise() : "Not quite."}</strong> ${esc(it.x)}
            ${it.hook ? `<p class="hook">💡 ${esc(it.hook)}</p>` : ""}
            ${!it.order[ctx.answered].ok && manualChapter(it.code) ? `<p class="manual">📖 Read up: Manual chapter ${manualChapter(it.code)}, ${esc(MANUAL[manualChapter(it.code)])}</p>` : ""}
            <button class="say" data-act="sayx" aria-label="Read explanation aloud">🔊</button>
          </div>
          ${QBY[it.key] ? `<details class="note"${S.notes[it.key] ? " open" : ""}><summary>My notes${S.notes[it.key] ? "" : " (add a note or manual page)"}</summary><textarea data-note="${it.key}" rows="2" placeholder="e.g. Manual p.42, or your own memory trick">${esc((S.notes[it.key] || {}).t || "")}</textarea></details>` : ""}
          <button class="go" data-act="next">${ctx.queue.length ? "Next" : "Finish"}</button>` : ""}
      </article>`;
  }
  const PRAISE = ["Correct.", "Spot on.", "Nailed it.", "Right.", "Yes!", "Good."];
  const pickPraise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];

  function answer(i) {
    const it = ctx.cur; if (ctx.answered != null) return;
    ctx.answered = i;
    const ok = it.order[i].ok;
    ctx.total++; if (ok) ctx.right++;
    if (!ctx.noGrade) {
      if (!S.items[it.key]) S.items[it.key] = { box: 0, r: 0, w: 0, first: today() };
      grade(it.key, ok);
    }
    // a missed card comes back once at the end of the session
    if (!ok && !ctx.retry.has(it.key)) { ctx.retry.add(it.key); ctx.queue.push(it.key); }
    if (ctx.mock) ctx.mockAns.push({ sec: it.sec, ok });
    // first attempt at each card this session, for the "what to read next" suggestion
    ctx.log ||= [];
    if (!ctx.log.some(e => e.k === it.key)) ctx.log.push({ k: it.key, ok });
    render();
    const ex = app.querySelector(".explain");
    if (ex) ex.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function done() {
    const pct = ctx.total ? Math.round(100 * ctx.right / ctx.total) : 0;
    app.innerHTML = ctx.empty ? `
      <article class="card center"><h1>All caught up</h1><p>Nothing is due here right now. Try the calc trainer or a mock exam, or come back tomorrow.</p><button class="go" data-go="home">Home</button></article>` : `
      <article class="card center">
        <h1>${pct >= 80 ? "Great session" : pct >= 60 ? "Solid work" : "Good effort"}</h1>
        <p class="big-n">${ctx.right}<small>/${ctx.total}</small></p>
        <p>Missed cards will come back soon. Streak: <b>${streak()}</b> day${streak() === 1 ? "" : "s"}.</p>
        ${suggestionCard(ctx.log)}
        <button class="go" data-go="home">Home</button>
      </article>`;
  }

  function lessons() {
    const track = ctx.track || "section";
    const list = LESSONS.filter(l => l.track === track);
    app.innerHTML = `
      <div class="crumb"><button class="link" data-go="home">‹ Home</button><span>${track === "maths" ? "Maths from scratch" : "Listen & learn"}</span><span></span></div>
      <p class="intro">${track === "maths" ? "Seven short lessons. Each ends with a few practice sums with fresh numbers every time. Do them in order." : "Short explainers for every section, written to be listened to. Tap one, press play, then answer a few questions."}</p>
      <div class="list">${list.map((l, i) => `<button class="row" data-act="lesson" data-id="${l.id}"><span class="num">${S.lessons[l.id] ? "✓" : i + 1}</span><span>${esc(l.title)}${l.sec ? `<small>Section ${l.sec}</small>` : ""}</span></button>`).join("")}</div>`;
  }

  function lesson() {
    const l = LESSONS.find(x => x.id === ctx.id);
    app.innerHTML = `
      <div class="crumb"><button class="link" data-act="back-lessons" data-track="${l.track}">‹ Lessons</button><span></span><span></span></div>
      <article class="card lesson">
        <h1>${esc(l.title)}</h1>
        <button class="go alt" data-act="play">▶ Play aloud</button>
        ${l.body.map((p, i) => `<p data-p="${i}">${esc(p)}</p>`).join("")}
        <button class="go" data-act="practise">Practise this</button>
      </article>`;
  }

  function practiseLesson() {
    const l = LESSONS.find(x => x.id === ctx.id);
    S.lessons[l.id] = Date.now(); save();
    let keys;
    if (l.gens) keys = shuffle(l.gens.flatMap(g => ["g:" + g, "g:" + g])).slice(0, 6);
    else keys = shuffle(ALL_KEYS.filter(k => secOf(k) === l.sec && !k.startsWith("g:"))).slice(0, 6);
    startSession(keys, l.title);
  }

  function sections() {
    app.innerHTML = `
      <div class="crumb"><button class="link" data-go="home">‹ Home</button><span>Drill a section</span><span></span></div>
      <div class="list">${SECTIONS.map(s => `<button class="row" data-act="drill" data-sec="${s.n}"><span class="num">${s.n}</span><span>${esc(s.name)}<small>${s.weight} Qs in the exam · ${readiness(s.n)}% ready</small><small class="blurb">${esc(s.blurb)}</small></span></button>`).join("")}</div>
      <h2>Or follow the manual</h2>
      <p class="intro">Read a chapter of the Intermediate Licence Manual, then drill just its questions.</p>
      <div class="list">${Object.entries(MANUAL).map(([n, t]) => { const keys = ALL_KEYS.filter(k => chOf(k) === +n); const p = pctOf(keys); return `<button class="row" data-act="drill-ch" data-ch="${n}"><span class="num">${n}</span><span>${esc(t)}<small>${keys.length} cards · ${p}% ready</small></span></button>`; }).join("")}</div>`;
  }
  function drillChapter(ch) {
    const all = ALL_KEYS.filter(k => chOf(k) === ch);
    const due = dueKeys().filter(k => chOf(k) === ch);
    const seen = new Set(Object.keys(S.items));
    let keys = [...due.slice(0, 12), ...shuffle(all.filter(k => !seen.has(k))).slice(0, Math.max(0, 12 - due.length))];
    if (keys.length < 6) keys = shuffle(all).slice(0, 12);
    startSession(shuffle(keys), `Manual ch ${ch}: ${MANUAL[ch]}`);
  }
  function drill(sec) {
    const due = dueKeys().filter(k => secOf(k) === sec);
    const fresh = newKeys(Math.max(0, 12 - due.length), sec);
    let keys = [...due.slice(0, 12), ...fresh];
    if (keys.length < 6) keys = shuffle(ALL_KEYS.filter(k => secOf(k) === sec)).slice(0, 12);
    startSession(shuffle(keys), `Section ${sec}: ${SECTIONS[sec - 1].short}`);
  }

  function calc() {
    app.innerHTML = `
      <div class="crumb"><button class="link" data-go="home">‹ Home</button><span>Calc trainer</span><span></span></div>
      <p class="intro">Fresh numbers every time. Use the calculator on your phone; it's allowed in the exam too.</p>
      <button class="go" data-act="calc-mix">Mixed set of 10</button>
      <div class="list">${Object.entries(GENERATORS).map(([k, g]) => { const it = S.items["g:" + k]; return `<button class="row" data-act="calc-one" data-g="${k}"><span class="num">${it ? it.box : "·"}</span><span>${esc(g.name)}<small>Section ${g.sec}</small></span></button>`; }).join("")}</div>`;
  }

  /* Mock exam: 46 questions weighted like the real paper, 90 minutes */
  function mock() {
    app.innerHTML = `
      <div class="crumb"><button class="link" data-go="home">‹ Home</button><span>Mock exam</span><span></span></div>
      <article class="card center">
        <h1>46 questions · 90 minutes</h1>
        <p>Weighted exactly like the real paper. Pass mark is 28. Have your EX308 booklet open in another tab, just like the real thing.</p>
        <button class="go" data-act="mock-start">Start mock</button>
        <p class="small">For a full dress rehearsal, also sit the three <a href="https://rsgb.org/main/clubs-training/training-resources/mock-exams/" target="_blank" rel="noopener">official RSGB mock papers</a> in the last fortnight.</p>
      </article>`;
  }
  function mockStart() {
    const keys = [];
    for (const s of SECTIONS) {
      let pool = shuffle(ALL_KEYS.filter(k => secOf(k) === s.n));
      if (s.n === 2) { const calcs = pool.filter(k => k.startsWith("g:")).slice(0, 4); pool = [...calcs, ...pool.filter(k => !k.startsWith("g:"))]; }
      keys.push(...pool.slice(0, s.weight));
    }
    const end = Date.now() + 90 * 60e3;
    go("session", { queue: keys, label: "Mock exam", total: 0, right: 0, retry: new Set(Object.keys(S.items).concat(ALL_KEYS)), mock: true, mockAns: [], end });
    ctx.timer = setInterval(() => {
      const left = ctx.end - Date.now();
      const el = $(".crumb span:nth-child(2)");
      if (el) el.textContent = `Mock · ${Math.floor(left / 60e3)}:${String(Math.floor(left / 1e3) % 60).padStart(2, "0")}`;
      if (left <= 0) finishMock();
    }, 1000);
  }
  function finishMock() {
    clearInterval(ctx.timer);
    const bySec = {};
    for (const a of ctx.mockAns) { const b = bySec[a.sec] ||= [0, 0]; b[1]++; if (a.ok) b[0]++; }
    const score = ctx.mockAns.filter(a => a.ok).length;
    S.mocks.push({ d: Date.now(), score, bySec }); save();
    go("mockdone", { score, bySec, answered: ctx.mockAns.length, log: ctx.log });
  }

  /* After a session: find the weakest manual chapter and suggest it.
     Weakest = most cards missed this session (first attempts only);
     ties go to the chapter that is least ready overall.
     A clean session suggests the least-ready chapter you've started. */
  function chapterReady(ch) {
    const keys = ALL_KEYS.filter(k => chOf(k) === ch);
    return keys.length ? pctOf(keys) : 100;
  }
  function weakestChapter(log = []) {
    const by = {};
    for (const e of log) { const ch = chOf(e.k); if (!ch) continue; const b = by[ch] ||= { seen: 0, missed: 0 }; b.seen++; if (!e.ok) b.missed++; }
    const missed = Object.entries(by).filter(([, b]) => b.missed);
    if (missed.length) {
      missed.sort(([a, x], [b, y]) => y.missed - x.missed || chapterReady(+a) - chapterReady(+b));
      const [ch, b] = missed[0];
      return { ch: +ch, why: `You missed ${b.missed} of ${b.seen} card${b.seen === 1 ? "" : "s"} from this chapter today, and it's ${chapterReady(+ch)}% ready overall.` };
    }
    const started = Object.keys(MANUAL).map(Number).filter(ch => ALL_KEYS.some(k => chOf(k) === ch && S.items[k]));
    if (!started.length) return null;
    started.sort((a, b) => chapterReady(a) - chapterReady(b));
    const ch = started[0];
    return { ch, why: `No misses today, well done. Of the chapters you've started, this is the least ready at ${chapterReady(ch)}%.` };
  }
  function suggestionCard(log) {
    const w = weakestChapter(log);
    if (!w) return "";
    return `
      <div class="suggest">
        <div class="tag">📖 Suggested reading</div>
        <h2 class="sug-title">Chapter ${w.ch}: ${esc(MANUAL[w.ch])}</h2>
        <p>${esc(w.why)}</p>
        <button class="go alt" data-act="drill-ch" data-ch="${w.ch}">Drill chapter ${w.ch} after reading</button>
      </div>`;
  }
  function mockdone() {
    const { score, bySec } = ctx;
    app.innerHTML = `
      <article class="card center">
        <h1>${score >= 28 ? "Pass" : "Not yet"}</h1>
        <p class="big-n ${score >= 28 ? "pass" : "fail"}">${score}<small>/46</small></p>
        <p>${score >= 28 ? `That's ${score - 28} above the pass mark.` : `${28 - score} more needed to pass.`}</p>
        <div class="bars">${SECTIONS.map(s => { const b = bySec[s.n] || [0, s.weight]; const p = Math.round(100 * b[0] / (b[1] || 1)); return `<div class="bar"><span class="bl">${s.n}. ${s.short}</span><span class="bt"><span style="width:${p}%" class="${p >= 70 ? "ok" : p >= 50 ? "mid" : ""}"></span></span><span class="bn">${b[0]}/${b[1]}</span></div>`; }).join("")}</div>
        ${suggestionCard(ctx.log)}
        <button class="go" data-go="home">Home</button>
      </article>`;
  }

  /* Car mode: hands-free audio quiz. Reads a question, pauses, then reads the answer. */
  function listen() {
    app.innerHTML = `
      <div class="crumb"><button class="link" data-go="home">‹ Home</button><span>Car mode</span><span></span></div>
      <article class="card center">
        <h1>Hands-free quiz</h1>
        <p>Reads a question and its options, pauses so you can answer out loud, then gives the answer and explanation. It doesn't change your scores, so it's pure revision.</p>
        <p class="small">Start it before you set off, and keep your eyes on the road.</p>
        <div id="nowq" class="nowq"></div>
        <button class="go" data-act="listen-start">${ctx.on ? "■ Stop" : "▶ Start"}</button>
      </article>`;
  }
  function listenLoop() {
    if (view !== "listen" || !ctx.on) return;
    const pool = dueKeys().filter(k => QBY[k]);
    const seenQ = Object.keys(S.items).filter(k => QBY[k]);
    const keys = pool.length ? pool : seenQ.length ? seenQ : QUESTIONS.map(q => q.id);
    const it = build(keys[Math.floor(Math.random() * keys.length)]);
    it.order = shuffle(it.opts.map((t, i) => ({ t, ok: i === 0, n: i })));
    const letter = "ABCD"[it.order.findIndex(o => o.ok)];
    const el = $("#nowq"); if (el) el.innerHTML = `<p class="q">${esc(it.q)}</p>`;
    // Short right answers have their own "The answer is Option B, …" clip; longer ones are joined from two.
    const answer = it.id && clip(`Q:${it.id}:a:${letter}`, it.opts[0])
      ? [{ key: `Q:${it.id}:a:${letter}`, source: it.opts[0], text: `The answer is ${letter}: ${it.opts[0]}`, gap: 450 }]
      : [{ key: `ans:${letter}`, check: false, text: `The answer is ${letter}:`, gap: 150 }, { key: it.id && `Q:${it.id}:o0`, text: it.opts[0], gap: 450 }];
    say(questionParts(it), () => {
      ctx.wait = setTimeout(() => say([...answer, ...explainParts(it)], () => { ctx.wait = setTimeout(listenLoop, 2500); }), 6000);
    });
  }

  function settings() {
    app.innerHTML = `
      <div class="crumb"><button class="link" data-go="home">‹ Home</button><span>Settings</span><span></span></div>
      <article class="card">
        <label class="field">Target exam date<input type="date" id="st-target" value="${S.settings.target}"></label>
        <label class="field">New cards per day<input type="number" min="2" max="30" id="st-new" value="${S.settings.newPerDay}"></label>
        <label class="field">Speech speed<input type="range" min="0.7" max="1.3" step="0.05" id="st-rate" value="${S.settings.rate}"></label>
        <button class="go alt" data-act="test-voice">Test voice</button>
        <div class="field">Offline audio<span class="small" id="offline-status">Checking…</span></div>
        <button class="go alt" data-act="save-offline" id="save-offline">Save audio for offline (about 45 MB)</button>
        <button class="go" data-act="save-settings">Save</button>
        <p class="small">Signed in as <b>${esc(USER)}</b>. Progress syncs between your devices. ${Object.keys(S.items).length} of ${ALL_KEYS.length} cards started.</p>
        <button class="go alt" data-act="logout">Log out</button>
      </article>`;
    offlineStatus().then(o => {
      const st = $("#offline-status"); if (!st) return;
      st.textContent = !o ? "Not available on this device." : o.saved === o.total ? "All saved: the app and its audio work with no signal." : o.saved ? `${o.saved} of ${o.total} clips saved. Tap Save to finish.` : "Not saved yet. Without signal, the phone voice is used.";
    });
  }

  /* ── EVENTS ── */
  app.addEventListener("click", e => {
    const b = e.target.closest("[data-go],[data-act]"); if (!b) return;
    if (b.dataset.go) return go(b.dataset.go, { track: b.dataset.track });
    const a = b.dataset.act;
    if (a === "daily") {
      const due = dueKeys().slice(0, SESSION_SIZE);
      const fresh = newKeys(Math.min(Math.max(0, S.settings.newPerDay - newToday()), Math.max(3, SESSION_SIZE - due.length)));
      return startSession(shuffle([...due, ...fresh]), "Today's session");
    }
    if (a === "ans") return answer(+b.dataset.i);
    if (a === "next") { ctx.cur = null; if (ctx.mock && !ctx.queue.length) return finishMock(); return render(); }
    if (a === "sayq") { hush(); return say(questionParts(ctx.cur)); }
    if (a === "sayx") { hush(); return say(explainParts(ctx.cur)); }
    if (a === "lesson") return go("lesson", { id: b.dataset.id });
    if (a === "back-lessons") return go("lessons", { track: b.dataset.track });
    if (a === "play") {
      const l = LESSONS.find(x => x.id === ctx.id); hush();
      let i = 0; const ps = app.querySelectorAll("[data-p]");
      const next = () => { ps.forEach(p => p.classList.remove("reading")); if (i >= l.body.length || view !== "lesson") return; ps[i].classList.add("reading"); say([{ key: `L:${l.id}:${i}`, text: l.body[i] }], () => { i++; next(); }); };
      return next();
    }
    if (a === "practise") return practiseLesson();
    if (a === "drill") return drill(+b.dataset.sec);
    if (a === "drill-ch") return drillChapter(+b.dataset.ch);
    if (a === "booklet") return startSession(shuffle([...X_KEYS, ...X_KEYS, ...X_KEYS, ...QUESTIONS.filter(q => q.code === "1H1").map(q => q.id)]).slice(0, 10), "EX308 lookups");
    if (a === "calc-mix") return startSession(shuffle(GEN_KEYS).slice(0, 10), "Calc trainer");
    if (a === "calc-one") return startSession(Array(6).fill("g:" + b.dataset.g), GENERATORS[b.dataset.g].name);
    if (a === "mock-start") return mockStart();
    if (a === "listen-start") {
      if (ctx.on) { ctx.on = false; clearTimeout(ctx.wait); hush(); return render(); }
      ctx.on = true; render(); return listenLoop();
    }
    if (a === "logout") {
      // Send any unsynced answers first, then remove this person's copy from the device.
      b.disabled = true; b.textContent = "Logging out…";
      clearTimeout(syncTimer);
      return (async () => {
        // Only remove the device copy once it's safely on the server; if offline, it waits here for next time.
        let synced = false;
        try { synced = await push(); } catch {}
        if (synced) try { localStorage.removeItem(LS); } catch {}
        location.href = "/api/logout";
      })();
    }
    if (a === "save-offline") {
      if (!clips) return;
      b.disabled = true;
      const st = $("#offline-status");
      return saveOffline((d, t) => { if (st) st.textContent = `Saving… ${d} of ${t} clips`; }).then(failed => {
        b.disabled = false;
        if (st) st.textContent = failed ? `${failed} clips couldn't be saved. Check your connection and tap Save again.` : "All saved: the app and its audio work with no signal.";
        if (!failed) opSet({ done: true });
      });
    }
    if (a === "test-voice") { S.settings.rate = +$("#st-rate").value; hush(); return speak("Q R T means stop transmitting. Three dB doubles the power."); }
    if (a === "save-settings") {
      S.settings.target = $("#st-target").value || S.settings.target;
      S.settings.newPerDay = Math.max(2, Math.min(30, +$("#st-new").value || 8));
      S.settings.rate = +$("#st-rate").value;
      save(); return go("home");
    }
  });
  app.addEventListener("input", e => {
    const k = e.target.dataset.note; if (!k) return;
    S.notes[k] = { t: e.target.value, u: Date.now() }; save();
  });
  document.querySelector(".brand").addEventListener("click", () => go("home"));
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") pull(); });

  if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  // Keep a copy of the whole app so it opens with no signal. Pages reached through the login
  // redirect aren't stored by the service worker, so the app files are fetched directly here.
  const SHELL = ["/", "/index.html", "/app.js", "/style.css", "/data/sections.js", "/data/questions.js", "/data/generators.js",
    "/data/lessons.js", "/data/ex308.js", "/manifest.webmanifest", "/icon.svg", "/icon-180.png", "/icon-192.png", "/audio/manifest.json"];
  async function cacheShell() {
    if (!("caches" in window) || !navigator.onLine) return;
    const cache = await caches.open("int-trainer-v1");
    await Promise.all(SHELL.map(async u => {
      try { const r = await fetch(u, { credentials: "same-origin", cache: "no-cache" }); if (r.status === 200 && !r.redirected) await cache.put(u, r); } catch {}
    }));
  }
  setTimeout(() => cacheShell().catch(() => {}), 3000);
  /* ── OFFLINE PROMPT ──
     Asked once per phone, the first time the app opens there. "Skip for now" asks once more,
     the first time the app opens at least a day after that phone first played any audio.
     Saving (here or in Settings) stops both. */
  const OP = "rsgb-offline-prompt";
  function opGet() { try { return JSON.parse(localStorage.getItem(OP) || "{}"); } catch { return {}; } }
  function opSet(patch) { try { localStorage.setItem(OP, JSON.stringify({ ...opGet(), ...patch })); } catch {} }
  function noteAudioUsed() { if (!opGet().firstAudio) opSet({ firstAudio: Date.now() }); }
  const PROMPTS = {
    first: { title: "One quick thing before you start",
      text: "Would you like the whole course, including the spoken lessons and questions, saved on this phone? Then it'll work even with no signal. It takes about 45 MB and a minute on Wi-Fi. You can always do it later in Settings.",
      no: "Skip for now" },
    second: { title: "You've recently used the spoken content",
      text: "Would you like to save it on this phone so it works with no signal, in the car or anywhere? It's about 45 MB and takes a minute on Wi-Fi. You can always do it later in Settings.",
      no: "No thanks" },
  };
  async function maybePromptOffline() {
    if (!navigator.onLine || !("caches" in window)) return;
    for (let i = 0; i < 40 && !clips; i++) await new Promise(r => setTimeout(r, 250));
    if (!clips || document.querySelector(".modal-back")) return;
    const st = opGet();
    if (st.done) return;
    const o = await offlineStatus();
    if (o && o.saved === o.total) return opSet({ done: true });
    if (!st.first) showOfflinePrompt("first");
    else if (!st.second && st.firstAudio && Date.now() - st.firstAudio >= 864e5) showOfflinePrompt("second");
  }
  function showOfflinePrompt(kind) {
    const t = PROMPTS[kind];
    const back = document.createElement("div");
    back.className = "modal-back";
    back.innerHTML = `
      <div class="card modal" role="dialog" aria-modal="true" aria-labelledby="op-title">
        <h1 id="op-title">${esc(t.title)}</h1>
        <p id="op-text">${esc(t.text)}</p>
        <button class="go" id="op-save">Save everything</button>
        <button class="go alt" id="op-skip">${esc(t.no)}</button>
      </div>`;
    document.body.appendChild(back);
    const close = () => back.remove();
    back.querySelector("#op-skip").onclick = () => { opSet({ [kind]: Date.now() }); close(); };
    back.querySelector("#op-save").onclick = async e => {
      const btn = e.currentTarget, text = back.querySelector("#op-text");
      opSet({ [kind]: Date.now() });
      btn.disabled = true; back.querySelector("#op-skip").hidden = true;
      const failed = await saveOffline((d, n) => { text.textContent = `Saving… ${d} of ${n} files. Keep the app open until it finishes.`; });
      if (failed) text.textContent = `${failed} files couldn't be saved. You can finish this later in Settings, ideally on Wi-Fi.`;
      else { opSet({ done: true }); text.textContent = "All saved: the app and its audio now work with no signal."; }
      btn.disabled = false; btn.textContent = "Done"; btn.onclick = close;
    };
  }
  setTimeout(() => maybePromptOffline().catch(() => {}), 1500);

  // deep link from the reminder: /?start=daily
  if (new URLSearchParams(location.search).get("start") === "daily") { render(); setTimeout(() => app.querySelector('[data-act="daily"]')?.click(), 50); }
  else render();
  pull();
})();
