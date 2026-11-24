// Funktionsprov av presentationen: genomklickning, klickspärrar, tangenter, talarvy.
import { launch, firstPage, attach, targets, sleep, DOCS, shotsDir } from './cdp.mjs';
const OUT = shotsDir('build');
const FINAL = shotsDir('final');
const BASE = DOCS + 'index.html';
const VK = { PageDown: 34, PageUp: 33, ArrowRight: 39, Home: 36, End: 35 };
const b = await launch(9335);
const p = await firstPage(b.port);
await p.size(1920, 1080);
const st = () => p.eval('window.deck.state');
const press = (k, code = k) => p.key(k, code, VK[k] || k.toUpperCase().charCodeAt(0));
const waitIdle = async () => { for (let k = 0; k < 400; k++) { if (!(await st()).busy) return; await sleep(50); } throw new Error('aldrig ledig'); };
let ok = 0, fail = 0;
const check = (name, cond, extra = '') => { cond ? ok++ : fail++; console.log((cond ? 'OK   ' : 'FEL  ') + name + (extra ? '  -> ' + extra : '')); };

// 1. Genomklickning från början till slut, med riktiga tangenthändelser (PageDown, som en klicker).
await p.goto(BASE, 800);
const slides = await p.eval('window.deck.slides');
const total = slides.reduce((a, s) => a + s.steps, 0) + slides.length - 1;
let presses = 0; const seen = [];
for (let k = 0; k < total; k++) {
  await waitIdle(); await sleep(270);
  await press('PageDown'); presses++;
  const s = await st(); seen.push(s.n + '.' + s.step);
}
await waitIdle();
let s = await st();
check(`genomklickning: ${presses} tryck slutar på 13.0`, s.n === 13 && s.step === 0, JSON.stringify(s));
check('varje tryck gav ett nytt steg', new Set(seen).size === total, `${new Set(seen).size} unika av ${total}`);
await sleep(300); await press('PageDown'); await sleep(100);
check('tryck efter sista bilden gör ingenting', (await st()).n === 13);
check('adressen följer med (#13.0)', (await p.eval('location.hash')) === '#13.0');

// 2. Bakåt hela vägen.
for (let k = 0; k < total; k++) { await sleep(270); await press('PageUp'); }
s = await st(); check('bakåt hela vägen slutar på 0.0', s.n === 0 && s.step === 0, JSON.stringify(s));

// 3. Studsande klicker framåt: två tryck inom 0,1 s räknas som ett.
await p.goto(BASE + '#2.0', 500); await p.eval("location.hash='#2.0',1"); await sleep(400);
await press('PageDown'); await sleep(90); await press('PageDown'); await waitIdle();
s = await st(); check('två tryck 90 ms isär går ett steg (2.1)', s.n === 2 && s.step === 1, JSON.stringify(s));
// 4. Studsande klicker bakåt.
await p.eval("location.hash='#2.4',1"); await sleep(400);
await press('PageUp'); await sleep(90); await press('PageUp'); await sleep(100);
s = await st(); check('två tryck bakåt 90 ms isär backar ett steg (2.3)', s.n === 2 && s.step === 3, JSON.stringify(s));

// 5. Skriptad rörelse: tryck mitt i ordflygningen på bild 3 gör bara klart steget.
await p.eval("location.hash='#3.2',1"); await sleep(400);
await press('PageDown'); await sleep(1300);
await p.shot(OUT + 'mellan-03.3-ordet-flyger.png');
await press('PageDown'); await sleep(150);
s = await st(); check('tryck under ordflygningen stannar på 3.3 och är klart', s.n === 3 && s.step === 3 && !s.busy, JSON.stringify(s));
check('  slutläget visas: ”Margit” står i meningen', await p.eval("document.querySelector('#s3-sent').textContent.includes('Margit') && !document.querySelector('.fly')"));
await sleep(300); await press('PageDown'); await sleep(100);
s = await st(); check('nästa tryck går vidare till 3.4', s.step === 4, JSON.stringify(s));

