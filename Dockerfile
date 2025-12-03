# --- 1. Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходники
COPY . .

# Собираем Next.js
RUN npm run build


# --- 2. Runtime stage ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Копируем package.json, чтобы иметь список зависимостей
COPY package*.json ./

# Устанавливаем только production-зависимости
RUN npm install --only=production

# Копируем билд
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Порт
EXPOSE 3000

# Команда запуска
CMD ["npm", "start"]
