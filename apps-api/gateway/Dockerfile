FROM node:20-alpine AS preparer

WORKDIR /app

RUN npm install -g turbo@2

COPY . .

RUN turbo prune --scope=@api/gateway --docker

#########################################################################

FROM node:20-alpine AS builder

RUN apk add --no-cache bash curl


WORKDIR /app

RUN npm install -g pnpm@9.10.0

COPY --from=preparer /app/out/json/ .
COPY --from=preparer /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install

COPY --from=preparer /app/out/full/ .

RUN cd packages/grpc && pnpm generate
RUN pnpm build --filter=@api/gateway

EXPOSE 5000

CMD [ "node", "apps-api/gateway/dist/index.mjs" ]