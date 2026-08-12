FROM node:20-alpine AS builder 
# Install glibc compatibility library for LightningCSS and SWC binaries in Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/

RUN npm ci --workspace=@todo/web --include-workspace-root

COPY apps/web ./apps/web

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build --workspace=@todo/web


FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Security: Non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web ./apps/web
COPY package.json ./
USER nodejs
EXPOSE 3000
CMD ["npm", "run", "start", "--workspace=@todo/web"]