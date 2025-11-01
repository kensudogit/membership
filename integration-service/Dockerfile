# マルチステージビルド
FROM gradle:8.5-jdk17-alpine AS builder

WORKDIR /app

# ルートのビルドファイルをコピー
COPY build.gradle settings.gradle gradle.properties ./
COPY gradle ./gradle

# このサービスのソースをコピー
COPY integration-service/build.gradle ./integration-service/
COPY integration-service/src ./integration-service/src

# ビルド実行
RUN cd integration-service && gradle build --no-daemon -x test

# 実行用イメージ
FROM eclipse-temurin:17-jre-alpine

RUN apk add --no-cache wget

WORKDIR /app

# JARファイルをコピー
COPY --from=builder /app/integration-service/build/libs/*.jar app.jar

EXPOSE 8085

ENV SPRING_PROFILES_ACTIVE=docker

ENTRYPOINT ["java", "-jar", "app.jar"]

