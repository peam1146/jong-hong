FROM node:20-alpine AS preparer

WORKDIR /app

RUN npm install -g turbo@2

COPY . .

RUN turbo prune --scope=@api/auth --docker

#########################################################################

FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9.10.0

COPY --from=preparer /app/out/json/ .
COPY --from=preparer /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY --from=preparer /app/out/full/ .

RUN pnpm build --filter=@api/auth

CMD [ "node", "apps-api/auth/dist/index.mjs" ]