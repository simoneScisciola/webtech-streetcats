# Webtech's StreetCats

Repository dedicata al progetto "Webtech's StreetCats" di Tecnologie Web 2024/2025

## Indice

* [Backend](#backend)
    + [Usare la giusta versione di Node.js](#usare-la-giusta-versione-di-nodejs)
    + [Eseguire il typechecking](#eseguire-il-typechecking)
        - [Typechecking in watch mode](#typechecking-in-watch-mode)
    + [Transpiling del codice TypeScript in JavaScript](#transpiling-del-codice-typescript-in-javascript)
    + [Esecuzione del codice di produzione](#esecuzione-del-codice-di-produzione)
    + [Esecuzione del codice con hot reloading](#esecuzione-del-codice-con-hot-reloading)

## Backend

Per eseguire i comandi relativi al backend è necessario recarsi alla root directory del [backend project](./source-code/backend/). Dalla root directory della repository, eseguire il comando:

```Bash
cd ./source-code/backend/ # Ci spostiamo alla directory "backend"
```

### Usare la giusta versione di Node.js

Nel file `.nvmrc` è riportata la versione di Node.js utilizzata per questo progetto. Se abbiamo `nvm` installato sul nostro computer, eseguiamo i comandi:

```Bash
nvm install # Installa la versione di Node.js riportata nel file ".nvmrc"
nvm use # Usa la versione di Node.js riportata nel file ".nvmrc"
```

### Eseguire il typechecking

E' possibile eseguire il typechecking del progetto con il seguente comando:

```Bash
npx tsc --noEmit # Eseguiamo tsc senza produzione di file JavaScript
```

o, in alternativa:

```Bash
npm run typecheck
```

#### Typechecking in watch mode

E' possibile eseguire il typechecking ad ogni salvataggio di un file con il seguente comando:

```Bash
npx tsc --noEmit --watch # Esecuzione di tsc senza produzione di file in watch mode
```

ATTENZIONE! Dato che l'intero progetto è sviluppato all'interno di un DevContainer con files sul sistema host, i segnali di "modifica file" non vengono inoltrati dall'host al container. Di conseguenza, poichè `tsc` usa un *native-event watcher*, l'hot reloading non funzionerà. Per risolvere, modifichiamo il comportamento del watcher a *polling watcher*, con il comando:

```Bash
TSC_WATCHFILE=PriorityPollingInterval npx tsc --noEmit --watch
```

o, in alternativa:

```Bash
npm run typecheck:watch
```

Tuttavia, se il progetto è eseguito direttamente sulla macchina host, questo accorgimento non sarà necessario. E' un limite relativo a DevContainer / WSL / Docker Desktop, non di `tsx`.

### Transpiling del codice TypeScript in JavaScript

E' possibile eseguire il transpiling del codice TypeScript del progetto in JavaScript con il seguente comando:

```Bash
npx tsc # Traduzione del TypeScript in JavaScript
```

o, in alternativa:

```Bash
npm run build
```

### Esecuzione del codice di produzione

E' possibile eseguire il codice JavaScript transpilato con il seguente comando:

```Bash
npx node dist/index.js # Esecuzione del JavaScript (bisogna prima fare il transpiling)
```

o, in alternativa:

```Bash
npm run start # Traduzione ed esecuzione del TypeScript transpilato
```

### Esecuzione del codice con hot reloading

E' possibile eseguire il progetto **senza typechecking** (maggiori informazioni nella [documentazione ufficiale](https://tsx.is/typescript#development-workflow)) e con **hot reload** del server Node.js ad ogni salvataggio di un file con il seguente comando:

```Bash
npx tsx watch src/index.ts # Avvio di tsx in watch mode
```

ATTENZIONE! Dato che l'intero progetto è sviluppato all'interno di un DevContainer con files sul sistema host, i segnali di "modifica file" non vengono inoltrati dall'host al container. Di conseguenza, poichè `tsx` usa un *native-event watcher*, l'hot reloading non funzionerà. Per risolvere, modifichiamo il comportamento del watcher a *polling watcher*, con il comando:

```Bash
CHOKIDAR_USEPOLLING=true npx tsx watch --clear-screen=false src/index.ts
```

o, in alternativa:

```Bash
npm run dev
```

Tuttavia, se il progetto è eseguito direttamente sulla macchina host, questo accorgimento non sarà necessario. E' un limite relativo a DevContainer / WSL / Docker Desktop, non di `tsx`.
