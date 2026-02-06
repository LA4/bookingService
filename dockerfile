# --- ÉTAPE 1 : Build ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
# On respecte ton architecture dès le début
COPY src/infrastructure/database/prisma ./src/infrastructure/database/prisma/

RUN npm install
COPY . .

# On génère le client en pointant explicitement le schéma
RUN npx prisma generate --schema ./src/infrastructure/database/prisma/schema.prisma
RUN npm run build
RUN npm prune --production

# --- ÉTAPE 2 : Exécution ---
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
# On recopie le dossier au même endroit exact
COPY --from=builder /app/src/infrastructure/database/prisma ./src/infrastructure/database/prisma

EXPOSE 3000

# On lance la migration en pointant le schéma, puis l'app
CMD npx prisma migrate deploy --schema ./src/infrastructure/database/prisma/schema.prisma && node dist/main