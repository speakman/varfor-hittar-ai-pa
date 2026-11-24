/* Talarmanus per bild och steg. Samma text står i content/innehall.md.
   notes[k] är det talaren säger när bilden står på steg k.
   cues[k] beskriver vad nästa tryck gör när bilden står på steg k.
   Text inom [hakparentes] är regi och sägs inte. */
window.MANUS = [
  { n: 0, title: 'Varför hittar AI på saker?', time: 'cirka 15 s, ligger uppe före start',
    notes: [
      '[Ligger uppe medan publiken sätter sig.] Välkomna. Den närmaste dryga kvarten ska vi titta under huven på ChatGPT och andra chattbotar: varför de ibland hittar på saker, och hur du får nytta av dem ändå.'
    ],
    cues: ['Bild 1: ett tomt frågefält.'] },

  { n: 1, title: 'Säker på rösten, fel i sak', time: '1 min 55 s',
    notes: [
      'Tänk dig att du frågar en chattbot, till exempel ChatGPT, om en bok.',
      'Så här kan svaret se ut: författare, årtal, handling. [Vänta tills svaret står klart.] Hur många tycker att det låter trovärdigt? Hand upp.',
      'Det är påhittat. Boken finns inte. Jag har skrivit svaret själv, för att visa hur det kan se ut. Tyckte ni att det lät trovärdigt är det fullt begripligt. Språket avslöjar inte felet.',
      'Det här kallas hallucination: chattboten hittar på, och låter lika säker som vanligt.',
      'Och det händer på riktigt. 2023 lämnade två advokater i New York in sex rättsfall till en domstol, som ChatGPT hade hittat på. Det slutade med 5 000 dollar i böter. Ändå är de här tjänsterna till stor nytta, och det kommer vi till. En chattjänst som ChatGPT består av en språkmodell som formulerar text, och ofta verktyg runt omkring, som sökning på nätet. Tjänster och versioner skiljer sig åt. Betalversioner har andra modeller och verktyg, men ingen garanti mot fel. Nu tittar vi under huven.'
    ],
    cues: [
      'Frågan skrivs och svaret spelas upp (cirka 8 s).',
      'Stämpeln PÅHITTAT. Fråga först: hur många tycker att det låter trovärdigt?',
      'Ordet hallucination med förklaring.',
      'Advokatfallet: 6 påhittade rättsfall, 5 000 dollar.',
      'Bild 2: ”Bä, bä, vita …”'
    ] },

  { n: 2, title: 'Ni kan också fylla i', time: '45 s',
    notes: [
      'Avsluta den här meningen tyst för er själva. Bä, bä, vita …',
      'Lamm.',
      'Sveriges huvudstad är …',
      'Stockholm.',
      'Romanen Fyren vid Gråskär skrevs av …',
      'Margit Holmsten. Märkte ni vad som hände? Namnet dök upp i huvudet, fast ni vet att det är påhittat.',
      'Att kunna fortsättningen är alltså inte samma sak som att veta att det stämmer. En chattbot gör i grunden just det här: den fyller i fortsättningen.'
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

  { n: 3, title: 'Ett ord i taget, och snöbollen', time: '1 min 30 s',
    notes: [
      'Det känner ni igen från mobilen. Du skriver ”Vi ses i” och tangentbordet föreslår några ord: morgon, kväll, helgen.',
      'Språkmodellen i en chattbot gör i grunden samma sak, bara oerhört mycket bättre. Den räknar ut vilka fortsättningar som är troliga, väljer en, lägger till den och börjar om. Ett ord i taget. Siffrorna här är påhittade för att visa principen.',
      'Så här kan det se ut för vår bok. Lägg märke till en sak: även en mycket sannolik fortsättning kan vara fel. Procenten gäller nästa ord, inte sanningen. Själva modellen slår inte upp något.',
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

  { n: 4, title: 'Tränad med en gissningslek', time: '1 min',
    notes: [
      'Hur blir den bra på det här? Det är steg ett: att lära sig av text. Modellen får början av en riktig text, här ett recept, och ska gissa nästa ord.',
      'Sedan jämförs gissningen med vad som faktiskt stod där.',
      'Och modellen justeras en aning, så att just den fortsättningen får lite högre sannolikhet nästa gång.',
      'Det här upprepas på enorma mängder text. För att göra det bra har modellen lärt sig mycket om språk och om världen, och den kan dra slutsatser. Men lägg märke till vad facit är: vad som stod i just den texten, inte vad som är sant. Ett välformulerat svar är alltså inte automatiskt kontrollerat.'
    ],
    cues: [
      'Det dolda ordet avslöjas: ”mjöl”.',
      'Stapeln för ”mjöl” växer en aning.',
      '”Upprepas på enorma mängder text” och ”Facit = vad som stod där”.',
      'Bild 5: ett suddigt fotografi.'
    ] },

  { n: 5, title: 'Ett suddigt minne, inget uppslagsverk', time: '1 min 10 s',
    notes: [
      'Vad finns kvar efter träningen? Inget arkiv som modellen kan slå i. Kvar finns inlärda mönster. Tänk på det som ett suddigt fotografi av allt den har läst.',
      'Det som stod på tusentals ställen, som att Astrid Lindgren skrev Pippi Långstrump, är oftast skarpt.',
      'Ovanliga uppgifter är suddigare. De kan vara svårare att få rätt.',
      'Och där det inte finns något alls? När du ställer frågan kan modellen fylla i med något som passar mönstret: svensk skärgårdsroman, författarnamn, årtal. Lappen skrivs alltså när frågan ställs, inte under träningen.',
      'Ungefär som när du återberättar en film du såg för tio år sedan och fyller i luckorna utan att märka det. Vanliga uppgifter är ofta lättare att återge, men även välkända fakta kan bli fel. Det finns ingen källa att kontrollera mot.'
    ],
    cues: [
      'Ofta skarpt: Astrid Lindgren.',
      'Ofta suddigt: ”19?7”.',
      'Tomt: dimma, och sedan den gula lappen ”Margit Holmsten, 1962”.',
      'Raden ”Vanliga uppgifter är ofta lättare att återge. Men även välkända fakta kan bli fel.”',
      'Bild 6: steg 2, textfortsättaren och assistenten.'
    ] },

  { n: 6, title: 'Provet utan minuspoäng', time: '2 min 35 s',
    notes: [
      'Hittills har vi en maskin som fortsätter text. Får den en fråga kan den lika gärna skriva fler frågor.',
      'Steg två är att lära sig hjälpa. Modellen tränas en gång till, på exempelsamtal och med betyg från människor. Då lär den sig svara på frågor, följa instruktioner och oftare svara rätt.',
      'Men hur mäter man om en modell är bra? Länge ungefär som på ett prov utan minuspoäng. Tänk er ett sådant prov, och en fråga ni inte kan. Vad gör ni: gissar, eller lämnar blankt? Hand upp ni som gissar.',
      'Självklart. Blankt ger noll, en gissning kan ge poäng. Rätt svar är förresten 1907, så den här gissningen gav noll. Men den kostade ingenting. Så har modellerna länge bedömts, och då lönar det sig att gissa. Det är en del av förklaringen till att tidiga versioner hittade på så mycket.',
      'Nu ett test från OpenAI, hösten 2025. Det består av extremt svåra detaljfrågor, ungefär som den om hembygdsföreningen, och modellerna får inte söka på nätet. Siffrorna visar alltså inte hur ofta en chattbot har fel i vardagen. Två modeller från 2025 fick samma frågor. Den första svarade nästan alltid, och svarade fel 75 gånger av hundra.',
      'Den andra avstod 52 gånger och svarade fel 26.',
      'Båda kunde ungefär lika många svar, runt en fjärdedel. Skillnaden är vad de gör när de inte kan: den andra avstår oftare och gör betydligt färre fel.'
    ],
    cues: [
      'Assistenten svarar: Paris.',
      'Provbladet. Fråga: gissa eller lämna blankt? Vänta in händerna.',
      'Gissningen ”B, 1902” fylls i gult. ”Gissa lönar sig alltid.”',
      'Stapeln för modellen som svarade nästan alltid (cirka 3 s).',
      'Stapeln för modellen som avstod oftare (cirka 3 s).',
      'Slutsatsen: ungefär lika många rätt, betydligt färre fel.',
      'Bild 7: frågan om boken, tre gånger.'
    ] },

  { n: 7, title: 'Frågan styr, och lite slump', time: '1 min 5 s',
    notes: [
      'Två saker till om hur svaren blir till. Titta först på frågan.',
      '”Vem skrev Fyren vid Gråskär?” förutsätter att boken finns. Och en assistent vill gärna vara till lags, så den hakar lätt på. Fråga hellre öppet: Vad talar för och emot? Finns det något fel i mina antaganden?',
      'Det andra är slumpen. Modellen tar inte alltid den troligaste fortsättningen. Därför kan samma fråga ge olika svar. Första gången: Margit Holmsten.',
      'Andra gången: ett annat namn.',
      'Tredje gången: Margit Holmsten igen. Motsäger svaren varandra är det en varningssignal.',
      'Men det omvända gäller inte. Tre likadana svar kan vara lika påhittade, och två svar från samma chattbot är inte två källor. Kontrollera uppgiften utanför chatten.'
    ],
    cues: [
      'Lappen vid frågan: den förutsätter att boken finns.',
      'Svar 1: Margit Holmsten.',
      'Svar 2: Karin Lindvall, märkt ”Ett annat namn”.',
      'Svar 3: Margit Holmsten, och raden om varningssignalen.',
      'Slutraden: stabilt är inget bevis, kontrollera utanför chatten.',
      'Bild 8: skrivbordet.'
    ] },

  { n: 8, title: 'Skrivbordet', time: '1 min 30 s',
    notes: [
      'När modellen svarar har den ett begränsat underlag framför sig: tjänstens instruktioner, samtalet och det du själv har lagt dit. Tänk på det som ett skrivbord.',
      'Är bordet tomt, och du frågar vad som står i er förenings stadgar, har den bara sitt suddiga minne. Då kan du få en regel som låter rimlig men inte är er.',
      'Klistrar du in stadgarna har den något riktigt att läsa. Jämför paragraf sju med svaret: nu stämmer det. Det du klistrar in ligger på bordet i det här samtalet. Det tränar inte om modellen medan ni pratar. Här är det offentliga stadgar. Dela bara sådant du får dela: klistra inte in lösenord, personnummer eller känsliga uppgifter, och följ jobbets regler.',
      'Men lasta inte på för mycket. På ett överfullt bord kan en detalj mitt i högen förbises, och i riktigt långa samtal kan gamla delar falla bort.',
      'Säg det viktiga igen om den har tappat det. Finns texten kvar kan det hjälpa att peka på rätt stycke. Har den fallit bort behöver du klistra in den igen.'
    ],
    cues: [
      'Tomt bord: svaret ”två veckor”.',
      'Stadgarna läggs på bordet. Svaret ”fyra veckor” stämmer med § 7. Raden om vad du får dela.',
      'Överfullt bord: papper faller över stadgarna, svaret blir ”två veckor” igen.',
      'Påminnelsen som en vanlig chattfråga. Rätt svar igen.',
      'Bild 9: därför hittar den på.'
    ] },

  { n: 9, title: 'Därför hittar den på', time: '55 s',
    notes: [
      'Nu kan vi svara på frågan.',
      'Ett: svaret skapas, ord för ord. Det är inte automatiskt faktakontrollerat.',
      'Två: underlaget kan saknas eller förbises. Minnet är suddigt, inget uppslagsverk.',
      'Tre: den säger inte alltid ”jag vet inte”. Länge belönades gissningar. Nyare modeller avstår oftare, och felen har blivit färre.',
      'Titta på de här två svaren. Vilket låter osäkert? Inget. Utifrån ser de likadana ut.',
      'Samma sätt att formulera text kan ge både korrekta svar och påhitt. Därför räcker inte en självsäker ton som bevis. Och kom ihåg: ett felaktigt svar betyder inte att någon försöker lura dig.'
    ],
    cues: [
      'Påstående 1: svaret skapas, det är inte automatiskt faktakontrollerat.',
      'Påstående 2: underlaget kan saknas eller förbises.',
      'Påstående 3: den säger inte alltid ”jag vet inte”.',
      'Två svar sida vid sida: utifrån ser de likadana ut.',
      'Slutraden: samma sätt att formulera ger både korrekta svar och påhitt.',
      'Bild 10: sökning kan hjälpa.'
    ] },

  { n: 10, title: 'Sökning hjälper, men löser inte allt', time: '1 min 25 s',
    notes: [
      'Många chattbotar kan numera söka på nätet eller läsa dokument du laddar upp.',
      'Då hamnar riktiga texter på skrivbordet. Ställer du frågan om boken till en chattbot som söker kan du få det här svaret: den hittar ingen sådan roman, och säger det. Det modellen lärde sig under träningen har dessutom ett slutdatum. För nyheter, öppettider och annat som ändras: be den söka, öppna källan och titta på datumet.',
      'Men det är samma modell som läser och sammanfattar. Här har den hittat en guide om fyrar och satt en liten etta efter namnet. Ettan är en hänvisning: den pekar på källan.',
      'Men läs källan. Den nämner Gråskär, men varken boken eller Margit Holmsten. Länken finns. Påståendet står inte där.',
      'I en internationell studie från 2025 testade 22 public service-bolag, bland dem SVT, AI-assistenter med nyhetsfrågor. 45 procent av svaren hade minst ett betydande problem. Så en länk är inget bevis. Den är en inbjudan att kontrollera.'
    ],
    cues: [
      'Tre källor läggs på bordet. Svaret: ”Jag hittar ingen roman med den titeln.” Raden om det som ändras.',
      'Ny scen: ett källkort och ett svar med hänvisningen [1].',
      'Stämpeln STÅR INTE DÄR.',
      'Nyhetsstudien: 45 %. Slutraden om länken.',
      'Bild 11: så använder du den klokt.'
    ] },

  { n: 11, title: 'Så använder du den klokt', time: '1 min 20 s',
    notes: [
      'Så hur får du nytta av den? Vi tar ett exempel: ett mejl som blev lite väl kärvt.',
      'Ett: fråga med villkor. Säg vad som ska vara kvar och hur långt det får bli.',
      'Två: kontrollera resultatet. Står uppgifterna kvar? Fredag finns med. Det ser du själv, direkt.',
      'Tre: be om en ändring. Du behöver inte börja om. Fortsätt samtalet tills du är nöjd.',
      'Det är tumregeln. Chattboten är som bäst när du själv kan bedöma resultatet: göra om en text, förklara ett krångligt brev som du har klistrat in, bolla idéer eller skriva ett första utkast.',
      'Var på din vakt med sådant som antingen stämmer eller inte: namn, årtal, siffror, citat och källor. Och med juridik och medicin: fråga apoteket eller läs bipacksedeln.',
      'Ibland beror det på. Har du läst texten själv kan du bedöma sammanfattningen. Annars: stickprova mot originalet.'
    ],
    cues: [
      'Ditt utkast, och frågan med villkor.',
      'Chattbotens förslag. Kontrollera: fredag står kvar.',
      'Följdfrågan ”Lite kortare, tack” och det kortare svaret.',
      'Ny scen: ”Bedöm själv” med tre kort.',
      '”Kontrollera” med två kort: citatet och medicindosen.',
      'Kortet om sammanfattningen, mitt på linjen: beror på.',
      'Bild 12: tre vanor och QR-koden.'
    ] },

  { n: 12, title: 'Tre vanor, och mer att läsa', time: '30 s',
    notes: [
      'Tre vanor räcker långt. Ge den underlag som du får dela, i stället för att be den minnas. Be om källor och klicka på dem. Dubbelkolla det som har konsekvenser. QR-koden leder till en sida där du kan prova själv på fem minuter, med källorna och några filmer. Adressen står under koden. Tack. Vad undrar ni över? [Klicka fram tidslinjen. Den ligger uppe under frågestunden.]'
    ],
    cues: ['Bild 13: tidslinjen, som ligger uppe tyst under frågestunden.'] },

  { n: 13, title: 'Åttio år på en bild', time: 'ingen taltid, ligger uppe under frågestunden',
    notes: [
      '[Tidslinjen ligger uppe tyst under frågestunden och har inget eget manus. QR-koden och adressen syns nere till vänster. Backa till bild 12 om någon vill se de tre vanorna igen.]'
    ],
    cues: ['Sista bilden. Den står kvar under frågestunden.'] }
];