// 6. CSS-rörelse: stapeln på bild 6 (steg 4) växer i cirka 2,5 s. Ett tryck under tiden gör klart den.
await p.eval("location.hash='#6.3',1"); await sleep(400);
await press('PageDown'); await sleep(1100);
await p.shot(OUT + 'mellan-06.4-stapeln-vaxer.png');
const wMid = await p.eval("getComputedStyle(document.querySelector('#s6 .brow .seg.right')).width");
await press('PageDown'); await sleep(200);
s = await st();
const wEnd = await p.eval("parseFloat(getComputedStyle(document.querySelector('#s6 .brow .seg.right')).width) / document.querySelector('#s6 .sbar').clientWidth");
check('tryck medan stapeln växer stannar på 6.4', s.n === 6 && s.step === 4 && !s.busy, JSON.stringify(s));
check('  stapeln står i slutläge (Rätt = 24 % av bredden)', Math.abs(wEnd - 0.24) < 0.005, `mitt i rörelsen: ${wMid}, efter trycket: ${(wEnd * 100).toFixed(1)} %`);

// 7. Stämpeln (CSS-animation) på bild 1: tryck direkt efter gör klart, hoppar inte vidare.
await p.eval("location.hash='#1.1',1"); await sleep(400);
await press('PageDown'); await sleep(300); await press('PageDown'); await sleep(200);
s = await st(); check('tryck 0,3 s efter stämpeln stannar på 1.2', s.n === 1 && s.step === 2, JSON.stringify(s));
check('  stämpeln syns och spelas inte om', await p.eval("(() => { const e = document.querySelector('#s1 .stamp'); const c = getComputedStyle(e); return c.opacity === '1' && c.animationName === 'none'; })()"));

// 8. Mellansteg i rörelse: bild 1 medan svaret skrivs, bild 8 medan pappren faller.
await p.eval("location.hash='#1.0',1"); await sleep(400);
await press('PageDown'); await sleep(5200); await p.shot(OUT + 'mellan-01.1-svaret-skrivs.png');
await p.eval("location.hash='#8.2',1"); await sleep(400);
await press('PageDown'); await sleep(450); await p.shot(OUT + 'mellan-08.3-papper-faller.png');

// 9. Svart skärm, tema, hjälp, Home/End.
await p.eval("location.hash='#5.2',1"); await sleep(400);
await press('b', 'KeyB'); check('B ger svart skärm', await p.eval("document.querySelector('#black').classList.contains('on')"));
await press('PageDown'); await sleep(100);
s = await st(); check('tangent tänder skärmen utan att stega', !(await p.eval("document.querySelector('#black').classList.contains('on')")) && s.step === 2);
await press('.', 'Period'); check('punkt ger svart skärm', await p.eval("document.querySelector('#black').classList.contains('on')")); await press('b', 'KeyB');
await press('t', 'KeyT'); check('T byter till mörkt tema', (await p.eval('document.documentElement.dataset.theme')) === 'dark');
await sleep(300); await p.shot(OUT + 'tangent-T-morkt-05.2.png');
await press('t', 'KeyT'); check('T byter tillbaka till ljust', (await p.eval('document.documentElement.dataset.theme')) === 'light');
await press('h', 'KeyH'); await sleep(100); check('H visar hjälprutan', await p.eval("document.querySelector('#help').classList.contains('on')"));
await p.shot(OUT + 'tangent-H-hjalp.png');
await press('h', 'KeyH'); check('H döljer hjälprutan', !(await p.eval("document.querySelector('#help').classList.contains('on')")));
await press('End'); s = await st(); check('End går till sista bilden', s.n === 13);
await press('Home'); s = await st(); check('Home går till första bilden', s.n === 0);
await press('f', 'KeyF'); await sleep(500);
console.log('INFO helskärm efter F: fullscreenElement =', await p.eval('document.fullscreenElement ? document.fullscreenElement.tagName : null'));
await p.eval('document.fullscreenElement ? document.exitFullscreen().then(() => 1) : 1');

