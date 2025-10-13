FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Solo dependencias necesarias en prod
COPY package*.json ./
RUN npm ci --omit=dev

# Copia el código
COPY . .

# Puerto y comando
ENV PORT=8080
EXPOSE 8080
CMD ["node", "src/server.js"]

