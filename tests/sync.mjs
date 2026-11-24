// Kontrollerar att talet, bilderna, manuset och fördjupningssidan säger samma sak.
// Ren Node, utan webbläsare. Körs med: node tests/sync.mjs
//
// Talet finns på flera ställen: docs/assets/manus.js (talarvyn), content/innehall.md (manuset),
// bildtexten i docs/index.html och citaten på docs/fordjupning.html. De här kontrollerna
// fångar när ett av ställena ändras utan de andra.
import { readFileSync } from 'node:fs';

const read = rel => readFileSync(new URL('../' + rel, import.meta.url), 'utf8');
const manusSrc = read('docs/assets/manus.js');
const index = read('docs/index.html');
const fordj = read('docs/fordjupning.html');
const md = read('content/innehall.md');
const css = read('docs/assets/presentation.css');
const js = read('docs/assets/presentation.js');

const win = {};
new Function('window', manusSrc)(win);
const MANUS = win.MANUS;

const ENT = { '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>' };
const text = html => html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, e => ENT[e] ?? e);
const ws = s => s.replace(/[ \s]+/g, ' ').trim();
// Jämförelse av citat: blanksteg normaliseras, skiftläge och avslutande skiljetecken spelar ingen roll.
const loose = s => ws(s).toLowerCase().replace(/[.!?…]+$/, '');

let errors = 0, checks = 0;
const fail = msg => { errors++; console.log('FEL  ' + msg); };
const section = (name, fn) => { const before = errors; fn(); console.log((errors === before ? 'OK   ' : '---  ') + name); };
const short = s => (s.length > 90 ? s.slice(0, 90) + ' …' : s);