// 9b. Bild 10: etiketten "Påhittat exempel" är dold i steg 4, och stämpeln ligger inom högerkolumnen.
await p.eval("location.hash='#10.3',1"); await sleep(400);
const l3 = await p.eval("document.querySelector('#label').className");
const st10 = await p.eval("(() => { const s = document.querySelector('#s10 .stamp').getBoundingClientRect(), c = document.querySelector('#s10 .sceneb .chatcol').getBoundingClientRect(); return Math.round(s.right - c.right) + 0; })()");
await p.eval("location.hash='#10.4',1"); await sleep(400);
const l4 = await p.eval("document.querySelector('#label').className");
check('bild 10: etiketten syns i steg 3 och är dold i steg 4', l3 === 'ill' && l4 === '', `steg 3: "${l3}", steg 4: "${l4}"`);
check('bild 10: stämpeln sticker inte ut utanför högerkolumnen', st10 <= 8, `stämpelns högerkant minus kolumnens (skärmpixlar, inklusive lutningen): ${st10}`);

// 10. Direktlänk och ?still.
await p.goto(BASE + '?still#6.5', 600);
s = await st(); check('direktlänk ?still#6.5 öppnar bild 6 steg 5', s.n === 6 && s.step === 5);
check('  ?still: scenen har klassen still', await p.eval("document.querySelector('#stage').classList.contains('still')"));
await press('PageDown'); await sleep(60);
check('  ?still: steget är inte upptaget efter ett tryck (ingen rörelse att vänta på)', !(await st()).busy);
await p.goto(BASE + '?theme=dark#13', 600);
check('?theme=dark#13 ger mörkt tema och bild 13', (await p.eval('document.documentElement.dataset.theme')) === 'dark' && (await st()).n === 13);

// 11. prefers-reduced-motion: svaret på bild 1 står klart direkt.
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await p.goto(BASE + '?theme=light#1.0', 600);
await press('PageDown'); await sleep(120);
check('reduced-motion: hela svaret på bild 1 syns direkt', await p.eval("(() => { const w = [...document.querySelectorAll('#s1-a .w')]; return w.length > 10 && w.every(x => x.classList.contains('on')) && document.querySelector('#s1-q').textContent.length > 20; })()"));
await p.send('Emulation.setEmulatedMedia', { features: [] });

