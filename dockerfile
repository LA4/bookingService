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
# --- ÉTAPE 2 : Exécution ---
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/infrastructure/database/prisma ./src/infrastructure/database/prisma

# Installation de Prisma en global pour pouvoir lancer les migrations en prod 
# (car prisma est dans devDependencies et a été supprimé par npm prune)
RUN npm install -g prisma

EXPOSE 3000

# Lancement des migrations puis démarrage de l'application (chemin corrigé selon package.json)
CMD prisma migrate deploy --schema ./src/infrastructure/database/prisma/schema.prisma && node dist/main