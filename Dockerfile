FROM node:22-alpine AS builder
WORKDIR /app
COPY apps/backend/package.json apps/backend/package-lock.json ./
RUN npm ci
COPY apps/backend .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY apps/backend/prisma ./prisma
RUN npx prisma generate
EXPOSE 3001
CMD ["node", "dist/main.js"]