// 12. Talarvyn (S): eget fönster med klocka, manus per steg och "nästa klick".
await p.goto(BASE + '#6.1', 600); await p.eval("location.hash='#6.1',1"); await sleep(300);
await press('s', 'KeyS'); await sleep(800);
const tgt = (await targets(b.port)).find(t => t.type === 'page' && t.title === 'Talarvy');
check('S öppnar ett fönster med titeln Talarvy', !!tgt);
if (tgt) {
  const sp = await attach(tgt.webSocketDebuggerUrl);
  await sp.size(1100, 780);
  const info = await sp.eval("({ t: document.getElementById('t').textContent, c: document.getElementById('c').textContent, pos: document.getElementById('pos').textContent, now: document.querySelector('p.now').textContent, cue: document.getElementById('cue').textContent, n: document.querySelectorAll('main p').length })");
  console.log('INFO talarvy:', JSON.stringify(info));
  const manus = await p.eval('window.MANUS.find(m => m.n === 6)');
  check('  talarvyn visar manuset för aktuellt steg (6.1)', info.now === manus.notes[1] && info.n === manus.notes.length);
  check('  "Nästa klick" visar rätt rad', info.cue === 'Nästa klick: ' + manus.cues[1]);
  check('  klocka och klockslag finns', /^\d\d:\d\d$/.test(info.t) && /^\d\d:\d\d$/.test(info.c));
  await sp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'PageDown', code: 'PageDown', windowsVirtualKeyCode: 34 });
  await sp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'PageDown', code: 'PageDown', windowsVirtualKeyCode: 34 });
  await sleep(1300);
  s = await st(); check('  PageDown i talarvyn stegar presentationen (6.2)', s.n === 6 && s.step === 2, JSON.stringify(s));
  const t2 = await sp.eval("document.getElementById('t').textContent");
  check('  klockan går efter första trycket', t2 !== '00:00', t2);
  // Litet fönster: klockan och "nästa klick" ska ligga kvar när manuset är långt.
  await sp.size(900, 420); await sleep(200);
  const fixed = await sp.eval("(() => { const r = e => document.querySelector(e).getBoundingClientRect(); const m = r('main'), n = r('p.now'); return { h: innerHeight, headTop: r('header').top, footBottom: r('footer').bottom, mainTop: Math.round(m.top), mainBottom: Math.round(m.bottom), nowTop: Math.round(n.top), nowBottom: Math.round(n.bottom), pastVisible: [...document.querySelectorAll('p.past')].filter(e => e.offsetHeight > 0).length }; })()");
  check('  litet fönster (900x420): klockan och "nästa klick" ligger fast', fixed.headTop === 0 && Math.abs(fixed.footBottom - fixed.h) < 1, JSON.stringify(fixed));
  check('  litet fönster: aktuellt stycke börjar överst i läsytan och tidigare stycken är dolda', fixed.nowTop >= fixed.mainTop && fixed.nowTop - fixed.mainTop < 70 && fixed.pastVisible === 0, JSON.stringify(fixed));
  await sp.shot(OUT + 'talarvy-litet-fonster.png');
  await sp.shot(FINAL + 'talarvy-litet-fonster.png');
  // Efter storleksändring och ett steg till ska det aktuella stycket fortfarande ligga överst.
  await sp.size(700, 360); await sleep(250);
  const after = await sp.eval("(() => { const m = document.querySelector('main').getBoundingClientRect(), n = document.querySelector('p.now').getBoundingClientRect(); return { d: Math.round(n.top - m.top), scroll: document.querySelector('main').scrollTop }; })()");
  check('  efter storleksändring (700x360) ligger aktuellt stycke kvar överst', after.d >= 0 && after.d < 70, JSON.stringify(after));
  await sp.shot(FINAL + 'talarvy-mycket-litet-fonster.png');
  await sp.size(1100, 780); await sleep(200);
  await sp.shot(OUT + 'talarvy.png');
  await p.eval("location.hash='#1.1',1"); await sleep(300);
  const regi = await sp.eval("(() => { const i = document.querySelector('p.now i.regi'); if (!i) return null; const c = getComputedStyle(i), pc = getComputedStyle(i.parentElement); return { text: i.textContent, italic: c.fontStyle, color: c.color, parentColor: pc.color }; })()");
  check('  regi inom [hakparentes] har egen stil (kursiv, dämpad färg)', regi && regi.italic === 'italic' && regi.color !== regi.parentColor, JSON.stringify(regi));
  await sp.shot(FINAL + 'talarvy-regi.png');
  if (sp.errors.length) console.log('talarvy errors', sp.errors);
  check('  inga fel i talarvyns konsol', sp.errors.length === 0);
  sp.close();
}

// 12b. Etiketten "Påhittat exempel" syns så fort det påhittade mejlet syns, alltså redan på bild 11 steg 0.
await p.goto(BASE + '?still&theme=light#11.0', 500); await p.eval("location.hash='#11.0',1"); await sleep(300);
const l110 = await p.eval("JSON.stringify({ label: document.querySelector('#label').className, text: document.querySelector('#label').textContent, draft: document.querySelector('#s11 .draft').offsetHeight > 0 })");
check('bild 11 steg 0: utkastet syns och etiketten "Påhittat exempel" syns', l110 === '{"label":"ill","text":"Påhittat exempel","draft":true}', l110);

