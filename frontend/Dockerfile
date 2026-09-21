# Node.js als Grundlage
FROM node:22-alpine

# Arbeitsordner im Container
WORKDIR /app

# Frontend-Pakete installieren
COPY package*.json ./
RUN npm ci

# Frontend-Code kopieren
COPY . .

# Port des Vite-Servers
EXPOSE 5173

# Frontend starten und für Zugriffe von außen erreichbar machen
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]