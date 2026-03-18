# Backend

Backend dedicato al progetto Webtech's StreetCats.

L'interprete utilizzato è `node 22.19.0`.

Ogni comando si intende eseguito dalla root directory del progetto, [backend](.).

## Indice

* [Package Dependencies](#package-dependencies)
  * [Impostare la giusta versione di Node.js](#impostare-la-giusta-versione-di-nodejs)
* [Scripts](#scripts)
* [Avviare il development server](#avviare-il-development-server)
* [Eseguire il typechecking](#eseguire-il-typechecking)
  * [Typechecking in watch mode](#typechecking-in-watch-mode)
* [Building](#building)

## Package Dependencies

Il backend è stato costruito con le dipendenze definite nel `package.json`.

Una volta impostata la versione di node corretta (lo verifichiamo con `node --version`), installiamo le package dependencies con il comando:

```bash
npm install
```

### Impostare la giusta versione di Node.js

Nel file `.nvmrc` è riportata la versione di Node.js utilizzata per questo progetto. Se abbiamo `nvm` installato sul nostro computer, eseguiamo i comandi:

```Bash
nvm install # Installa la versione di Node.js riportata nel file ".nvmrc"
nvm use # Usa la versione di Node.js riportata nel file ".nvmrc"
```

## Scripts

Per eseguire il backend, è stato predisposto un [package.json](./package.json). Gli script definiti sono i seguenti:

* `npm run dev` esegue il progetto in modalità sviluppo (variante `npm run dev:docker` per sviluppo in ambiente Docker);
* `npm run typecheck` esegue il typechecking del progetto (variante `typecheck:watch` per eseguire il typechecking in watch mode; variante `typecheck:watch:docker` per eseguire il typechecking in watch mode in ambiente Docker);
* `npm run build` compila il progetto in modalità produzione;
* `npm run start` serve la compilazione del progetto tramite il server integrato in Node.js;
* `npm run test` esegue test unitari;

## Avviare il development server

Per avviare un server locale di sviluppo, che esegue il progetto **senza typechecking** (maggiori informazioni nella [documentazione ufficiale](https://tsx.is/typescript#development-workflow)) e con hot reload del server Node.js ad ogni salvataggio dei file sorgente, esegui:

```Bash
npx tsx watch --clear-screen=false src/index.ts # Avvio di tsx in watch mode e senza clear del terminale a ogni relaod
```

In alternativa, è possibile usare `npm run dev`.

In questo modo, l'applicazione si ricaricherà automaticamente ogni volta che modifichi uno qualsiasi dei file sorgente.

ATTENZIONE! Nel caso in cui il progetto venga eseguito all'interno di un DevContainer con files sul sistema host, i segnali di "modifica file" non vengono inoltrati dall'host al container. Di conseguenza, poichè `tsx` usa un *native-event watcher*, l'hot reloading non funzionerà. Per risolvere, modifichiamo il comportamento del watcher a *polling watcher*, eseguendo:

```Bash
CHOKIDAR_USEPOLLING=true npx tsx watch --clear-screen=false src/index.ts
```

In alternativa, è possibile usare `npm run dev:docker`.

Tuttavia, se il progetto è eseguito direttamente sulla macchina host, questo accorgimento non sarà necessario. E' un limite relativo a DevContainer / WSL / Docker Desktop, non di `tsx`.

## Eseguire il typechecking

Per eseguire il typechecking del progetto, esegui:

```Bash
npx tsc --noEmit # Eseguiamo tsc senza produzione di file JavaScript
```

In alternativa, è possibile usare `npm run typecheck`.

### Typechecking in watch mode

Per eseguire il typechecking ad ogni salvataggio dei file sorgente, esegui:

```Bash
npx tsc --noEmit --watch # Esecuzione di tsc senza produzione di file in watch mode
```

In alternativa, è possibile usare `npm run typecheck:watch`.

ATTENZIONE! Nel caso in cui il progetto venga eseguito all'interno di un DevContainer con files sul sistema host, i segnali di "modifica file" non vengono inoltrati dall'host al container. Di conseguenza, poichè `tsc` usa un *native-event watcher*, l'hot reloading non funzionerà. Per risolvere, modifichiamo il comportamento del watcher a *polling watcher*, con il comando:

```Bash
TSC_WATCHFILE=PriorityPollingInterval npx tsc --noEmit --watch
```

In alternativa, è possibile usare `npm run typecheck:watch:docker`.

Tuttavia, se il progetto è eseguito direttamente sulla macchina host, questo accorgimento non sarà necessario. E' un limite relativo a DevContainer / WSL / Docker Desktop, non di `tsx`.

## Building

Per eseguire la compilazione, o meglio, il transpiling del codice TypeScript del progetto in JavaScript, esegui:

```Bash
npx tsc # Traduzione del TypeScript in JavaScript
```

In alternativa, è possibile usare `npm run build`.

Questo compilerà il tuo progetto e salverà i file compilati nella directory `dist/`. Di default, la build di produzione è ottimizzata per prestazioni e velocità.
