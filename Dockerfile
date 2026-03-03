FROM node:20-alpine AS deps
WORKDIR /app
COPY backend/package.json ./package.json
RUN npm install

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY backend/package.json ./package.json
COPY backend/tsconfig.json ./tsconfig.json
COPY backend/src ./src
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["node", "dist/index.js"]
