# プロジェクト構造

## ディレクトリ構成

```
membership/
├── api-gateway/              # API Gateway サービス
│   ├── build.gradle
│   └── src/main/java/com/membership/gateway/
│       └── ApiGatewayApplication.java
│
├── config-server/           # Config Server サービス
│   ├── build.gradle
│   └── src/main/java/com/membership/config/
│       └── ConfigServerApplication.java
│
├── eureka-server/            # Eureka Server (Service Discovery)
│   ├── build.gradle
│   └── src/main/java/com/membership/eureka/
│       └── EurekaServerApplication.java
│
├── membership-service/       # 会員管理サービス (メインサービス)
│   ├── build.gradle
│   └── src/main/java/com/membership/
│       ├── MembershipServiceApplication.java
│       ├── controller/
│       │   └── MemberController.java
│       ├── entity/
│       │   ├── Member.java
│       │   └── MemberCard.java
│       ├── repository/
│       │   ├── MemberRepository.java
│       │   └── MemberCardRepository.java
│       ├── service/
│       │   ├── MemberService.java
│       │   └── FaceRecognitionService.java
│       └── security/
│           ├── SecurityConfig.java
│           └── IpRestrictionFilter.java
│
├── payment-service/          # 決済サービス
│   ├── build.gradle
│   └── src/main/java/com/membership/payment/
│       └── PaymentServiceApplication.java
│
├── lesson-service/           # レッスン管理サービス
│   ├── build.gradle
│   └── src/main/java/com/membership/lesson/
│       └── LessonServiceApplication.java
│
├── store-service/            # 店舗管理サービス
│   ├── build.gradle
│   └── src/main/java/com/membership/store/
│       └── StoreServiceApplication.java
│
├── integration-service/      # 外部連携サービス
│   ├── build.gradle
│   └── src/main/java/com/membership/integration/
│       ├── IntegrationServiceApplication.java
│       └── service/
│           ├── GolfSimulatorService.java
│           └── HydrogenWaterService.java
│
├── frontend/                  # フロントエンドアプリケーション
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx          # ホームページ
│       │   ├── globals.css
│       │   └── members/
│       │       └── page.tsx      # 会員一覧ページ
│       └── components/
│           └── providers/
│               └── ThemeProvider.tsx
│
├── build.gradle              # ルートビルド設定
├── settings.gradle           # プロジェクト設定
├── gradle.properties        # Gradle プロパティ
├── docker-compose.yml        # Docker Compose設定
├── init.sql                  # データベース初期化SQL
├── start.bat                 # 一括起動スクリプト (Windows)
├── README.md                 # プロジェクト概要
├── SETUP.md                  # セットアップガイド
└── .gitignore                # Git除外設定

```

## サービス構成

### ポート番号

- **Eureka Server**: 8761
- **API Gateway**: 8080
- **Membership Service**: 8081
- **Payment Service**: 8082
- **Lesson Service**: 8083
- **Store Service**: 8084
- **Integration Service**: 8085
- **Config Server**: 8888
- **Frontend**: 3000

### データベース

- **PostgreSQL**: 5432
- **データベース名**: membership_db
- **ユーザー名**: membership_user
- **パスワード**: membership_pass

## 技術スタック詳細

### バックエンド

- **Java**: 17
- **Spring Boot**: 3.2.0
- **Spring Cloud**: 2023.0.0
- **Spring Data JPA**: データアクセス
- **Spring Security**: 認証・認可
- **PostgreSQL**: データベース
- **Eureka**: サービスディスカバリー
- **Spring Cloud Gateway**: API Gateway
- **Swagger/OpenAPI**: API ドキュメント

### フロントエンド

- **React**: 18.2.0
- **Next.js**: 14.0.4
- **TypeScript**: 5.2.2
- **Vite**: 5.0.8 (テスト用)
- **Tailwind CSS**: 3.3.6
- **Framer Motion**: アニメーション
- **React Query**: データフェッチング
- **Vitest**: テストフレームワーク

## 主要機能マッピング

| 機能 | サービス | エンティティ |
|------|---------|-------------|
| 会員管理 | membership-service | Member, MemberCard |
| 会費請求 | payment-service | MembershipBill, BankAccount, CreditCard |
| レッスン予約 | lesson-service | Lesson, LessonBooking |
| 店舗管理 | store-service | Store |
| 外部連携 | integration-service | ExternalIntegration, DeviceUsageLog |
| 来場管理 | membership-service | VisitRecord |
| 販売管理 | store-service | Product, Sale |

