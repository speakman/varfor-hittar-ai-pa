/* Talarmanus per bild och steg. Samma text står i content/innehall.md.
   notes[k] är det talaren säger när bilden står på steg k.
   cues[k] beskriver vad nästa tryck gör när bilden står på steg k.
   Text inom [hakparentes] är regi och sägs inte. */
window.MANUS = [
  { n: 0, title: 'Varför hittar AI på saker?', time: 'cirka 15 s, ligger uppe före start',
    notes: [
      '[Ligger uppe medan publiken sätter sig.] Välkomna. Den närmaste dryga kvarten ska vi titta under huven på ChatGPT och andra chattbotar, och svara på en enda fråga: varför hittar de på saker?'
    ],
    cues: ['Bild 1: ett tomt frågefält.'] },

  { n: 1, title: 'Säker på rösten, fel i sak', time: '1 min 45 s',
    notes: [
      'Tänk dig att du frågar en chattbot om en bok.',
      'Så här kan svaret se ut: författare, årtal, handling. [Vänta tills svaret står klart.] Hur många tycker att det låter trovärdigt? Hand upp.',
      'Det är påhittat. Boken finns inte. Jag har skrivit svaret själv, för att visa hur det kan se ut. Och lägg märke till en sak: det syntes inte på svaret.',
      'Det här kallas hallucination: chattboten hittar på, och låter lika säker som vanligt.',
      'Och det händer på riktigt. 2023 lämnade två advokater i New York in en skrivelse till domstolen med sex rättsfall som ChatGPT hade hittat på. En av dem frågade chattboten om fallen var äkta, och den svarade ja. Det slutade med 5 000 dollar i böter. Många av er har kanske provat en tidig version och blivit besvikna. Det har blivit klart bättre sedan dess, men inte felfritt. Nu tittar vi under huven och ser varför.'
    ],
    cues: [
      'Frågan skrivs och svaret spelas upp (cirka 8 s).',
      'Stämpeln PÅHITTAT. Fråga först: hur många tycker att det låter trovärdigt?',
      'Ordet hallucination med förklaring.',
      'Advokatfallet: 6 påhittade rättsfall, 5 000 dollar.',
      'Bild 2: ”Bä, bä, vita …”'
    ] },

  { n: 2, title: 'Ni kan också fylla i', time: '1 min',
    notes: [
      'Innan vi öppnar huven: avsluta den här meningen tyst för er själva. Bä, bä, vita …',
      'Lamm.',
      'Sveriges huvudstad är …',
      'Stockholm.',
      'Romanen Fyren vid Gråskär skrevs av …',
      'Margit Holmsten. Märkte ni vad som hände? Namnet dök upp i huvudet, fast ni vet att det är påhittat. Det gick lätt, för ni såg det nyss.',
      'Att kunna fortsättningen är alltså inte samma sak som att veta att det stämmer. En chattbot gör i grunden just det här: den fyller i fortsättningen. Den kan säga ”jag vet inte”. Men den gör det inte alltid när den borde.'
    ],
    cues: [
      'Ordet ”lamm” fylls i.',
      'Ny mening: ”Sveriges huvudstad är …”',
      'Ordet ”Stockholm” fylls i.',
      'Ny mening: ”Romanen Fyren vid Gråskär skrevs av …”',
      '”Margit Holmsten” fylls i, och raden ”Lätt att fylla i. Fortfarande påhittat.”',
      'Alla tre meningarna och slutsatsen: att kunna fortsättningen är inte att veta.',
      'Bild 3: ”Vi ses i …” och mobilens ordförslag.'
    ] },

  { n: 3, title: 'Ett ord i taget, och snöbollen', time: '1 min 45 s',
    notes: [
      'Det känner ni igen från mobilen. Du skriver ”Vi ses i” och tangentbordet föreslår några ord: morgon, kväll, helgen.',
      'Språkmodellen i en chattbot gör i grunden samma sak, bara oerhört mycket bättre. Den räknar ut vilka fortsättningar som är troliga, väljer en, lägger till den och börjar om. Ett ord i taget. Egentligen små textbitar, som kallas tokens, men vi säger ord. Siffrorna här är påhittade för att visa principen.',
      'Så här kan det se ut för vår bok. Lägg märke till en sak: staplarna visar hur texten troligen fortsätter, inte om påståendet är sant. Även en mycket sannolik fortsättning kan vara fel. Procenten gäller nästa ord, inte sanningen. Själva modellen slår inte upp något. Chattjänsten runt omkring kan söka på nätet, och det kommer vi till.',
      'Modellen väljer ”Margit”. [Vänta medan ordet flyttas upp och listan räknas om.] Nu är listan en annan. Nästa ord beror på hela texten hittills, också på det modellen själv nyss skrev. Efter Margit passar ett efternamn.',
      'Den väljer ”Holmsten” och fyller på med ”och gavs ut”. [Vänta på den nya listan.] Nu är det årtal som passar.',
      'Den väljer 1962. Som en snöboll som rullar. Därför blir ett påhitt så detaljerat och sammanhängande.'
    ],
    cues: [
      '”Sveriges huvudstad är”: Stockholm 93 %.',
      '”Romanen Fyren vid Gråskär skrevs av”: en jämn topplista.',
      '”Margit” väljs och flyttas upp. Listan räknas om till efternamn. Rubriken byts.',
      '”Holmsten” väljs, ”och gavs ut” fylls på. Listan räknas om till årtal.',
      '”1962” väljs. Listan försvinner och slutraden visas.',
      'Bild 4: steg 1, ett recept med ett dolt ord.'
    ] },

  { n: 4, title: 'Tränad med en gissningslek', time: '1 min 5 s',
    notes: [
      'Hur blir den bra på att gissa? Det är steg ett: att lära sig av text. Modellen får början av en riktig text, här ett recept, och ska gissa nästa ord.',
      'Sedan jämförs gissningen med vad som faktiskt stod där.',
      'Och modellen justeras en aning, så att just den fortsättningen får lite högre sannolikhet nästa gång.',
      'Det här upprepas på enorma mängder text. För att gissa bra måste modellen fånga mönster: grammatik, fakta, stil, till och med hur resonemang brukar gå. Men lägg märke till vad facit är. Det är vad som stod i just den texten, inte vad som är sant. Mycket blir rätt på köpet, men det är inte det den övar på i det här steget.'
    ],
    cues: [
      'Det dolda ordet avslöjas: ”mjöl”.',
      'Stapeln för ”mjöl” växer en aning.',
      '”Upprepas på enorma mängder text” och ”Facit = vad som stod där”.',
      'Bild 5: ett suddigt fotografi.'
    ] },

  { n: 5, title: 'Ett suddigt minne, inget uppslagsverk', time: '1 min 30 s',
    notes: [
      'Vad finns kvar efter träningen? Inget arkiv som modellen kan slå i. Kvar finns inställningarna på många miljarder små rattar, som tillsammans fångar det den har lärt sig. Tänk på det som ett suddigt fotografi av allt den har läst.',
      'Det som stod på tusentals ställen, som att Astrid Lindgren skrev Pippi Långstrump, är oftast skarpt. Vissa texter sitter till och med ordagrant.',
      'Ovanliga uppgifter är suddigare. De kan vara svårare att få rätt.',
      'Och där det inte finns något alls? När du ställer frågan kan modellen fylla i med något som passar mönstret: svensk skärgårdsroman, författarnamn, årtal. Lappen skrivs alltså när frågan ställs, inte under träningen.',
      'Ungefär som när du återberättar en film du såg för tio år sedan och fyller i luckorna utan att märka det. Modellen kan också dra nya slutsatser. Men ett författarnamn till en påhittad bok går inte att räkna ut. Vanliga uppgifter är ofta lättare att återge, men även välkända fakta kan bli fel. Det finns ingen källa att kontrollera mot.'
    ],
    cues: [
      'Ofta skarpt: Astrid Lindgren.',
      'Ofta suddigt: ”19?7”.',
      'Tomt: dimma, och sedan den gula lappen ”Margit Holmsten, 1962”.',
      'Raden ”Vanliga uppgifter är ofta lättare att återge. Men även välkända fakta kan bli fel.”',
      'Bild 6: steg 2, textfortsättaren och assistenten.'
    ] },

  { n: 6, title: 'Provet utan minuspoäng', time: '2 min 25 s',
    notes: [
      'Hittills har vi en maskin som fortsätter text. Får den en fråga kan den lika gärna skriva fler frågor.',
      'Steg två är att lära sig hjälpa. Modellen tränas en gång till, på exempelsamtal och med betyg från människor. Då lär den sig svara på frågor, följa instruktioner och oftare svara rätt.',
      'Men hur mäter man om en modell är bra? Länge ungefär som på ett prov utan minuspoäng. Tänk er ett sådant prov, och en fråga ni inte kan. Vad gör ni: gissar, eller lämnar blankt? Hand upp ni som gissar.',
      'Självklart. Blankt ger noll, en gissning kan ge poäng. Rätt svar är förresten 1907, så den här gissningen gav noll. Men den kostade ingenting. Så har modellerna länge bedömts, och då lönar det sig att gissa. Det beskrev OpenAI själva hösten 2025. Det är en del av förklaringen till att många minns tidiga versioner som opålitliga: de kunde mindre, och de avstod sällan.',
      'Här ser vi två sätt att svara på samma test: två modeller från 2025 och samma svåra faktafrågor. Den första svarade nästan alltid. Den avstod en gång av hundra och svarade fel 75 gånger av hundra.',
      'Den andra avstod 52 gånger och svarade fel 26.',
      'Ungefär lika många rätt. Men den andra modellen avstår oftare och gör betydligt färre fel.'
    ],
    cues: [
      'Assistenten svarar: Paris.',
      'Provbladet. Fråga: gissa eller lämna blankt? Vänta in händerna.',
      'Gissningen ”B, 1902” fylls i gult. ”Gissa lönar sig alltid.”',
      'Stapeln för modellen som svarade nästan alltid (cirka 3 s).',
      'Stapeln för modellen som avstod oftare (cirka 3 s).',
      'Slutsatsen: ungefär lika många rätt, betydligt färre fel.',
      'Bild 7: samma fråga tre gånger.'
    ] },

  { n: 7, title: 'Lite slump i varje svar', time: '55 s',
    notes: [
      'En sak till om hur orden väljs. Modellen tar inte alltid den troligaste fortsättningen. Det finns lite slump i valet, och hur mycket styrs av en inställning som kallas temperatur. Därför kan samma fråga ge olika svar.',
      'Vi ställer frågan om boken en gång.',
      'Och en gång till. Ett annat namn.',
      'Och en tredje gång. Ställ gärna samma faktafråga två gånger. Får du uppgifter som säger emot varandra är det en varningsklocka.',
      'Men det omvända gäller inte. Tre likadana svar hade kunnat vara lika påhittade. Stabilt är inget bevis. Kontrollera mot en källa.'
    ],
    cues: [
      'Svar 1: Margit Holmsten.',
      'Svar 2: Karin Lindvall, märkt ”Ett annat namn”.',
      'Svar 3: Margit Holmsten, och raden om varningsklockan.',
      'Slutraden: stabilt är inget bevis.',
      'Bild 8: skrivbordet.'
    ] },

  { n: 8, title: 'Skrivbordet', time: '1 min 30 s',
    notes: [
      'När modellen svarar har den ett begränsat underlag framför sig: tjänstens instruktioner, samtalet och det du själv har lagt dit. Tänk på det som ett skrivbord.',
      'Är bordet tomt, och du frågar vad som står i er förenings stadgar, har den bara sitt suddiga minne. Då kan du få en regel som låter rimlig men inte är er.',
      'Lägger du stadgarna på bordet, genom att klistra in dem, har den något riktigt att läsa. Jämför paragraf sju med svaret: nu stämmer det. Rätt papper på bordet ger färre fel.',
      'Men lasta inte på för mycket. På ett överfullt bord kan en detalj mitt i högen förbises, och i riktigt långa samtal kan gamla delar kortas ner eller falla bort.',
      'Säg det viktiga igen om du märker att den har tappat det. Skriv det som en vanlig fråga i chatten. Finns texten kvar kan det hjälpa att peka på rätt stycke. Har den fallit bort behöver du klistra in den igen. Det hjälper ofta, men garanterar inget.'
    ],
    cues: [
      'Tomt bord: svaret ”två veckor”.',
      'Stadgarna läggs på bordet. Svaret ”fyra veckor” stämmer med § 7.',
      'Överfullt bord: papper faller över stadgarna, svaret blir ”två veckor” igen.',
      'Påminnelsen som en vanlig chattfråga. Rätt svar igen.',
      'Bild 9: därför hittar den på.'
    ] },

  { n: 9, title: 'Därför hittar den på', time: '1 min',
    notes: [
      'Nu kan vi svara på frågan.',
      'Ett: svaret formuleras ord för ord, efter vad som är en trolig fortsättning.',
      'Två: underlaget kan saknas eller förbises. Minnet är suddigt, inget uppslagsverk.',
      'Tre: den säger inte alltid ”jag vet inte”. Länge belönades gissningar. Nu tränas modellerna att avstå, och felen har blivit färre. Men modellen har ingen pålitlig varningslampa.',
      'Titta på de här två svaren. Vilket låter osäkert? Inget. Utifrån ser de likadana ut.',
      'Samma sätt att formulera text kan ge både korrekta svar och påhitt. Därför räcker inte en självsäker ton som bevis. Dagens chattbotar gör fortfarande fel. Och kom ihåg: ett felaktigt svar betyder inte att någon försöker lura dig.'
    ],
    cues: [
      'Påstående 1: svaret formuleras ord för ord.',
      'Påstående 2: underlaget kan saknas eller förbises.',
      'Påstående 3: den säger inte alltid ”jag vet inte”.',
      'Två svar sida vid sida: utifrån ser de likadana ut.',
      'Slutraden: samma sätt att formulera ger både korrekta svar och påhitt.',
      'Bild 10: sökning kan hjälpa.'
    ] },

  { n: 10, title: 'Sökning hjälper, men löser inte allt', time: '1 min 25 s',
    notes: [
      'Många chattbotar kan numera söka på nätet eller läsa dokument du laddar upp.',
      'Då hamnar riktiga texter på skrivbordet. Här hittar den inget om boken, och säger det. Bra och relevanta källor kan minska felen, och du får länkar att klicka på.',
      'Men det är samma modell som läser och sammanfattar. Här har den hittat en guide om fyrar och satt en liten etta efter namnet. Ettan är en hänvisning: den pekar på källan.',
      'Men läs källan. Den nämner Gråskär, men varken boken eller Margit Holmsten. Länken finns. Påståendet står inte där. Modellen kan också missförstå en källa, blanda ihop två eller välja en dålig.',
      'I en internationell studie, publicerad i oktober 2025, testade 22 public service-bolag, bland dem SVT, AI-assistenter med nyhetsfrågor. 45 procent av svaren hade minst ett betydande problem. Vart femte hade betydande sakfel, och nästan vart tredje hade problem med källorna. Så en länk är inget bevis. Den är en inbjudan att kontrollera.'
    ],
    cues: [
      'Tre källor läggs på bordet. Svaret: ”Jag hittar ingen roman med den titeln.”',
      'Ny scen: ett källkort och ett svar med hänvisningen [1].',
      'Stämpeln STÅR INTE DÄR.',
      'Nyhetsstudien: 45 %. Slutraden om länken.',
      'Bild 11: så använder du den klokt.'
    ] },

  { n: 11, title: 'Så använder du den klokt', time: '1 min 45 s',
    notes: [
      'Så vad gör vi med allt det här?',
      'Först: den här tekniken är till stor nytta. Här är ett kort mejl som blev lite väl kärvt, och chattbotens förslag på en vänligare ton. Du ser själv, direkt, om det blev bra.',
      'Det är tumregeln. Chattboten är som bäst när du själv kan bedöma resultatet: formulera om en text, ge idéer, skriva ett första utkast.',
      'Var på din vakt med sådant som antingen stämmer eller inte: namn, årtal, siffror, citat, källor. Ett citat till ett tal är precis sådant som kan vara påhittat.',
      'Juridik och medicin hör också hit. Fråga apoteket eller läs bipacksedeln.',
      'Och ibland beror det på. Har du läst texten själv kan du bedöma sammanfattningen. Annars: stickprova mot originalet.',
      'Att det spelar roll fick Tromsø kommun i Norge erfara 2025. I underlaget till ett förslag om att lägga ner skolor gick 11 av 18 källhänvisningar inte att spåra. Flera hänvisade till publikationer som inte fanns. Underlaget var delvis framtaget med AI. Förslaget drogs tillbaka för kontroll, och den ansvariga chefen lämnade sin chefsroll. En extern granskning fann senare att slutsatserna inte ändrades. Men kontrollera alltid att källan finns och säger det som påstås.'
    ],
    cues: [
      'Mejlet före och efter.',
      'Ny scen: ”Bedöm själv” och ”Kontrollera”. Första kortet: mejlet.',
      'Kortet om citatet, under ”Kontrollera”.',
      'Kortet om medicindosen, under ”Kontrollera”.',
      'Kortet om sammanfattningen, mitt på linjen: beror på.',
      'Tromsø: 11 av 18 källhänvisningar gick inte att spåra.',
      'Bild 12: tidslinjen.'
    ] },

  { n: 12, title: 'Åttio år på en bild', time: '40 s',
    notes: [
      'Det här tog åttio år att bygga. Från en första matematisk modell av en nervcell 1943 till chattbotar som söker på nätet och gör färre fel genom att avstå oftare.',
      'Och här är några uppmärksammade fel. Det första har ni inte hört om: i februari 2023 gjorde Googles chattbot Bard ett sakfel i en reklam. När felet uppmärksammades föll Alphabets börsvärde med ungefär 100 miljarder dollar. Påhitten har följt med sedan chattbotarna slog igenom.'
    ],
    cues: [
      'De tre uppmärksammade felen under tidsaxeln.',
      'Bild 13: tre vanor och QR-koden.'
    ] },

  { n: 13, title: 'Tre vanor, och mer att läsa', time: '30 s, står sedan kvar under frågestunden',
    notes: [
      'Tre vanor räcker långt. Ge den underlaget i stället för att be den minnas. Be om källor och klicka på dem. Dubbelkolla det som har konsekvenser. QR-koden leder till en sida med källorna, några filmer och de mer invecklade resonemangen. Adressen står under koden för er som sitter långt bak. Tack. Vad undrar ni över?'
    ],
    cues: ['Sista bilden. Den står kvar under frågestunden.'] }
];
