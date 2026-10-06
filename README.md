# Membership Platform — Enterprise SaaS / Microservices

> **Enterprise Membership SaaS** — 入会・会員証・決済・予約・来場・店舗・分析・外部連携を、Spring Cloudベースのマイクロサービスとして構成した会員管理プラットフォームです。
>
> **Stack:** Java 17 · Spring Boot · Spring Cloud · PostgreSQL · Next.js · React · TypeScript · Docker

## Architecture

```text
Web / Tablet / Mobile
        │
        ▼
     Next.js UI
        │
        ▼
    API Gateway
        │
  ┌─────┼───────────────┐
  ▼     ▼       ▼       ▼
Member Payment Lesson  Store
Service Service Service Service
  │             │
  ├── Analytics / Integration
  ├── Eureka Service Discovery
  └── PostgreSQL
```

## Enterprise Capabilities

- 会員ライフサイクル管理
- 会費・商品などの決済管理
- レッスン予約・出席管理
- 来場・会員証・QRコード管理
- 顔認証およびIP制限
- 多店舗運営・店舗別設定
- 売上・会員・利用状況分析
- 外部機器・サービス連携
- OAuth2 / JWTベースの認証・認可
- API Gateway / Service Discoveryによる分散サービス構成

## Engineering Focus

- Spring Boot / Spring Cloudによる業務マイクロサービス
- ドメイン単位のサービス分割
- API Gatewayによる統合エンドポイント
- EurekaによるService Discovery
- PostgreSQLによる業務データ管理
- Next.js / React / TypeScriptによる管理・利用者UI
- Docker Composeによる複数サービスのローカル実行
- Enterprise SaaSに必要な認証・決済・予約・分析の統合

## Portfolio Context

This repository represents the **Enterprise SaaS / Business Systems** track of my portfolio. It demonstrates how multiple business domains can be separated into services while providing a unified user experience through an API gateway and modern web frontend.

## 機能概要

### 入会管理
- **Web入会**: Webサイトから会員登録
- **タブレット入会**: 店舗内タブレット端末からの会員登録

### 会員証管理
- 会員証発行・管理
- QRコード生成
- 有効期限管理

### ロッカー管理
- 契約ロッカー管理
- 利用状況追跡

### 販売管理
- 商品管理
- 販売履歴
- 在庫管理

### 来場管理
- 来場記録
- 顔認証連携
- IP制限機能

### 会費請求
- 口座振替による自動請求
- クレジットカードによる請求
- 請求履歴管理

### レッスン予約
- レッスンスケジュール管理
- 予約・キャンセル管理
- 出席管理

### スクール管理
- スクール情報管理
- インストラクター管理

### スマートフォンアプリ連携
- API連携
- モバイル向け最適化

### 商品管理
- 商品マスタ管理
- 価格・在庫管理

### データ分析
- 会員分析
- 売上分析
- 利用状況分析

### 多店舗展開機能
- 店舗マスタ管理
- 店舗別設定
- データ集計

### 外部連携
- ゴルフシュミレーター連携
- 水素水サーバー連携

### セキュリティ機能
- **顔認証**: 画像ベースの会員認証（FaceRecognitionService）
- **IP制限**: 会員ごとのIPアドレスホワイトリスト機能
- **電話サポート管理**: サポート履歴の記録と管理
- OAuth2/JWT認証対応

## 技術スタック

### バックエンド
- Java 17
- Spring Boot 3.2.0
- Spring Cloud
- PostgreSQL 15
- Spring Security
- JPA/Hibernate

### フロントエンド
- React 18
- Next.js 14
- TypeScript
- Vite
- Tailwind CSS
- Vitest

### インフラ
- Docker
- Docker Compose
- Eureka (Service Discovery)
- API Gateway

## プロジェクト構造

