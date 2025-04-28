# Base stage: 기본 세팅
FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# corepack 활성화 (pnpm 지원)
RUN corepack enable

# 소스 복사
WORKDIR /app
COPY . .

# Build stage: 빌드용
FROM base AS build

WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# Production stage: 실행용
FROM base

# 빌드된 파일 복사
COPY --from=build /app/dist /app/dist
COPY package.json pnpm-lock.yaml ./

# 프로덕션용 의존성 설치
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# config 파일 복사
COPY --from=build /app/config/* ./config/

# 포트 오픈
EXPOSE 3000

# 서버 실행
CMD ["node", "dist/apps/apps/src/main"]