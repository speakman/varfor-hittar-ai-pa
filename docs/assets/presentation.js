/* Varför hittar AI på saker? Presentationens logik.
   Talarstyrd: allt drivs av "nästa" och "föregående". Inget på skärmen är klickbart för publiken. */
(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const params = new URLSearchParams(location.search);
const stage = $('#stage');
const LABELS = { ill: 'Påhittat exempel', real: 'Verkliga siffror' };
const CHECK = '<svg class="ic" aria-hidden="true"><use href="#i-check"/></svg>';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const still = () => reduced.matches || params.has('still');

/* ---------- Tidsstyrda rörelser ---------- */
let timers = [];
let busy = false;

function later(ms, fn) {
  const id = setTimeout(() => { timers = timers.filter(t => t !== id); fn(); }, ms);
  timers.push(id);
}
function cancelTimers() {
  timers.forEach(clearTimeout);
  timers = [];
  busy = false;
  $$('.fly').forEach(el => el.remove());
}
/* Markerar att en rörelse pågår i ms millisekunder. Under den tiden gör ett tryck
   på "nästa" bara färdigt det aktuella steget. Gäller både skriptade rörelser och
   rena CSS-övergångar (staplar som växer, stämpeln, blad som faller). */
function hold(ms) {
  busy = true;
  later(ms, () => { busy = false; });
}
/* Spelar en lista av [millisekunder, funktion] och håller steget upptaget tills den är klar. */
function play(steps) {
  let end = 0;
  for (const [ms, fn] of steps) { later(ms, fn); end = Math.max(end, ms); }
  hold(end + 60);
}

function setWords(el, text, on) {
  el.innerHTML = text.split(' ').map(w => `<span class="w${on ? ' on' : ''}">${w} </span>`).join('');
}
function streamInto(tl, el, start, gap) {
  let t = start;
  $$('.w', el).forEach(w => { tl.push([t, () => w.classList.add('on')]); t += gap; });
  return t;
}
function toStage(r) {
  const s = stage.getBoundingClientRect();
  const k = s.width / 1920;
  return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
}

/* ---------- Bild 1 ---------- */
const Q1 = 'Vem skrev romanen Fyren vid Gråskär och vad handlar den om?';
const A1 = 'Fyren vid Gråskär skrevs av Margit Holmsten och gavs ut 1962. Romanen följer fyrvaktaren Elis under en stormig vinter i Bohusläns skärgård.';

function renderS1(step, anim) {
  const qb = $('#s1-qb'), q = $('#s1-q'), bot = $('#s1-bot'), a = $('#s1-a');
  const typed = anim && step === 1;
  qb.classList.toggle('sent', step >= 1 && !typed);
  qb.classList.toggle('typing', typed);
  q.textContent = step >= 1 && !typed ? Q1 : '';
  bot.classList.remove('thinking');
  bot.classList.toggle('is-on', step >= 1 && !typed);
  setWords(a, A1, step >= 1 && !typed);
  if (!typed) return;

  const tl = [];
  let t = 400;
  for (let k = 1; k <= Q1.length; k++) {
    tl.push([t, () => { q.textContent = Q1.slice(0, k); }]);
    t += Q1[k - 1] === ' ' ? 60 : 27;
  }
  t += 500; tl.push([t, () => { qb.classList.remove('typing'); qb.classList.add('sent'); }]);
  t += 500; tl.push([t, () => bot.classList.add('is-on', 'thinking')]);
  t += 1300; tl.push([t, () => bot.classList.remove('thinking')]);
  t = streamInto(tl, a, t + 80, 110);
  tl.push([t + 300, () => {}]);
  play(tl);
}

/* ---------- Bild 2 ---------- */
const S2 = [
  ['Bä, bä, vita', 'lamm'],
  ['Sveriges huvudstad är', 'Stockholm'],
  ['Romanen Fyren vid Gråskär skrevs av', 'Margit Holmsten']
];

function renderS2(step, anim) {
  const el = $('#s2'), sent = $('#s2-sent');
  const k = Math.min(Math.floor(step / 2), 2);
  const filled = step % 2 === 1 || step >= 6;
  const html = pop => S2[k][0] + ' ' + (filled
    ? `<span class="tok${pop ? ' pop' : ''}">${S2[k][1]}</span>`
    : '<span class="caret"></span>');
  el.classList.remove('swap-out');
  if (anim && step > 0 && step < 6 && !filled) {
    // Ny mening: den gamla tonar ut, den nya tonar in.
    el.classList.add('swap-out');
    play([[330, () => { sent.innerHTML = html(false); el.classList.remove('swap-out'); }], [700, () => {}]]);
    return;
  }
  sent.innerHTML = html(anim && filled && step < 6);
}

/* ---------- Bild 3 ---------- */
const NOVEL = 'Romanen Fyren vid Gråskär skrevs av';
const REST = 'Alla andra ord tillsammans';
const S3 = [
  { prompt: 'Vi ses i', picked: [], rows: [] },
  { prompt: 'Sveriges huvudstad är', picked: [],
    rows: [['Stockholm', 93], ['en', 3], ['belägen', 2], [REST, 2, 1]] },
  { prompt: NOVEL, picked: [],
    rows: [['Margit', 9], ['Karin', 8], ['Sven', 8], ['den', 5], [REST, 70, 1]] },
  { prompt: NOVEL, picked: ['Margit'],
    rows: [['Holmsten', 11], ['Lindström', 9], ['Berg', 7], [REST, 73, 1]] },
  { prompt: NOVEL, picked: ['Margit', 'Holmsten', 'och', 'gavs', 'ut'],
    rows: [['1962', 14], ['1958', 12], ['1971', 9], [REST, 65, 1]] },
  { prompt: NOVEL, picked: ['Margit', 'Holmsten', 'och', 'gavs', 'ut', '1962'], rows: [] }
];

function renderS3(step, anim) {
  const el = $('#s3'), sent = $('#s3-sent'), rows = $('#s3-rows');

  const tokHTML = (w, cls = '') => ` <span class="tok ${cls}">${w}</span>`;
  const addTok = (w, cls) => {
    $('.caret', sent).insertAdjacentHTML('beforebegin', tokHTML(w, cls) + ' ');
    return $$('.tok', sent).pop();
  };
  const build = (n, zero) => {
    const st = S3[n];
    el.classList.remove('swap-out');
    el.classList.toggle('closing-on', n === 5);
    rows.className = 'rows';
    sent.innerHTML = st.prompt + st.picked.map(w => tokHTML(w)).join('') +
      ' <span class="caret"' + (n === 5 ? ' hidden' : '') + '></span>';
    rows.innerHTML = st.rows.map(([w, p, rest]) =>
      `<div class="row${rest ? ' rest' : ''}${zero ? ' zero' : ''}"><span class="w">${w}</span>` +
      `<span class="track"><span class="fill" style="--p:${p}"></span></span>` +
      `<span class="pct">${p}&nbsp;%</span><span class="tag">vald</span></div>`).join('');
  };
  const grow = () => $$('.row', rows).forEach((r, i) => later(60 + i * 120, () => r.classList.remove('zero')));

  if (!anim || step === 0) { build(step, false); return; }

  if (step <= 2) {
    // Ny mening: den gamla tonar ut, den nya tonar in och staplarna växer fram.
    el.classList.add('swap-out');
    play([[340, () => { build(step, true); grow(); }], [340 + 5 * 120 + 900, () => {}]]);
    return;
  }

  // Snöbollen: ett ord väljs, flyttas upp i meningen, och listan räknas om.
  build(step - 1, false);
  const before = S3[step - 1].picked.length;
  const [word, ...extra] = S3[step].picked.slice(before);
  const row = $$('.row', rows).find(r => $('.w', r).textContent === word);
  const tl = [];
  let tok;
  tl.push([150, () => { rows.classList.add('choosing'); row.classList.add('picked'); }]);
  tl.push([1050, () => {
    tok = addTok(word, 'hidden');
    const from = toStage($('.w', row).getBoundingClientRect());
    const to = toStage(tok.getBoundingClientRect());
    const c = document.createElement('span');
    c.className = 'tok fly';
    c.textContent = word;
    c.style.left = to.x + 'px';
    c.style.top = to.y + 'px';
    c.style.transform = `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.h / to.h})`;
    stage.appendChild(c);
    c.getBoundingClientRect();
    c.style.transition = 'transform .85s cubic-bezier(.5, 0, .2, 1)';
    c.style.transform = 'none';
  }]);
  let t = 1950;
  tl.push([t, () => { tok.classList.remove('hidden'); $$('.fly').forEach(c => c.remove()); }]);
  extra.forEach(w => { t += 430; tl.push([t, () => addTok(w, 'pop')]); });
  t += 650; tl.push([t, () => rows.classList.add('out')]);
  t += 360; tl.push([t, () => { build(step, true); grow(); }]);
  tl.push([t + 4 * 120 + 900, () => {}]);
  play(tl);
}

/* ---------- Bild 6 ---------- */
const CONT6 = 'Vad är huvudstaden i Italien? Vad är huvudstaden i Spanien? Skriv dina svar på raden nedan.';
const ANS6 = 'Huvudstaden i Frankrike är Paris.';

function renderS6(step, anim) {
  const cont = $('#s6-cont'), ans = $('#s6-ans'), bot = $('#s6-bot');
  setWords(cont, CONT6, !(anim && step === 0));
  setWords(ans, ANS6, step >= 1 && !(anim && step === 1));
  bot.classList.toggle('is-on', step >= 1);
  if (anim && step === 0) {
    const tl = [];
    const t = streamInto(tl, cont, 1300, 150);
    tl.push([t + 200, () => {}]);
    play(tl);
  }
  if (anim && step === 1) {
    const tl = [];
    const t = streamInto(tl, ans, 600, 170);
    tl.push([t + 200, () => {}]);
    play(tl);
  }
}

/* ---------- Bild 8: pappershögen på det överfulla bordet ---------- */
// [vänster, topp, lutning i grader]. Sist i listan hamnar överst.
const PILE = [
  [-60, -40, -8], [300, -70, 6], [470, 60, -5], [-90, 190, 9], [250, 330, -7], [480, 300, 4],
  [60, 380, -3], [-40, 40, 5], [400, 150, 12], [130, -90, -4], [330, 250, -11], [-100, 310, -6]
];
$('#s8-pile').innerHTML = PILE.map(([l, t, r], k) =>
  `<i style="left:${l}px;top:${t}px;--r:${r}deg;--dl:${(k * 0.07).toFixed(2)}s"></i>`).join('');

/* ---------- Bilderna ---------- */
const RENDER = { 1: renderS1, 2: renderS2, 3: renderS3, 6: renderS6 };
/* Etiketten nere till höger: 'ill' (påhittat exempel, streckad ram) eller 'real' (fylld, med bock). */
const LABEL = {
  2: s => (s >= 4 ? 'ill' : null),
  4: () => 'ill',
  5: s => (s >= 1 ? 'ill' : null),
  6: s => (s >= 4 ? 'real' : 'ill'),
  7: s => (s >= 2 ? 'ill' : null),
  8: s => (s >= 1 ? 'ill' : null),
  9: s => (s >= 4 ? 'ill' : null),
  10: s => (s <= 3 ? 'ill' : null),   // i steg 4 visas verkliga siffror, med egen märkning
  11: s => (s >= 1 ? 'ill' : null)
};
/* Rörelser som drivs av CSS och är längre än en vanlig intoning (millisekunder per steg). */
const HOLD = {
  1: { 2: 700 },
  4: { 2: 1200 },
  5: { 3: 1700 },
  6: { 2: 1000, 4: 2800, 5: 2800 },
  8: { 2: 900, 3: 1500 },
  10: { 2: 1000, 3: 700 },
  11: { 4: 1100 }
};
const DEFAULT_HOLD = 650;

const slides = window.MANUS.map(m => ({
  n: m.n, title: m.title, time: m.time, notes: m.notes, cues: m.cues,
  steps: m.notes.length - 1,
  el: document.getElementById('s' + m.n),
  render: RENDER[m.n] || (() => {}),
  label: LABEL[m.n] || (() => null),
  hold: HOLD[m.n] || {}
}));
const LAST = slides[slides.length - 1].n;

let cur = { i: 0, step: 0 };
let lastPress = 0;
let startedAt = null;

function show(i, step, anim) {
  cancelTimers();
  const sl = slides[i];
  cur = { i, step };
  const animate = anim && !still();
  stage.classList.toggle('still', still());
  stage.classList.toggle('instant', !animate);
  slides.forEach((s, k) => {
    s.el.classList.toggle('active', k === i);
    s.el.classList.toggle('play', k === i && animate);
  });
  sl.el.dataset.step = step;
  $$('[data-show]', sl.el).forEach(el => {
    const [a, b] = el.dataset.show.split('-').map(Number);
    el.classList.toggle('is-on', step >= a && step <= (b === undefined ? 99 : b));
  });
  sl.render(step, animate);
  if (animate && !busy) hold(sl.hold[step] || DEFAULT_HOLD);
  if (!animate) requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove('instant')));
  updateChrome();
  updateSpeaker();
  try { history.replaceState(null, '', '#' + sl.n + '.' + step); } catch (err) { location.hash = sl.n + '.' + step; }
}

