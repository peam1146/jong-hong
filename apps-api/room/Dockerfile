FROM node:20-alpine AS preparer

WORKDIR /app

RUN npm install -g turbo@2

COPY . .

RUN turbo prune --scope=@api/room --docker

#########################################################################

FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9.10.0

COPY --from=preparer /app/out/json/ .
COPY --from=preparer /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install

COPY --from=preparer /app/out/full/ .

RUN cd apps-api/room && pnpm prisma generate
RUN pnpm build --filter=@api/room
COPY ./packages /packages

CMD [ "node", "apps-api/room/dist/index.mjs" ]