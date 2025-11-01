# マルチステージビルド
FROM node:18-alpine AS builder

WORKDIR /app

# package.jsonをコピー
COPY package.json package-lock.json* ./

# 依存関係をインストール
RUN npm ci

# ソースコードをコピー
COPY . .

# ビルド実行
RUN npm run build

# 実行用イメージ
FROM node:18-alpine

RUN apk add --no-cache wget

WORKDIR /app

# package.jsonをコピー
COPY package.json package-lock.json* ./

# プロダクション依存関係のみインストール
RUN npm ci --only=production

# ビルド成果物をコピー
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]

