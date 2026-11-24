// Går igenom varje bild och steg i slutläge och letar efter text under 40 enheter (utom sidfotens räknare)
// och text utanför marginalerna. Manusets synk kontrolleras av sync.mjs.
import { launch, firstPage, sleep, DOCS } from './cdp.mjs';
const BASE = DOCS + 'index.html';
const b = await launch(9338); const p = await firstPage(b.port);
await p.size(1920, 1080);
await p.goto(BASE + '?still&theme=light#0.0', 700);
const slides = await p.eval('window.deck.slides');
const small = new Map(), out = [];
for (const s of slides) for (let st = 0; st <= s.steps; st++) {
  await p.eval(`location.hash='#${s.n}.${st}',1`); await sleep(120);
  const r = await p.eval(`(() => {
    const stage = document.querySelector('#stage'), sl = document.querySelector('.slide.active');
    const sr = stage.getBoundingClientRect();
    const vis = el => { for (let e = el; e && e !== stage; e = e.parentElement) { const c = getComputedStyle(e); if (c.visibility === 'hidden' || c.display === 'none' || c.opacity === '0') return false; } return true; };
    const small = [], out = [];
    const w = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const t = n.textContent.trim(); if (!t) continue;
      const el = n.parentElement; if (!vis(el)) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      const range = document.createRange(); range.selectNodeContents(n); const rc = range.getBoundingClientRect();
      if (!rc.width) continue;
      const inChrome = !!el.closest('#chrome');
      if (fs < 39.9) small.push(fs + 'px ' + (inChrome ? '[sidfot] ' : el.closest('.source') ? '[källrad] ' : '') + t.slice(0, 40));
      if (!inChrome && (rc.left < sr.left + 60 || rc.right > sr.right - 60 || rc.top < sr.top + 30 || rc.bottom > sr.top + 978)) out.push(t.slice(0, 40) + ' @ ' + [rc.left, rc.top, rc.right, rc.bottom].map(Math.round).join(','));
    }
    return { small, out };
  })()`);
  r.small.forEach(x => small.set(x, (small.get(x) || '') + ` ${s.n}.${st}`));
  r.out.forEach(x => out.push(`${s.n}.${st}: ${x}`));
}
console.log('TEXT UNDER 40 ENHETER (unika, med var de syns):'); for (const [k, v] of small) console.log('  ' + k + '  ->' + (v.length > 60 ? v.slice(0, 60) + ' …' : v));
console.log('TEXT UTANFÖR MARGINALERNA (60 px i sidled, under y=978):'); out.forEach(x => console.log('  ' + x)); if (!out.length) console.log('  inget');
const bad = [...small.keys()].filter(k => !k.includes('[sidfot]')).length + out.length;
console.log('errors', JSON.stringify(p.errors)); p.close(); b.close();
process.exitCode = bad || p.errors.length ? 1 : 0;