// 13. Ny ordning: bild 12 är tre vanor med stor QR-kod, bild 13 är tidslinjen med liten QR-kod och adress, utan klick.
await p.goto(BASE + '?still&theme=light#12.0', 500); await p.eval("location.hash='#12.0',1"); await sleep(300);
const q12 = await p.eval("JSON.stringify((() => { const i = document.querySelector('#s12 .qr img'); const r = i.getBoundingClientRect(); return { loaded: i.complete && i.naturalWidth > 0, w: Math.round(r.width), habits: [...document.querySelectorAll('#s12 .habits li')].map(l => l.textContent), addr: document.querySelector('#s12 .addr').textContent, active: document.querySelector('.slide.active').id }; })())");
const o12 = JSON.parse(q12);
check('bild 12: tre vanor, QR-koden laddad och minst 35 % av höjden', o12.active === 's12' && o12.loaded && o12.w >= 378 && o12.habits.length === 3 && o12.habits[0] === 'Ge underlag som du får dela.', q12);
await p.key('PageDown', 'PageDown', 34); await sleep(900);
const q13 = await p.eval("JSON.stringify((() => { const i = document.querySelector('#s13 .tlfoot img'); const r = i.getBoundingClientRect(); const ev = document.querySelector('#s13 .ev'); return { state: window.deck.state, steps: window.deck.slides.find(s => s.n === 13).steps, loaded: i.complete && i.naturalWidth > 0, w: Math.round(r.width), addr: document.querySelector('#s13 .addr').textContent, evVisible: getComputedStyle(ev).visibility === 'visible' && ev.offsetHeight > 0 }; })())");
const o13 = JSON.parse(q13);
check('bild 13: tidslinjen kommer efter bild 12, har 0 klick, visar felen direkt, liten QR-kod laddad och adressen', o13.state.n === 13 && o13.steps === 0 && o13.loaded && o13.w >= 250 && o13.evVisible && o13.addr.includes('fordjupning'), q13);
const m13 = await p.eval("window.MANUS.find(m => m.n === 13).notes.join(' ').replace(/\\[[^\\]]*\\]/g, '').trim()");
check('bild 13 har inget talarmanus utöver regiraden', m13 === '', JSON.stringify(m13));
// Bild 7: lappen om frågans förutsättning kommer i steg 1, svaren i steg 2–4. Bild 11: metoden i steg 1–3, tavlan från steg 4.
await p.eval("location.hash='#7.1',1"); await sleep(300);
const s7 = await p.eval("JSON.stringify({ premise: document.querySelector('#s7 .premise').classList.contains('is-on'), answers: document.querySelectorAll('#s7 .try.is-on').length })");
check('bild 7 steg 1: lappen syns, inga svar ännu', s7 === '{"premise":true,"answers":0}', s7);
await p.eval("location.hash='#11.3',1"); await sleep(300);
const s11a = await p.eval("JSON.stringify({ bubbles: document.querySelectorAll('#s11 .mchat .msg.is-on').length, steps: document.querySelectorAll('#s11 .msteps li.is-on').length })");
await p.eval("location.hash='#11.6',1"); await sleep(300);
const s11b = await p.eval("JSON.stringify({ cards: document.querySelectorAll('#s11 .card.is-on').length, tromso: document.body.textContent.includes('11 av 18') })");
check('bild 11 steg 3: fyra bubblor och tre metodsteg', s11a === '{"bubbles":4,"steps":3}', s11a);
check('bild 11 slutläge: sex kort, Tromsø borta', s11b === '{"cards":6,"tromso":false}', s11b);

check('inga JavaScript-fel eller varningar i konsolen under hela provet', p.errors.length === 0, JSON.stringify(p.errors));
const ext = [...new Set(p.requests.filter(u => !u.startsWith('file:') && !u.startsWith('data:') && !u.startsWith('about:')))];
check('inga nätverksanrop (bara file://)', ext.length === 0, JSON.stringify(ext));
console.log(`\n${ok} OK, ${fail} FEL`);
p.close(); b.close();
process.exitCode = fail ? 1 : 0;
