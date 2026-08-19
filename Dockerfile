# Stage 1: Build static Vite frontend
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Node.js API & Web Server
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY server.js ./
COPY entriesStore.js ./
COPY mediaStore.js ./

EXPOSE 80
ENV PORT=80

CMD ["node", "server.js"]