/* Skydd mot en studsande klicker: två tryck inom 0,25 s räknas som ett. Gäller åt båda håll. */
function bounced() {
  const now = performance.now();
  if (now - lastPress < 250) return true;
  lastPress = now;
  return false;
}
function next() {
  if (bounced()) return;
  if (startedAt === null) startedAt = Date.now();
  // Pågår en rörelse gör första trycket bara klart den. Nästa tryck går vidare.
  if (busy) { show(cur.i, cur.step, false); return; }
  if (cur.step < slides[cur.i].steps) show(cur.i, cur.step + 1, true);
  else if (cur.i < slides.length - 1) show(cur.i + 1, 0, true);
}
function prev() {
  if (bounced()) return;
  if (cur.step > 0) show(cur.i, cur.step - 1, false);
  else if (cur.i > 0) show(cur.i - 1, slides[cur.i - 1].steps, false);
}

/* ---------- Sidfot ---------- */
function updateChrome() {
  const sl = slides[cur.i];
  $('#chrome').classList.toggle('off', sl.n === 0);
  let html = '';
  for (let n = 1; n <= LAST; n++) html += `<i class="${n < sl.n ? 'done' : n === sl.n ? 'cur' : ''}"></i>`;
  html += `<span id="count">${sl.n} / ${LAST}</span><span id="pips">`;
  for (let s = 1; s <= sl.steps; s++) html += `<i class="${s <= cur.step ? 'on' : ''}"></i>`;
  $('#progress').innerHTML = html + '</span>';
  const kind = sl.label(cur.step);
  const label = $('#label');
  label.className = kind || '';
  if (kind) label.innerHTML = (kind === 'real' ? CHECK : '') + LABELS[kind];
}

