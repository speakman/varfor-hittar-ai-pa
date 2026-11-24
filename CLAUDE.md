# llm-for-newbies

Review profile: hobby, fix mode auto

Kort animerad föreläsning "Varför hittar AI på saker?" + fördjupningssida, publicerad via GitHub Pages från `docs/` på `main` (https://speakman.github.io/varfor-hittar-ai-pa/). En merge till `main` publicerar direkt.

- Manus: `content/innehall.md` (måste hållas i synk med `docs/assets/manus.js` och bildtexterna i `docs/index.html`).
- Sajten är statisk, utan byggsteg och nätverksberoenden; fungerar via `file://`.
- Test och verifiering: skripten ligger i `tests/` (se `tests/README.md`). `node tests/sync.mjs` kontrollerar synken mellan manus, bilder och fördjupningssida utan webbläsare. `node tests/test.mjs` kör presentationen i headless Chrome via DevTools-protokollet och fångar konsolfel och nätverksanrop. Inga loggar eller hemligheter i projektet.
- Arbetsmaterial (`tasks/`, `shots/`, `prototype/`) är utestängt i `.gitignore`.