```
membership/
├── membership-service/     # 会員管理サービス
├── payment-service/        # 決済サービス
├── lesson-service/         # レッスン管理サービス
├── store-service/          # 店舗管理サービス
├── analytics-service/      # データ分析サービス
├── integration-service/    # 外部連携サービス
├── api-gateway/            # APIゲートウェイ
├── eureka-server/          # サービスディスカバリー
├── config-server/          # 設定サーバー
├── frontend/               # フロントエンドアプリケーション
└── docker-compose.yml      # Docker Compose設定
```

## セットアップ

### 前提条件
- Java 17以上
- Node.js 18以上
- Docker & Docker Compose
- PostgreSQL 15
- Gradle 7.x以上

### クイックスタート（Docker推奨）

全てのサービスをDockerコンテナで起動（推奨）:

```bash
# Windows
docker-start.bat

# Linux/Mac
docker-compose up -d --build
```

**Dockerを使わない場合:**

Windows環境の場合、`start.bat`を実行:
```bash
start.bat
```

これにより以下の順序でサービスが起動します:
1. PostgreSQL (Docker)
2. Eureka Server
3. Membership Service
4. Payment Service
5. Lesson Service
6. Store Service
7. API Gateway

詳細は [DOCKER.md](DOCKER.md) を参照してください。

### 手動セットアップ

#### 1. PostgreSQLの起動

```bash
docker-compose up -d postgres
```

#### 2. バックエンドサービスの起動

各サービスを順番に起動:

```bash
# Eureka Server
cd eureka-server
../gradlew bootRun

# Membership Service (別ターミナル)
cd membership-service
../gradlew bootRun

# Payment Service (別ターミナル)
cd payment-service
../gradlew bootRun

# Lesson Service (別ターミナル)
cd lesson-service
../gradlew bootRun

# Store Service (別ターミナル)
cd store-service
../gradlew bootRun

# API Gateway (別ターミナル)
cd api-gateway
../gradlew bootRun
```

#### 3. フロントエンドの起動

```bash
cd frontend
npm install
npm run dev
```

### アクセスURL

- **フロントエンド**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Swagger UI**: 
  - Membership Service: http://localhost:8081/swagger-ui.html
  - Payment Service: http://localhost:8082/swagger-ui.html
  - Lesson Service: http://localhost:8083/swagger-ui.html

## 環境変数

### Docker環境

Docker環境では、環境変数は`docker-compose.yml`で自動設定されます。各サービスはDockerネットワーク内で通信します。

### ローカル環境

各サービスで以下の環境変数を設定:

- `SPRING_DATASOURCE_URL`: PostgreSQL接続URL
- `SPRING_DATASOURCE_USERNAME`: データベースユーザー名
- `SPRING_DATASOURCE_PASSWORD`: データベースパスワード
- `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`: EurekaサーバーURL

## API ドキュメント

各サービス起動後、Swagger UIでAPIドキュメントを確認:
- **Membership Service**: http://localhost:8081/swagger-ui.html
- **Payment Service**: http://localhost:8082/swagger-ui.html
- **Lesson Service**: http://localhost:8083/swagger-ui.html
- **Store Service**: http://localhost:8084/swagger-ui.html
- **Integration Service**: http://localhost:8085/swagger-ui.html

## 主要APIエンドポイント

### 会員管理 (Membership Service)
- `POST /api/members` - 新規会員登録
- `GET /api/members` - 会員一覧取得
- `GET /api/members/{id}` - 会員情報取得
- `PUT /api/members/{id}` - 会員情報更新
- `DELETE /api/members/{id}` - 会員削除
- `POST /api/members/{memberId}/cards` - 会員証発行
- `GET /api/members/{memberId}/cards` - 会員証一覧取得

### 決済 (Payment Service)
- `POST /api/payments` - 決済処理
- `GET /api/payments/members/{memberId}` - 会員の決済履歴

### レッスン (Lesson Service)
- `GET /api/lessons` - レッスン一覧
- `POST /api/lessons/{lessonId}/bookings` - レッスン予約
- `GET /api/lessons/bookings/members/{memberId}` - 会員の予約一覧

## ライセンス

Copyright © 2024
