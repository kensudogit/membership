# マルチステージビルド
FROM gradle:8.5-jdk17-alpine AS builder

WORKDIR /app

# ルートのビルドファイルをコピー
COPY build.gradle settings.gradle gradle.properties ./
COPY gradle ./gradle

# このサービスのソースをコピー
COPY membership-service/build.gradle ./membership-service/
COPY membership-service/src ./membership-service/src

# ビルド実行
RUN cd membership-service && gradle build --no-daemon -x test

# 実行用イメージ
FROM eclipse-temurin:17-jre-alpine

RUN apk add --no-cache wget

WORKDIR /app

# JARファイルをコピー
COPY --from=builder /app/membership-service/build/libs/*.jar app.jar

EXPOSE 8081

ENV SPRING_PROFILES_ACTIVE=docker

ENTRYPOINT ["java", "-jar", "app.jar"]

