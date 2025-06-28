# Webtech's Streetcats

Repository dedicata al progetto "Webtech's Streetcats" di Tecnologie Web 2024/2025

## Backend

Per eseguire i comandi relativi al backend è necessario recarsi alla root directory del [backend project](./source-code/backend/). Da terminale, eseguire il comando:

```Bash
cd ./source-code/backend/
```

### Development mode

In development mode eseguiamo il progetto senza typechecking e con riavvio automatico del server Node.js ad ogni salvataggio di un file.

E' possibile eseguire il progetto in modalità di sviluppo con il seguente comando:

```Bash
npx tsx watch src/index.ts
```

ATTENZIONE! Dato che l'intero progetto è sviluppato all'interno di un DevContainer con files sul sistema host, i segnali di "modifica file" non vengono inoltrati dall'host al container. Di conseguenza, poichè `tsx` usa un *native-event watcher*, l'hot reloading non funzionerà. Per risolvere, modifichiamo il comportamento del watcher a *polling watcher*, con il comando:

```Bash
CHOKIDAR_USEPOLLING=true npx tsx watch src/index.ts
```

o, alternativamente:

```Bash
npm run dev
```

Tuttavia, se il progetto è eseguito direttamente sulla macchina host, questo accorgimento non sarà necessario. E' un limite relativo a DevContainer / WSL / Docker Desktop, non di `tsx`.