FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo@^2

FROM base AS pruner
COPY . .
RUN turbo prune transcoder --docker

FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci

FROM node:22-alpine AS build
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=pruner /app/out/full/ .
COPY --from=deps /app/node_modules ./node_modules
RUN npx turbo run build --filter=transcoder...

FROM node:22-alpine AS runtime
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci --omit=dev
COPY --from=build /app/apps/transcoder/package.json ./apps/transcoder/package.json
COPY --from=build /app/apps/transcoder/dist ./apps/transcoder/dist
COPY --from=build /app/packages ./packages
CMD ["node", "apps/transcoder/dist/index.js"]
