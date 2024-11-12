FROM node:20-slim AS pnpm

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

RUN npm install -g pnpm@9.10.0

# --------------------------------------------------------

FROM pnpm AS pruner
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -g turbo@2.1.1
COPY . .
RUN turbo prune --scope=@api/booking-v2 --docker

# --------------------------------------------------------

FROM pnpm AS builder
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo run build --filter=@api/booking-v2...

# --------------------------------------------------------

FROM pnpm AS runner
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

USER 1001:1001


COPY --from=builder --chown=nextjs:nodejs /app/apps-api/booking-v2/dist ./apps-api/booking-v2/
COPY --from=builder --chown=nodejs:nodejs /app/packages/ packages/


# RUN GRPC_HEALTH_PROBE_VERSION=v0.4.19 && \
#     wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
#     chmod +x /bin/grpc_health_probe

ARG GRPC_HEALTH_PROBE_VERSION=v0.4.19
ADD https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 /bin/grpc_health_probe

ENV HOSTNAME="0.0.0.0"
ENV TZ="Asia/Bangkok"
ENV PORT="8000"

CMD ["node", "apps-api/booking-v2/index.js"]


HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD ["/bin/grpc_health_probe", "-addr=:${PORT}"]
