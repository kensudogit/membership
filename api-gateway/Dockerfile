# マルチステージビルド
FROM gradle:8.5-jdk17-alpine AS builder

WORKDIR /app

# ルートのビルドファイルをコピー
COPY build.gradle settings.gradle gradle.properties ./
COPY gradle ./gradle

# このサービスのソースをコピー
COPY api-gateway/build.gradle ./api-gateway/
COPY api-gateway/src ./api-gateway/src

# ビルド実行
RUN cd api-gateway && gradle build --no-daemon -x test

# 実行用イメージ
FROM eclipse-temurin:17-jre-alpine

RUN apk add --no-cache wget

WORKDIR /app

# JARファイルをコピー
COPY --from=builder /app/api-gateway/build/libs/*.jar app.jar

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=docker

ENTRYPOINT ["java", "-jar", "app.jar"]

