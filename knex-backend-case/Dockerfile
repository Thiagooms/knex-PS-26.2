FROM node:22-alpine AS runtime
WORKDIR /app
RUN corepack enable
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps ./apps
RUN pnpm install --frozen-lockfile
ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "--filter", "api", "start"]
