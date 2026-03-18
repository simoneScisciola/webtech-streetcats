# Production backend's Dockerfile

# ---- STAGE 1: Build TypeScript ----
# Uso un'immagine base che contiene Node.js, nvm e poche altre cose
# Doc: https://hub.docker.com/_/node
FROM node:22.16.0-slim AS build

# Spostiamoci nella directory `app` del container
WORKDIR /app

# Dipendenze del backend, installate all'interno del container
    ## Copia sia package-lock.json che package.json nella WORKDIR del container (da' errore se mancano o sono incoerenti)
COPY package*.json ./
    ## Clean install delle dipendenze (ottimizzato per build riproducibili)
RUN npm ci

# Copio tutti i files dalla directory locale alla directory corrente all'interno del container
COPY . .
# Compilazione del progetto in modalità di produzione, l'output viene generato nella cartella ./dist
RUN npm run build


# ---- STAGE 2: Runtime di produzione ----
# Uso un'immagine base che contiene Node.js, nvm e poche altre cose
# Doc: https://hub.docker.com/_/node
FROM node:22.16.0-slim AS production

# Spostiamoci nella directory `app` del container
WORKDIR /app

# Dipendenze del backend, installate all'interno del container
    ## Copia sia package-lock.json che package.json nella WORKDIR del container (da' errore se mancano o sono incoerenti)
COPY package*.json ./
    ## Installa solo le dipendenze di produzione (esclude le devDependencies come TypeScript)
RUN npm ci --omit=dev

# Copia il bundle JavaScript, compilato dallo stage di build
COPY --from=build /app/dist ./dist

# Dichiara di voler esporre la porta del server Express
# Avverte solo Docker che all'interno c'è un processo in ascolto sulla porta
EXPOSE 3000

# Avvia la REST API
CMD ["npm", "run", "start"]