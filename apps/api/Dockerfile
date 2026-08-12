# ==========================================
# STAGE 1: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/  

RUN npm ci --workspace=@todo/api --include-workspace-root

COPY apps/api ./apps/api


# ==========================================
# STAGE 2: Production Runner
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4100

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy built dependencies and code from STAGE 1 (builder)
COPY --from=builder /app/node_modules ./node_modules 
COPY --from=builder /app/apps/api ./apps/api
COPY package.json ./

USER nodejs

EXPOSE 4100

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget -q --tries=1 --spider http://localhost:4100/health || exit 1

CMD ["node", "apps/api/src/server.js"]
