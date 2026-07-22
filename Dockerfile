FROM node:22

RUN corepack enable

WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json drizzle.config.ts ./
COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile --filter=!docs

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "pnpm db:migrate && pnpm start"]