/* ---------- Talarvy i eget fönster ---------- */
let spk = null;
const SPK_CSS = `
  *{box-sizing:border-box}
  html,body{height:100%;margin:0}
  body{display:flex;flex-direction:column;background:#10161d;color:#f3eee2;font:20px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
  header{flex:none;display:flex;justify-content:space-between;align-items:baseline;gap:24px;padding:18px 36px 12px;border-bottom:2px solid #36424f;background:#10161d}
  #t{font:700 60px/1 ui-monospace,Menlo,Consolas,monospace;color:#ffc83d}
  #pos{font-size:22px;color:#f3eee2;text-align:center}
  #pos small{display:block;color:#b8c0cc;font-size:17px}
  #c{font:400 30px/1 ui-monospace,Menlo,Consolas,monospace;color:#b8c0cc}
  main{flex:1;overflow-y:auto;padding:18px 36px 24px 58px}
  p{margin:0 0 14px;font-size:27px;line-height:1.45;color:#8a94a1}
  p.now{color:#f3eee2;border-left:6px solid #ffc83d;padding-left:16px;margin-left:-22px}
  p.past{display:none}
  .said{margin:0 0 12px;font-size:16px;color:#5d6876}
  i.regi{font-style:italic;color:#8fa0b3;font-size:.86em}
  p.now i.regi{color:#b8c0cc}
  footer{flex:none;padding:12px 36px 14px;border-top:2px solid #36424f;background:#18212b}
  .cue{font-size:24px;line-height:1.35}
  .cue b{color:#ffc83d}
  .cue.next{margin-top:6px;font-size:19px;color:#b8c0cc}
  .cue.next b{color:#b8c0cc}
  .keys{margin-top:8px;color:#8a94a1;font-size:15px}`;

