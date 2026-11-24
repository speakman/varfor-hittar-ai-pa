// Räknar talade ord per bild ur docs/assets/manus.js (regi inom hakparentes räknas inte).
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../docs/assets/manus.js', import.meta.url), 'utf8');
const window = {}; new Function('window', src)(window);
// Tillägg per bild i sekunder: [publikmoment, väntan på rörelser som talaren inte pratar över]
const EXTRA = { 1: [20, 8], 3: [0, 6], 6: [25, 8] };
let tot = 0, totS = 0; const rows = [];
for (const m of window.MANUS) {
  const words = m.notes.join(' ').replace(/\[[^\]]*\]/g, '').split(/\s+/).filter(Boolean).length;
  const clicks = m.notes.length - 1;
  const [aud, wait] = EXTRA[m.n] || [0, 0];
  const sec = words / 125 * 60 + aud + wait + clicks * 1.5 + 2;   // 1,5 s per klick, 2 s för bildbytet
  tot += words; totS += sec;
  rows.push({ n: m.n, words, clicks, tal: Math.round(words / 125 * 60), sek: Math.round(sec), satt: m.time });
}
console.table(rows);
console.log('ord totalt', tot, 'tal', (tot / 125).toFixed(2), 'min; summa', Math.floor(totS / 60) + ' min ' + Math.round(totS % 60) + ' s');
