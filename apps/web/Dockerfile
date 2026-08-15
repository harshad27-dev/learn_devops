# ==========================================
# STAGE 1: Builder (Debian Slim for glibc compatibility with LightningCSS/SWC)
# ==========================================
FROM node:20-slim AS builder 

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/

RUN npm install --workspace=@todo/web --include-workspace-root --force

COPY apps/web ./apps/web

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build --workspace=@todo/web


# ==========================================
# STAGE 2: Production Runner
# ==========================================
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user (Debian syntax)
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 -g nodejs nodejs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web ./apps/web
COPY package.json ./

USER nodejs

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=@todo/web"]