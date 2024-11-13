# When copying this Dockerfile for use in other apps, don't forget to change the scope (api, web, etc.) in RUN commands

FROM node:20-alpine AS pnpm

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

RUN npm install -g pnpm@8.6.10

# --------------------------------------------------------

FROM pnpm AS pruner
WORKDIR /app
RUN apk add --no-cache jq
RUN pnpm install -g turbo@2
COPY . .
RUN turbo prune --scope=@client/web --docker

# --------------------------------------------------------

FROM pnpm AS builder
WORKDIR /app
RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake

COPY --from=pruner /app/out/json/ .
COPY pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
RUN DISABLE_ERD=true pnpm turbo run build --filter=@client/web...

# --------------------------------------------------------

FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

USER 1001:1001

COPY --from=builder /app/apps-client/web/next.config.mjs /app/apps-client/web/package.json ./

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps-client/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps-client/web/public ./apps-client/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps-client/web/.next/static ./apps-client/web/.next/static

ENV HOSTNAME "0.0.0.0"
ENV TZ "Asia/Bangkok"
EXPOSE 3000
CMD ["node", "apps-client/web/server.js"]