/* 1. Antalet steg på varje bild i index.html stämmer med antalet stycken i manus.js. */
section('högsta steg per bild = antal manusstycken − 1', () => {
  const s3 = (js.match(/\{ prompt:/g) || []).length - 1;   // bild 3 stegas av listan S3 i presentation.js
  for (const m of MANUS) {
    checks++;
    const a = index.indexOf(`id="s${m.n}"`);
    if (a < 0) { fail(`bild ${m.n} saknas i index.html`); continue; }
    const next = index.indexOf('<section class="slide"', a);
    const html = index.slice(a, next < 0 ? index.indexOf('<footer id="chrome">') : next);
    const steps = [0];
    for (const [, v] of html.matchAll(/data-show="([\d-]+)"/g)) steps.push(...v.split('-').map(Number));
    for (const [, v] of css.matchAll(new RegExp(`#s${m.n}(?:\\.\\w+)?\\[data-step="(\\d+)"\\]`, 'g'))) steps.push(Number(v));
    if (m.n === 3) steps.push(s3);
    const max = Math.max(...steps), want = m.notes.length - 1;
    if (max !== want) fail(`bild ${m.n}: högsta steg på bilden är ${max}, men manus.js har ${m.notes.length} stycken (steg 0–${want})`);
    if (m.cues.length !== m.notes.length) fail(`bild ${m.n}: ${m.notes.length} manusstycken men ${m.cues.length} klickrader`);
  }
});

/* 2. Varje manusstycke och klickrad i manus.js står ordagrant i innehall.md. */
section('manus.js ⊂ innehall.md', () => {
  const hay = ws(md);
  for (const m of MANUS) for (const [kind, list] of [['tal', m.notes], ['klickrad', m.cues]]) list.forEach((t, k) => {
    checks++;
    if (!hay.includes(ws(t))) fail(`bild ${m.n} steg ${k} (${kind}) saknas i innehall.md: "${short(t)}"`);
  });
});

/* Det som faktiskt sägs eller står på bilderna. */
const spoken = loose(MANUS.map(m => m.notes.join(' ')).join(' ') + ' ' + text(index));
const said = q => spoken.includes(loose(q));

/* 3. Varje "Vi sa"-citat på fördjupningssidan finns i talet eller på en bild. */
const cards = [...fordj.matchAll(/<details class="card simpl">([\s\S]*?)<\/details>/g)].map(([, h]) => {
  const title = ws(text(h.match(/<span class="s-title">([\s\S]*?)<\/span>/)[1])).replace(/^”|”$/g, '');
  const body = h.match(/<div class="more">([\s\S]*)<\/div>/)[1].replace(/<h4>Källa<\/h4>[\s\S]*$/, '');
  const [, exact, why] = body.match(/<h4>Mer exakt<\/h4>([\s\S]*?)<h4>Varför det är okej<\/h4>([\s\S]*)/);
  return { title, exact: ws(text(exact)), why: ws(text(why)) };
});
section('"Vi sa"-citaten på fördjupningssidan sägs i talet eller står på en bild', () => {
  if (!cards.length) fail('hittade inga "Vi sa"-kort i fordjupning.html');
  for (const c of cards) { checks++; if (!said(c.title)) fail(`"Vi sa"-kort citerar något som varken sägs eller står på en bild: "${c.title}"`); }
  for (const [, q] of fordj.matchAll(/<q class="sagt">([\s\S]*?)<\/q>/g)) { checks++; if (!said(text(q))) fail(`citat i löptexten sägs inte: "${ws(text(q))}"`); }
  // Löptext får inte påstå "vi sa att …" i egna ord. Det som sades ska stå som märkt citat.
  const prose = text(fordj.replace(/<details[\s\S]*?<\/details>/g, ' ').replace(/<q class="sagt">[\s\S]*?<\/q>/g, ' §CITAT§ '));
  for (const [hit] of prose.matchAll(/\bvi sa att\b[^.§]{0,80}/gi)) { checks++; fail(`löptexten säger "vi sa" utan märkt citat (<q class="sagt">): "${ws(hit)}"`); }
});

/* 4. "Säg"-raderna i innehall.md för händelser som nämns i talet står i manus.js. */
section('"Säg"-raderna i innehall.md för talade händelser står i talet', () => {
  const events = [...md.matchAll(/^\*\*\d+\. (.+?)\*\*\n- \*\*(Säg|Kortversion):\*\* "([\s\S]*?)"\n/gm)];
  if (!events.length) fail('hittade inga händelser med "Säg" eller "Kortversion" i innehall.md');
  for (const [, head, label, quote] of events) {
    checks++;
    const talked = /\(bild \d+\)/.test(head);
    if (talked && label !== 'Säg') fail(`"${head}" nämns i talet men är märkt "${label}"`);
    if (!talked && label === 'Säg') fail(`"${head}" nämns inte i talet men raden är märkt "Säg" (ska vara "Kortversion")`);
    if (talked && !said(quote)) fail(`"Säg"-raden för "${head}" står inte i talet: "${short(quote)}"`);
  }
});

/* 5. Förenklingstabellen i innehall.md är samma som korten på fördjupningssidan. */
section('förenklingstabellen i innehall.md = korten på fördjupningssidan', () => {
  const a = md.indexOf('| Vi säger |');
  if (a < 0) { fail('hittade inte förenklingstabellen i innehall.md'); return; }
  const rows = md.slice(a).split('\n').slice(2).filter((l, i, all) => l.startsWith('|') && all.slice(0, i).every(x => x.startsWith('|')))
    .map(l => l.split('|').slice(1, -1).map(c => ws(c)));
  checks++;
  if (rows.length !== cards.length) fail(`innehall.md har ${rows.length} rader, fördjupningssidan har ${cards.length} kort`);
  const strip = s => s.replace(/^[”"]|[”"]$/g, '');
  for (let i = 0; i < Math.max(rows.length, cards.length); i++) {
    const r = rows[i], c = cards[i];
    if (!r || !c) { fail(`rad ${i + 1}: finns bara i ${r ? 'innehall.md: ' + r[0] : 'fördjupningssidan: ”' + c.title + '”'}`); continue; }
    checks++;
    if (strip(r[0]) !== c.title) { fail(`rad ${i + 1}: citatet skiljer sig. innehall.md: ${r[0]} / fördjupningssidan: ”${c.title}”`); continue; }
    if (r[1] !== c.exact) fail(`rad ${i + 1} (”${c.title}”): "Mer exakt" skiljer sig mellan innehall.md och fördjupningssidan`);
    if (r[2] !== c.why) fail(`rad ${i + 1} (”${c.title}”): "Varför det är okej" skiljer sig mellan innehall.md och fördjupningssidan`);
  }
});

console.log(`\n${checks} kontroller, ${errors} fel. ${errors ? 'RÖD' : 'GRÖN'}`);
process.exitCode = errors ? 1 : 0;
