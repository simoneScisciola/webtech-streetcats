-- =============================================================================
-- seed.sql
-- Database seed file for the Webtech's StreetCats application.
-- Generated to match Sequelize model definitions.
-- Run AFTER Sequelize has synced and created the schema.
-- =============================================================================

-- Wrap everything in a transaction for atomicity.
BEGIN;

-- -----------------------------------------------------------------------------
-- 1. UserRoles
-- The afterSync hook already inserts these rows, but we include them here with
-- ON CONFLICT DO NOTHING so the seed is idempotent.
-- -----------------------------------------------------------------------------
INSERT INTO user_roles (rolename, created_at, updated_at) VALUES
    ('ADMIN', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
    ('USER',  '2025-01-01 00:00:00', '2025-01-01 00:00:00')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. Users
-- 2 admins + 5 regular users.
-- Passwords are bcrypt hashes of "NameSurname01!".
-- -----------------------------------------------------------------------------
INSERT INTO users (username, email, password, fk_rolename, created_at, updated_at)
VALUES
    ('mario_rossi', 'mario.rossi@gattirandagi.it', '$2b$12$ZUP/Nct5p/4nPlOXdou1oecojcGo4XL0ViHCDgLqU6rmFyNiznCp2', 'ADMIN', '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
    ('giulia_bianchi', 'giulia.bianchi@gattirandagi.it', '$2b$12$ohTEiE7fq5aYIYEuo9Fu4uUyI3hSUnWpVpAh0K7RmdXFM6YGADDsS', 'ADMIN', '2025-01-01 08:00:00', '2025-01-01 08:00:00'),
    ('luca_ferrari', 'luca.ferrari@example.com', '$2b$12$NGMhwlnr0Qs4DwwkwCtBcuRpkdVmw8EL5ZxDDWdOu0/TTZQJERPjO', 'USER',  '2025-01-01 09:00:00', '2025-01-01 09:00:00'),
    ('sofia_esposito', 'sofia.esposito@example.com', '$2b$12$92MOCk5R/em.fVBXwQb2cOboZ4fmj/TBxxfsIVxtmCBp4A/zb3hOS', 'USER',  '2025-01-01 09:00:00', '2025-01-01 09:00:00'),
    ('marco_romano', 'marco.romano@example.com', '$2b$12$/o4wsyfL0amw4rMewB9vwu9llfmsd/6wmrhVMM3NFY6cNJ48TOk.q', 'USER',  '2025-01-01 09:00:00', '2025-01-01 09:00:00'),
    ('elena_conti', 'elena.conti@example.com', '$2b$12$KuC1Za4RsgbY7jTEBYYbwO70wKaNxk7xlKq7m1w1e5QGjcKcR9/Pe', 'USER',  '2025-01-01 09:00:00', '2025-01-01 09:00:00'),
    ('andrea_ricci', 'andrea.ricci@example.com', '$2b$12$0UGjPWLULCU.47Q5PgiuR.WskRrMOjcimqZscnvhwDI5h0mDjhuzO', 'USER',  '2025-01-01 09:00:00', '2025-01-01 09:00:00')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. Sightings
-- 35 cat sightings spread across Italy.
-- Descriptions use Markdown format as required by the application.
-- -----------------------------------------------------------------------------
INSERT INTO sightings (photo_url, title, description, latitude, longitude, address, fk_username, created_at, updated_at)
VALUES
    (
        '/uploads/sightings/2026-02-24-sighting-1933976e.jpg',
        'Gatto tigrato sotto il portico di Piazza Navona',
        '## Avvistamento a Piazza Navona

Oggi pomeriggio ho incontrato un magnifico **gatto tigrato grigio**
accucciato sotto uno dei portici laterali di Piazza Navona.
Sembrava molto a suo agio con la gente, accettando carezze da chiunque
si avvicinasse con calma.

### Caratteristiche fisiche
- Mantello: tigrato grigio con striature nere
- Occhi: giallo-verdi
- Taglia: media, ben nutrito
- Sesso: maschio (non castrato, apparentemente)

### Comportamento
Il micio era **molto socievole** e si è avvicinato spontaneamente
a me mentre mangiavo un gelato. Non mostrava segni di malnutrizione.

> Se qualcuno lo conosce, fatemi sapere! Sembra un gatto di colonia
> o forse un semi-randagio abituato ai turisti.

Portate sempre qualche croccantino se passate da queste parti!',
        41.8991,
        12.4731,
        'Piazza Navona, 00186 Roma RM',
        'mario_rossi',
        '2025-01-01 09:00:00',
        '2025-01-01 09:00:00'
    ),
    (
        '/uploads/sightings/2026-02-24-sighting-20b48150.jpg',
        'Colonia di gatti al Foro Romano',
        '## La colonia felina del Foro Romano

Tra le rovine del **Foro Romano** vive da decenni una delle colonie
feline più famose di Roma. Ho contato almeno **dodici gatti** in
un''unica visita mattutina.

### Gatti avvistati
| Nome (dato dai volontari) | Colore | Stima età |
|--------------------------|--------|-----------|
| Cesare | Nero lucido | ~5 anni |
| Cleopatra | Tartarugata | ~3 anni |
| Nerone | Rosso tabby | ~7 anni |
| Augusto | Bianco e nero | ~4 anni |

### Gestione della colonia
La colonia è gestita da **volontari LAV** che provvedono a:
- Cibo quotidiano
- Sterilizzazioni (metodo TNR)
- Cure veterinarie di base

*Questi gatti vivono tra storia e modernità: guardiani silenziosi
di tremila anni di civiltà.*',
        41.8924,
        12.4857,
        'Via Sacra, 00186 Roma RM',
        'giulia_bianchi',
        '2025-02-02 10:07:00',
        '2025-02-02 10:07:00'
    ),
    (
        '/uploads/sightings/2026-02-24-sighting-291f01b4.jpg',
        'Micia bianca al Gianicolo',
        '## Una principessa sul colle

Passeggiando sul **Gianicolo** ho incontrato una splendida gatta
completamente bianca, con un occhio azzurro e uno verde (eterocromia!).
Era seduta su un muretto con il panorama di Roma alle spalle.

### Note sull''eterocromia nei gatti
L''eterocromia oculare nei gatti bianchi è spesso correlata a una
**mutazione genetica** legata al gene W (white).
I gatti bianchi con occhio azzurro hanno spesso **deficit uditivi**
parziali o totali dal lato dell''occhio azzurro.

Questa micia sembrava in ottima salute e ben curata.
Probabilmente appartiene a qualche residente della zona che
la lascia libera di girovagare.

> Avvistata alle 7:30 circa, ancora bagnata di rugiada.',
        41.8883,
        12.4672,
        'Passeggiata del Gianicolo, 00165 Roma RM',
        'luca_ferrari',
        '2025-03-03 11:14:00',
        '2025-03-03 11:14:00'
    ),
    (
        '/uploads/sightings/2026-02-24-sighting-4573a0a9.jpg',
        'Randagio arancione a Trastevere',
        '## Il re di Trastevere

C''è un gatto rosso-arancione che i residenti di Trastevere chiamano
affettuosamente **"Carbonara"** per via del colore. Lo si trova
quasi sempre nei pressi della fontana di Piazza Santa Maria.

### Avvistamenti documentati
```
Lunedì mattina   → fontana centrale
Giovedì sera     → gradini della basilica
Sabato pomeriggio→ tavoli del bar all''angolo
```

È assolutamente **non addomesticabile** — accetta cibo ma non
vuole essere toccato. Un vero romano: accetta l''ospitalità
ma non rinuncia alla libertà.

I baristi della piazza gli lasciano regolarmente
un piattino con cibo umido.',
        41.8895,
        12.4698,
        'Piazza di Santa Maria in Trastevere, 00153 Roma RM',
        'sofia_esposito',
        '2025-04-04 12:21:00',
        '2025-04-04 12:21:00'
    ),
    (
        '/uploads/sightings/2026-02-24-sighting-526f06fa.jpg',
        'Gatti nei Quartieri Spagnoli di Napoli',
        '## I monarchi dei vicoli napoletani

Nei **Quartieri Spagnoli** i gatti non sono ospiti: sono i
**proprietari del territorio**. Ogni vicolo ha il suo felino
di riferimento, rispettato da tutti gli abitanti.

### La gerarchia felina
1. **Peppe ''o Russo** – maschio dominante, tigrato arancione
2. **Carmela** – femmina anziana, nera, non accetta sconosciuti
3. **I tre moschettieri** – trio di fratelli, grigi, inseparabili

Gli abitanti portano cibo regolarmente e li considerano
portafortuna e protettori del quartiere.

> *"Chi ha un gatto in casa non ha bisogno di antifurto"*
> — detto napoletano (inventato adesso, ma ci sta)

Se passate da queste parti, portate tonno in scatola.',
        40.8368,
        14.2482,
        'Via Speranzella, 80132 Napoli NA',
        'marco_romano',
        '2025-05-05 13:28:00',
        '2025-05-05 13:28:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5dhg0dd8.jpg',
        'Colonia felina al Lungomare di Napoli',
        '## Gatti con vista Vesuvio

Sul **Lungomare Caracciolo** esiste una colonia di una quindicina
di gatti che ha eletto a casa propria la balaustra di pietra
affacciata sul Golfo di Napoli.

### Condizioni della colonia
- Stato generale: **buono**
- Sterilizzazioni: circa il 70% degli adulti
- Referente: signora Angela, 68 anni, abita in Via Caracciolo 14
- Punto di alimentazione: ore 7:30 e ore 18:00

Uno di loro — un maschio soriano di circa 4 anni — ha l''abitudine
di saltare sulle banchine degli scooter parcheggiati per dormire
seduti in bella vista sul parafango anteriore.

*Napoli e i suoi gatti: un amore che non ha bisogno di spiegazioni.*',
        40.8278,
        14.2496,
        'Via Caracciolo, 80122 Napoli NA',
        'elena_conti',
        '2025-06-06 14:35:00',
        '2025-06-06 14:35:00'
    ),
    (
        '/uploads/sightings/2026-02-24-sighting-81617b87.jpg',
        'Gatto soriano nei Caruggi di Genova',
        '## Fantasma dei vicoli genovesi

Nei **Caruggi** — i vicoli stretti del centro storico di Genova —
i gatti si muovono come ombre. Ho fotografato questo soriano
classico mentre attraversava un raggio di luce in un vicolo
praticamente buio.

### I Caruggi come habitat felino
I vicoli genovesi offrono ai gatti:
- **Riparo** garantito anche con la pioggia (i caruggi sono spesso
  coperti da strutture aggettanti)
- **Calore** emanato dalla pietra antica
- **Cibo** lasciato dalle signore anziane del quartiere
- **Fuga** rapida verso i piani alti tramite scale esterne

Il gatto in questione era adulto, ben nutrito, con una piccola
tacca sull''orecchio sinistro che indica **sterilizzazione** (metodo TNR).',
        44.407,
        8.933,
        'Vico Falamonica, 16124 Genova GE',
        'andrea_ricci',
        '2025-07-07 15:42:00',
        '2025-07-07 15:42:00'
    ),
    (
        '/uploads/sightings/2026-02-24-sighting-917ffca2.jpg',
        'Micio sul Canal Grande di Venezia',
        '## Un gatto a Venezia: equilibrismo sull''acqua

A Venezia i gatti esistono ancora, ma sono molto meno numerosi
di un tempo — la città lagunare non è il loro habitat ideale.
Ho trovato questo **nero corvino** seduto su un paletto da ormeggio
alla Fondamenta degli Ormesini.

### Curiosità: i gatti a Venezia nel tempo
Nel Medioevo Venezia **vietò i gatti** per decreto, ritenendoli
associati alla stregoneria. Poi li reintrodusse quando i topi
invasero i magazzini delle spezie.

Oggi ne sopravvivono alcune colonie sparse, spesso curate
da veneziani doc che resistono all''esodo dalla laguna.

> *Il gatto guarda il Canal Grande come se stesse aspettando
> un vaporetto in ritardo.*',
        45.4406,
        12.3361,
        'Fondamenta degli Ormesini, 30121 Venezia VE',
        'mario_rossi',
        '2025-08-08 16:49:00',
        '2025-08-08 16:49:00'
    ),
    (
        '/uploads/sightings/2026-02-24-sighting-b250c4d8.jpg',
        'Triplo avvistamento a Cannaregio',
        '## Tre gatti, una storia

Nel **Campo del Ghetto Nuovo** — il ghetto ebraico più antico
d''Europa — vivono almeno tre gatti appartenenti a una piccola
colonia gestita da un''associazione locale.

### I tre avvistati
- **Golda** – femmina, tartarugata, la più anziana (~10 anni)
- **Mosè** – maschio, bianco con macchia nera sulla testa
- **Shlomo** – giovane maschio grigio, timidissimo

La colonia è curata con grande dedizione da un residente
del campo che preferisce restare anonimo.

Condizioni: **ottime**. Tutti e tre sterilizzati, vaccinati,
con microchip. Un esempio di gestione felina responsabile
in un contesto urbano delicatissimo.',
        45.4452,
        12.3307,
        'Campo del Ghetto Nuovo, 30121 Venezia VE',
        'giulia_bianchi',
        '2025-09-09 09:56:00',
        '2025-09-09 09:56:00'
    ),
    (
        '/uploads/sightings/2026-02-24-sighting-d3d3f555.jpg',
        'Gatta con cuccioli a Firenze – Oltrarno',
        '## Urgente: mamma gatta con cuccioli!

⚠️ **Avvistamento urgente** ⚠️

In **Piazza della Passera**, nel quartiere Oltrarno di Firenze,
ho trovato una gatta grigio-blu (probabilmente una **Certosina** o
simile) con **quattro cuccioli** di circa 3-4 settimane.

### Stato dei cuccioli
| # | Colore | Condizioni |
|----|--------|-----------|
| 1 | Grigio | Buone |
| 2 | Grigio | Buone |
| 3 | Bianco e grigio | Magrino |
| 4 | Nero | Buone |

**Ho già contattato l''ENPA Firenze** (055 333 221).
Se siete della zona e potete fornire assistenza temporanea,
commentate questo post o scrivetemi in privato.

La mamma è **diffidente ma non aggressiva**.',
        43.7662,
        11.2488,
        'Piazza della Passera, 50125 Firenze FI',
        'luca_ferrari',
        '2025-10-10 10:03:00',
        '2025-10-10 10:03:00'
    ),
    (
        '/uploads/sightings/2026-02-24-sighting-e793f044.jpg',
        'Gatto al Mercato Centrale di Firenze',
        '## Il padrone del mercato

Al **Mercato Centrale** di Firenze c''è un gatto soriano macchiato
che i venditori chiamano **"Lorenzo"** (in onore dei Medici,
ovviamente). Ogni mattina fa il giro delle bancarelle
del piano terra e riscuote il suo tributo in scarti di pesce.

### La routine di Lorenzo
```
06:30 – Arrivo dal retro del mercato
07:00 – Giro della pescheria (il preferito)
08:00 – Sonnellino sotto la cassa della norcineria
10:00 – Secondo giro, specializzato in formaggi
12:00 – Siesta prolungata fino al pomeriggio
```

I turisti lo fotografano continuamente.
Lorenzo sopporta con la stoica indifferenza tipica della sua specie.

> *Un gatto in un mercato non è un ospite: è un socio.*',
        43.7758,
        11.2541,
        'Piazza del Mercato Centrale, 50123 Firenze FI',
        'sofia_esposito',
        '2025-01-11 11:10:00',
        '2025-01-11 11:10:00'
    ),
    (
        '/uploads/sightings/2026-02-26-sighting-84a2e557.jpg',
        'Randagio ai Navigli di Milano',
        '## Un gatto tra i locali notturni

Sui **Navigli** ci si aspetta aperitivi e street art,
non gatti randagi. Eppure, nascosto tra i vasi di piante
di un appartamento al pianterreno, vive un bellissimo
**Maine Coon** semi-selvatico di colore marrone tabby.

### Il Maine Coon randagio: un paradosso
Il Maine Coon è una razza pregiata che può costare centinaia
di euro. Trovarne uno randagio suggerisce che sia stato
**abbandonato** o si sia perso.

Ho segnalato il ritrovamento a:
- **Enpa Milano** ✓
- **Gruppo Facebook "Gatti Smarriti Milano"** ✓
- **Veterinario di zona** ✓ (nessun microchip rilevato)

Se qualcuno lo riconosce, questo gatto merita di tornare a casa
— o di trovarne una nuova degna di lui.',
        45.4511,
        9.176,
        'Ripa di Porta Ticinese, 20143 Milano MI',
        'marco_romano',
        '2025-02-12 12:17:00',
        '2025-02-12 12:17:00'
    ),
    (
        '/uploads/sightings/2026-02-26-sighting-9eea1576.jpg',
        'Colonia in Piazza XXIV Maggio – Milano',
        '## La colonia più urbana di Milano

In **Piazza XXIV Maggio**, vicino alla Darsena, vive una colonia
di sette gatti che ha sopravvissuto a decenni di trasformazioni
urbane.

### Composizione della colonia
- 3 femmine sterilizzate
- 2 maschi castrati
- 2 giovani arrivati di recente (non ancora sterilizzati)

La colonia è registrata al **Comune di Milano** come previsto
dalla legge 281/91, che tutela i gatti che vivono in libertà
sul territorio italiano.

Il referente, un pensionato di nome **Gino**, porta cibo
ogni sera alle 18:00 con puntualità svizzera.

*Una piccola oasi felina nell''asfalto meneghino.*',
        45.4525,
        9.1802,
        'Piazza XXIV Maggio, 20143 Milano MI',
        'elena_conti',
        '2025-03-13 13:24:00',
        '2025-03-13 13:24:00'
    ),
    (
        '/uploads/sightings/2026-02-27-sighting-ab66c478.jpg',
        'Gatto alla Mole Antonelliana di Torino',
        '## Sentinella del cinema italiano

Ai piedi della **Mole Antonelliana** — sede del Museo Nazionale
del Cinema — vive un gatto nero che i dipendenti del museo
chiamano affettuosamente **"Chaplin"**.

### Chaplin in numeri
- Età stimata: **6-7 anni**
- Abitudini: si siede sui gradini d''ingresso ogni mattina
- Peculiarità: ama essere fotografato (si posa letteralmente)
- Sterilizzato: sì (orecchio sinistro tagliato — metodo TNR)

I visitatori del museo lo hanno reso una piccola célébrité locale.
Su Instagram esistono almeno tre profili dedicati a lui.

> *Il gatto più fotografato di Torino, in una città che ospita
> il museo del cinema. Una coincidenza? Non credo.*',
        45.0696,
        7.6927,
        'Via Montebello 20, 10124 Torino TO',
        'andrea_ricci',
        '2025-04-14 14:31:00',
        '2025-04-14 14:31:00'
    ),
    (
        '/uploads/sightings/2026-02-27-sighting-fce47998.jpg',
        'Gatti a Palermo – mercato di Ballarò',
        '## Il mercato più felino di Sicilia

**Ballarò** è il mercato più antico e vitale di Palermo,
e i suoi gatti sono parte integrante dell''ecosistema.
Rumoroso, colorato, profumato di spezie e pesce — per un gatto
è il paradiso in terra.

### Avvistamenti del giorno
1. Gatto soriano sul bancone del pesce spada (cacciato con affetto)
2. Gatta arancione addormentata in un cesto di finocchi
3. Tre cuccioli che giocavano sotto le cassette della frutta
4. Vecchio gatto nero che mendicava con dignità davanti alla norcineria

I venditori li tollerano con quella saggezza mediterranea
che distingue la vera accoglienza dalla semplice cortesia.

*Portare sempre qualcosa da offrire — il mercato lo insegna.*',
        38.1126,
        13.3546,
        'Piazza Ballarò, 90134 Palermo PA',
        'mario_rossi',
        '2025-05-15 15:38:00',
        '2025-05-15 15:38:00'
    ),
    (
        '/uploads/sightings/2026-03-11-sighting-4db917b1.jpg',
        'Gatto tricolore a Mondello',
        '## Una calicò in riva al mare

Alla spiaggia di **Mondello** ho incontrato una splendida
gatta **calicò** (tricolore: bianco, nero, arancione) seduta
su una delle cabine chiuse in attesa della stagione balneare.

### La genetica del pelo calicò
Il mantello tricolore è quasi esclusivamente **femminile**:
- Il gene del colore è legato al cromosoma X
- Servono **due cromosomi X** per esprimere sia il nero che l''arancione
- I maschi calicò esistono ma sono rarissimi e quasi sempre sterili

La gatta era in buone condizioni ma molto diffidente.
Probabilmente fa parte di una colonia della zona balneare.

Lasciatele spazio: stava chiaramente godensi il sole.',
        38.2183,
        13.3198,
        'Viale Regina Elena, 90151 Palermo PA',
        'giulia_bianchi',
        '2025-06-16 16:45:00',
        '2025-06-16 16:45:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5cef0e58.jpg',
        'Soriano alle pendici dell''Etna',
        '## Gatto con la lava alle spalle

In un vicolo di **Catania** costruito interamente in pietra lavica
nera, questo soriano grigio risultava quasi **invisibile** —
mimetizzato perfettamente con l''ambiente circostante.

### Pietra lavica e gatti: una simbiosi
La pietra lavica dell''Etna si scalda al sole e rimane calda
a lungo. I gatti di Catania hanno imparato da millenni a
utilizzare le pietre come **termoregolatori naturali**.

Il gatto era socievole e in buone condizioni. Si è lasciato
accarezzare senza problemi.

Nessuna tacca sull''orecchio — probabilmente **non sterilizzato**.
Ho segnalato alla colonia referente della zona.',
        37.69,
        15.071,
        'Via Etnea, 95125 Catania CT',
        'luca_ferrari',
        '2025-07-17 09:52:00',
        '2025-07-17 09:52:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5d9g0qd8.jpg',
        'Gatti nei Sassi di Matera',
        '## I gatti più antichi d''Europa

Nei **Sassi di Matera** i gatti non sono solo randagi: sono
**conviventi storici** di quelle abitazioni rupestri dove
uomini e animali hanno vissuto fianco a fianco per millenni.

### Habitat unico
Le case-grotta offrono ai gatti:
- Temperature costanti (fresche d''estate, tiepide d''inverno)
- Accesso a livelli multipli tramite scale esterne in pietra
- Rifugio sicuro dalla pioggia
- Turisti generosi tutto l''anno

Ho contato **diciassette gatti** in un''unica mattinata di
esplorazione del Sasso Caveoso. Tutti in condizioni discrete,
segno di cure costanti.

> *A Matera anche i gatti sembrano avere nove millenni di storia.*',
        40.6657,
        16.6085,
        'Sasso Caveoso, 75100 Matera MT',
        'sofia_esposito',
        '2025-08-18 10:59:00',
        '2025-08-18 10:59:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5daf0q58.jpg',
        'Gatto sulle mura di Alberobello',
        '## Un gatto tra i trulli

Ad **Alberobello** i trulli e i gatti sembrano fatti l''uno
per l''altro: entrambi bassi, rotondi e diffidenti verso
i forestieri ma caldi con chi li rispetta.

### Il gatto del trullo n.47
Un maschio nero con una striscia bianca sul mento —
che gli dà l''aspetto di portare un papillon —
presidia l''ingresso del trullo n.47 con aria da buttafuori.

I proprietari lo chiamano **"Mastro"** e lo considerano
parte della famiglia.

Accetta cibo dalle mani ma non si lascia prendere in braccio.
*Una coerenza ammirevole.*

Ore di avvistamento: 15:30, luce pomeridiana.',
        40.7847,
        17.2394,
        'Rione Monti, 70011 Alberobello BA',
        'marco_romano',
        '2025-09-19 11:06:00',
        '2025-09-19 11:06:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5deg0q58.jpg',
        'Randagio a Polignano a Mare',
        '## Il gatto delle falesie

A **Polignano a Mare** ho incontrato un gatto grigio-blu
che vive letteralmente sull''orlo della falesia, a pochi metri
dall''Adriatico. Sembra non temere minimamente le vertigini.

### Adattamento felino alle coste
I gatti costieri sviluppano spesso una **tolleranza al vento**
e al rumore del mare superiore rispetto ai gatti di città.
Alcuni ricercatori hanno documentato gatti marini che
pescano direttamente dagli scogli!

Questo esemplare era in ottime condizioni fisiche —
probabilmente nutrito dai ristoranti della zona.

> Avvistato alle 6:00 di mattina mentre guardava il mare.
> Momento di inaspettata bellezza.

Nessuna tacca sull''orecchio.',
        40.9964,
        17.2181,
        'Via Conversano, 70044 Polignano a Mare BA',
        'elena_conti',
        '2025-10-20 12:13:00',
        '2025-10-20 12:13:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5def0d58.jpg',
        'Colonia felina alle Cinque Terre – Vernazza',
        '## I gatti del villaggio dei colori

**Vernazza** ha una piccola ma ben curata colonia felina
che vive tra i vicoli colorati del borgo marinaro.

### La colonia di Vernazza
- Numero stimato: **8-10 gatti**
- Gestita da: Associazione Amici dei Gatti delle Cinque Terre
- Stato sanitario: **buono** (tutti sterilizzati)
- Punti di alimentazione: 2 (mattina e sera)

Il più fotogenico è senza dubbio **"Azzurro"**, un maschio
dal mantello blu-grigio che si siede sempre sulle barche
ormeggiate nel porticciolo, creando contrasti cromatici
perfetti con il mare turquoise.

*Questi gatti hanno capito che vivere in un posto bello
porta croccantini in automatico.*',
        44.1353,
        9.6836,
        'Piazza Marconi, 19018 Vernazza SP',
        'andrea_ricci',
        '2025-01-21 13:20:00',
        '2025-01-21 13:20:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5def0e55.jpg',
        'Gatto al Castello di Bari',
        '## Il guardiano normanno

Ai piedi del **Castello Normanno-Svevo** di Bari vive una
piccola colonia di gatti che pare convinta di custodire
ancora la fortezza medievale.

### Storia del castello e dei suoi gatti
Il castello fu costruito dai Normanni nell''XI secolo,
poi ampliato da Federico II. I gatti probabilmente
lo abitano da quasi altrettanto tempo.

**Avvistati oggi:**
- 1 maschio soriano, molto territoriale
- 1 femmina tigrata con cucciolo al seguito
- 2 gatti anziani che dormivano sul fossato asciutto

I turisti li fotografano quasi quanto le mura medievali.

Segnalazione inviata alla **Lega del Cane e del Gatto di Bari**.',
        41.1265,
        16.8678,
        'Piazza Federico II di Svevia, 70122 Bari BA',
        'mario_rossi',
        '2025-02-22 14:27:00',
        '2025-02-22 14:27:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5def0e58.jpg',
        'Gatta nelle mura di Lecce',
        '## La barocca e il gatto

Il barocco leccese è fatto di pietra chiara, decorazioni floreali
e... gatti. Una **gatta rossa** di taglia piccola vive tra le
colonne di **Piazza Sant''Oronzo** con assoluta disinvoltura.

### Il carattere leccese
Come l''architettura della città, anche questa gatta è
**ornamentale ed essenziale insieme**: bella da guardare,
non è disposta a farsi maneggiare.

Accetta cibo solo se posato a terra.
Non si avvicina oltre i 50 cm.
Mantiene il contatto visivo con autorevolezza.

> *Una gatta barocca in una città barocca. Nessuna coincidenza.*

Condizioni fisiche: buone.
Orecchio destro tagliato (TNR).',
        40.3528,
        18.1733,
        'Piazza Sant''Oronzo, 73100 Lecce LE',
        'giulia_bianchi',
        '2025-03-23 15:34:00',
        '2025-03-23 15:34:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5def0p58.jpg',
        'Avvistamento a Tropea – gatto sulla scogliera',
        '## Equilibrista sul precipizio

A **Tropea** il promontorio su cui sorge il Santuario di
Santa Maria dell''Isola scende a picco sul mare.
Su quella scogliera vive un gatto tigrato che sembra
non soffrire minimamente di vertigini.

### Anatomia di un gatto costiero
I gatti che vivono sulle coste rocciose sviluppano:
- Zampe posteriori **più muscolose** per i salti su roccia
- Cuscinetti plantari **più resistenti** per le superfici irregolari
- Senso dell''equilibrio **ancora più sviluppato** del normale

Il mare di Tropea era turchese. Il gatto era tigrato.
Insieme formavano la combinazione cromatica perfetta.

*Fotografato alle 17:00 con luce dorata.*',
        38.6761,
        15.8961,
        'Via Marina dell''Isola, 89861 Tropea VV',
        'luca_ferrari',
        '2025-04-24 16:41:00',
        '2025-04-24 16:41:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5def0q58.jpg',
        'Gatto in Piazza del Campo a Siena',
        '## L''unico che non corre il Palio

Mentre tutti parlano del Palio, **"Duccio"** — un gatto
bianco e nero che vive tra i vicoli attorno a Piazza del Campo —
se ne infischia allegramente di cavalli e contradde.

### Duccio e le 17 contrade
Quando ho chiesto al barista di quale contrada fosse Duccio,
la risposta è stata immediata: *"Della Contrada dell''Indipendenza"*.

Il gatto sembra condividere questo punto di vista:
non si avvicina a nessuno se non lo vuole lui,
mangia dove gli pare, dorme dove gli piace.

Condizioni: **eccellenti**. Peso forma, pelo lucido, occhi sani.

Probabilmente mantenuto da qualche esercizio commerciale della piazza.

> *Il gatto più libero di Siena.*',
        43.3189,
        11.3314,
        'Piazza del Campo, 53100 Siena SI',
        'sofia_esposito',
        '2025-05-25 09:48:00',
        '2025-05-25 09:48:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5de80qd8.jpg',
        'Micio al Colosseo – versante nord',
        '## Ancora lui: il Colosseo ha i suoi re

Sul versante nord del **Colosseo**, verso Via Celio Vibenna,
esiste una seconda piccola colonia felina meno nota di quella
al Foro Romano, ma altrettanto affascinante.

### Il gatto più anziano
Un maschio tigrato di probabili **12-13 anni** domina
ancora il territorio con la calma assoluta di chi ha visto
passare più turisti di quante pietre ci siano nell''anfiteatro.

Il personale dell''area archeologica lo conosce bene
e gli lascia acqua fresca ogni mattina.

**Statistiche personali stimate:**
- Turisti fotografati: milioni
- Selfie rifiutati: tutti
- Sonnellini quotidiani: 6-8

*Roma non fu costruita in un giorno, ma questo gatto
ha tempo da vendere.*',
        41.8906,
        12.4928,
        'Via Celio Vibenna, 00184 Roma RM',
        'marco_romano',
        '2025-06-26 10:55:00',
        '2025-06-26 10:55:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5deg0qd8.jpg',
        'Gatto alle Cinque Terre – Manarola',
        '## Il guardiano delle vigne

A **Manarola**, il paese più pittoresco delle Cinque Terre,
ho trovato un gatto soriano che vive tra i muretti a secco
dei vigneti che scendono verso il mare.

### Gatti e vigneti: un''associazione antica
Da secoli i gatti vengono tenuti nelle vigne per
**controllare i roditori** che mangerebbero le radici
delle viti. Questo soriano probabilmente svolge ancora
questa funzione ancestrale.

Era diffidente ma non aggressivo. Si è fermato a scrutarmi
da un muretto a circa tre metri, prima di scomparire
tra i filari.

*Silenzio, vento, gatto. Manarola in una sintesi.*',
        44.1067,
        9.7251,
        'Via Rollandi, 19010 Manarola SP',
        'elena_conti',
        '2025-07-27 11:02:00',
        '2025-07-27 11:02:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5dh90ql8.jpg',
        'Cuccioli trovati a Bologna – zona universitaria',
        '## Urgente: quattro cuccioli abbandonati

⚠️ **URGENTE – CERCASI STALLI TEMPORANEI** ⚠️

In **Via Zamboni**, nel cuore della zona universitaria di Bologna,
ho trovato quattro cuccioli di circa 4 settimane in uno scatolone
abbandonato vicino a un bidone dell''immondizia.

### Condizioni dei cuccioli
| # | Sesso | Colore | Stato |
|----|------|--------|-------|
| 1 | F | Nera | Buone |
| 2 | M | Tigrato | Lievemente disidratato |
| 3 | F | Bianca | Buone |
| 4 | M | Nero/bianco | Buone |

**Ho già contattato:**
- ENPA Bologna (051 523 566) ✓
- Ambulatorio veterinario universitario ✓

Cerco urgentemente stalli temporanei per almeno due di loro.
Commento qui sotto o scrivetemi in privato.',
        44.4977,
        11.3549,
        'Via Zamboni, 40126 Bologna BO',
        'andrea_ricci',
        '2025-08-28 12:09:00',
        '2025-08-28 12:09:00'
    ),
    (
        '/uploads/sightings/2026-02-24-sighting-5def0d58.jpg',
        'Gatto a Bergamo Alta',
        '## Medievale e felino

Nella **Città Alta** di Bergamo, racchiusa nelle mura
veneziane (UNESCO 2017), vive un gatto marrone tabby
che i turisti incontrano invariabilmente in Via Colleoni.

### La routine del gatto di Via Colleoni
```
Mattina    → scalini del Duomo (sole del mattino)
Mezzogiorno→ ombra del portico del Palazzo della Ragione
Pomeriggio → aiuola di Piazza Vecchia (nap)
Sera       → mistero (probabilmente cibo dai ristoranti)
```

I commercianti della via lo rispettano come una sorta
di mascotte ufficiale del centro storico.

Orecchio sinistro tagliato — **sterilizzato**.
Condizioni: **ottime**.

> *Una città medievale, un gatto medievale nell''atteggiamento.
> Si addice perfettamente.*',
        45.7036,
        9.668,
        'Via Colleoni, 24129 Bergamo BG',
        'mario_rossi',
        '2025-09-01 13:16:00',
        '2025-09-01 13:16:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5dhg0dl8.jpg',
        'Randagi a Perugia – centro storico',
        '## Il centro storico appartiene ai gatti

Il **Corso Vannucci** di Perugia, la via principale del centro
storico umbro, ha i suoi felini di riferimento.
Ho fotografato tre esemplari diversi nel giro di un''ora.

### I tre gatti del Corso
1. **Il soriano delle scale** – dorme sui gradini del Palazzo dei Priori
2. **La nera del bar** – frequenta un bar storico, viene sfamata dal personale
3. **Il biondo misterioso** – appare e scompare, mai riuscito a avvicinarmi

L''Università di Perugia ha un gruppo studentesco
**"Gatti del Centro Storico"** che monitora e gestisce
diverse colonie nel centro città.

Un''iniziativa encomiabile che altri atenei dovrebbero copiare.',
        43.1122,
        12.3882,
        'Corso Vannucci, 06121 Perugia PG',
        'giulia_bianchi',
        '2025-10-02 14:23:00',
        '2025-10-02 14:23:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5dhg0q58.jpg',
        'Gatta siamese a Verona',
        '## Una nobildonna in Via Mazzini

In **Via Mazzini**, la via dello shopping di Verona,
tra le boutique di lusso e i turisti di Shakespeare,
vive una **siamese** semi-selvatica che sembra nata
nel posto sbagliato — o forse in quello giusto.

### Il paradosso della siamese randagia
La Siamese è una delle razze più antiche e ricercate.
Come finisce una siamese per strada?

Due ipotesi:
- **Abbandono** da parte di proprietari irresponsabili
- **Incrocio** con siamese sfuggito di casa (più probabile)

In ogni caso, questa gatta ha gli occhi azzurro ghiaccio
e il mantello seal point impeccabile.

Sembra in buona salute ma è **molto diffidente**.
Nessuna tacca sull''orecchio.',
        45.4426,
        10.9988,
        'Via Mazzini, 37121 Verona VR',
        'luca_ferrari',
        '2025-01-03 15:30:00',
        '2025-01-03 15:30:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5dhg0q98.jpg',
        'Gatti alla Villa Borghese di Roma',
        '## Il parco dei gatti romani

**Villa Borghese** è forse il posto con la maggiore
concentrazione di gatti curati di Roma.
Le colonie del parco godono di cure costanti da parte
di numerosi volontari.

### La colonia dello stagno
Nei pressi del laghetto si trovano regolarmente:
- 6-8 gatti adulti sterilizzati
- 2 punti di alimentazione fissi
- Un volontario referente ogni mattina alle 7:30

Il più famoso è **"Bernini"**, un maschio a pelo lungo
di color crema che posa immobile per le foto
come se lo pagassero.

La gestione delle colonie a Villa Borghese è considerata
un **modello virtuoso** per la città di Roma.

*Roma ha più gatti che residenti, si dice. A Villa Borghese ci si crede.*',
        41.9138,
        12.4923,
        'Viale delle Magnolie, 00197 Roma RM',
        'sofia_esposito',
        '2025-02-04 16:37:00',
        '2025-02-04 16:37:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5dhg0qd8.jpg',
        'Gatto a Portofino',
        '## Il gatto più ricco d''Italia?

A **Portofino** — la baia più esclusiva d''Italia —
vive un gatto soriano che dorme sugli yacht ormeggiati
con la nonchalance di chi ha i propri problemi.

### Confronto di vita
| Turista | Gatto di Portofino |
|---------|-------------------|
| Paga 30€ per un caffè | Mangia gratis |
| Dorme in hotel da 500€/notte | Dorme sullo yacht |
| Parte dopo il weekend | Non parte mai |
| Si fa foto con il gatto | Il gatto si fa foto con lui |

Condizioni fisiche: **straordinarie**. Pelo lucido, forma invidiabile.
Probabilmente i proprietari degli yacht gareggiano per dargli cibo.

> *Il gatto più benestante d''Italia, senza aver guadagnato un euro.*',
        44.3039,
        9.2097,
        'Piazzetta di Portofino, 16034 Portofino GE',
        'marco_romano',
        '2025-03-05 09:44:00',
        '2025-03-05 09:44:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5dhg0ql8.jpg',
        'Colonia felina al Lago di Como',
        '## I gatti del lungolago

Lungo il **Lungolago di Como** esiste una colonia di circa
dieci gatti che vive tra i giardini e le panchine del
waterfront, con una vista sul lago che farebbe invidia
a molti esseri umani.

### Caratteristiche della colonia
- Tutti sterilizzati (progetto LAV Como)
- Alimentazione gestita da 3 referenti a rotazione
- Presenza veterinaria mensile
- Microchip su tutti gli adulti

Il gatto più famoso è **"George Clooney"** (nome dato dai
residenti per ovvie ragioni geografiche): un maschio grigio
di grande eleganza che frequenta regolarmente i tavoli
del ristorante più vicino.

*Il lungolago di Como: bello per gli umani, paradiso per i gatti.*',
        45.9945,
        9.2587,
        'Lungolago, 22100 Como CO',
        'elena_conti',
        '2025-04-06 10:51:00',
        '2025-04-06 10:51:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5dhn0al8.jpg',
        'Gatto tricolore a Trieste',
        '## Una calicò sulla piazza più grande d''Europa

**Piazza Unità d''Italia** a Trieste è considerata la piazza
sul mare più grande d''Europa. Al centro di tanta grandiosità,
una piccola gatta **calicò** sembrava del tutto indifferente
alla propria marginalità geografica.

### Trieste e i suoi gatti
Trieste ha una tradizione felina legata alla sua storia
di città di confine:
- I gatti arrivarono con le navi dei mercanti
- Alcune colonie discendono da gatti portati dai commercianti
  levantini nei secoli scorsi
- La colonia del **Castello di Miramare** è famosa tra gli appassionati

La gatta era in buone condizioni, con l''orecchio destro tagliato.

*Sul mare più orientale d''Italia, una calicò guarda verso est.*',
        45.6495,
        13.7768,
        'Piazza Unità d''Italia, 34121 Trieste TS',
        'andrea_ricci',
        '2025-05-07 11:58:00',
        '2025-05-07 11:58:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5dhn0qf8.jpg',
        'Randagio al Gran Sasso – rifugio',
        '## Il gatto più alto d''Appennino

Al **Rifugio Duca degli Abruzzi** a Campo Imperatore (2.130 m slm)
vive un gatto soriano che detiene probabilmente il record
di abitante felino più in quota dell''Appennino centrale.

### Adattamento all''alta quota
I gatti in quota sviluppano:
- Pelo **più fitto e denso** per le temperature rigide
- Abitudini di caccia concentrate nelle ore centrali del giorno
- Dipendenza maggiore dall''apporto umano di cibo in inverno

**"Picco"** (così lo chiamano i gestori del rifugio) è diventato
la mascotte ufficiale della struttura.

D''inverno resta al caldo nella cucina del rifugio.
D''estate esplora liberamente l''altopiano.

> *Un gatto che vive più in alto di molte città italiane.*',
        42.4514,
        13.567,
        'Rifugio Duca degli Abruzzi, 67100 L''Aquila AQ',
        'mario_rossi',
        '2025-06-08 12:05:00',
        '2025-06-08 12:05:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5dhn0ql6.jpg',
        'Gatto nei vicoli di Amalfi',
        '## Scogliere e mici

Ad **Amalfi** i vicoli sono così stretti che due persone
passano a malapena. I gatti del posto hanno risolto il
problema architettonico passando direttamente sopra le teste:
saltano da tetto a tetto con precisione acrobatica.

### Il sistema di mobilità felina di Amalfi
```
Piano strada  → troppi turisti
Primo livello → balconi e ringhiere
Secondo livello→ tetti e terrazze (preferito)
```

Il gatto di questo avvistamento era un soriano classico
appollaiato su un balcone al terzo piano.
Ci siamo guardati negli occhi per un lungo momento.

Lui ha sbadigliato.
Io mi sono sentito giudicato.

*La Costiera Amalfitana: bella per i turisti, ottimale per i gatti.*',
        40.6343,
        14.6026,
        'Via Pietro Capuano, 84011 Amalfi SA',
        'giulia_bianchi',
        '2025-07-09 13:12:00',
        '2025-07-09 13:12:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5dhn0ql8.jpg',
        'Gatto al Duomo di Milano',
        '## Tra le guglie e i mici

In **Piazza del Duomo** — la piazza più frequentata d''Italia —
vive un gatto tigrato che ha imparato a sfruttare il flusso
turistico con efficienza imprenditoriale.

### La strategia di sopravvivenza
1. Sedersi in posizione fotogenica
2. Fissare i turisti con occhi grandi
3. Avvicinarsi lentamente ai bambini
4. Ricevere cibo, carezze, selfie
5. Ripetere

Stimato incasso quotidiano in termini alimentari:
- 3-4 porzioni di cibo umido (offerte dai turisti)
- Quantità imprecisata di croccantini
- Almeno 2 fettine di bresaola (turisti tedeschi)

*Milano è la capitale della moda. Anche questo gatto
ha capito come funziona l''immagine.*',
        45.4642,
        9.1919,
        'Piazza del Duomo, 20122 Milano MI',
        'luca_ferrari',
        '2025-08-10 14:19:00',
        '2025-08-10 14:19:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5dhn74l8.jpg',
        'Gatto sul lungotevere a Roma',
        '## Un contemplativo sul Tevere

Al tramonto, seduto sul parapetto del **Lungotevere**,
un gatto grigio guarda il Tevere scorrere con la pazienza
di chi non ha nessun posto dove andare e va bene così.

### Filosofia del gatto sul fiume
Il gatto sul Lungotevere non ha fretta.
Non ha appuntamenti.
Non ha notifiche.

Esiste in uno stato che gli esseri umani inseguono
disperatamente tramite app di meditazione e retreat
di mindfulness.

Lui ce l''ha naturalmente.

Condizioni fisiche: **ottime**.
Comportamento: **distaccato ma non aggressivo**.
Contatto visivo: breve, eloquente.

> *Roma scorre. Il gatto guarda. Il gatto capisce.*',
        41.8957,
        12.4794,
        'Lungotevere dei Mellini, 00193 Roma RM',
        'sofia_esposito',
        '2025-09-11 15:26:00',
        '2025-09-11 15:26:00'
    ),
    (
        '/uploads/sightings/2026-03-12-sighting-5dhn7ql8.jpg',
        'Colonia felina a Cagliari – quartiere Castello',
        '## I gatti del bastione sardo

Il **Bastione Saint Remy** domina Cagliari dall''alto
con una vista sul golfo che toglie il respiro.
Da questa postazione privilegiata, una colonia di circa
dodici gatti sorveglia la città con autorevolezza regale.

### La colonia del Bastione
- **Gestita da**: Associazione Gatti di Cagliari
- **Numero gatti**: 12 (censimento dicembre 2024)
- **Sterilizzati**: 10 su 12
- **Punti acqua**: 3
- **Punti cibo**: 2 (mattina e sera)

Il più anziano, un maschio tigrato di **14 anni** stimati,
siede invariabilmente sul muretto centrale come se fosse
il suo trono personale.

*I gatti del Bastione di Cagliari: guardiani di pietra
in una città di pietra.*',
        39.2198,
        9.1111,
        'Bastione Saint Remy, 09124 Cagliari CA',
        'marco_romano',
        '2025-10-12 16:33:00',
        '2025-10-12 16:33:00'
    )
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. Comments
-- Each sighting gets a variable number of comments (15–30).
-- Comments are distributed across all users for variety.
-- Sighting IDs are assumed to be auto-incremented from 1.
-- -----------------------------------------------------------------------------
INSERT INTO comments (content, fk_username, fk_sighting_id, created_at, updated_at)
VALUES
    ('Che bel micio! Lo conosco, passa spesso da questa zona.', 'mario_rossi', 1, '2025-01-02 10:00:00', '2025-01-02 10:00:00'),
    ('Ho lasciato delle crocchette vicino alla fontana ieri sera, speriamo le abbia trovate.', 'giulia_bianchi', 1, '2025-01-03 11:11:00', '2025-01-03 11:11:00'),
    ('Bellissimo avvistamento! Anche io l''ho visto qualche giorno fa, sembra in buona salute.', 'luca_ferrari', 1, '2025-01-04 12:22:00', '2025-01-04 12:22:00'),
    ('Grazie per la segnalazione! I gatti di questa zona sono monitorati dalla nostra associazione.', 'sofia_esposito', 1, '2025-01-05 13:33:00', '2025-01-05 13:33:00'),
    ('È importante non spostare i gatti randagi dalla loro colonia — si disorientano molto.', 'marco_romano', 1, '2025-01-06 14:44:00', '2025-01-06 14:44:00'),
    ('Che occhi meravigliosi! Ha un carattere tutto suo quel micio.', 'elena_conti', 1, '2025-01-02 15:55:00', '2025-01-02 15:55:00'),
    ('Lo chiamo ''Il Sindaco'' perché sembra il padrone del quartiere.', 'andrea_ricci', 1, '2025-01-03 16:06:00', '2025-01-03 16:06:00'),
    ('Attenti a non dargli cibo troppo salato o condito — fa male ai reni dei gatti.', 'mario_rossi', 1, '2025-01-04 17:17:00', '2025-01-04 17:17:00'),
    ('Ho segnalato la presenza al referente di colonia della zona, grazie del post!', 'giulia_bianchi', 1, '2025-01-05 18:28:00', '2025-01-05 18:28:00'),
    ('Un consiglio: se volete avvicinarvi, abbassatevi lentamente e aspettate che venga lui da voi.', 'luca_ferrari', 1, '2025-01-06 19:39:00', '2025-01-06 19:39:00'),
    ('Bello! È da mesi che non lo vedevo, pensavo si fosse spostato.', 'sofia_esposito', 1, '2025-01-02 20:50:00', '2025-01-02 20:50:00'),
    ('Fantastico avvistamento. Questi gatti fanno parte del patrimonio culturale della città.', 'marco_romano', 1, '2025-01-03 21:01:00', '2025-01-03 21:01:00'),
    ('Ha la tacca sull''orecchio? Sarebbe importante saperlo per capire se è già sterilizzato.', 'elena_conti', 1, '2025-01-04 10:12:00', '2025-01-04 10:12:00'),
    ('Grazie per condividere! Più segnalazioni abbiamo, meglio possiamo monitorare le colonie.', 'andrea_ricci', 1, '2025-01-05 11:23:00', '2025-01-05 11:23:00'),
    ('Che bella foto! Si vede che era a suo agio con te.', 'mario_rossi', 1, '2025-01-06 12:34:00', '2025-01-06 12:34:00'),
    ('I gatti come lui ci insegnano tutti i giorni il significato della libertà.', 'giulia_bianchi', 1, '2025-01-02 13:45:00', '2025-01-02 13:45:00'),
    ('Ho passato mezz''ora a guardarlo camminare sul marciapiede. Ipnotico.', 'luca_ferrari', 1, '2025-01-03 14:56:00', '2025-01-03 14:56:00'),
    ('È fondamentale non spostare il cibo dalla posizione abitudinaria — i gatti sono molto dipendenti dalla routine.', 'sofia_esposito', 1, '2025-01-04 15:07:00', '2025-01-04 15:07:00'),
    ('Avvistamento confermato! Anche il mio vicino me ne aveva parlato.', 'marco_romano', 1, '2025-01-05 16:18:00', '2025-01-05 16:18:00'),
    ('Queste segnalazioni sono preziosissime per la mappa felina della città.', 'elena_conti', 1, '2025-01-06 17:29:00', '2025-01-06 17:29:00'),
    ('Che personaggio! Si vede subito che ha carattere da vendere.', 'andrea_ricci', 1, '2025-01-02 18:40:00', '2025-01-02 18:40:00'),
    ('Grazie per la descrizione dettagliata delle condizioni — utilissima per i volontari.', 'mario_rossi', 1, '2025-01-03 19:51:00', '2025-01-03 19:51:00'),
    ('Che bel micio! Lo conosco, passa spesso da questa zona.', 'giulia_bianchi', 1, '2025-01-04 20:02:00', '2025-01-04 20:02:00'),
    ('Ho lasciato delle crocchette vicino alla fontana ieri sera, speriamo le abbia trovate.', 'luca_ferrari', 1, '2025-01-05 21:13:00', '2025-01-05 21:13:00'),
    ('Bellissimo avvistamento! Anche io l''ho visto qualche giorno fa, sembra in buona salute.', 'sofia_esposito', 1, '2025-01-06 10:24:00', '2025-01-06 10:24:00'),
    ('Grazie per la segnalazione! I gatti di questa zona sono monitorati dalla nostra associazione.', 'marco_romano', 1, '2025-01-02 11:35:00', '2025-01-02 11:35:00'),
    ('È importante non spostare i gatti randagi dalla loro colonia — si disorientano molto.', 'elena_conti', 1, '2025-01-03 12:46:00', '2025-01-03 12:46:00'),
    ('Che occhi meravigliosi! Ha un carattere tutto suo quel micio.', 'andrea_ricci', 1, '2025-01-04 13:57:00', '2025-01-04 13:57:00'),
    ('Mamma mia quanto è bello! Quel pelo è pazzesco.', 'giulia_bianchi', 2, '2025-02-03 10:00:00', '2025-02-03 10:00:00'),
    ('L''ho avvistato anch''io stamattina! Stava dormendo al sole tranquillissimo.', 'luca_ferrari', 2, '2025-02-04 11:11:00', '2025-02-04 11:11:00'),
    ('Se qualcuno è di zona e può portare cibo regolarmente, sarebbe utilissimo.', 'sofia_esposito', 2, '2025-02-05 12:22:00', '2025-02-05 12:22:00'),
    ('Attenzione: i gatti randagi non vanno mai raccolti senza prima consultare un''associazione.', 'marco_romano', 2, '2025-02-06 13:33:00', '2025-02-06 13:33:00'),
    ('Ho l''impressione che sia lo stesso gatto che avevo segnalato tre mesi fa più a nord.', 'elena_conti', 2, '2025-02-07 14:44:00', '2025-02-07 14:44:00'),
    ('Che carattere! Si vede da come posa che è abituato all''attenzione.', 'andrea_ricci', 2, '2025-02-03 15:55:00', '2025-02-03 15:55:00'),
    ('Meraviglioso. Questi randagi ci ricordano quanto siano resistenti e adattabili i gatti.', 'mario_rossi', 2, '2025-02-04 16:06:00', '2025-02-04 16:06:00'),
    ('Il metodo TNR (Trap-Neuter-Return) è l''unico modo etico per gestire le colonie.', 'giulia_bianchi', 2, '2025-02-05 17:17:00', '2025-02-05 17:17:00'),
    ('Ho contattato il municipio per segnalare il punto — servirebbero più rifugi invernali.', 'luca_ferrari', 2, '2025-02-06 18:28:00', '2025-02-06 18:28:00'),
    ('È bellissimo sapere che c''è chi monitora questi animali. Grazie a tutti i volontari!', 'sofia_esposito', 2, '2025-02-07 19:39:00', '2025-02-07 19:39:00'),
    ('Una nota: l''acqua è importante tanto quanto il cibo, specialmente d''estate.', 'marco_romano', 2, '2025-02-03 20:50:00', '2025-02-03 20:50:00'),
    ('Adoro questi post! Tengono viva l''attenzione su una realtà spesso ignorata.', 'elena_conti', 2, '2025-02-04 21:01:00', '2025-02-04 21:01:00'),
    ('Avevo paura che si fosse allontanato. Sapere che sta bene mi rincuora.', 'andrea_ricci', 2, '2025-02-05 10:12:00', '2025-02-05 10:12:00'),
    ('La sua diffidenza è normale — ci vogliono settimane per guadagnare la fiducia di un randagio.', 'mario_rossi', 2, '2025-02-06 11:23:00', '2025-02-06 11:23:00'),
    ('Chi abita in zona potrebbe tenerlo d''occhio? Sarebbe preziosissimo.', 'giulia_bianchi', 2, '2025-02-07 12:34:00', '2025-02-07 12:34:00'),
    ('Questi gatti meritano rispetto e cura. Grazie per la segnalazione!', 'luca_ferrari', 2, '2025-02-03 13:45:00', '2025-02-03 13:45:00'),
    ('Non dategli latte! Molti gatti adulti sono intolleranti al lattosio.', 'sofia_esposito', 2, '2025-02-04 14:56:00', '2025-02-04 14:56:00'),
    ('Il fatto che sia sterilizzato è un ottimo segnale — la colonia è gestita bene.', 'marco_romano', 2, '2025-02-05 15:07:00', '2025-02-05 15:07:00'),
    ('Condivido! Più gente sa di queste colonie, meglio è per tutti.', 'elena_conti', 2, '2025-02-06 16:18:00', '2025-02-06 16:18:00'),
    ('Ho aggiunto la posizione alla nostra mappa delle colonie feline della città.', 'andrea_ricci', 2, '2025-02-07 17:29:00', '2025-02-07 17:29:00'),
    ('Che storia bellissima. Un gatto che ha trovato il suo posto nel mondo.', 'mario_rossi', 2, '2025-02-03 18:40:00', '2025-02-03 18:40:00'),
    ('Mamma mia quanto è bello! Quel pelo è pazzesco.', 'giulia_bianchi', 2, '2025-02-04 19:51:00', '2025-02-04 19:51:00'),
    ('L''ho visto anche io settimana scorsa! Sembrava in ottima forma.', 'luca_ferrari', 3, '2025-03-04 10:00:00', '2025-03-04 10:00:00'),
    ('Zona monitorata dalla nostra associazione — grazie per la segnalazione aggiuntiva.', 'sofia_esposito', 3, '2025-03-05 11:11:00', '2025-03-05 11:11:00'),
    ('Che espressione seria! Sembra stia valutando se fidarsi o meno.', 'marco_romano', 3, '2025-03-06 12:22:00', '2025-03-06 12:22:00'),
    ('Portateci cibo secco di qualità — meglio per la salute rispetto agli avanzi.', 'elena_conti', 3, '2025-03-07 13:33:00', '2025-03-07 13:33:00'),
    ('Bellissimo esemplare. Il mantello è curatissimo per essere un randagio.', 'andrea_ricci', 3, '2025-03-08 14:44:00', '2025-03-08 14:44:00'),
    ('Non toccate i cuccioli se la mamma è presente — potrebbe spaventarsi e abbandonarli.', 'mario_rossi', 3, '2025-03-04 15:55:00', '2025-03-04 15:55:00'),
    ('Segnalazione inoltrata alla ASL Veterinaria del distretto. Grazie!', 'giulia_bianchi', 3, '2025-03-05 16:06:00', '2025-03-05 16:06:00'),
    ('Queste colonie sono protette dalla legge 281/91 — è illegale rimuoverle o maltrattarle.', 'luca_ferrari', 3, '2025-03-06 17:17:00', '2025-03-06 17:17:00'),
    ('Che begli occhi! I gatti tigrati hanno sempre qualcosa di speciale.', 'sofia_esposito', 3, '2025-03-07 18:28:00', '2025-03-07 18:28:00'),
    ('Ho lasciato una ciotola d''acqua fresca sotto il portico vicino — spero la trovi.', 'marco_romano', 3, '2025-03-08 19:39:00', '2025-03-08 19:39:00'),
    ('Post preziosissimo. Aggiornate se tornate in zona!', 'elena_conti', 3, '2025-03-04 20:50:00', '2025-03-04 20:50:00'),
    ('La sua routine sembra ben consolidata — segno che vive lì da tempo.', 'andrea_ricci', 3, '2025-03-05 21:01:00', '2025-03-05 21:01:00'),
    ('Grazie per aver specificato le condizioni fisiche — è fondamentale per i volontari.', 'mario_rossi', 3, '2025-03-06 10:12:00', '2025-03-06 10:12:00'),
    ('Che bel randagio! Mi fa pensare ai gatti di Roma antica, discendenti di secoli.', 'giulia_bianchi', 3, '2025-03-07 11:23:00', '2025-03-07 11:23:00'),
    ('Se volete adottarlo, il passaggio dal randagio alla casa richiede pazienza e tempo.', 'luca_ferrari', 3, '2025-03-08 12:34:00', '2025-03-08 12:34:00'),
    ('Condivido nella pagina della nostra associazione — speriamo trovi un referente fisso!', 'sofia_esposito', 3, '2025-03-04 13:45:00', '2025-03-04 13:45:00'),
    ('Questi avvistamenti mi fanno sempre venire voglia di uscire a fare volontariato.', 'marco_romano', 3, '2025-03-05 14:56:00', '2025-03-05 14:56:00'),
    ('Complimenti per la foto — cattura perfettamente il suo carattere.', 'elena_conti', 3, '2025-03-06 15:07:00', '2025-03-06 15:07:00'),
    ('Ho incontrato anche io un gatto simile nello stesso quartiere — forse è lo stesso?', 'andrea_ricci', 3, '2025-03-07 16:18:00', '2025-03-07 16:18:00'),
    ('Grazie per la segnalazione con coordinate precise — utilissime per la mappa.', 'mario_rossi', 3, '2025-03-08 17:29:00', '2025-03-08 17:29:00'),
    ('Dolcissimo! Spero che qualcuno lo segua con regolarità.', 'sofia_esposito', 4, '2025-04-05 10:00:00', '2025-04-05 10:00:00'),
    ('È utile sapere se ha la tacca sull''orecchio — indicherebbe già la sterilizzazione TNR.', 'marco_romano', 4, '2025-04-06 11:11:00', '2025-04-06 11:11:00'),
    ('Zona nota alla nostra associazione. Manterremo l''occhio aperto.', 'elena_conti', 4, '2025-04-07 12:22:00', '2025-04-07 12:22:00'),
    ('Che eleganza nei movimenti! I gatti hanno una grazia innata.', 'andrea_ricci', 4, '2025-04-08 13:33:00', '2025-04-08 13:33:00'),
    ('Non avvicinatevi troppo se è diffidente — il rispetto è la base.', 'mario_rossi', 4, '2025-04-09 14:44:00', '2025-04-09 14:44:00'),
    ('La sua condizione sembra buona — qualcuno si prende cura di lui.', 'giulia_bianchi', 4, '2025-04-05 15:55:00', '2025-04-05 15:55:00'),
    ('Aggiungo questa posizione alla app di mappatura delle colonie feline. Grazie!', 'luca_ferrari', 4, '2025-04-06 16:06:00', '2025-04-06 16:06:00'),
    ('Bellissima segnalazione! Questi post fanno la differenza per il benessere animale.', 'sofia_esposito', 4, '2025-04-07 17:17:00', '2025-04-07 17:17:00'),
    ('Attenzione alle macchine in quella zona — è una strada trafficata.', 'marco_romano', 4, '2025-04-08 18:28:00', '2025-04-08 18:28:00'),
    ('Chi vive nei paraggi potrebbe tenerlo d''occhio? Ci servirebbe un referente.', 'elena_conti', 4, '2025-04-09 19:39:00', '2025-04-09 19:39:00'),
    ('Il gatto ha capito tutto della vita: mangiare, dormire, esplorare. Noi no.', 'andrea_ricci', 4, '2025-04-05 20:50:00', '2025-04-05 20:50:00'),
    ('Condiviso nella pagina del comune — speriamo in un casetta/rifugio per l''inverno.', 'mario_rossi', 4, '2025-04-06 21:01:00', '2025-04-06 21:01:00'),
    ('Questi gatti sono la vera anima dei quartieri storici italiani.', 'giulia_bianchi', 4, '2025-04-07 10:12:00', '2025-04-07 10:12:00'),
    ('Grazie per la precisione della descrizione — ci aiuta a identificare i soggetti.', 'luca_ferrari', 4, '2025-04-08 11:23:00', '2025-04-08 11:23:00'),
    ('Lo stesso gatto è stato avvistato anche in Via X la settimana scorsa.', 'sofia_esposito', 4, '2025-04-09 12:34:00', '2025-04-09 12:34:00'),
    ('Un consiglio: il cibo umido in estate va rimosso dopo 30 minuti per evitare batteri.', 'marco_romano', 4, '2025-04-05 13:45:00', '2025-04-05 13:45:00'),
    ('Post fantastico! Continua a segnalare, queste informazioni sono oro per noi volontari.', 'elena_conti', 4, '2025-04-06 14:56:00', '2025-04-06 14:56:00'),
    ('Che personalità! Si vede subito chi comanda da quelle parti.', 'andrea_ricci', 4, '2025-04-07 15:07:00', '2025-04-07 15:07:00'),
    ('Grazie! L''avevamo perso di vista da qualche settimana, ottimo sapere che sta bene.', 'marco_romano', 5, '2025-05-06 10:00:00', '2025-05-06 10:00:00'),
    ('È quello che chiamiamo gatto ''semi-addomesticato'': né randagio né domestico, nel mezzo.', 'elena_conti', 5, '2025-05-07 11:11:00', '2025-05-07 11:11:00'),
    ('Che bello! Queste segnalazioni tengono viva l''attenzione sui gatti liberi.', 'andrea_ricci', 5, '2025-05-08 12:22:00', '2025-05-08 12:22:00'),
    ('Ho portato del cibo ieri sera — era già lì ad aspettarmi. Forse ci vede abituali!', 'mario_rossi', 5, '2025-05-09 13:33:00', '2025-05-09 13:33:00'),
    ('La diffidenza dei randagi è una forma di intelligenza, non cattiveria.', 'giulia_bianchi', 5, '2025-05-10 14:44:00', '2025-05-10 14:44:00'),
    ('Bravissimo a fotografarlo senza disturbarlo — si vede che sei esperto.', 'luca_ferrari', 5, '2025-05-06 15:55:00', '2025-05-06 15:55:00'),
    ('Zona monitorata mensilmente dalla nostra unità veterinaria mobile.', 'sofia_esposito', 5, '2025-05-07 16:06:00', '2025-05-07 16:06:00'),
    ('Che contemplazione! Sembra stia risolvendo i problemi del mondo.', 'marco_romano', 5, '2025-05-08 17:17:00', '2025-05-08 17:17:00'),
    ('Il pelo lucido indica una dieta adeguata — qualcuno se ne prende cura.', 'elena_conti', 5, '2025-05-09 18:28:00', '2025-05-09 18:28:00'),
    ('Non spostate mai i gatti da una colonia a un''altra senza supporto professionale.', 'andrea_ricci', 5, '2025-05-10 19:39:00', '2025-05-10 19:39:00'),
    ('Avvistamento confermato da altri due utenti questa settimana — zona molto attiva.', 'mario_rossi', 5, '2025-05-06 20:50:00', '2025-05-06 20:50:00'),
    ('Che tenerezza! Mi ha fatto venire voglia di abbracciarlo (ma non l''avrei fatto, tranquilli).', 'giulia_bianchi', 5, '2025-05-07 21:01:00', '2025-05-07 21:01:00'),
    ('Grazie per l''avvistamento dettagliato — aggiornate se notate cambiamenti.', 'luca_ferrari', 5, '2025-05-08 10:12:00', '2025-05-08 10:12:00'),
    ('Un randagio ben integrato nel territorio è il risultato del lavoro di molti volontari.', 'sofia_esposito', 5, '2025-05-09 11:23:00', '2025-05-09 11:23:00'),
    ('Zona con alta densità felina — stiamo lavorando per aumentare i punti di alimentazione.', 'marco_romano', 5, '2025-05-10 12:34:00', '2025-05-10 12:34:00'),
    ('Il gatto ha trovato il suo posto nel mondo. Rispettiamolo.', 'elena_conti', 5, '2025-05-06 13:45:00', '2025-05-06 13:45:00'),
    ('Adoro questi post! Mi ricordano perché faccio volontariato ogni settimana.', 'andrea_ricci', 5, '2025-05-07 14:56:00', '2025-05-07 14:56:00'),
    ('Che grazia! Anche i randagi hanno la loro dignità, anzi — soprattutto loro.', 'mario_rossi', 5, '2025-05-08 15:07:00', '2025-05-08 15:07:00'),
    ('Condiviso! Più occhi ci sono su questi gatti, meglio è per la loro sicurezza.', 'giulia_bianchi', 5, '2025-05-09 16:18:00', '2025-05-09 16:18:00'),
    ('Grazie per la segnalazione e per il rispetto dimostrato verso l''animale.', 'luca_ferrari', 5, '2025-05-10 17:29:00', '2025-05-10 17:29:00'),
    ('Post salvato! Passerò da quella zona la prossima settimana.', 'sofia_esposito', 5, '2025-05-06 18:40:00', '2025-05-06 18:40:00'),
    ('Grazie! L''avevamo perso di vista da qualche settimana, ottimo sapere che sta bene.', 'marco_romano', 5, '2025-05-07 19:51:00', '2025-05-07 19:51:00'),
    ('È quello che chiamiamo gatto ''semi-addomesticato'': né randagio né domestico, nel mezzo.', 'elena_conti', 5, '2025-05-08 20:02:00', '2025-05-08 20:02:00'),
    ('Che bello! Queste segnalazioni tengono viva l''attenzione sui gatti liberi.', 'andrea_ricci', 5, '2025-05-09 21:13:00', '2025-05-09 21:13:00'),
    ('Ho portato del cibo ieri sera — era già lì ad aspettarmi. Forse ci vede abituali!', 'mario_rossi', 5, '2025-05-10 10:24:00', '2025-05-10 10:24:00'),
    ('Che bel micio! Lo conosco, passa spesso da questa zona.', 'elena_conti', 6, '2025-06-07 10:00:00', '2025-06-07 10:00:00'),
    ('Ho lasciato delle crocchette vicino alla fontana ieri sera, speriamo le abbia trovate.', 'andrea_ricci', 6, '2025-06-08 11:11:00', '2025-06-08 11:11:00'),
    ('Bellissimo avvistamento! Anche io l''ho visto qualche giorno fa, sembra in buona salute.', 'mario_rossi', 6, '2025-06-09 12:22:00', '2025-06-09 12:22:00'),
    ('Grazie per la segnalazione! I gatti di questa zona sono monitorati dalla nostra associazione.', 'giulia_bianchi', 6, '2025-06-10 13:33:00', '2025-06-10 13:33:00'),
    ('È importante non spostare i gatti randagi dalla loro colonia — si disorientano molto.', 'luca_ferrari', 6, '2025-06-11 14:44:00', '2025-06-11 14:44:00'),
    ('Che occhi meravigliosi! Ha un carattere tutto suo quel micio.', 'sofia_esposito', 6, '2025-06-07 15:55:00', '2025-06-07 15:55:00'),
    ('Lo chiamo ''Il Sindaco'' perché sembra il padrone del quartiere.', 'marco_romano', 6, '2025-06-08 16:06:00', '2025-06-08 16:06:00'),
    ('Attenti a non dargli cibo troppo salato o condito — fa male ai reni dei gatti.', 'elena_conti', 6, '2025-06-09 17:17:00', '2025-06-09 17:17:00'),
    ('Ho segnalato la presenza al referente di colonia della zona, grazie del post!', 'andrea_ricci', 6, '2025-06-10 18:28:00', '2025-06-10 18:28:00'),
    ('Un consiglio: se volete avvicinarvi, abbassatevi lentamente e aspettate che venga lui da voi.', 'mario_rossi', 6, '2025-06-11 19:39:00', '2025-06-11 19:39:00'),
    ('Bello! È da mesi che non lo vedevo, pensavo si fosse spostato.', 'giulia_bianchi', 6, '2025-06-07 20:50:00', '2025-06-07 20:50:00'),
    ('Fantastico avvistamento. Questi gatti fanno parte del patrimonio culturale della città.', 'luca_ferrari', 6, '2025-06-08 21:01:00', '2025-06-08 21:01:00'),
    ('Ha la tacca sull''orecchio? Sarebbe importante saperlo per capire se è già sterilizzato.', 'sofia_esposito', 6, '2025-06-09 10:12:00', '2025-06-09 10:12:00'),
    ('Grazie per condividere! Più segnalazioni abbiamo, meglio possiamo monitorare le colonie.', 'marco_romano', 6, '2025-06-10 11:23:00', '2025-06-10 11:23:00'),
    ('Che bella foto! Si vede che era a suo agio con te.', 'elena_conti', 6, '2025-06-11 12:34:00', '2025-06-11 12:34:00'),
    ('I gatti come lui ci insegnano tutti i giorni il significato della libertà.', 'andrea_ricci', 6, '2025-06-07 13:45:00', '2025-06-07 13:45:00'),
    ('Ho passato mezz''ora a guardarlo camminare sul marciapiede. Ipnotico.', 'mario_rossi', 6, '2025-06-08 14:56:00', '2025-06-08 14:56:00'),
    ('Mamma mia quanto è bello! Quel pelo è pazzesco.', 'andrea_ricci', 7, '2025-07-08 10:00:00', '2025-07-08 10:00:00'),
    ('L''ho avvistato anch''io stamattina! Stava dormendo al sole tranquillissimo.', 'mario_rossi', 7, '2025-07-09 11:11:00', '2025-07-09 11:11:00'),
    ('Se qualcuno è di zona e può portare cibo regolarmente, sarebbe utilissimo.', 'giulia_bianchi', 7, '2025-07-10 12:22:00', '2025-07-10 12:22:00'),
    ('Attenzione: i gatti randagi non vanno mai raccolti senza prima consultare un''associazione.', 'luca_ferrari', 7, '2025-07-11 13:33:00', '2025-07-11 13:33:00'),
    ('Ho l''impressione che sia lo stesso gatto che avevo segnalato tre mesi fa più a nord.', 'sofia_esposito', 7, '2025-07-12 14:44:00', '2025-07-12 14:44:00'),
    ('Che carattere! Si vede da come posa che è abituato all''attenzione.', 'marco_romano', 7, '2025-07-08 15:55:00', '2025-07-08 15:55:00'),
    ('Meraviglioso. Questi randagi ci ricordano quanto siano resistenti e adattabili i gatti.', 'elena_conti', 7, '2025-07-09 16:06:00', '2025-07-09 16:06:00'),
    ('Il metodo TNR (Trap-Neuter-Return) è l''unico modo etico per gestire le colonie.', 'andrea_ricci', 7, '2025-07-10 17:17:00', '2025-07-10 17:17:00'),
    ('Ho contattato il municipio per segnalare il punto — servirebbero più rifugi invernali.', 'mario_rossi', 7, '2025-07-11 18:28:00', '2025-07-11 18:28:00'),
    ('È bellissimo sapere che c''è chi monitora questi animali. Grazie a tutti i volontari!', 'giulia_bianchi', 7, '2025-07-12 19:39:00', '2025-07-12 19:39:00'),
    ('Una nota: l''acqua è importante tanto quanto il cibo, specialmente d''estate.', 'luca_ferrari', 7, '2025-07-08 20:50:00', '2025-07-08 20:50:00'),
    ('Adoro questi post! Tengono viva l''attenzione su una realtà spesso ignorata.', 'sofia_esposito', 7, '2025-07-09 21:01:00', '2025-07-09 21:01:00'),
    ('Avevo paura che si fosse allontanato. Sapere che sta bene mi rincuora.', 'marco_romano', 7, '2025-07-10 10:12:00', '2025-07-10 10:12:00'),
    ('La sua diffidenza è normale — ci vogliono settimane per guadagnare la fiducia di un randagio.', 'elena_conti', 7, '2025-07-11 11:23:00', '2025-07-11 11:23:00'),
    ('Chi abita in zona potrebbe tenerlo d''occhio? Sarebbe preziosissimo.', 'andrea_ricci', 7, '2025-07-12 12:34:00', '2025-07-12 12:34:00'),
    ('Questi gatti meritano rispetto e cura. Grazie per la segnalazione!', 'mario_rossi', 7, '2025-07-08 13:45:00', '2025-07-08 13:45:00'),
    ('Non dategli latte! Molti gatti adulti sono intolleranti al lattosio.', 'giulia_bianchi', 7, '2025-07-09 14:56:00', '2025-07-09 14:56:00'),
    ('Il fatto che sia sterilizzato è un ottimo segnale — la colonia è gestita bene.', 'luca_ferrari', 7, '2025-07-10 15:07:00', '2025-07-10 15:07:00'),
    ('Condivido! Più gente sa di queste colonie, meglio è per tutti.', 'sofia_esposito', 7, '2025-07-11 16:18:00', '2025-07-11 16:18:00'),
    ('Ho aggiunto la posizione alla nostra mappa delle colonie feline della città.', 'marco_romano', 7, '2025-07-12 17:29:00', '2025-07-12 17:29:00'),
    ('Che storia bellissima. Un gatto che ha trovato il suo posto nel mondo.', 'elena_conti', 7, '2025-07-08 18:40:00', '2025-07-08 18:40:00'),
    ('L''ho visto anche io settimana scorsa! Sembrava in ottima forma.', 'mario_rossi', 8, '2025-08-09 10:00:00', '2025-08-09 10:00:00'),
    ('Zona monitorata dalla nostra associazione — grazie per la segnalazione aggiuntiva.', 'giulia_bianchi', 8, '2025-08-10 11:11:00', '2025-08-10 11:11:00'),
    ('Che espressione seria! Sembra stia valutando se fidarsi o meno.', 'luca_ferrari', 8, '2025-08-11 12:22:00', '2025-08-11 12:22:00'),
    ('Portateci cibo secco di qualità — meglio per la salute rispetto agli avanzi.', 'sofia_esposito', 8, '2025-08-12 13:33:00', '2025-08-12 13:33:00'),
    ('Bellissimo esemplare. Il mantello è curatissimo per essere un randagio.', 'marco_romano', 8, '2025-08-13 14:44:00', '2025-08-13 14:44:00'),
    ('Non toccate i cuccioli se la mamma è presente — potrebbe spaventarsi e abbandonarli.', 'elena_conti', 8, '2025-08-09 15:55:00', '2025-08-09 15:55:00'),
    ('Segnalazione inoltrata alla ASL Veterinaria del distretto. Grazie!', 'andrea_ricci', 8, '2025-08-10 16:06:00', '2025-08-10 16:06:00'),
    ('Queste colonie sono protette dalla legge 281/91 — è illegale rimuoverle o maltrattarle.', 'mario_rossi', 8, '2025-08-11 17:17:00', '2025-08-11 17:17:00'),
    ('Che begli occhi! I gatti tigrati hanno sempre qualcosa di speciale.', 'giulia_bianchi', 8, '2025-08-12 18:28:00', '2025-08-12 18:28:00'),
    ('Ho lasciato una ciotola d''acqua fresca sotto il portico vicino — spero la trovi.', 'luca_ferrari', 8, '2025-08-13 19:39:00', '2025-08-13 19:39:00'),
    ('Post preziosissimo. Aggiornate se tornate in zona!', 'sofia_esposito', 8, '2025-08-09 20:50:00', '2025-08-09 20:50:00'),
    ('La sua routine sembra ben consolidata — segno che vive lì da tempo.', 'marco_romano', 8, '2025-08-10 21:01:00', '2025-08-10 21:01:00'),
    ('Grazie per aver specificato le condizioni fisiche — è fondamentale per i volontari.', 'elena_conti', 8, '2025-08-11 10:12:00', '2025-08-11 10:12:00'),
    ('Che bel randagio! Mi fa pensare ai gatti di Roma antica, discendenti di secoli.', 'andrea_ricci', 8, '2025-08-12 11:23:00', '2025-08-12 11:23:00'),
    ('Se volete adottarlo, il passaggio dal randagio alla casa richiede pazienza e tempo.', 'mario_rossi', 8, '2025-08-13 12:34:00', '2025-08-13 12:34:00'),
    ('Condivido nella pagina della nostra associazione — speriamo trovi un referente fisso!', 'giulia_bianchi', 8, '2025-08-09 13:45:00', '2025-08-09 13:45:00'),
    ('Questi avvistamenti mi fanno sempre venire voglia di uscire a fare volontariato.', 'luca_ferrari', 8, '2025-08-10 14:56:00', '2025-08-10 14:56:00'),
    ('Complimenti per la foto — cattura perfettamente il suo carattere.', 'sofia_esposito', 8, '2025-08-11 15:07:00', '2025-08-11 15:07:00'),
    ('Ho incontrato anche io un gatto simile nello stesso quartiere — forse è lo stesso?', 'marco_romano', 8, '2025-08-12 16:18:00', '2025-08-12 16:18:00'),
    ('Grazie per la segnalazione con coordinate precise — utilissime per la mappa.', 'elena_conti', 8, '2025-08-13 17:29:00', '2025-08-13 17:29:00'),
    ('Che storia! Un gatto libero che ha trovato il suo territorio.', 'andrea_ricci', 8, '2025-08-09 18:40:00', '2025-08-09 18:40:00'),
    ('Segnalazione aggiunta al registro della colonia. Grazie!', 'mario_rossi', 8, '2025-08-10 19:51:00', '2025-08-10 19:51:00'),
    ('L''ho visto anche io settimana scorsa! Sembrava in ottima forma.', 'giulia_bianchi', 8, '2025-08-11 20:02:00', '2025-08-11 20:02:00'),
    ('Dolcissimo! Spero che qualcuno lo segua con regolarità.', 'giulia_bianchi', 9, '2025-09-10 10:00:00', '2025-09-10 10:00:00'),
    ('È utile sapere se ha la tacca sull''orecchio — indicherebbe già la sterilizzazione TNR.', 'luca_ferrari', 9, '2025-09-11 11:11:00', '2025-09-11 11:11:00'),
    ('Zona nota alla nostra associazione. Manterremo l''occhio aperto.', 'sofia_esposito', 9, '2025-09-12 12:22:00', '2025-09-12 12:22:00'),
    ('Che eleganza nei movimenti! I gatti hanno una grazia innata.', 'marco_romano', 9, '2025-09-13 13:33:00', '2025-09-13 13:33:00'),
    ('Non avvicinatevi troppo se è diffidente — il rispetto è la base.', 'elena_conti', 9, '2025-09-14 14:44:00', '2025-09-14 14:44:00'),
    ('La sua condizione sembra buona — qualcuno si prende cura di lui.', 'andrea_ricci', 9, '2025-09-10 15:55:00', '2025-09-10 15:55:00'),
    ('Aggiungo questa posizione alla app di mappatura delle colonie feline. Grazie!', 'mario_rossi', 9, '2025-09-11 16:06:00', '2025-09-11 16:06:00'),
    ('Bellissima segnalazione! Questi post fanno la differenza per il benessere animale.', 'giulia_bianchi', 9, '2025-09-12 17:17:00', '2025-09-12 17:17:00'),
    ('Attenzione alle macchine in quella zona — è una strada trafficata.', 'luca_ferrari', 9, '2025-09-13 18:28:00', '2025-09-13 18:28:00'),
    ('Chi vive nei paraggi potrebbe tenerlo d''occhio? Ci servirebbe un referente.', 'sofia_esposito', 9, '2025-09-14 19:39:00', '2025-09-14 19:39:00'),
    ('Il gatto ha capito tutto della vita: mangiare, dormire, esplorare. Noi no.', 'marco_romano', 9, '2025-09-10 20:50:00', '2025-09-10 20:50:00'),
    ('Condiviso nella pagina del comune — speriamo in un casetta/rifugio per l''inverno.', 'elena_conti', 9, '2025-09-11 21:01:00', '2025-09-11 21:01:00'),
    ('Questi gatti sono la vera anima dei quartieri storici italiani.', 'andrea_ricci', 9, '2025-09-12 10:12:00', '2025-09-12 10:12:00'),
    ('Grazie per la precisione della descrizione — ci aiuta a identificare i soggetti.', 'mario_rossi', 9, '2025-09-13 11:23:00', '2025-09-13 11:23:00'),
    ('Lo stesso gatto è stato avvistato anche in Via X la settimana scorsa.', 'giulia_bianchi', 9, '2025-09-14 12:34:00', '2025-09-14 12:34:00'),
    ('Un consiglio: il cibo umido in estate va rimosso dopo 30 minuti per evitare batteri.', 'luca_ferrari', 9, '2025-09-10 13:45:00', '2025-09-10 13:45:00'),
    ('Post fantastico! Continua a segnalare, queste informazioni sono oro per noi volontari.', 'sofia_esposito', 9, '2025-09-11 14:56:00', '2025-09-11 14:56:00'),
    ('Che personalità! Si vede subito chi comanda da quelle parti.', 'marco_romano', 9, '2025-09-12 15:07:00', '2025-09-12 15:07:00'),
    ('Speriamo che qualcuno possa dargli una sistemazione per l''inverno.', 'elena_conti', 9, '2025-09-13 16:18:00', '2025-09-13 16:18:00'),
    ('Grazie! L''avevamo perso di vista da qualche settimana, ottimo sapere che sta bene.', 'luca_ferrari', 10, '2025-10-11 10:00:00', '2025-10-11 10:00:00'),
    ('È quello che chiamiamo gatto ''semi-addomesticato'': né randagio né domestico, nel mezzo.', 'sofia_esposito', 10, '2025-10-12 11:11:00', '2025-10-12 11:11:00'),
    ('Che bello! Queste segnalazioni tengono viva l''attenzione sui gatti liberi.', 'marco_romano', 10, '2025-10-13 12:22:00', '2025-10-13 12:22:00'),
    ('Ho portato del cibo ieri sera — era già lì ad aspettarmi. Forse ci vede abituali!', 'elena_conti', 10, '2025-10-14 13:33:00', '2025-10-14 13:33:00'),
    ('La diffidenza dei randagi è una forma di intelligenza, non cattiveria.', 'andrea_ricci', 10, '2025-10-15 14:44:00', '2025-10-15 14:44:00'),
    ('Bravissimo a fotografarlo senza disturbarlo — si vede che sei esperto.', 'mario_rossi', 10, '2025-10-11 15:55:00', '2025-10-11 15:55:00'),
    ('Zona monitorata mensilmente dalla nostra unità veterinaria mobile.', 'giulia_bianchi', 10, '2025-10-12 16:06:00', '2025-10-12 16:06:00'),
    ('Che contemplazione! Sembra stia risolvendo i problemi del mondo.', 'luca_ferrari', 10, '2025-10-13 17:17:00', '2025-10-13 17:17:00'),
    ('Il pelo lucido indica una dieta adeguata — qualcuno se ne prende cura.', 'sofia_esposito', 10, '2025-10-14 18:28:00', '2025-10-14 18:28:00'),
    ('Non spostate mai i gatti da una colonia a un''altra senza supporto professionale.', 'marco_romano', 10, '2025-10-15 19:39:00', '2025-10-15 19:39:00'),
    ('Avvistamento confermato da altri due utenti questa settimana — zona molto attiva.', 'elena_conti', 10, '2025-10-11 20:50:00', '2025-10-11 20:50:00'),
    ('Che tenerezza! Mi ha fatto venire voglia di abbracciarlo (ma non l''avrei fatto, tranquilli).', 'andrea_ricci', 10, '2025-10-12 21:01:00', '2025-10-12 21:01:00'),
    ('Grazie per l''avvistamento dettagliato — aggiornate se notate cambiamenti.', 'mario_rossi', 10, '2025-10-13 10:12:00', '2025-10-13 10:12:00'),
    ('Un randagio ben integrato nel territorio è il risultato del lavoro di molti volontari.', 'giulia_bianchi', 10, '2025-10-14 11:23:00', '2025-10-14 11:23:00'),
    ('Zona con alta densità felina — stiamo lavorando per aumentare i punti di alimentazione.', 'luca_ferrari', 10, '2025-10-15 12:34:00', '2025-10-15 12:34:00'),
    ('Il gatto ha trovato il suo posto nel mondo. Rispettiamolo.', 'sofia_esposito', 10, '2025-10-11 13:45:00', '2025-10-11 13:45:00'),
    ('Adoro questi post! Mi ricordano perché faccio volontariato ogni settimana.', 'marco_romano', 10, '2025-10-12 14:56:00', '2025-10-12 14:56:00'),
    ('Che grazia! Anche i randagi hanno la loro dignità, anzi — soprattutto loro.', 'elena_conti', 10, '2025-10-13 15:07:00', '2025-10-13 15:07:00'),
    ('Condiviso! Più occhi ci sono su questi gatti, meglio è per la loro sicurezza.', 'andrea_ricci', 10, '2025-10-14 16:18:00', '2025-10-14 16:18:00'),
    ('Grazie per la segnalazione e per il rispetto dimostrato verso l''animale.', 'mario_rossi', 10, '2025-10-15 17:29:00', '2025-10-15 17:29:00'),
    ('Post salvato! Passerò da quella zona la prossima settimana.', 'giulia_bianchi', 10, '2025-10-11 18:40:00', '2025-10-11 18:40:00'),
    ('Grazie! L''avevamo perso di vista da qualche settimana, ottimo sapere che sta bene.', 'luca_ferrari', 10, '2025-10-12 19:51:00', '2025-10-12 19:51:00'),
    ('È quello che chiamiamo gatto ''semi-addomesticato'': né randagio né domestico, nel mezzo.', 'sofia_esposito', 10, '2025-10-13 20:02:00', '2025-10-13 20:02:00'),
    ('Che bello! Queste segnalazioni tengono viva l''attenzione sui gatti liberi.', 'marco_romano', 10, '2025-10-14 21:13:00', '2025-10-14 21:13:00'),
    ('Ho portato del cibo ieri sera — era già lì ad aspettarmi. Forse ci vede abituali!', 'elena_conti', 10, '2025-10-15 10:24:00', '2025-10-15 10:24:00'),
    ('La diffidenza dei randagi è una forma di intelligenza, non cattiveria.', 'andrea_ricci', 10, '2025-10-11 11:35:00', '2025-10-11 11:35:00'),
    ('Bravissimo a fotografarlo senza disturbarlo — si vede che sei esperto.', 'mario_rossi', 10, '2025-10-12 12:46:00', '2025-10-12 12:46:00'),
    ('Zona monitorata mensilmente dalla nostra unità veterinaria mobile.', 'giulia_bianchi', 10, '2025-10-13 13:57:00', '2025-10-13 13:57:00'),
    ('Che contemplazione! Sembra stia risolvendo i problemi del mondo.', 'luca_ferrari', 10, '2025-10-14 14:08:00', '2025-10-14 14:08:00'),
    ('Il pelo lucido indica una dieta adeguata — qualcuno se ne prende cura.', 'sofia_esposito', 10, '2025-10-15 15:19:00', '2025-10-15 15:19:00'),
    ('Che bel micio! Lo conosco, passa spesso da questa zona.', 'sofia_esposito', 11, '2025-01-12 10:00:00', '2025-01-12 10:00:00'),
    ('Ho lasciato delle crocchette vicino alla fontana ieri sera, speriamo le abbia trovate.', 'marco_romano', 11, '2025-01-13 11:11:00', '2025-01-13 11:11:00'),
    ('Bellissimo avvistamento! Anche io l''ho visto qualche giorno fa, sembra in buona salute.', 'elena_conti', 11, '2025-01-14 12:22:00', '2025-01-14 12:22:00'),
    ('Grazie per la segnalazione! I gatti di questa zona sono monitorati dalla nostra associazione.', 'andrea_ricci', 11, '2025-01-15 13:33:00', '2025-01-15 13:33:00'),
    ('È importante non spostare i gatti randagi dalla loro colonia — si disorientano molto.', 'mario_rossi', 11, '2025-01-16 14:44:00', '2025-01-16 14:44:00'),
    ('Che occhi meravigliosi! Ha un carattere tutto suo quel micio.', 'giulia_bianchi', 11, '2025-01-12 15:55:00', '2025-01-12 15:55:00'),
    ('Lo chiamo ''Il Sindaco'' perché sembra il padrone del quartiere.', 'luca_ferrari', 11, '2025-01-13 16:06:00', '2025-01-13 16:06:00'),
    ('Attenti a non dargli cibo troppo salato o condito — fa male ai reni dei gatti.', 'sofia_esposito', 11, '2025-01-14 17:17:00', '2025-01-14 17:17:00'),
    ('Ho segnalato la presenza al referente di colonia della zona, grazie del post!', 'marco_romano', 11, '2025-01-15 18:28:00', '2025-01-15 18:28:00'),
    ('Un consiglio: se volete avvicinarvi, abbassatevi lentamente e aspettate che venga lui da voi.', 'elena_conti', 11, '2025-01-16 19:39:00', '2025-01-16 19:39:00'),
    ('Bello! È da mesi che non lo vedevo, pensavo si fosse spostato.', 'andrea_ricci', 11, '2025-01-12 20:50:00', '2025-01-12 20:50:00'),
    ('Fantastico avvistamento. Questi gatti fanno parte del patrimonio culturale della città.', 'mario_rossi', 11, '2025-01-13 21:01:00', '2025-01-13 21:01:00'),
    ('Ha la tacca sull''orecchio? Sarebbe importante saperlo per capire se è già sterilizzato.', 'giulia_bianchi', 11, '2025-01-14 10:12:00', '2025-01-14 10:12:00'),
    ('Grazie per condividere! Più segnalazioni abbiamo, meglio possiamo monitorare le colonie.', 'luca_ferrari', 11, '2025-01-15 11:23:00', '2025-01-15 11:23:00'),
    ('Che bella foto! Si vede che era a suo agio con te.', 'sofia_esposito', 11, '2025-01-16 12:34:00', '2025-01-16 12:34:00'),
    ('I gatti come lui ci insegnano tutti i giorni il significato della libertà.', 'marco_romano', 11, '2025-01-12 13:45:00', '2025-01-12 13:45:00'),
    ('Ho passato mezz''ora a guardarlo camminare sul marciapiede. Ipnotico.', 'elena_conti', 11, '2025-01-13 14:56:00', '2025-01-13 14:56:00'),
    ('È fondamentale non spostare il cibo dalla posizione abitudinaria — i gatti sono molto dipendenti dalla routine.', 'andrea_ricci', 11, '2025-01-14 15:07:00', '2025-01-14 15:07:00'),
    ('Avvistamento confermato! Anche il mio vicino me ne aveva parlato.', 'mario_rossi', 11, '2025-01-15 16:18:00', '2025-01-15 16:18:00'),
    ('Queste segnalazioni sono preziosissime per la mappa felina della città.', 'giulia_bianchi', 11, '2025-01-16 17:29:00', '2025-01-16 17:29:00'),
    ('Mamma mia quanto è bello! Quel pelo è pazzesco.', 'marco_romano', 12, '2025-02-13 10:00:00', '2025-02-13 10:00:00'),
    ('L''ho avvistato anch''io stamattina! Stava dormendo al sole tranquillissimo.', 'elena_conti', 12, '2025-02-14 11:11:00', '2025-02-14 11:11:00'),
    ('Se qualcuno è di zona e può portare cibo regolarmente, sarebbe utilissimo.', 'andrea_ricci', 12, '2025-02-15 12:22:00', '2025-02-15 12:22:00'),
    ('Attenzione: i gatti randagi non vanno mai raccolti senza prima consultare un''associazione.', 'mario_rossi', 12, '2025-02-16 13:33:00', '2025-02-16 13:33:00'),
    ('Ho l''impressione che sia lo stesso gatto che avevo segnalato tre mesi fa più a nord.', 'giulia_bianchi', 12, '2025-02-17 14:44:00', '2025-02-17 14:44:00'),
    ('Che carattere! Si vede da come posa che è abituato all''attenzione.', 'luca_ferrari', 12, '2025-02-13 15:55:00', '2025-02-13 15:55:00'),
    ('Meraviglioso. Questi randagi ci ricordano quanto siano resistenti e adattabili i gatti.', 'sofia_esposito', 12, '2025-02-14 16:06:00', '2025-02-14 16:06:00'),
    ('Il metodo TNR (Trap-Neuter-Return) è l''unico modo etico per gestire le colonie.', 'marco_romano', 12, '2025-02-15 17:17:00', '2025-02-15 17:17:00'),
    ('Ho contattato il municipio per segnalare il punto — servirebbero più rifugi invernali.', 'elena_conti', 12, '2025-02-16 18:28:00', '2025-02-16 18:28:00'),
    ('È bellissimo sapere che c''è chi monitora questi animali. Grazie a tutti i volontari!', 'andrea_ricci', 12, '2025-02-17 19:39:00', '2025-02-17 19:39:00'),
    ('Una nota: l''acqua è importante tanto quanto il cibo, specialmente d''estate.', 'mario_rossi', 12, '2025-02-13 20:50:00', '2025-02-13 20:50:00'),
    ('Adoro questi post! Tengono viva l''attenzione su una realtà spesso ignorata.', 'giulia_bianchi', 12, '2025-02-14 21:01:00', '2025-02-14 21:01:00'),
    ('Avevo paura che si fosse allontanato. Sapere che sta bene mi rincuora.', 'luca_ferrari', 12, '2025-02-15 10:12:00', '2025-02-15 10:12:00'),
    ('La sua diffidenza è normale — ci vogliono settimane per guadagnare la fiducia di un randagio.', 'sofia_esposito', 12, '2025-02-16 11:23:00', '2025-02-16 11:23:00'),
    ('Chi abita in zona potrebbe tenerlo d''occhio? Sarebbe preziosissimo.', 'marco_romano', 12, '2025-02-17 12:34:00', '2025-02-17 12:34:00'),
    ('Questi gatti meritano rispetto e cura. Grazie per la segnalazione!', 'elena_conti', 12, '2025-02-13 13:45:00', '2025-02-13 13:45:00'),
    ('Non dategli latte! Molti gatti adulti sono intolleranti al lattosio.', 'andrea_ricci', 12, '2025-02-14 14:56:00', '2025-02-14 14:56:00'),
    ('Il fatto che sia sterilizzato è un ottimo segnale — la colonia è gestita bene.', 'mario_rossi', 12, '2025-02-15 15:07:00', '2025-02-15 15:07:00'),
    ('Condivido! Più gente sa di queste colonie, meglio è per tutti.', 'giulia_bianchi', 12, '2025-02-16 16:18:00', '2025-02-16 16:18:00'),
    ('Ho aggiunto la posizione alla nostra mappa delle colonie feline della città.', 'luca_ferrari', 12, '2025-02-17 17:29:00', '2025-02-17 17:29:00'),
    ('Che storia bellissima. Un gatto che ha trovato il suo posto nel mondo.', 'sofia_esposito', 12, '2025-02-13 18:40:00', '2025-02-13 18:40:00'),
    ('Mamma mia quanto è bello! Quel pelo è pazzesco.', 'marco_romano', 12, '2025-02-14 19:51:00', '2025-02-14 19:51:00'),
    ('L''ho visto anche io settimana scorsa! Sembrava in ottima forma.', 'elena_conti', 13, '2025-03-14 10:00:00', '2025-03-14 10:00:00'),
    ('Zona monitorata dalla nostra associazione — grazie per la segnalazione aggiuntiva.', 'andrea_ricci', 13, '2025-03-15 11:11:00', '2025-03-15 11:11:00'),
    ('Che espressione seria! Sembra stia valutando se fidarsi o meno.', 'mario_rossi', 13, '2025-03-16 12:22:00', '2025-03-16 12:22:00'),
    ('Portateci cibo secco di qualità — meglio per la salute rispetto agli avanzi.', 'giulia_bianchi', 13, '2025-03-17 13:33:00', '2025-03-17 13:33:00'),
    ('Bellissimo esemplare. Il mantello è curatissimo per essere un randagio.', 'luca_ferrari', 13, '2025-03-18 14:44:00', '2025-03-18 14:44:00'),
    ('Non toccate i cuccioli se la mamma è presente — potrebbe spaventarsi e abbandonarli.', 'sofia_esposito', 13, '2025-03-14 15:55:00', '2025-03-14 15:55:00'),
    ('Segnalazione inoltrata alla ASL Veterinaria del distretto. Grazie!', 'marco_romano', 13, '2025-03-15 16:06:00', '2025-03-15 16:06:00'),
    ('Queste colonie sono protette dalla legge 281/91 — è illegale rimuoverle o maltrattarle.', 'elena_conti', 13, '2025-03-16 17:17:00', '2025-03-16 17:17:00'),
    ('Che begli occhi! I gatti tigrati hanno sempre qualcosa di speciale.', 'andrea_ricci', 13, '2025-03-17 18:28:00', '2025-03-17 18:28:00'),
    ('Ho lasciato una ciotola d''acqua fresca sotto il portico vicino — spero la trovi.', 'mario_rossi', 13, '2025-03-18 19:39:00', '2025-03-18 19:39:00'),
    ('Post preziosissimo. Aggiornate se tornate in zona!', 'giulia_bianchi', 13, '2025-03-14 20:50:00', '2025-03-14 20:50:00'),
    ('La sua routine sembra ben consolidata — segno che vive lì da tempo.', 'luca_ferrari', 13, '2025-03-15 21:01:00', '2025-03-15 21:01:00'),
    ('Grazie per aver specificato le condizioni fisiche — è fondamentale per i volontari.', 'sofia_esposito', 13, '2025-03-16 10:12:00', '2025-03-16 10:12:00'),
    ('Che bel randagio! Mi fa pensare ai gatti di Roma antica, discendenti di secoli.', 'marco_romano', 13, '2025-03-17 11:23:00', '2025-03-17 11:23:00'),
    ('Se volete adottarlo, il passaggio dal randagio alla casa richiede pazienza e tempo.', 'elena_conti', 13, '2025-03-18 12:34:00', '2025-03-18 12:34:00'),
    ('Condivido nella pagina della nostra associazione — speriamo trovi un referente fisso!', 'andrea_ricci', 13, '2025-03-14 13:45:00', '2025-03-14 13:45:00'),
    ('Questi avvistamenti mi fanno sempre venire voglia di uscire a fare volontariato.', 'mario_rossi', 13, '2025-03-15 14:56:00', '2025-03-15 14:56:00'),
    ('Complimenti per la foto — cattura perfettamente il suo carattere.', 'giulia_bianchi', 13, '2025-03-16 15:07:00', '2025-03-16 15:07:00'),
    ('Dolcissimo! Spero che qualcuno lo segua con regolarità.', 'andrea_ricci', 14, '2025-04-15 10:00:00', '2025-04-15 10:00:00'),
    ('È utile sapere se ha la tacca sull''orecchio — indicherebbe già la sterilizzazione TNR.', 'mario_rossi', 14, '2025-04-16 11:11:00', '2025-04-16 11:11:00'),
    ('Zona nota alla nostra associazione. Manterremo l''occhio aperto.', 'giulia_bianchi', 14, '2025-04-17 12:22:00', '2025-04-17 12:22:00'),
    ('Che eleganza nei movimenti! I gatti hanno una grazia innata.', 'luca_ferrari', 14, '2025-04-18 13:33:00', '2025-04-18 13:33:00'),
    ('Non avvicinatevi troppo se è diffidente — il rispetto è la base.', 'sofia_esposito', 14, '2025-04-19 14:44:00', '2025-04-19 14:44:00'),
    ('La sua condizione sembra buona — qualcuno si prende cura di lui.', 'marco_romano', 14, '2025-04-15 15:55:00', '2025-04-15 15:55:00'),
    ('Aggiungo questa posizione alla app di mappatura delle colonie feline. Grazie!', 'elena_conti', 14, '2025-04-16 16:06:00', '2025-04-16 16:06:00'),
    ('Bellissima segnalazione! Questi post fanno la differenza per il benessere animale.', 'andrea_ricci', 14, '2025-04-17 17:17:00', '2025-04-17 17:17:00'),
    ('Attenzione alle macchine in quella zona — è una strada trafficata.', 'mario_rossi', 14, '2025-04-18 18:28:00', '2025-04-18 18:28:00'),
    ('Chi vive nei paraggi potrebbe tenerlo d''occhio? Ci servirebbe un referente.', 'giulia_bianchi', 14, '2025-04-19 19:39:00', '2025-04-19 19:39:00'),
    ('Il gatto ha capito tutto della vita: mangiare, dormire, esplorare. Noi no.', 'luca_ferrari', 14, '2025-04-15 20:50:00', '2025-04-15 20:50:00'),
    ('Condiviso nella pagina del comune — speriamo in un casetta/rifugio per l''inverno.', 'sofia_esposito', 14, '2025-04-16 21:01:00', '2025-04-16 21:01:00'),
    ('Questi gatti sono la vera anima dei quartieri storici italiani.', 'marco_romano', 14, '2025-04-17 10:12:00', '2025-04-17 10:12:00'),
    ('Grazie per la precisione della descrizione — ci aiuta a identificare i soggetti.', 'elena_conti', 14, '2025-04-18 11:23:00', '2025-04-18 11:23:00'),
    ('Lo stesso gatto è stato avvistato anche in Via X la settimana scorsa.', 'andrea_ricci', 14, '2025-04-19 12:34:00', '2025-04-19 12:34:00'),
    ('Un consiglio: il cibo umido in estate va rimosso dopo 30 minuti per evitare batteri.', 'mario_rossi', 14, '2025-04-15 13:45:00', '2025-04-15 13:45:00'),
    ('Post fantastico! Continua a segnalare, queste informazioni sono oro per noi volontari.', 'giulia_bianchi', 14, '2025-04-16 14:56:00', '2025-04-16 14:56:00'),
    ('Che personalità! Si vede subito chi comanda da quelle parti.', 'luca_ferrari', 14, '2025-04-17 15:07:00', '2025-04-17 15:07:00'),
    ('Speriamo che qualcuno possa dargli una sistemazione per l''inverno.', 'sofia_esposito', 14, '2025-04-18 16:18:00', '2025-04-18 16:18:00'),
    ('Bellissimo avvistamento — e ottima la descrizione delle condizioni fisiche.', 'marco_romano', 14, '2025-04-19 17:29:00', '2025-04-19 17:29:00'),
    ('Dolcissimo! Spero che qualcuno lo segua con regolarità.', 'elena_conti', 14, '2025-04-15 18:40:00', '2025-04-15 18:40:00'),
    ('È utile sapere se ha la tacca sull''orecchio — indicherebbe già la sterilizzazione TNR.', 'andrea_ricci', 14, '2025-04-16 19:51:00', '2025-04-16 19:51:00'),
    ('Zona nota alla nostra associazione. Manterremo l''occhio aperto.', 'mario_rossi', 14, '2025-04-17 20:02:00', '2025-04-17 20:02:00'),
    ('Che eleganza nei movimenti! I gatti hanno una grazia innata.', 'giulia_bianchi', 14, '2025-04-18 21:13:00', '2025-04-18 21:13:00'),
    ('Non avvicinatevi troppo se è diffidente — il rispetto è la base.', 'luca_ferrari', 14, '2025-04-19 10:24:00', '2025-04-19 10:24:00'),
    ('Grazie! L''avevamo perso di vista da qualche settimana, ottimo sapere che sta bene.', 'mario_rossi', 15, '2025-05-16 10:00:00', '2025-05-16 10:00:00'),
    ('È quello che chiamiamo gatto ''semi-addomesticato'': né randagio né domestico, nel mezzo.', 'giulia_bianchi', 15, '2025-05-17 11:11:00', '2025-05-17 11:11:00'),
    ('Che bello! Queste segnalazioni tengono viva l''attenzione sui gatti liberi.', 'luca_ferrari', 15, '2025-05-18 12:22:00', '2025-05-18 12:22:00'),
    ('Ho portato del cibo ieri sera — era già lì ad aspettarmi. Forse ci vede abituali!', 'sofia_esposito', 15, '2025-05-19 13:33:00', '2025-05-19 13:33:00'),
    ('La diffidenza dei randagi è una forma di intelligenza, non cattiveria.', 'marco_romano', 15, '2025-05-20 14:44:00', '2025-05-20 14:44:00'),
    ('Bravissimo a fotografarlo senza disturbarlo — si vede che sei esperto.', 'elena_conti', 15, '2025-05-16 15:55:00', '2025-05-16 15:55:00'),
    ('Zona monitorata mensilmente dalla nostra unità veterinaria mobile.', 'andrea_ricci', 15, '2025-05-17 16:06:00', '2025-05-17 16:06:00'),
    ('Che contemplazione! Sembra stia risolvendo i problemi del mondo.', 'mario_rossi', 15, '2025-05-18 17:17:00', '2025-05-18 17:17:00'),
    ('Il pelo lucido indica una dieta adeguata — qualcuno se ne prende cura.', 'giulia_bianchi', 15, '2025-05-19 18:28:00', '2025-05-19 18:28:00'),
    ('Non spostate mai i gatti da una colonia a un''altra senza supporto professionale.', 'luca_ferrari', 15, '2025-05-20 19:39:00', '2025-05-20 19:39:00'),
    ('Avvistamento confermato da altri due utenti questa settimana — zona molto attiva.', 'sofia_esposito', 15, '2025-05-16 20:50:00', '2025-05-16 20:50:00'),
    ('Che tenerezza! Mi ha fatto venire voglia di abbracciarlo (ma non l''avrei fatto, tranquilli).', 'marco_romano', 15, '2025-05-17 21:01:00', '2025-05-17 21:01:00'),
    ('Grazie per l''avvistamento dettagliato — aggiornate se notate cambiamenti.', 'elena_conti', 15, '2025-05-18 10:12:00', '2025-05-18 10:12:00'),
    ('Un randagio ben integrato nel territorio è il risultato del lavoro di molti volontari.', 'andrea_ricci', 15, '2025-05-19 11:23:00', '2025-05-19 11:23:00'),
    ('Zona con alta densità felina — stiamo lavorando per aumentare i punti di alimentazione.', 'mario_rossi', 15, '2025-05-20 12:34:00', '2025-05-20 12:34:00'),
    ('Il gatto ha trovato il suo posto nel mondo. Rispettiamolo.', 'giulia_bianchi', 15, '2025-05-16 13:45:00', '2025-05-16 13:45:00'),
    ('Adoro questi post! Mi ricordano perché faccio volontariato ogni settimana.', 'luca_ferrari', 15, '2025-05-17 14:56:00', '2025-05-17 14:56:00'),
    ('Che grazia! Anche i randagi hanno la loro dignità, anzi — soprattutto loro.', 'sofia_esposito', 15, '2025-05-18 15:07:00', '2025-05-18 15:07:00'),
    ('Condiviso! Più occhi ci sono su questi gatti, meglio è per la loro sicurezza.', 'marco_romano', 15, '2025-05-19 16:18:00', '2025-05-19 16:18:00'),
    ('Grazie per la segnalazione e per il rispetto dimostrato verso l''animale.', 'elena_conti', 15, '2025-05-20 17:29:00', '2025-05-20 17:29:00'),
    ('Che bel micio! Lo conosco, passa spesso da questa zona.', 'giulia_bianchi', 16, '2025-06-17 10:00:00', '2025-06-17 10:00:00'),
    ('Ho lasciato delle crocchette vicino alla fontana ieri sera, speriamo le abbia trovate.', 'luca_ferrari', 16, '2025-06-18 11:11:00', '2025-06-18 11:11:00'),
    ('Bellissimo avvistamento! Anche io l''ho visto qualche giorno fa, sembra in buona salute.', 'sofia_esposito', 16, '2025-06-19 12:22:00', '2025-06-19 12:22:00'),
    ('Grazie per la segnalazione! I gatti di questa zona sono monitorati dalla nostra associazione.', 'marco_romano', 16, '2025-06-20 13:33:00', '2025-06-20 13:33:00'),
    ('È importante non spostare i gatti randagi dalla loro colonia — si disorientano molto.', 'elena_conti', 16, '2025-06-21 14:44:00', '2025-06-21 14:44:00'),
    ('Che occhi meravigliosi! Ha un carattere tutto suo quel micio.', 'andrea_ricci', 16, '2025-06-17 15:55:00', '2025-06-17 15:55:00'),
    ('Lo chiamo ''Il Sindaco'' perché sembra il padrone del quartiere.', 'mario_rossi', 16, '2025-06-18 16:06:00', '2025-06-18 16:06:00'),
    ('Attenti a non dargli cibo troppo salato o condito — fa male ai reni dei gatti.', 'giulia_bianchi', 16, '2025-06-19 17:17:00', '2025-06-19 17:17:00'),
    ('Ho segnalato la presenza al referente di colonia della zona, grazie del post!', 'luca_ferrari', 16, '2025-06-20 18:28:00', '2025-06-20 18:28:00'),
    ('Un consiglio: se volete avvicinarvi, abbassatevi lentamente e aspettate che venga lui da voi.', 'sofia_esposito', 16, '2025-06-21 19:39:00', '2025-06-21 19:39:00'),
    ('Bello! È da mesi che non lo vedevo, pensavo si fosse spostato.', 'marco_romano', 16, '2025-06-17 20:50:00', '2025-06-17 20:50:00'),
    ('Fantastico avvistamento. Questi gatti fanno parte del patrimonio culturale della città.', 'elena_conti', 16, '2025-06-18 21:01:00', '2025-06-18 21:01:00'),
    ('Ha la tacca sull''orecchio? Sarebbe importante saperlo per capire se è già sterilizzato.', 'andrea_ricci', 16, '2025-06-19 10:12:00', '2025-06-19 10:12:00'),
    ('Grazie per condividere! Più segnalazioni abbiamo, meglio possiamo monitorare le colonie.', 'mario_rossi', 16, '2025-06-20 11:23:00', '2025-06-20 11:23:00'),
    ('Che bella foto! Si vede che era a suo agio con te.', 'giulia_bianchi', 16, '2025-06-21 12:34:00', '2025-06-21 12:34:00'),
    ('I gatti come lui ci insegnano tutti i giorni il significato della libertà.', 'luca_ferrari', 16, '2025-06-17 13:45:00', '2025-06-17 13:45:00'),
    ('Ho passato mezz''ora a guardarlo camminare sul marciapiede. Ipnotico.', 'sofia_esposito', 16, '2025-06-18 14:56:00', '2025-06-18 14:56:00'),
    ('È fondamentale non spostare il cibo dalla posizione abitudinaria — i gatti sono molto dipendenti dalla routine.', 'marco_romano', 16, '2025-06-19 15:07:00', '2025-06-19 15:07:00'),
    ('Avvistamento confermato! Anche il mio vicino me ne aveva parlato.', 'elena_conti', 16, '2025-06-20 16:18:00', '2025-06-20 16:18:00'),
    ('Mamma mia quanto è bello! Quel pelo è pazzesco.', 'luca_ferrari', 17, '2025-07-18 10:00:00', '2025-07-18 10:00:00'),
    ('L''ho avvistato anch''io stamattina! Stava dormendo al sole tranquillissimo.', 'sofia_esposito', 17, '2025-07-19 11:11:00', '2025-07-19 11:11:00'),
    ('Se qualcuno è di zona e può portare cibo regolarmente, sarebbe utilissimo.', 'marco_romano', 17, '2025-07-20 12:22:00', '2025-07-20 12:22:00'),
    ('Attenzione: i gatti randagi non vanno mai raccolti senza prima consultare un''associazione.', 'elena_conti', 17, '2025-07-21 13:33:00', '2025-07-21 13:33:00'),
    ('Ho l''impressione che sia lo stesso gatto che avevo segnalato tre mesi fa più a nord.', 'andrea_ricci', 17, '2025-07-22 14:44:00', '2025-07-22 14:44:00'),
    ('Che carattere! Si vede da come posa che è abituato all''attenzione.', 'mario_rossi', 17, '2025-07-18 15:55:00', '2025-07-18 15:55:00'),
    ('Meraviglioso. Questi randagi ci ricordano quanto siano resistenti e adattabili i gatti.', 'giulia_bianchi', 17, '2025-07-19 16:06:00', '2025-07-19 16:06:00'),
    ('Il metodo TNR (Trap-Neuter-Return) è l''unico modo etico per gestire le colonie.', 'luca_ferrari', 17, '2025-07-20 17:17:00', '2025-07-20 17:17:00'),
    ('Ho contattato il municipio per segnalare il punto — servirebbero più rifugi invernali.', 'sofia_esposito', 17, '2025-07-21 18:28:00', '2025-07-21 18:28:00'),
    ('È bellissimo sapere che c''è chi monitora questi animali. Grazie a tutti i volontari!', 'marco_romano', 17, '2025-07-22 19:39:00', '2025-07-22 19:39:00'),
    ('Una nota: l''acqua è importante tanto quanto il cibo, specialmente d''estate.', 'elena_conti', 17, '2025-07-18 20:50:00', '2025-07-18 20:50:00'),
    ('Adoro questi post! Tengono viva l''attenzione su una realtà spesso ignorata.', 'andrea_ricci', 17, '2025-07-19 21:01:00', '2025-07-19 21:01:00'),
    ('Avevo paura che si fosse allontanato. Sapere che sta bene mi rincuora.', 'mario_rossi', 17, '2025-07-20 10:12:00', '2025-07-20 10:12:00'),
    ('La sua diffidenza è normale — ci vogliono settimane per guadagnare la fiducia di un randagio.', 'giulia_bianchi', 17, '2025-07-21 11:23:00', '2025-07-21 11:23:00'),
    ('Chi abita in zona potrebbe tenerlo d''occhio? Sarebbe preziosissimo.', 'luca_ferrari', 17, '2025-07-22 12:34:00', '2025-07-22 12:34:00'),
    ('Questi gatti meritano rispetto e cura. Grazie per la segnalazione!', 'sofia_esposito', 17, '2025-07-18 13:45:00', '2025-07-18 13:45:00'),
    ('Non dategli latte! Molti gatti adulti sono intolleranti al lattosio.', 'marco_romano', 17, '2025-07-19 14:56:00', '2025-07-19 14:56:00'),
    ('Il fatto che sia sterilizzato è un ottimo segnale — la colonia è gestita bene.', 'elena_conti', 17, '2025-07-20 15:07:00', '2025-07-20 15:07:00'),
    ('Condivido! Più gente sa di queste colonie, meglio è per tutti.', 'andrea_ricci', 17, '2025-07-21 16:18:00', '2025-07-21 16:18:00'),
    ('Ho aggiunto la posizione alla nostra mappa delle colonie feline della città.', 'mario_rossi', 17, '2025-07-22 17:29:00', '2025-07-22 17:29:00'),
    ('Che storia bellissima. Un gatto che ha trovato il suo posto nel mondo.', 'giulia_bianchi', 17, '2025-07-18 18:40:00', '2025-07-18 18:40:00'),
    ('L''ho visto anche io settimana scorsa! Sembrava in ottima forma.', 'sofia_esposito', 18, '2025-08-19 10:00:00', '2025-08-19 10:00:00'),
    ('Zona monitorata dalla nostra associazione — grazie per la segnalazione aggiuntiva.', 'marco_romano', 18, '2025-08-20 11:11:00', '2025-08-20 11:11:00'),
    ('Che espressione seria! Sembra stia valutando se fidarsi o meno.', 'elena_conti', 18, '2025-08-21 12:22:00', '2025-08-21 12:22:00'),
    ('Portateci cibo secco di qualità — meglio per la salute rispetto agli avanzi.', 'andrea_ricci', 18, '2025-08-22 13:33:00', '2025-08-22 13:33:00'),
    ('Bellissimo esemplare. Il mantello è curatissimo per essere un randagio.', 'mario_rossi', 18, '2025-08-23 14:44:00', '2025-08-23 14:44:00'),
    ('Non toccate i cuccioli se la mamma è presente — potrebbe spaventarsi e abbandonarli.', 'giulia_bianchi', 18, '2025-08-19 15:55:00', '2025-08-19 15:55:00'),
    ('Segnalazione inoltrata alla ASL Veterinaria del distretto. Grazie!', 'luca_ferrari', 18, '2025-08-20 16:06:00', '2025-08-20 16:06:00'),
    ('Queste colonie sono protette dalla legge 281/91 — è illegale rimuoverle o maltrattarle.', 'sofia_esposito', 18, '2025-08-21 17:17:00', '2025-08-21 17:17:00'),
    ('Che begli occhi! I gatti tigrati hanno sempre qualcosa di speciale.', 'marco_romano', 18, '2025-08-22 18:28:00', '2025-08-22 18:28:00'),
    ('Ho lasciato una ciotola d''acqua fresca sotto il portico vicino — spero la trovi.', 'elena_conti', 18, '2025-08-23 19:39:00', '2025-08-23 19:39:00'),
    ('Post preziosissimo. Aggiornate se tornate in zona!', 'andrea_ricci', 18, '2025-08-19 20:50:00', '2025-08-19 20:50:00'),
    ('La sua routine sembra ben consolidata — segno che vive lì da tempo.', 'mario_rossi', 18, '2025-08-20 21:01:00', '2025-08-20 21:01:00'),
    ('Grazie per aver specificato le condizioni fisiche — è fondamentale per i volontari.', 'giulia_bianchi', 18, '2025-08-21 10:12:00', '2025-08-21 10:12:00'),
    ('Che bel randagio! Mi fa pensare ai gatti di Roma antica, discendenti di secoli.', 'luca_ferrari', 18, '2025-08-22 11:23:00', '2025-08-22 11:23:00'),
    ('Se volete adottarlo, il passaggio dal randagio alla casa richiede pazienza e tempo.', 'sofia_esposito', 18, '2025-08-23 12:34:00', '2025-08-23 12:34:00'),
    ('Condivido nella pagina della nostra associazione — speriamo trovi un referente fisso!', 'marco_romano', 18, '2025-08-19 13:45:00', '2025-08-19 13:45:00'),
    ('Questi avvistamenti mi fanno sempre venire voglia di uscire a fare volontariato.', 'elena_conti', 18, '2025-08-20 14:56:00', '2025-08-20 14:56:00'),
    ('Complimenti per la foto — cattura perfettamente il suo carattere.', 'andrea_ricci', 18, '2025-08-21 15:07:00', '2025-08-21 15:07:00'),
    ('Ho incontrato anche io un gatto simile nello stesso quartiere — forse è lo stesso?', 'mario_rossi', 18, '2025-08-22 16:18:00', '2025-08-22 16:18:00'),
    ('Grazie per la segnalazione con coordinate precise — utilissime per la mappa.', 'giulia_bianchi', 18, '2025-08-23 17:29:00', '2025-08-23 17:29:00'),
    ('Che storia! Un gatto libero che ha trovato il suo territorio.', 'luca_ferrari', 18, '2025-08-19 18:40:00', '2025-08-19 18:40:00'),
    ('Segnalazione aggiunta al registro della colonia. Grazie!', 'sofia_esposito', 18, '2025-08-20 19:51:00', '2025-08-20 19:51:00'),
    ('L''ho visto anche io settimana scorsa! Sembrava in ottima forma.', 'marco_romano', 18, '2025-08-21 20:02:00', '2025-08-21 20:02:00'),
    ('Zona monitorata dalla nostra associazione — grazie per la segnalazione aggiuntiva.', 'elena_conti', 18, '2025-08-22 21:13:00', '2025-08-22 21:13:00'),
    ('Dolcissimo! Spero che qualcuno lo segua con regolarità.', 'marco_romano', 19, '2025-09-20 10:00:00', '2025-09-20 10:00:00'),
    ('È utile sapere se ha la tacca sull''orecchio — indicherebbe già la sterilizzazione TNR.', 'elena_conti', 19, '2025-09-21 11:11:00', '2025-09-21 11:11:00'),
    ('Zona nota alla nostra associazione. Manterremo l''occhio aperto.', 'andrea_ricci', 19, '2025-09-22 12:22:00', '2025-09-22 12:22:00'),
    ('Che eleganza nei movimenti! I gatti hanno una grazia innata.', 'mario_rossi', 19, '2025-09-23 13:33:00', '2025-09-23 13:33:00'),
    ('Non avvicinatevi troppo se è diffidente — il rispetto è la base.', 'giulia_bianchi', 19, '2025-09-24 14:44:00', '2025-09-24 14:44:00'),
    ('La sua condizione sembra buona — qualcuno si prende cura di lui.', 'luca_ferrari', 19, '2025-09-20 15:55:00', '2025-09-20 15:55:00'),
    ('Aggiungo questa posizione alla app di mappatura delle colonie feline. Grazie!', 'sofia_esposito', 19, '2025-09-21 16:06:00', '2025-09-21 16:06:00'),
    ('Bellissima segnalazione! Questi post fanno la differenza per il benessere animale.', 'marco_romano', 19, '2025-09-22 17:17:00', '2025-09-22 17:17:00'),
    ('Attenzione alle macchine in quella zona — è una strada trafficata.', 'elena_conti', 19, '2025-09-23 18:28:00', '2025-09-23 18:28:00'),
    ('Chi vive nei paraggi potrebbe tenerlo d''occhio? Ci servirebbe un referente.', 'andrea_ricci', 19, '2025-09-24 19:39:00', '2025-09-24 19:39:00'),
    ('Il gatto ha capito tutto della vita: mangiare, dormire, esplorare. Noi no.', 'mario_rossi', 19, '2025-09-20 20:50:00', '2025-09-20 20:50:00'),
    ('Condiviso nella pagina del comune — speriamo in un casetta/rifugio per l''inverno.', 'giulia_bianchi', 19, '2025-09-21 21:01:00', '2025-09-21 21:01:00'),
    ('Questi gatti sono la vera anima dei quartieri storici italiani.', 'luca_ferrari', 19, '2025-09-22 10:12:00', '2025-09-22 10:12:00'),
    ('Grazie per la precisione della descrizione — ci aiuta a identificare i soggetti.', 'sofia_esposito', 19, '2025-09-23 11:23:00', '2025-09-23 11:23:00'),
    ('Lo stesso gatto è stato avvistato anche in Via X la settimana scorsa.', 'marco_romano', 19, '2025-09-24 12:34:00', '2025-09-24 12:34:00'),
    ('Un consiglio: il cibo umido in estate va rimosso dopo 30 minuti per evitare batteri.', 'elena_conti', 19, '2025-09-20 13:45:00', '2025-09-20 13:45:00'),
    ('Post fantastico! Continua a segnalare, queste informazioni sono oro per noi volontari.', 'andrea_ricci', 19, '2025-09-21 14:56:00', '2025-09-21 14:56:00'),
    ('Che personalità! Si vede subito chi comanda da quelle parti.', 'mario_rossi', 19, '2025-09-22 15:07:00', '2025-09-22 15:07:00'),
    ('Speriamo che qualcuno possa dargli una sistemazione per l''inverno.', 'giulia_bianchi', 19, '2025-09-23 16:18:00', '2025-09-23 16:18:00'),
    ('Bellissimo avvistamento — e ottima la descrizione delle condizioni fisiche.', 'luca_ferrari', 19, '2025-09-24 17:29:00', '2025-09-24 17:29:00'),
    ('Dolcissimo! Spero che qualcuno lo segua con regolarità.', 'sofia_esposito', 19, '2025-09-20 18:40:00', '2025-09-20 18:40:00'),
    ('È utile sapere se ha la tacca sull''orecchio — indicherebbe già la sterilizzazione TNR.', 'marco_romano', 19, '2025-09-21 19:51:00', '2025-09-21 19:51:00'),
    ('Grazie! L''avevamo perso di vista da qualche settimana, ottimo sapere che sta bene.', 'elena_conti', 20, '2025-10-21 10:00:00', '2025-10-21 10:00:00'),
    ('È quello che chiamiamo gatto ''semi-addomesticato'': né randagio né domestico, nel mezzo.', 'andrea_ricci', 20, '2025-10-22 11:11:00', '2025-10-22 11:11:00'),
    ('Che bello! Queste segnalazioni tengono viva l''attenzione sui gatti liberi.', 'mario_rossi', 20, '2025-10-23 12:22:00', '2025-10-23 12:22:00'),
    ('Ho portato del cibo ieri sera — era già lì ad aspettarmi. Forse ci vede abituali!', 'giulia_bianchi', 20, '2025-10-24 13:33:00', '2025-10-24 13:33:00'),
    ('La diffidenza dei randagi è una forma di intelligenza, non cattiveria.', 'luca_ferrari', 20, '2025-10-25 14:44:00', '2025-10-25 14:44:00'),
    ('Bravissimo a fotografarlo senza disturbarlo — si vede che sei esperto.', 'sofia_esposito', 20, '2025-10-21 15:55:00', '2025-10-21 15:55:00'),
    ('Zona monitorata mensilmente dalla nostra unità veterinaria mobile.', 'marco_romano', 20, '2025-10-22 16:06:00', '2025-10-22 16:06:00'),
    ('Che contemplazione! Sembra stia risolvendo i problemi del mondo.', 'elena_conti', 20, '2025-10-23 17:17:00', '2025-10-23 17:17:00'),
    ('Il pelo lucido indica una dieta adeguata — qualcuno se ne prende cura.', 'andrea_ricci', 20, '2025-10-24 18:28:00', '2025-10-24 18:28:00'),
    ('Non spostate mai i gatti da una colonia a un''altra senza supporto professionale.', 'mario_rossi', 20, '2025-10-25 19:39:00', '2025-10-25 19:39:00'),
    ('Avvistamento confermato da altri due utenti questa settimana — zona molto attiva.', 'giulia_bianchi', 20, '2025-10-21 20:50:00', '2025-10-21 20:50:00'),
    ('Che tenerezza! Mi ha fatto venire voglia di abbracciarlo (ma non l''avrei fatto, tranquilli).', 'luca_ferrari', 20, '2025-10-22 21:01:00', '2025-10-22 21:01:00'),
    ('Grazie per l''avvistamento dettagliato — aggiornate se notate cambiamenti.', 'sofia_esposito', 20, '2025-10-23 10:12:00', '2025-10-23 10:12:00'),
    ('Un randagio ben integrato nel territorio è il risultato del lavoro di molti volontari.', 'marco_romano', 20, '2025-10-24 11:23:00', '2025-10-24 11:23:00'),
    ('Zona con alta densità felina — stiamo lavorando per aumentare i punti di alimentazione.', 'elena_conti', 20, '2025-10-25 12:34:00', '2025-10-25 12:34:00'),
    ('Il gatto ha trovato il suo posto nel mondo. Rispettiamolo.', 'andrea_ricci', 20, '2025-10-21 13:45:00', '2025-10-21 13:45:00'),
    ('Adoro questi post! Mi ricordano perché faccio volontariato ogni settimana.', 'mario_rossi', 20, '2025-10-22 14:56:00', '2025-10-22 14:56:00'),
    ('Che grazia! Anche i randagi hanno la loro dignità, anzi — soprattutto loro.', 'giulia_bianchi', 20, '2025-10-23 15:07:00', '2025-10-23 15:07:00'),
    ('Condiviso! Più occhi ci sono su questi gatti, meglio è per la loro sicurezza.', 'luca_ferrari', 20, '2025-10-24 16:18:00', '2025-10-24 16:18:00'),
    ('Grazie per la segnalazione e per il rispetto dimostrato verso l''animale.', 'sofia_esposito', 20, '2025-10-25 17:29:00', '2025-10-25 17:29:00'),
    ('Che bel micio! Lo conosco, passa spesso da questa zona.', 'andrea_ricci', 21, '2025-01-22 10:00:00', '2025-01-22 10:00:00'),
    ('Ho lasciato delle crocchette vicino alla fontana ieri sera, speriamo le abbia trovate.', 'mario_rossi', 21, '2025-01-23 11:11:00', '2025-01-23 11:11:00'),
    ('Bellissimo avvistamento! Anche io l''ho visto qualche giorno fa, sembra in buona salute.', 'giulia_bianchi', 21, '2025-01-24 12:22:00', '2025-01-24 12:22:00'),
    ('Grazie per la segnalazione! I gatti di questa zona sono monitorati dalla nostra associazione.', 'luca_ferrari', 21, '2025-01-25 13:33:00', '2025-01-25 13:33:00'),
    ('È importante non spostare i gatti randagi dalla loro colonia — si disorientano molto.', 'sofia_esposito', 21, '2025-01-26 14:44:00', '2025-01-26 14:44:00'),
    ('Che occhi meravigliosi! Ha un carattere tutto suo quel micio.', 'marco_romano', 21, '2025-01-22 15:55:00', '2025-01-22 15:55:00'),
    ('Lo chiamo ''Il Sindaco'' perché sembra il padrone del quartiere.', 'elena_conti', 21, '2025-01-23 16:06:00', '2025-01-23 16:06:00'),
    ('Attenti a non dargli cibo troppo salato o condito — fa male ai reni dei gatti.', 'andrea_ricci', 21, '2025-01-24 17:17:00', '2025-01-24 17:17:00'),
    ('Ho segnalato la presenza al referente di colonia della zona, grazie del post!', 'mario_rossi', 21, '2025-01-25 18:28:00', '2025-01-25 18:28:00'),
    ('Un consiglio: se volete avvicinarvi, abbassatevi lentamente e aspettate che venga lui da voi.', 'giulia_bianchi', 21, '2025-01-26 19:39:00', '2025-01-26 19:39:00'),
    ('Bello! È da mesi che non lo vedevo, pensavo si fosse spostato.', 'luca_ferrari', 21, '2025-01-22 20:50:00', '2025-01-22 20:50:00'),
    ('Fantastico avvistamento. Questi gatti fanno parte del patrimonio culturale della città.', 'sofia_esposito', 21, '2025-01-23 21:01:00', '2025-01-23 21:01:00'),
    ('Ha la tacca sull''orecchio? Sarebbe importante saperlo per capire se è già sterilizzato.', 'marco_romano', 21, '2025-01-24 10:12:00', '2025-01-24 10:12:00'),
    ('Grazie per condividere! Più segnalazioni abbiamo, meglio possiamo monitorare le colonie.', 'elena_conti', 21, '2025-01-25 11:23:00', '2025-01-25 11:23:00'),
    ('Che bella foto! Si vede che era a suo agio con te.', 'andrea_ricci', 21, '2025-01-26 12:34:00', '2025-01-26 12:34:00'),
    ('I gatti come lui ci insegnano tutti i giorni il significato della libertà.', 'mario_rossi', 21, '2025-01-22 13:45:00', '2025-01-22 13:45:00'),
    ('Ho passato mezz''ora a guardarlo camminare sul marciapiede. Ipnotico.', 'giulia_bianchi', 21, '2025-01-23 14:56:00', '2025-01-23 14:56:00'),
    ('È fondamentale non spostare il cibo dalla posizione abitudinaria — i gatti sono molto dipendenti dalla routine.', 'luca_ferrari', 21, '2025-01-24 15:07:00', '2025-01-24 15:07:00'),
    ('Avvistamento confermato! Anche il mio vicino me ne aveva parlato.', 'sofia_esposito', 21, '2025-01-25 16:18:00', '2025-01-25 16:18:00'),
    ('Queste segnalazioni sono preziosissime per la mappa felina della città.', 'marco_romano', 21, '2025-01-26 17:29:00', '2025-01-26 17:29:00'),
    ('Che personaggio! Si vede subito che ha carattere da vendere.', 'elena_conti', 21, '2025-01-22 18:40:00', '2025-01-22 18:40:00'),
    ('Grazie per la descrizione dettagliata delle condizioni — utilissima per i volontari.', 'andrea_ricci', 21, '2025-01-23 19:51:00', '2025-01-23 19:51:00'),
    ('Che bel micio! Lo conosco, passa spesso da questa zona.', 'mario_rossi', 21, '2025-01-24 20:02:00', '2025-01-24 20:02:00'),
    ('Ho lasciato delle crocchette vicino alla fontana ieri sera, speriamo le abbia trovate.', 'giulia_bianchi', 21, '2025-01-25 21:13:00', '2025-01-25 21:13:00'),
    ('Bellissimo avvistamento! Anche io l''ho visto qualche giorno fa, sembra in buona salute.', 'luca_ferrari', 21, '2025-01-26 10:24:00', '2025-01-26 10:24:00'),
    ('Grazie per la segnalazione! I gatti di questa zona sono monitorati dalla nostra associazione.', 'sofia_esposito', 21, '2025-01-22 11:35:00', '2025-01-22 11:35:00'),
    ('Mamma mia quanto è bello! Quel pelo è pazzesco.', 'mario_rossi', 22, '2025-02-23 10:00:00', '2025-02-23 10:00:00'),
    ('L''ho avvistato anch''io stamattina! Stava dormendo al sole tranquillissimo.', 'giulia_bianchi', 22, '2025-02-24 11:11:00', '2025-02-24 11:11:00'),
    ('Se qualcuno è di zona e può portare cibo regolarmente, sarebbe utilissimo.', 'luca_ferrari', 22, '2025-02-25 12:22:00', '2025-02-25 12:22:00'),
    ('Attenzione: i gatti randagi non vanno mai raccolti senza prima consultare un''associazione.', 'sofia_esposito', 22, '2025-02-26 13:33:00', '2025-02-26 13:33:00'),
    ('Ho l''impressione che sia lo stesso gatto che avevo segnalato tre mesi fa più a nord.', 'marco_romano', 22, '2025-02-27 14:44:00', '2025-02-27 14:44:00'),
    ('Che carattere! Si vede da come posa che è abituato all''attenzione.', 'elena_conti', 22, '2025-02-23 15:55:00', '2025-02-23 15:55:00'),
    ('Meraviglioso. Questi randagi ci ricordano quanto siano resistenti e adattabili i gatti.', 'andrea_ricci', 22, '2025-02-24 16:06:00', '2025-02-24 16:06:00'),
    ('Il metodo TNR (Trap-Neuter-Return) è l''unico modo etico per gestire le colonie.', 'mario_rossi', 22, '2025-02-25 17:17:00', '2025-02-25 17:17:00'),
    ('Ho contattato il municipio per segnalare il punto — servirebbero più rifugi invernali.', 'giulia_bianchi', 22, '2025-02-26 18:28:00', '2025-02-26 18:28:00'),
    ('È bellissimo sapere che c''è chi monitora questi animali. Grazie a tutti i volontari!', 'luca_ferrari', 22, '2025-02-27 19:39:00', '2025-02-27 19:39:00'),
    ('Una nota: l''acqua è importante tanto quanto il cibo, specialmente d''estate.', 'sofia_esposito', 22, '2025-02-23 20:50:00', '2025-02-23 20:50:00'),
    ('Adoro questi post! Tengono viva l''attenzione su una realtà spesso ignorata.', 'marco_romano', 22, '2025-02-24 21:01:00', '2025-02-24 21:01:00'),
    ('Avevo paura che si fosse allontanato. Sapere che sta bene mi rincuora.', 'elena_conti', 22, '2025-02-25 10:12:00', '2025-02-25 10:12:00'),
    ('La sua diffidenza è normale — ci vogliono settimane per guadagnare la fiducia di un randagio.', 'andrea_ricci', 22, '2025-02-26 11:23:00', '2025-02-26 11:23:00'),
    ('Chi abita in zona potrebbe tenerlo d''occhio? Sarebbe preziosissimo.', 'mario_rossi', 22, '2025-02-27 12:34:00', '2025-02-27 12:34:00'),
    ('Questi gatti meritano rispetto e cura. Grazie per la segnalazione!', 'giulia_bianchi', 22, '2025-02-23 13:45:00', '2025-02-23 13:45:00'),
    ('Non dategli latte! Molti gatti adulti sono intolleranti al lattosio.', 'luca_ferrari', 22, '2025-02-24 14:56:00', '2025-02-24 14:56:00'),
    ('Il fatto che sia sterilizzato è un ottimo segnale — la colonia è gestita bene.', 'sofia_esposito', 22, '2025-02-25 15:07:00', '2025-02-25 15:07:00'),
    ('Condivido! Più gente sa di queste colonie, meglio è per tutti.', 'marco_romano', 22, '2025-02-26 16:18:00', '2025-02-26 16:18:00'),
    ('Ho aggiunto la posizione alla nostra mappa delle colonie feline della città.', 'elena_conti', 22, '2025-02-27 17:29:00', '2025-02-27 17:29:00'),
    ('Che storia bellissima. Un gatto che ha trovato il suo posto nel mondo.', 'andrea_ricci', 22, '2025-02-23 18:40:00', '2025-02-23 18:40:00'),
    ('Mamma mia quanto è bello! Quel pelo è pazzesco.', 'mario_rossi', 22, '2025-02-24 19:51:00', '2025-02-24 19:51:00'),
    ('L''ho avvistato anch''io stamattina! Stava dormendo al sole tranquillissimo.', 'giulia_bianchi', 22, '2025-02-25 20:02:00', '2025-02-25 20:02:00'),
    ('Se qualcuno è di zona e può portare cibo regolarmente, sarebbe utilissimo.', 'luca_ferrari', 22, '2025-02-26 21:13:00', '2025-02-26 21:13:00'),
    ('Attenzione: i gatti randagi non vanno mai raccolti senza prima consultare un''associazione.', 'sofia_esposito', 22, '2025-02-27 10:24:00', '2025-02-27 10:24:00'),
    ('Ho l''impressione che sia lo stesso gatto che avevo segnalato tre mesi fa più a nord.', 'marco_romano', 22, '2025-02-23 11:35:00', '2025-02-23 11:35:00'),
    ('Che carattere! Si vede da come posa che è abituato all''attenzione.', 'elena_conti', 22, '2025-02-24 12:46:00', '2025-02-24 12:46:00'),
    ('Meraviglioso. Questi randagi ci ricordano quanto siano resistenti e adattabili i gatti.', 'andrea_ricci', 22, '2025-02-25 13:57:00', '2025-02-25 13:57:00'),
    ('L''ho visto anche io settimana scorsa! Sembrava in ottima forma.', 'giulia_bianchi', 23, '2025-03-24 10:00:00', '2025-03-24 10:00:00'),
    ('Zona monitorata dalla nostra associazione — grazie per la segnalazione aggiuntiva.', 'luca_ferrari', 23, '2025-03-25 11:11:00', '2025-03-25 11:11:00'),
    ('Che espressione seria! Sembra stia valutando se fidarsi o meno.', 'sofia_esposito', 23, '2025-03-26 12:22:00', '2025-03-26 12:22:00'),
    ('Portateci cibo secco di qualità — meglio per la salute rispetto agli avanzi.', 'marco_romano', 23, '2025-03-27 13:33:00', '2025-03-27 13:33:00'),
    ('Bellissimo esemplare. Il mantello è curatissimo per essere un randagio.', 'elena_conti', 23, '2025-03-28 14:44:00', '2025-03-28 14:44:00'),
    ('Non toccate i cuccioli se la mamma è presente — potrebbe spaventarsi e abbandonarli.', 'andrea_ricci', 23, '2025-03-24 15:55:00', '2025-03-24 15:55:00'),
    ('Segnalazione inoltrata alla ASL Veterinaria del distretto. Grazie!', 'mario_rossi', 23, '2025-03-25 16:06:00', '2025-03-25 16:06:00'),
    ('Queste colonie sono protette dalla legge 281/91 — è illegale rimuoverle o maltrattarle.', 'giulia_bianchi', 23, '2025-03-26 17:17:00', '2025-03-26 17:17:00'),
    ('Che begli occhi! I gatti tigrati hanno sempre qualcosa di speciale.', 'luca_ferrari', 23, '2025-03-27 18:28:00', '2025-03-27 18:28:00'),
    ('Ho lasciato una ciotola d''acqua fresca sotto il portico vicino — spero la trovi.', 'sofia_esposito', 23, '2025-03-28 19:39:00', '2025-03-28 19:39:00'),
    ('Post preziosissimo. Aggiornate se tornate in zona!', 'marco_romano', 23, '2025-03-24 20:50:00', '2025-03-24 20:50:00'),
    ('La sua routine sembra ben consolidata — segno che vive lì da tempo.', 'elena_conti', 23, '2025-03-25 21:01:00', '2025-03-25 21:01:00'),
    ('Grazie per aver specificato le condizioni fisiche — è fondamentale per i volontari.', 'andrea_ricci', 23, '2025-03-26 10:12:00', '2025-03-26 10:12:00'),
    ('Che bel randagio! Mi fa pensare ai gatti di Roma antica, discendenti di secoli.', 'mario_rossi', 23, '2025-03-27 11:23:00', '2025-03-27 11:23:00'),
    ('Se volete adottarlo, il passaggio dal randagio alla casa richiede pazienza e tempo.', 'giulia_bianchi', 23, '2025-03-28 12:34:00', '2025-03-28 12:34:00'),
    ('Dolcissimo! Spero che qualcuno lo segua con regolarità.', 'luca_ferrari', 24, '2025-04-25 10:00:00', '2025-04-25 10:00:00'),
    ('È utile sapere se ha la tacca sull''orecchio — indicherebbe già la sterilizzazione TNR.', 'sofia_esposito', 24, '2025-04-26 11:11:00', '2025-04-26 11:11:00'),
    ('Zona nota alla nostra associazione. Manterremo l''occhio aperto.', 'marco_romano', 24, '2025-04-27 12:22:00', '2025-04-27 12:22:00'),
    ('Che eleganza nei movimenti! I gatti hanno una grazia innata.', 'elena_conti', 24, '2025-04-28 13:33:00', '2025-04-28 13:33:00'),
    ('Non avvicinatevi troppo se è diffidente — il rispetto è la base.', 'andrea_ricci', 24, '2025-04-28 14:44:00', '2025-04-28 14:44:00'),
    ('La sua condizione sembra buona — qualcuno si prende cura di lui.', 'mario_rossi', 24, '2025-04-25 15:55:00', '2025-04-25 15:55:00'),
    ('Aggiungo questa posizione alla app di mappatura delle colonie feline. Grazie!', 'giulia_bianchi', 24, '2025-04-26 16:06:00', '2025-04-26 16:06:00'),
    ('Bellissima segnalazione! Questi post fanno la differenza per il benessere animale.', 'luca_ferrari', 24, '2025-04-27 17:17:00', '2025-04-27 17:17:00'),
    ('Attenzione alle macchine in quella zona — è una strada trafficata.', 'sofia_esposito', 24, '2025-04-28 18:28:00', '2025-04-28 18:28:00'),
    ('Chi vive nei paraggi potrebbe tenerlo d''occhio? Ci servirebbe un referente.', 'marco_romano', 24, '2025-04-28 19:39:00', '2025-04-28 19:39:00'),
    ('Il gatto ha capito tutto della vita: mangiare, dormire, esplorare. Noi no.', 'elena_conti', 24, '2025-04-25 20:50:00', '2025-04-25 20:50:00'),
    ('Condiviso nella pagina del comune — speriamo in un casetta/rifugio per l''inverno.', 'andrea_ricci', 24, '2025-04-26 21:01:00', '2025-04-26 21:01:00'),
    ('Questi gatti sono la vera anima dei quartieri storici italiani.', 'mario_rossi', 24, '2025-04-27 10:12:00', '2025-04-27 10:12:00'),
    ('Grazie per la precisione della descrizione — ci aiuta a identificare i soggetti.', 'giulia_bianchi', 24, '2025-04-28 11:23:00', '2025-04-28 11:23:00'),
    ('Lo stesso gatto è stato avvistato anche in Via X la settimana scorsa.', 'luca_ferrari', 24, '2025-04-28 12:34:00', '2025-04-28 12:34:00'),
    ('Un consiglio: il cibo umido in estate va rimosso dopo 30 minuti per evitare batteri.', 'sofia_esposito', 24, '2025-04-25 13:45:00', '2025-04-25 13:45:00'),
    ('Post fantastico! Continua a segnalare, queste informazioni sono oro per noi volontari.', 'marco_romano', 24, '2025-04-26 14:56:00', '2025-04-26 14:56:00'),
    ('Che personalità! Si vede subito chi comanda da quelle parti.', 'elena_conti', 24, '2025-04-27 15:07:00', '2025-04-27 15:07:00'),
    ('Speriamo che qualcuno possa dargli una sistemazione per l''inverno.', 'andrea_ricci', 24, '2025-04-28 16:18:00', '2025-04-28 16:18:00'),
    ('Bellissimo avvistamento — e ottima la descrizione delle condizioni fisiche.', 'mario_rossi', 24, '2025-04-28 17:29:00', '2025-04-28 17:29:00'),
    ('Dolcissimo! Spero che qualcuno lo segua con regolarità.', 'giulia_bianchi', 24, '2025-04-25 18:40:00', '2025-04-25 18:40:00'),
    ('È utile sapere se ha la tacca sull''orecchio — indicherebbe già la sterilizzazione TNR.', 'luca_ferrari', 24, '2025-04-26 19:51:00', '2025-04-26 19:51:00'),
    ('Zona nota alla nostra associazione. Manterremo l''occhio aperto.', 'sofia_esposito', 24, '2025-04-27 20:02:00', '2025-04-27 20:02:00'),
    ('Grazie! L''avevamo perso di vista da qualche settimana, ottimo sapere che sta bene.', 'sofia_esposito', 25, '2025-05-26 10:00:00', '2025-05-26 10:00:00'),
    ('È quello che chiamiamo gatto ''semi-addomesticato'': né randagio né domestico, nel mezzo.', 'marco_romano', 25, '2025-05-27 11:11:00', '2025-05-27 11:11:00'),
    ('Che bello! Queste segnalazioni tengono viva l''attenzione sui gatti liberi.', 'elena_conti', 25, '2025-05-28 12:22:00', '2025-05-28 12:22:00'),
    ('Ho portato del cibo ieri sera — era già lì ad aspettarmi. Forse ci vede abituali!', 'andrea_ricci', 25, '2025-05-28 13:33:00', '2025-05-28 13:33:00'),
    ('La diffidenza dei randagi è una forma di intelligenza, non cattiveria.', 'mario_rossi', 25, '2025-05-28 14:44:00', '2025-05-28 14:44:00'),
    ('Bravissimo a fotografarlo senza disturbarlo — si vede che sei esperto.', 'giulia_bianchi', 25, '2025-05-26 15:55:00', '2025-05-26 15:55:00'),
    ('Zona monitorata mensilmente dalla nostra unità veterinaria mobile.', 'luca_ferrari', 25, '2025-05-27 16:06:00', '2025-05-27 16:06:00'),
    ('Che contemplazione! Sembra stia risolvendo i problemi del mondo.', 'sofia_esposito', 25, '2025-05-28 17:17:00', '2025-05-28 17:17:00'),
    ('Il pelo lucido indica una dieta adeguata — qualcuno se ne prende cura.', 'marco_romano', 25, '2025-05-28 18:28:00', '2025-05-28 18:28:00'),
    ('Non spostate mai i gatti da una colonia a un''altra senza supporto professionale.', 'elena_conti', 25, '2025-05-28 19:39:00', '2025-05-28 19:39:00'),
    ('Avvistamento confermato da altri due utenti questa settimana — zona molto attiva.', 'andrea_ricci', 25, '2025-05-26 20:50:00', '2025-05-26 20:50:00'),
    ('Che tenerezza! Mi ha fatto venire voglia di abbracciarlo (ma non l''avrei fatto, tranquilli).', 'mario_rossi', 25, '2025-05-27 21:01:00', '2025-05-27 21:01:00'),
    ('Grazie per l''avvistamento dettagliato — aggiornate se notate cambiamenti.', 'giulia_bianchi', 25, '2025-05-28 10:12:00', '2025-05-28 10:12:00'),
    ('Un randagio ben integrato nel territorio è il risultato del lavoro di molti volontari.', 'luca_ferrari', 25, '2025-05-28 11:23:00', '2025-05-28 11:23:00'),
    ('Zona con alta densità felina — stiamo lavorando per aumentare i punti di alimentazione.', 'sofia_esposito', 25, '2025-05-28 12:34:00', '2025-05-28 12:34:00'),
    ('Il gatto ha trovato il suo posto nel mondo. Rispettiamolo.', 'marco_romano', 25, '2025-05-26 13:45:00', '2025-05-26 13:45:00'),
    ('Adoro questi post! Mi ricordano perché faccio volontariato ogni settimana.', 'elena_conti', 25, '2025-05-27 14:56:00', '2025-05-27 14:56:00'),
    ('Che grazia! Anche i randagi hanno la loro dignità, anzi — soprattutto loro.', 'andrea_ricci', 25, '2025-05-28 15:07:00', '2025-05-28 15:07:00'),
    ('Condiviso! Più occhi ci sono su questi gatti, meglio è per la loro sicurezza.', 'mario_rossi', 25, '2025-05-28 16:18:00', '2025-05-28 16:18:00'),
    ('Grazie per la segnalazione e per il rispetto dimostrato verso l''animale.', 'giulia_bianchi', 25, '2025-05-28 17:29:00', '2025-05-28 17:29:00'),
    ('Che bel micio! Lo conosco, passa spesso da questa zona.', 'marco_romano', 26, '2025-06-27 10:00:00', '2025-06-27 10:00:00'),
    ('Ho lasciato delle crocchette vicino alla fontana ieri sera, speriamo le abbia trovate.', 'elena_conti', 26, '2025-06-28 11:11:00', '2025-06-28 11:11:00'),
    ('Bellissimo avvistamento! Anche io l''ho visto qualche giorno fa, sembra in buona salute.', 'andrea_ricci', 26, '2025-06-28 12:22:00', '2025-06-28 12:22:00'),
    ('Grazie per la segnalazione! I gatti di questa zona sono monitorati dalla nostra associazione.', 'mario_rossi', 26, '2025-06-28 13:33:00', '2025-06-28 13:33:00'),
    ('È importante non spostare i gatti randagi dalla loro colonia — si disorientano molto.', 'giulia_bianchi', 26, '2025-06-28 14:44:00', '2025-06-28 14:44:00'),
    ('Che occhi meravigliosi! Ha un carattere tutto suo quel micio.', 'luca_ferrari', 26, '2025-06-27 15:55:00', '2025-06-27 15:55:00'),
    ('Lo chiamo ''Il Sindaco'' perché sembra il padrone del quartiere.', 'sofia_esposito', 26, '2025-06-28 16:06:00', '2025-06-28 16:06:00'),
    ('Attenti a non dargli cibo troppo salato o condito — fa male ai reni dei gatti.', 'marco_romano', 26, '2025-06-28 17:17:00', '2025-06-28 17:17:00'),
    ('Ho segnalato la presenza al referente di colonia della zona, grazie del post!', 'elena_conti', 26, '2025-06-28 18:28:00', '2025-06-28 18:28:00'),
    ('Un consiglio: se volete avvicinarvi, abbassatevi lentamente e aspettate che venga lui da voi.', 'andrea_ricci', 26, '2025-06-28 19:39:00', '2025-06-28 19:39:00'),
    ('Bello! È da mesi che non lo vedevo, pensavo si fosse spostato.', 'mario_rossi', 26, '2025-06-27 20:50:00', '2025-06-27 20:50:00'),
    ('Fantastico avvistamento. Questi gatti fanno parte del patrimonio culturale della città.', 'giulia_bianchi', 26, '2025-06-28 21:01:00', '2025-06-28 21:01:00'),
    ('Ha la tacca sull''orecchio? Sarebbe importante saperlo per capire se è già sterilizzato.', 'luca_ferrari', 26, '2025-06-28 10:12:00', '2025-06-28 10:12:00'),
    ('Grazie per condividere! Più segnalazioni abbiamo, meglio possiamo monitorare le colonie.', 'sofia_esposito', 26, '2025-06-28 11:23:00', '2025-06-28 11:23:00'),
    ('Che bella foto! Si vede che era a suo agio con te.', 'marco_romano', 26, '2025-06-28 12:34:00', '2025-06-28 12:34:00'),
    ('I gatti come lui ci insegnano tutti i giorni il significato della libertà.', 'elena_conti', 26, '2025-06-27 13:45:00', '2025-06-27 13:45:00'),
    ('Ho passato mezz''ora a guardarlo camminare sul marciapiede. Ipnotico.', 'andrea_ricci', 26, '2025-06-28 14:56:00', '2025-06-28 14:56:00'),
    ('È fondamentale non spostare il cibo dalla posizione abitudinaria — i gatti sono molto dipendenti dalla routine.', 'mario_rossi', 26, '2025-06-28 15:07:00', '2025-06-28 15:07:00'),
    ('Avvistamento confermato! Anche il mio vicino me ne aveva parlato.', 'giulia_bianchi', 26, '2025-06-28 16:18:00', '2025-06-28 16:18:00'),
    ('Queste segnalazioni sono preziosissime per la mappa felina della città.', 'luca_ferrari', 26, '2025-06-28 17:29:00', '2025-06-28 17:29:00'),
    ('Che personaggio! Si vede subito che ha carattere da vendere.', 'sofia_esposito', 26, '2025-06-27 18:40:00', '2025-06-27 18:40:00'),
    ('Grazie per la descrizione dettagliata delle condizioni — utilissima per i volontari.', 'marco_romano', 26, '2025-06-28 19:51:00', '2025-06-28 19:51:00'),
    ('Mamma mia quanto è bello! Quel pelo è pazzesco.', 'elena_conti', 27, '2025-07-28 10:00:00', '2025-07-28 10:00:00'),
    ('L''ho avvistato anch''io stamattina! Stava dormendo al sole tranquillissimo.', 'andrea_ricci', 27, '2025-07-28 11:11:00', '2025-07-28 11:11:00'),
    ('Se qualcuno è di zona e può portare cibo regolarmente, sarebbe utilissimo.', 'mario_rossi', 27, '2025-07-28 12:22:00', '2025-07-28 12:22:00'),
    ('Attenzione: i gatti randagi non vanno mai raccolti senza prima consultare un''associazione.', 'giulia_bianchi', 27, '2025-07-28 13:33:00', '2025-07-28 13:33:00'),
    ('Ho l''impressione che sia lo stesso gatto che avevo segnalato tre mesi fa più a nord.', 'luca_ferrari', 27, '2025-07-28 14:44:00', '2025-07-28 14:44:00'),
    ('Che carattere! Si vede da come posa che è abituato all''attenzione.', 'sofia_esposito', 27, '2025-07-28 15:55:00', '2025-07-28 15:55:00'),
    ('Meraviglioso. Questi randagi ci ricordano quanto siano resistenti e adattabili i gatti.', 'marco_romano', 27, '2025-07-28 16:06:00', '2025-07-28 16:06:00'),
    ('Il metodo TNR (Trap-Neuter-Return) è l''unico modo etico per gestire le colonie.', 'elena_conti', 27, '2025-07-28 17:17:00', '2025-07-28 17:17:00'),
    ('Ho contattato il municipio per segnalare il punto — servirebbero più rifugi invernali.', 'andrea_ricci', 27, '2025-07-28 18:28:00', '2025-07-28 18:28:00'),
    ('È bellissimo sapere che c''è chi monitora questi animali. Grazie a tutti i volontari!', 'mario_rossi', 27, '2025-07-28 19:39:00', '2025-07-28 19:39:00'),
    ('Una nota: l''acqua è importante tanto quanto il cibo, specialmente d''estate.', 'giulia_bianchi', 27, '2025-07-28 20:50:00', '2025-07-28 20:50:00'),
    ('Adoro questi post! Tengono viva l''attenzione su una realtà spesso ignorata.', 'luca_ferrari', 27, '2025-07-28 21:01:00', '2025-07-28 21:01:00'),
    ('Avevo paura che si fosse allontanato. Sapere che sta bene mi rincuora.', 'sofia_esposito', 27, '2025-07-28 10:12:00', '2025-07-28 10:12:00'),
    ('La sua diffidenza è normale — ci vogliono settimane per guadagnare la fiducia di un randagio.', 'marco_romano', 27, '2025-07-28 11:23:00', '2025-07-28 11:23:00'),
    ('Chi abita in zona potrebbe tenerlo d''occhio? Sarebbe preziosissimo.', 'elena_conti', 27, '2025-07-28 12:34:00', '2025-07-28 12:34:00'),
    ('Questi gatti meritano rispetto e cura. Grazie per la segnalazione!', 'andrea_ricci', 27, '2025-07-28 13:45:00', '2025-07-28 13:45:00'),
    ('Non dategli latte! Molti gatti adulti sono intolleranti al lattosio.', 'mario_rossi', 27, '2025-07-28 14:56:00', '2025-07-28 14:56:00'),
    ('Il fatto che sia sterilizzato è un ottimo segnale — la colonia è gestita bene.', 'giulia_bianchi', 27, '2025-07-28 15:07:00', '2025-07-28 15:07:00'),
    ('Condivido! Più gente sa di queste colonie, meglio è per tutti.', 'luca_ferrari', 27, '2025-07-28 16:18:00', '2025-07-28 16:18:00'),
    ('Ho aggiunto la posizione alla nostra mappa delle colonie feline della città.', 'sofia_esposito', 27, '2025-07-28 17:29:00', '2025-07-28 17:29:00'),
    ('Che storia bellissima. Un gatto che ha trovato il suo posto nel mondo.', 'marco_romano', 27, '2025-07-28 18:40:00', '2025-07-28 18:40:00'),
    ('L''ho visto anche io settimana scorsa! Sembrava in ottima forma.', 'andrea_ricci', 28, '2025-08-02 10:00:00', '2025-08-02 10:00:00'),
    ('Zona monitorata dalla nostra associazione — grazie per la segnalazione aggiuntiva.', 'mario_rossi', 28, '2025-08-03 11:11:00', '2025-08-03 11:11:00'),
    ('Che espressione seria! Sembra stia valutando se fidarsi o meno.', 'giulia_bianchi', 28, '2025-08-04 12:22:00', '2025-08-04 12:22:00'),
    ('Portateci cibo secco di qualità — meglio per la salute rispetto agli avanzi.', 'luca_ferrari', 28, '2025-08-05 13:33:00', '2025-08-05 13:33:00'),
    ('Bellissimo esemplare. Il mantello è curatissimo per essere un randagio.', 'sofia_esposito', 28, '2025-08-06 14:44:00', '2025-08-06 14:44:00'),
    ('Non toccate i cuccioli se la mamma è presente — potrebbe spaventarsi e abbandonarli.', 'marco_romano', 28, '2025-08-02 15:55:00', '2025-08-02 15:55:00'),
    ('Segnalazione inoltrata alla ASL Veterinaria del distretto. Grazie!', 'elena_conti', 28, '2025-08-03 16:06:00', '2025-08-03 16:06:00'),
    ('Queste colonie sono protette dalla legge 281/91 — è illegale rimuoverle o maltrattarle.', 'andrea_ricci', 28, '2025-08-04 17:17:00', '2025-08-04 17:17:00'),
    ('Che begli occhi! I gatti tigrati hanno sempre qualcosa di speciale.', 'mario_rossi', 28, '2025-08-05 18:28:00', '2025-08-05 18:28:00'),
    ('Ho lasciato una ciotola d''acqua fresca sotto il portico vicino — spero la trovi.', 'giulia_bianchi', 28, '2025-08-06 19:39:00', '2025-08-06 19:39:00'),
    ('Post preziosissimo. Aggiornate se tornate in zona!', 'luca_ferrari', 28, '2025-08-02 20:50:00', '2025-08-02 20:50:00'),
    ('La sua routine sembra ben consolidata — segno che vive lì da tempo.', 'sofia_esposito', 28, '2025-08-03 21:01:00', '2025-08-03 21:01:00'),
    ('Grazie per aver specificato le condizioni fisiche — è fondamentale per i volontari.', 'marco_romano', 28, '2025-08-04 10:12:00', '2025-08-04 10:12:00'),
    ('Che bel randagio! Mi fa pensare ai gatti di Roma antica, discendenti di secoli.', 'elena_conti', 28, '2025-08-05 11:23:00', '2025-08-05 11:23:00'),
    ('Se volete adottarlo, il passaggio dal randagio alla casa richiede pazienza e tempo.', 'andrea_ricci', 28, '2025-08-06 12:34:00', '2025-08-06 12:34:00'),
    ('Condivido nella pagina della nostra associazione — speriamo trovi un referente fisso!', 'mario_rossi', 28, '2025-08-02 13:45:00', '2025-08-02 13:45:00'),
    ('Questi avvistamenti mi fanno sempre venire voglia di uscire a fare volontariato.', 'giulia_bianchi', 28, '2025-08-03 14:56:00', '2025-08-03 14:56:00'),
    ('Complimenti per la foto — cattura perfettamente il suo carattere.', 'luca_ferrari', 28, '2025-08-04 15:07:00', '2025-08-04 15:07:00'),
    ('Ho incontrato anche io un gatto simile nello stesso quartiere — forse è lo stesso?', 'sofia_esposito', 28, '2025-08-05 16:18:00', '2025-08-05 16:18:00'),
    ('Grazie per la segnalazione con coordinate precise — utilissime per la mappa.', 'marco_romano', 28, '2025-08-06 17:29:00', '2025-08-06 17:29:00'),
    ('Che storia! Un gatto libero che ha trovato il suo territorio.', 'elena_conti', 28, '2025-08-02 18:40:00', '2025-08-02 18:40:00'),
    ('Segnalazione aggiunta al registro della colonia. Grazie!', 'andrea_ricci', 28, '2025-08-03 19:51:00', '2025-08-03 19:51:00'),
    ('L''ho visto anche io settimana scorsa! Sembrava in ottima forma.', 'mario_rossi', 28, '2025-08-04 20:02:00', '2025-08-04 20:02:00'),
    ('Zona monitorata dalla nostra associazione — grazie per la segnalazione aggiuntiva.', 'giulia_bianchi', 28, '2025-08-05 21:13:00', '2025-08-05 21:13:00'),
    ('Che espressione seria! Sembra stia valutando se fidarsi o meno.', 'luca_ferrari', 28, '2025-08-06 10:24:00', '2025-08-06 10:24:00'),
    ('Portateci cibo secco di qualità — meglio per la salute rispetto agli avanzi.', 'sofia_esposito', 28, '2025-08-02 11:35:00', '2025-08-02 11:35:00'),
    ('Bellissimo esemplare. Il mantello è curatissimo per essere un randagio.', 'marco_romano', 28, '2025-08-03 12:46:00', '2025-08-03 12:46:00'),
    ('Dolcissimo! Spero che qualcuno lo segua con regolarità.', 'mario_rossi', 29, '2025-09-03 10:00:00', '2025-09-03 10:00:00'),
    ('È utile sapere se ha la tacca sull''orecchio — indicherebbe già la sterilizzazione TNR.', 'giulia_bianchi', 29, '2025-09-04 11:11:00', '2025-09-04 11:11:00'),
    ('Zona nota alla nostra associazione. Manterremo l''occhio aperto.', 'luca_ferrari', 29, '2025-09-05 12:22:00', '2025-09-05 12:22:00'),
    ('Che eleganza nei movimenti! I gatti hanno una grazia innata.', 'sofia_esposito', 29, '2025-09-06 13:33:00', '2025-09-06 13:33:00'),
    ('Non avvicinatevi troppo se è diffidente — il rispetto è la base.', 'marco_romano', 29, '2025-09-07 14:44:00', '2025-09-07 14:44:00'),
    ('La sua condizione sembra buona — qualcuno si prende cura di lui.', 'elena_conti', 29, '2025-09-03 15:55:00', '2025-09-03 15:55:00'),
    ('Aggiungo questa posizione alla app di mappatura delle colonie feline. Grazie!', 'andrea_ricci', 29, '2025-09-04 16:06:00', '2025-09-04 16:06:00'),
    ('Bellissima segnalazione! Questi post fanno la differenza per il benessere animale.', 'mario_rossi', 29, '2025-09-05 17:17:00', '2025-09-05 17:17:00'),
    ('Attenzione alle macchine in quella zona — è una strada trafficata.', 'giulia_bianchi', 29, '2025-09-06 18:28:00', '2025-09-06 18:28:00'),
    ('Chi vive nei paraggi potrebbe tenerlo d''occhio? Ci servirebbe un referente.', 'luca_ferrari', 29, '2025-09-07 19:39:00', '2025-09-07 19:39:00'),
    ('Il gatto ha capito tutto della vita: mangiare, dormire, esplorare. Noi no.', 'sofia_esposito', 29, '2025-09-03 20:50:00', '2025-09-03 20:50:00'),
    ('Condiviso nella pagina del comune — speriamo in un casetta/rifugio per l''inverno.', 'marco_romano', 29, '2025-09-04 21:01:00', '2025-09-04 21:01:00'),
    ('Questi gatti sono la vera anima dei quartieri storici italiani.', 'elena_conti', 29, '2025-09-05 10:12:00', '2025-09-05 10:12:00'),
    ('Grazie per la precisione della descrizione — ci aiuta a identificare i soggetti.', 'andrea_ricci', 29, '2025-09-06 11:23:00', '2025-09-06 11:23:00'),
    ('Lo stesso gatto è stato avvistato anche in Via X la settimana scorsa.', 'mario_rossi', 29, '2025-09-07 12:34:00', '2025-09-07 12:34:00'),
    ('Un consiglio: il cibo umido in estate va rimosso dopo 30 minuti per evitare batteri.', 'giulia_bianchi', 29, '2025-09-03 13:45:00', '2025-09-03 13:45:00'),
    ('Post fantastico! Continua a segnalare, queste informazioni sono oro per noi volontari.', 'luca_ferrari', 29, '2025-09-04 14:56:00', '2025-09-04 14:56:00'),
    ('Che personalità! Si vede subito chi comanda da quelle parti.', 'sofia_esposito', 29, '2025-09-05 15:07:00', '2025-09-05 15:07:00'),
    ('Speriamo che qualcuno possa dargli una sistemazione per l''inverno.', 'marco_romano', 29, '2025-09-06 16:18:00', '2025-09-06 16:18:00'),
    ('Grazie! L''avevamo perso di vista da qualche settimana, ottimo sapere che sta bene.', 'giulia_bianchi', 30, '2025-10-04 10:00:00', '2025-10-04 10:00:00'),
    ('È quello che chiamiamo gatto ''semi-addomesticato'': né randagio né domestico, nel mezzo.', 'luca_ferrari', 30, '2025-10-05 11:11:00', '2025-10-05 11:11:00'),
    ('Che bello! Queste segnalazioni tengono viva l''attenzione sui gatti liberi.', 'sofia_esposito', 30, '2025-10-06 12:22:00', '2025-10-06 12:22:00'),
    ('Ho portato del cibo ieri sera — era già lì ad aspettarmi. Forse ci vede abituali!', 'marco_romano', 30, '2025-10-07 13:33:00', '2025-10-07 13:33:00'),
    ('La diffidenza dei randagi è una forma di intelligenza, non cattiveria.', 'elena_conti', 30, '2025-10-08 14:44:00', '2025-10-08 14:44:00'),
    ('Bravissimo a fotografarlo senza disturbarlo — si vede che sei esperto.', 'andrea_ricci', 30, '2025-10-04 15:55:00', '2025-10-04 15:55:00'),
    ('Zona monitorata mensilmente dalla nostra unità veterinaria mobile.', 'mario_rossi', 30, '2025-10-05 16:06:00', '2025-10-05 16:06:00'),
    ('Che contemplazione! Sembra stia risolvendo i problemi del mondo.', 'giulia_bianchi', 30, '2025-10-06 17:17:00', '2025-10-06 17:17:00'),
    ('Il pelo lucido indica una dieta adeguata — qualcuno se ne prende cura.', 'luca_ferrari', 30, '2025-10-07 18:28:00', '2025-10-07 18:28:00'),
    ('Non spostate mai i gatti da una colonia a un''altra senza supporto professionale.', 'sofia_esposito', 30, '2025-10-08 19:39:00', '2025-10-08 19:39:00'),
    ('Avvistamento confermato da altri due utenti questa settimana — zona molto attiva.', 'marco_romano', 30, '2025-10-04 20:50:00', '2025-10-04 20:50:00'),
    ('Che tenerezza! Mi ha fatto venire voglia di abbracciarlo (ma non l''avrei fatto, tranquilli).', 'elena_conti', 30, '2025-10-05 21:01:00', '2025-10-05 21:01:00'),
    ('Grazie per l''avvistamento dettagliato — aggiornate se notate cambiamenti.', 'andrea_ricci', 30, '2025-10-06 10:12:00', '2025-10-06 10:12:00'),
    ('Un randagio ben integrato nel territorio è il risultato del lavoro di molti volontari.', 'mario_rossi', 30, '2025-10-07 11:23:00', '2025-10-07 11:23:00'),
    ('Zona con alta densità felina — stiamo lavorando per aumentare i punti di alimentazione.', 'giulia_bianchi', 30, '2025-10-08 12:34:00', '2025-10-08 12:34:00'),
    ('Il gatto ha trovato il suo posto nel mondo. Rispettiamolo.', 'luca_ferrari', 30, '2025-10-04 13:45:00', '2025-10-04 13:45:00'),
    ('Adoro questi post! Mi ricordano perché faccio volontariato ogni settimana.', 'sofia_esposito', 30, '2025-10-05 14:56:00', '2025-10-05 14:56:00'),
    ('Che grazia! Anche i randagi hanno la loro dignità, anzi — soprattutto loro.', 'marco_romano', 30, '2025-10-06 15:07:00', '2025-10-06 15:07:00'),
    ('Condiviso! Più occhi ci sono su questi gatti, meglio è per la loro sicurezza.', 'elena_conti', 30, '2025-10-07 16:18:00', '2025-10-07 16:18:00'),
    ('Grazie per la segnalazione e per il rispetto dimostrato verso l''animale.', 'andrea_ricci', 30, '2025-10-08 17:29:00', '2025-10-08 17:29:00'),
    ('Che bel micio! Lo conosco, passa spesso da questa zona.', 'luca_ferrari', 31, '2025-01-05 10:00:00', '2025-01-05 10:00:00'),
    ('Ho lasciato delle crocchette vicino alla fontana ieri sera, speriamo le abbia trovate.', 'sofia_esposito', 31, '2025-01-06 11:11:00', '2025-01-06 11:11:00'),
    ('Bellissimo avvistamento! Anche io l''ho visto qualche giorno fa, sembra in buona salute.', 'marco_romano', 31, '2025-01-07 12:22:00', '2025-01-07 12:22:00'),
    ('Grazie per la segnalazione! I gatti di questa zona sono monitorati dalla nostra associazione.', 'elena_conti', 31, '2025-01-08 13:33:00', '2025-01-08 13:33:00'),
    ('È importante non spostare i gatti randagi dalla loro colonia — si disorientano molto.', 'andrea_ricci', 31, '2025-01-09 14:44:00', '2025-01-09 14:44:00'),
    ('Che occhi meravigliosi! Ha un carattere tutto suo quel micio.', 'mario_rossi', 31, '2025-01-05 15:55:00', '2025-01-05 15:55:00'),
    ('Lo chiamo ''Il Sindaco'' perché sembra il padrone del quartiere.', 'giulia_bianchi', 31, '2025-01-06 16:06:00', '2025-01-06 16:06:00'),
    ('Attenti a non dargli cibo troppo salato o condito — fa male ai reni dei gatti.', 'luca_ferrari', 31, '2025-01-07 17:17:00', '2025-01-07 17:17:00'),
    ('Ho segnalato la presenza al referente di colonia della zona, grazie del post!', 'sofia_esposito', 31, '2025-01-08 18:28:00', '2025-01-08 18:28:00'),
    ('Un consiglio: se volete avvicinarvi, abbassatevi lentamente e aspettate che venga lui da voi.', 'marco_romano', 31, '2025-01-09 19:39:00', '2025-01-09 19:39:00'),
    ('Bello! È da mesi che non lo vedevo, pensavo si fosse spostato.', 'elena_conti', 31, '2025-01-05 20:50:00', '2025-01-05 20:50:00'),
    ('Fantastico avvistamento. Questi gatti fanno parte del patrimonio culturale della città.', 'andrea_ricci', 31, '2025-01-06 21:01:00', '2025-01-06 21:01:00'),
    ('Ha la tacca sull''orecchio? Sarebbe importante saperlo per capire se è già sterilizzato.', 'mario_rossi', 31, '2025-01-07 10:12:00', '2025-01-07 10:12:00'),
    ('Grazie per condividere! Più segnalazioni abbiamo, meglio possiamo monitorare le colonie.', 'giulia_bianchi', 31, '2025-01-08 11:23:00', '2025-01-08 11:23:00'),
    ('Che bella foto! Si vede che era a suo agio con te.', 'luca_ferrari', 31, '2025-01-09 12:34:00', '2025-01-09 12:34:00'),
    ('I gatti come lui ci insegnano tutti i giorni il significato della libertà.', 'sofia_esposito', 31, '2025-01-05 13:45:00', '2025-01-05 13:45:00'),
    ('Ho passato mezz''ora a guardarlo camminare sul marciapiede. Ipnotico.', 'marco_romano', 31, '2025-01-06 14:56:00', '2025-01-06 14:56:00'),
    ('È fondamentale non spostare il cibo dalla posizione abitudinaria — i gatti sono molto dipendenti dalla routine.', 'elena_conti', 31, '2025-01-07 15:07:00', '2025-01-07 15:07:00'),
    ('Avvistamento confermato! Anche il mio vicino me ne aveva parlato.', 'andrea_ricci', 31, '2025-01-08 16:18:00', '2025-01-08 16:18:00'),
    ('Queste segnalazioni sono preziosissime per la mappa felina della città.', 'mario_rossi', 31, '2025-01-09 17:29:00', '2025-01-09 17:29:00'),
    ('Che personaggio! Si vede subito che ha carattere da vendere.', 'giulia_bianchi', 31, '2025-01-05 18:40:00', '2025-01-05 18:40:00'),
    ('Grazie per la descrizione dettagliata delle condizioni — utilissima per i volontari.', 'luca_ferrari', 31, '2025-01-06 19:51:00', '2025-01-06 19:51:00'),
    ('Che bel micio! Lo conosco, passa spesso da questa zona.', 'sofia_esposito', 31, '2025-01-07 20:02:00', '2025-01-07 20:02:00'),
    ('Ho lasciato delle crocchette vicino alla fontana ieri sera, speriamo le abbia trovate.', 'marco_romano', 31, '2025-01-08 21:13:00', '2025-01-08 21:13:00'),
    ('Mamma mia quanto è bello! Quel pelo è pazzesco.', 'sofia_esposito', 32, '2025-02-06 10:00:00', '2025-02-06 10:00:00'),
    ('L''ho avvistato anch''io stamattina! Stava dormendo al sole tranquillissimo.', 'marco_romano', 32, '2025-02-07 11:11:00', '2025-02-07 11:11:00'),
    ('Se qualcuno è di zona e può portare cibo regolarmente, sarebbe utilissimo.', 'elena_conti', 32, '2025-02-08 12:22:00', '2025-02-08 12:22:00'),
    ('Attenzione: i gatti randagi non vanno mai raccolti senza prima consultare un''associazione.', 'andrea_ricci', 32, '2025-02-09 13:33:00', '2025-02-09 13:33:00'),
    ('Ho l''impressione che sia lo stesso gatto che avevo segnalato tre mesi fa più a nord.', 'mario_rossi', 32, '2025-02-10 14:44:00', '2025-02-10 14:44:00'),
    ('Che carattere! Si vede da come posa che è abituato all''attenzione.', 'giulia_bianchi', 32, '2025-02-06 15:55:00', '2025-02-06 15:55:00'),
    ('Meraviglioso. Questi randagi ci ricordano quanto siano resistenti e adattabili i gatti.', 'luca_ferrari', 32, '2025-02-07 16:06:00', '2025-02-07 16:06:00'),
    ('Il metodo TNR (Trap-Neuter-Return) è l''unico modo etico per gestire le colonie.', 'sofia_esposito', 32, '2025-02-08 17:17:00', '2025-02-08 17:17:00'),
    ('Ho contattato il municipio per segnalare il punto — servirebbero più rifugi invernali.', 'marco_romano', 32, '2025-02-09 18:28:00', '2025-02-09 18:28:00'),
    ('È bellissimo sapere che c''è chi monitora questi animali. Grazie a tutti i volontari!', 'elena_conti', 32, '2025-02-10 19:39:00', '2025-02-10 19:39:00'),
    ('Una nota: l''acqua è importante tanto quanto il cibo, specialmente d''estate.', 'andrea_ricci', 32, '2025-02-06 20:50:00', '2025-02-06 20:50:00'),
    ('Adoro questi post! Tengono viva l''attenzione su una realtà spesso ignorata.', 'mario_rossi', 32, '2025-02-07 21:01:00', '2025-02-07 21:01:00'),
    ('Avevo paura che si fosse allontanato. Sapere che sta bene mi rincuora.', 'giulia_bianchi', 32, '2025-02-08 10:12:00', '2025-02-08 10:12:00'),
    ('La sua diffidenza è normale — ci vogliono settimane per guadagnare la fiducia di un randagio.', 'luca_ferrari', 32, '2025-02-09 11:23:00', '2025-02-09 11:23:00'),
    ('Chi abita in zona potrebbe tenerlo d''occhio? Sarebbe preziosissimo.', 'sofia_esposito', 32, '2025-02-10 12:34:00', '2025-02-10 12:34:00'),
    ('Questi gatti meritano rispetto e cura. Grazie per la segnalazione!', 'marco_romano', 32, '2025-02-06 13:45:00', '2025-02-06 13:45:00'),
    ('Non dategli latte! Molti gatti adulti sono intolleranti al lattosio.', 'elena_conti', 32, '2025-02-07 14:56:00', '2025-02-07 14:56:00'),
    ('Il fatto che sia sterilizzato è un ottimo segnale — la colonia è gestita bene.', 'andrea_ricci', 32, '2025-02-08 15:07:00', '2025-02-08 15:07:00'),
    ('Condivido! Più gente sa di queste colonie, meglio è per tutti.', 'mario_rossi', 32, '2025-02-09 16:18:00', '2025-02-09 16:18:00'),
    ('Ho aggiunto la posizione alla nostra mappa delle colonie feline della città.', 'giulia_bianchi', 32, '2025-02-10 17:29:00', '2025-02-10 17:29:00'),
    ('Che storia bellissima. Un gatto che ha trovato il suo posto nel mondo.', 'luca_ferrari', 32, '2025-02-06 18:40:00', '2025-02-06 18:40:00'),
    ('Mamma mia quanto è bello! Quel pelo è pazzesco.', 'sofia_esposito', 32, '2025-02-07 19:51:00', '2025-02-07 19:51:00'),
    ('L''ho visto anche io settimana scorsa! Sembrava in ottima forma.', 'marco_romano', 33, '2025-03-07 10:00:00', '2025-03-07 10:00:00'),
    ('Zona monitorata dalla nostra associazione — grazie per la segnalazione aggiuntiva.', 'elena_conti', 33, '2025-03-08 11:11:00', '2025-03-08 11:11:00'),
    ('Che espressione seria! Sembra stia valutando se fidarsi o meno.', 'andrea_ricci', 33, '2025-03-09 12:22:00', '2025-03-09 12:22:00'),
    ('Portateci cibo secco di qualità — meglio per la salute rispetto agli avanzi.', 'mario_rossi', 33, '2025-03-10 13:33:00', '2025-03-10 13:33:00'),
    ('Bellissimo esemplare. Il mantello è curatissimo per essere un randagio.', 'giulia_bianchi', 33, '2025-03-11 14:44:00', '2025-03-11 14:44:00'),
    ('Non toccate i cuccioli se la mamma è presente — potrebbe spaventarsi e abbandonarli.', 'luca_ferrari', 33, '2025-03-07 15:55:00', '2025-03-07 15:55:00'),
    ('Segnalazione inoltrata alla ASL Veterinaria del distretto. Grazie!', 'sofia_esposito', 33, '2025-03-08 16:06:00', '2025-03-08 16:06:00'),
    ('Queste colonie sono protette dalla legge 281/91 — è illegale rimuoverle o maltrattarle.', 'marco_romano', 33, '2025-03-09 17:17:00', '2025-03-09 17:17:00'),
    ('Che begli occhi! I gatti tigrati hanno sempre qualcosa di speciale.', 'elena_conti', 33, '2025-03-10 18:28:00', '2025-03-10 18:28:00'),
    ('Ho lasciato una ciotola d''acqua fresca sotto il portico vicino — spero la trovi.', 'andrea_ricci', 33, '2025-03-11 19:39:00', '2025-03-11 19:39:00'),
    ('Post preziosissimo. Aggiornate se tornate in zona!', 'mario_rossi', 33, '2025-03-07 20:50:00', '2025-03-07 20:50:00'),
    ('La sua routine sembra ben consolidata — segno che vive lì da tempo.', 'giulia_bianchi', 33, '2025-03-08 21:01:00', '2025-03-08 21:01:00'),
    ('Grazie per aver specificato le condizioni fisiche — è fondamentale per i volontari.', 'luca_ferrari', 33, '2025-03-09 10:12:00', '2025-03-09 10:12:00'),
    ('Che bel randagio! Mi fa pensare ai gatti di Roma antica, discendenti di secoli.', 'sofia_esposito', 33, '2025-03-10 11:23:00', '2025-03-10 11:23:00'),
    ('Se volete adottarlo, il passaggio dal randagio alla casa richiede pazienza e tempo.', 'marco_romano', 33, '2025-03-11 12:34:00', '2025-03-11 12:34:00'),
    ('Condivido nella pagina della nostra associazione — speriamo trovi un referente fisso!', 'elena_conti', 33, '2025-03-07 13:45:00', '2025-03-07 13:45:00'),
    ('Questi avvistamenti mi fanno sempre venire voglia di uscire a fare volontariato.', 'andrea_ricci', 33, '2025-03-08 14:56:00', '2025-03-08 14:56:00'),
    ('Complimenti per la foto — cattura perfettamente il suo carattere.', 'mario_rossi', 33, '2025-03-09 15:07:00', '2025-03-09 15:07:00'),
    ('Dolcissimo! Spero che qualcuno lo segua con regolarità.', 'elena_conti', 34, '2025-04-08 10:00:00', '2025-04-08 10:00:00'),
    ('È utile sapere se ha la tacca sull''orecchio — indicherebbe già la sterilizzazione TNR.', 'andrea_ricci', 34, '2025-04-09 11:11:00', '2025-04-09 11:11:00'),
    ('Zona nota alla nostra associazione. Manterremo l''occhio aperto.', 'mario_rossi', 34, '2025-04-10 12:22:00', '2025-04-10 12:22:00'),
    ('Che eleganza nei movimenti! I gatti hanno una grazia innata.', 'giulia_bianchi', 34, '2025-04-11 13:33:00', '2025-04-11 13:33:00'),
    ('Non avvicinatevi troppo se è diffidente — il rispetto è la base.', 'luca_ferrari', 34, '2025-04-12 14:44:00', '2025-04-12 14:44:00'),
    ('La sua condizione sembra buona — qualcuno si prende cura di lui.', 'sofia_esposito', 34, '2025-04-08 15:55:00', '2025-04-08 15:55:00'),
    ('Aggiungo questa posizione alla app di mappatura delle colonie feline. Grazie!', 'marco_romano', 34, '2025-04-09 16:06:00', '2025-04-09 16:06:00'),
    ('Bellissima segnalazione! Questi post fanno la differenza per il benessere animale.', 'elena_conti', 34, '2025-04-10 17:17:00', '2025-04-10 17:17:00'),
    ('Attenzione alle macchine in quella zona — è una strada trafficata.', 'andrea_ricci', 34, '2025-04-11 18:28:00', '2025-04-11 18:28:00'),
    ('Chi vive nei paraggi potrebbe tenerlo d''occhio? Ci servirebbe un referente.', 'mario_rossi', 34, '2025-04-12 19:39:00', '2025-04-12 19:39:00'),
    ('Il gatto ha capito tutto della vita: mangiare, dormire, esplorare. Noi no.', 'giulia_bianchi', 34, '2025-04-08 20:50:00', '2025-04-08 20:50:00'),
    ('Condiviso nella pagina del comune — speriamo in un casetta/rifugio per l''inverno.', 'luca_ferrari', 34, '2025-04-09 21:01:00', '2025-04-09 21:01:00'),
    ('Questi gatti sono la vera anima dei quartieri storici italiani.', 'sofia_esposito', 34, '2025-04-10 10:12:00', '2025-04-10 10:12:00'),
    ('Grazie per la precisione della descrizione — ci aiuta a identificare i soggetti.', 'marco_romano', 34, '2025-04-11 11:23:00', '2025-04-11 11:23:00'),
    ('Lo stesso gatto è stato avvistato anche in Via X la settimana scorsa.', 'elena_conti', 34, '2025-04-12 12:34:00', '2025-04-12 12:34:00'),
    ('Un consiglio: il cibo umido in estate va rimosso dopo 30 minuti per evitare batteri.', 'andrea_ricci', 34, '2025-04-08 13:45:00', '2025-04-08 13:45:00'),
    ('Post fantastico! Continua a segnalare, queste informazioni sono oro per noi volontari.', 'mario_rossi', 34, '2025-04-09 14:56:00', '2025-04-09 14:56:00'),
    ('Che personalità! Si vede subito chi comanda da quelle parti.', 'giulia_bianchi', 34, '2025-04-10 15:07:00', '2025-04-10 15:07:00'),
    ('Speriamo che qualcuno possa dargli una sistemazione per l''inverno.', 'luca_ferrari', 34, '2025-04-11 16:18:00', '2025-04-11 16:18:00'),
    ('Bellissimo avvistamento — e ottima la descrizione delle condizioni fisiche.', 'sofia_esposito', 34, '2025-04-12 17:29:00', '2025-04-12 17:29:00'),
    ('Grazie! L''avevamo perso di vista da qualche settimana, ottimo sapere che sta bene.', 'andrea_ricci', 35, '2025-05-09 10:00:00', '2025-05-09 10:00:00'),
    ('È quello che chiamiamo gatto ''semi-addomesticato'': né randagio né domestico, nel mezzo.', 'mario_rossi', 35, '2025-05-10 11:11:00', '2025-05-10 11:11:00'),
    ('Che bello! Queste segnalazioni tengono viva l''attenzione sui gatti liberi.', 'giulia_bianchi', 35, '2025-05-11 12:22:00', '2025-05-11 12:22:00'),
    ('Ho portato del cibo ieri sera — era già lì ad aspettarmi. Forse ci vede abituali!', 'luca_ferrari', 35, '2025-05-12 13:33:00', '2025-05-12 13:33:00'),
    ('La diffidenza dei randagi è una forma di intelligenza, non cattiveria.', 'sofia_esposito', 35, '2025-05-13 14:44:00', '2025-05-13 14:44:00'),
    ('Bravissimo a fotografarlo senza disturbarlo — si vede che sei esperto.', 'marco_romano', 35, '2025-05-09 15:55:00', '2025-05-09 15:55:00'),
    ('Zona monitorata mensilmente dalla nostra unità veterinaria mobile.', 'elena_conti', 35, '2025-05-10 16:06:00', '2025-05-10 16:06:00'),
    ('Che contemplazione! Sembra stia risolvendo i problemi del mondo.', 'andrea_ricci', 35, '2025-05-11 17:17:00', '2025-05-11 17:17:00'),
    ('Il pelo lucido indica una dieta adeguata — qualcuno se ne prende cura.', 'mario_rossi', 35, '2025-05-12 18:28:00', '2025-05-12 18:28:00'),
    ('Non spostate mai i gatti da una colonia a un''altra senza supporto professionale.', 'giulia_bianchi', 35, '2025-05-13 19:39:00', '2025-05-13 19:39:00'),
    ('Avvistamento confermato da altri due utenti questa settimana — zona molto attiva.', 'luca_ferrari', 35, '2025-05-09 20:50:00', '2025-05-09 20:50:00'),
    ('Che tenerezza! Mi ha fatto venire voglia di abbracciarlo (ma non l''avrei fatto, tranquilli).', 'sofia_esposito', 35, '2025-05-10 21:01:00', '2025-05-10 21:01:00'),
    ('Grazie per l''avvistamento dettagliato — aggiornate se notate cambiamenti.', 'marco_romano', 35, '2025-05-11 10:12:00', '2025-05-11 10:12:00'),
    ('Un randagio ben integrato nel territorio è il risultato del lavoro di molti volontari.', 'elena_conti', 35, '2025-05-12 11:23:00', '2025-05-12 11:23:00'),
    ('Zona con alta densità felina — stiamo lavorando per aumentare i punti di alimentazione.', 'andrea_ricci', 35, '2025-05-13 12:34:00', '2025-05-13 12:34:00'),
    ('Il gatto ha trovato il suo posto nel mondo. Rispettiamolo.', 'mario_rossi', 35, '2025-05-09 13:45:00', '2025-05-09 13:45:00'),
    ('Adoro questi post! Mi ricordano perché faccio volontariato ogni settimana.', 'giulia_bianchi', 35, '2025-05-10 14:56:00', '2025-05-10 14:56:00'),
    ('Che grazia! Anche i randagi hanno la loro dignità, anzi — soprattutto loro.', 'luca_ferrari', 35, '2025-05-11 15:07:00', '2025-05-11 15:07:00'),
    ('Condiviso! Più occhi ci sono su questi gatti, meglio è per la loro sicurezza.', 'sofia_esposito', 35, '2025-05-12 16:18:00', '2025-05-12 16:18:00'),
    ('Grazie per la segnalazione e per il rispetto dimostrato verso l''animale.', 'marco_romano', 35, '2025-05-13 17:29:00', '2025-05-13 17:29:00'),
    ('Post salvato! Passerò da quella zona la prossima settimana.', 'elena_conti', 35, '2025-05-09 18:40:00', '2025-05-09 18:40:00'),
    ('Grazie! L''avevamo perso di vista da qualche settimana, ottimo sapere che sta bene.', 'andrea_ricci', 35, '2025-05-10 19:51:00', '2025-05-10 19:51:00'),
    ('È quello che chiamiamo gatto ''semi-addomesticato'': né randagio né domestico, nel mezzo.', 'mario_rossi', 35, '2025-05-11 20:02:00', '2025-05-11 20:02:00'),
    ('Che bello! Queste segnalazioni tengono viva l''attenzione sui gatti liberi.', 'giulia_bianchi', 35, '2025-05-12 21:13:00', '2025-05-12 21:13:00'),
    ('Ho portato del cibo ieri sera — era già lì ad aspettarmi. Forse ci vede abituali!', 'luca_ferrari', 35, '2025-05-13 10:24:00', '2025-05-13 10:24:00')
ON CONFLICT DO NOTHING;

COMMIT;

-- End of seed.sql
