# Dockerfile del workspace

# Uso un'immagine base che contiene Node.js, git, nvm e altro
# Doc: https://hub.docker.com/r/microsoft/devcontainers-javascript-node
FROM mcr.microsoft.com/devcontainers/javascript-node:22


# Installiamo tutto ciò che è necessario sia per il frontend che per il backend

# Dipendenze del frontend
    ## Installiamo Typescript
RUN npm install -g typescript \

    ## Installiamo SASS
    && npm install -g sass \

    ## Installiamo Angular
    && npm install -g @angular/cli

# Installa i Playwright browsers e le browser system dependencies
# Doc: https://playwright.dev/docs/docker#build-your-own-image
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN npx -y playwright@1.56.1 install --with-deps