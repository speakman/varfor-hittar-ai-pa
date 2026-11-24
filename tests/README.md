# Tester

- `node tests/sync.mjs` kontrollerar utan webbläsare att `docs/assets/manus.js`, `content/innehall.md`, bildtexten i `docs/index.html` och citaten på `docs/fordjupning.html` säger samma sak.
- `node tests/test.mjs` klickar igenom presentationen i headless Chrome (cirka 3 minuter) och kontrollerar klickspärrar, tangenter, talarvy, konsolfel och nätverksanrop. `node tests/audit.mjs` letar efter för liten text och text utanför marginalerna, `node tests/shots.mjs` tar skärmdumpar till `shots/final/` och `node tests/words.mjs` räknar ord och tid. Chrome hittas på standardplatsen i macOS; annars anges sökvägen i miljövariabeln `CHROME`.
