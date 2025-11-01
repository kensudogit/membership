# マルチステージビルド用の共通ベースイメージ
FROM gradle:8.5-jdk17-alpine AS builder

WORKDIR /app

# ビルドファイルをコピー
COPY build.gradle settings.gradle gradle.properties ./
COPY gradle ./gradle

# 依存関係をダウンロード（キャッシュ最適化）
RUN gradle dependencies --no-daemon || true

# ソースコードをコピー
COPY . .

# アプリケーションをビルド（各サービスを個別にビルド）
RUN gradle build --no-daemon -x test || true

# 実行用イメージ
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# JARファイルをコピー
COPY --from=builder /app/*/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

