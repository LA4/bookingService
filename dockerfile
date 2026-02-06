# --- ÉTAPE 1 : Dépendances et Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de définition des dépendances
COPY package*.json ./
COPY src/infrastructure/database/prisma ./prisma/

# Installation des dépendances (y compris devDependencies pour le build)
RUN npm install

# Copie du reste du code source
COPY . .

# Génération du client Prisma et build du projet NestJS
RUN npx prisma generate
RUN npm run build

# Nettoyage pour ne garder que les dépendances de production
RUN npm prune --production

# --- ÉTAPE 2 : Exécution ---
FROM node:20-alpine

WORKDIR /app

# On récupère uniquement le nécessaire du builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Exposition du port (par défaut 3000 pour Nest)
EXPOSE 3000

# Commande de démarrage
# On utilise une commande qui lance les migrations Prisma avant de démarrer l'app
CMD npx prisma migrate deploy && node dist/main