function openSpeaker() {
  if (spk && !spk.closed) { spk.focus(); return; }
  spk = window.open('', 'talarvy', 'width=1100,height=780');
  if (!spk) { toast('Talarvyn blockerades. Tillåt popup-fönster för den här sidan.'); return; }
  spk.document.open();
  spk.document.write('<!doctype html><html lang="sv"><head><meta charset="utf-8"><title>Talarvy</title><style>' + SPK_CSS +
    '</style></head><body><header><div id="t">00:00</div><div id="pos"></div><div id="c"></div></header>' +
    '<main id="m"></main><footer><div class="cue" id="cue"></div><div class="cue next" id="nxt"></div>' +
    '<div class="keys">Samma tangenter som i presentationen. R nollställer klockan. Text inom [hakparentes] är regi.</div></footer></body></html>');
  spk.document.close();
  spk.document.addEventListener('keydown', onKey);
  spk.addEventListener('resize', updateSpeaker);   // håll det aktuella stycket överst även när fönstret ändras
  updateSpeaker();
  tick();
}
function updateSpeaker() {
  if (!spk || spk.closed) return;
  const sl = slides[cur.i];
  const d = spk.document;
  const nextSlide = slides[cur.i + 1];
  d.getElementById('pos').innerHTML =
    `Bild ${sl.n} av ${LAST}: ${sl.title}<small>Steg ${cur.step} av ${sl.steps} · budget ${sl.time}</small>`;
  // Det aktuella stycket står alltid överst. Det som redan är sagt döljs, så att inget behöver rullas fram.
  const regi = t => t.replace(/\[[^\]]*\]/g, m => `<i class="regi">${m}</i>`);
  d.getElementById('m').innerHTML =
    (cur.step > 0 ? `<div class="said">${cur.step} tidigare stycken på den här bilden är dolda.</div>` : '') +
    sl.notes.map((t, k) =>
      `<p class="${k < cur.step ? 'past' : k === cur.step ? 'now' : ''}">${regi(t)}</p>`).join('');
  d.getElementById('cue').innerHTML = `<b>Nästa klick:</b> ${sl.cues[cur.step]}`;
  d.getElementById('nxt').innerHTML = `<b>Nästa bild:</b> ${nextSlide ? `Bild ${nextSlide.n}: ${nextSlide.title}` : 'Frågestund'}`;
  d.getElementById('m').scrollTop = 0;
}
function tick() {
  if (!spk || spk.closed) return;
  const two = n => String(n).padStart(2, '0');
  const sec = startedAt === null ? 0 : Math.floor((Date.now() - startedAt) / 1000);
  const d = new Date();
  spk.document.getElementById('t').textContent = two(Math.floor(sec / 60)) + ':' + two(sec % 60);
  spk.document.getElementById('c').textContent = two(d.getHours()) + ':' + two(d.getMinutes());
}
setInterval(tick, 1000);
addEventListener('beforeunload', () => { if (spk && !spk.closed) spk.close(); });

