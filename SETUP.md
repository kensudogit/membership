# セットアップガイド

## 会員管理システム - セットアップ手順

### 必要なソフトウェア

1. **Java 17以上**
   - Oracle JDK 17 または OpenJDK 17
   - 確認: `java -version`

2. **Node.js 18以上**
   - Node.jsとnpmのインストール
   - 確認: `node --version` と `npm --version`

3. **Docker Desktop**
   - PostgreSQL 15をDockerで起動するため
   - 確認: `docker --version`

4. **Gradle 7.x以上** (オプション)
   - Gradle Wrapperが含まれているため不要な場合もあります
   - 確認: `gradle --version`

### 初回セットアップ

#### 1. データベースの準備

```bash
# PostgreSQLコンテナを起動
docker-compose up -d postgres

# データベースの接続確認（オプション）
docker exec -it membership-postgres psql -U membership_user -d membership_db
```

#### 2. バックエンドのビルド

```bash
# プロジェクトルートで実行
./gradlew build
```

#### 3. フロントエンドの依存関係インストール

```bash
cd frontend
npm install
```

### 起動方法

#### 方法1: 一括起動スクリプト (Windows)

```bash
start.bat
```

#### 方法2: 個別起動

**ターミナル1 - Eureka Server:**
```bash
cd eureka-server
../gradlew bootRun
```

**ターミナル2 - Membership Service:**
```bash
cd membership-service
../gradlew bootRun
```

**ターミナル3 - Payment Service:**
```bash
cd payment-service
../gradlew bootRun
```

**ターミナル4 - Lesson Service:**
```bash
cd lesson-service
../gradlew bootRun
```

**ターミナル5 - Store Service:**
```bash
cd store-service
../gradlew bootRun
```

**ターミナル6 - API Gateway:**
```bash
cd api-gateway
../gradlew bootRun
```

**ターミナル7 - Frontend:**
```bash
cd frontend
npm run dev
```

### 動作確認

1. **Eureka Dashboard**: http://localhost:8761
   - すべてのサービスが登録されていることを確認

2. **API Gateway**: http://localhost:8080
   - ゲートウェイが正常に動作していることを確認

3. **Frontend**: http://localhost:3000
   - Webアプリケーションが正常に表示されることを確認

### トラブルシューティング

#### データベース接続エラー

```bash
# PostgreSQLコンテナの状態確認
docker ps

# ログ確認
docker logs membership-postgres

# コンテナの再起動
docker-compose restart postgres
```

#### ポート競合エラー

- ポートが使用中の場合、`application.yml`でポート番号を変更

#### サービスが見つからないエラー

- Eureka Serverが先に起動していることを確認
- 各サービスのログを確認

### 開発環境のカスタマイズ

#### データベース接続設定の変更

各サービスの`application.yml`を編集:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/membership_db
    username: membership_user
    password: membership_pass
```

#### フロントエンドのAPIエンドポイント変更

`frontend/next.config.js`を編集:
```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8080/api/:path*',
    },
  ];
}
```

