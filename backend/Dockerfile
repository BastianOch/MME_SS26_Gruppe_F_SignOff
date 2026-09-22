# Node.js als Grundlage
FROM node:22-alpine

# Arbeitsordner im Container
WORKDIR /app

# Backend-Pakete installieren
COPY package*.json ./
RUN npm ci --omit=dev

# Backend-Code kopieren
COPY . .

# Ordner für hochgeladene Dateien anlegen
RUN mkdir -p uploads

# Port des Backends
EXPOSE 3000

# Server starten
CMD ["node", "server.js"]