/* ---------- Tema, svart skärm, hjälp ---------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), 2600);
}
function setTheme(name, announce) {
  document.documentElement.dataset.theme = name;
  try { localStorage.setItem('tema', name); } catch (err) { /* utan lagring gäller temat bara den här visningen */ }
  if (announce) toast(name === 'dark' ? 'Mörkt tema' : 'Ljust tema');
}
function toggleFullscreen() {
  const p = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  p.catch(() => toast('Helskärm gick inte att starta. Prova webbläsarens egen helskärm.'));
}

function onKey(e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const black = $('#black'), help = $('#help');
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  const isNext = ['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k);
  const isPrev = ['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k);
  if (isNext || isPrev || k === 'Home' || k === 'End') e.preventDefault();
  if (e.repeat) return;

  if (black.classList.contains('on')) {          // vilken tangent som helst tänder skärmen igen
    black.classList.remove('on');
    return;
  }
  if (help.classList.contains('on') && k !== 'h' && k !== '?') { help.classList.remove('on'); return; }

  if (isNext) next();
  else if (isPrev) prev();
  else if (k === 'Home') show(0, 0, false);
  else if (k === 'End') show(slides.length - 1, 0, false);
  else if (k === 'b' || k === '.') black.classList.add('on');
  else if (k === 't') setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
  else if (k === 's') openSpeaker();
  else if (k === 'f') toggleFullscreen();
  else if (k === 'r') { startedAt = null; tick(); toast('Klockan är nollställd'); }
  else if (k === 'h' || k === '?') help.classList.toggle('on');
}
document.addEventListener('keydown', onKey);
document.addEventListener('click', e => {
  if (e.target.closest('a')) return;             // källänkar öppnas i ny flik utan att bilden byts
  if ($('#black').classList.contains('on')) { $('#black').classList.remove('on'); return; }
  if ($('#help').classList.contains('on')) { $('#help').classList.remove('on'); return; }
  if (e.shiftKey) prev(); else next();
});

/* ---------- Start ---------- */
function fit() {
  const k = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = `translate(-50%, -50%) scale(${k})`;
}
addEventListener('resize', fit);
fit();

let theme = params.get('theme');
if (!theme) { try { theme = localStorage.getItem('tema'); } catch (err) { theme = null; } }
setTheme(theme === 'dark' ? 'dark' : 'light', false);

/* Direktlänk: #6.2 betyder bild 6, steg 2. */
function fromHash() {
  const m = /^#(\d+)\.?(\d+)?$/.exec(location.hash);
  if (!m) return null;
  const i = slides.findIndex(s => s.n === Number(m[1]));
  if (i < 0) return null;
  return { i, step: Math.min(Number(m[2] || 0), slides[i].steps) };
}
addEventListener('hashchange', () => {
  const t = fromHash();
  if (t && (t.i !== cur.i || t.step !== cur.step)) show(t.i, t.step, false);
});
reduced.addEventListener('change', () => show(cur.i, cur.step, false));

const start = fromHash();
show(start ? start.i : 0, start ? start.step : 0, false);
if (!start && !params.has('still')) toast('H visar tangenterna');

/* För automatiska prov: läget och ett sätt att stega utan tangentbord. */
window.deck = { get state() { return { n: slides[cur.i].n, step: cur.step, busy }; }, slides: slides.map(s => ({ n: s.n, steps: s.steps })) };
})();
