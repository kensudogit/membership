# Railwayデプロイチェックリスト

## ✅ デプロイ前の準備

### 1. Railwayアカウント
- [ ] Railwayアカウントを作成 (https://railway.app)
- [ ] GitHubアカウントと連携

### 2. Railway CLI（オプション）
- [ ] Railway CLIをインストール (`npm install -g @railway/cli`)
- [ ] Railwayにログイン (`railway login`)

### 3. GitHubリポジトリ
- [ ] リポジトリがGitHubにプッシュされている
- [ ] Railwayからリポジトリにアクセスできる

---

## 🚀 デプロイ手順

### ステップ1: プロジェクト作成
- [ ] Railway Dashboardで「New Project」をクリック
- [ ] 「Deploy from GitHub repo」を選択
- [ ] `membership` リポジトリを選択
- [ ] Root Directory: `.` を指定

### ステップ2: PostgreSQLデータベースの追加
- [ ] Railwayプロジェクトで「New」→「Database」→「Add PostgreSQL」を選択
- [ ] PostgreSQLサービスの「Variables」タブを開く
- [ ] 以下の接続情報を**必ず控える**：
  - [ ] `PGHOST` = _______________________________
  - [ ] `PGPORT` = _______________________________
  - [ ] `PGDATABASE` = _______________________________
  - [ ] `PGUSER` = _______________________________
  - [ ] `PGPASSWORD` = _______________________________

### ステップ3: データベースの初期化
- [ ] PostgreSQLサービスの「Data」タブを開く
- [ ] 「Connect」ボタンをクリック
- [ ] SQL Editorで `init.sql` の内容をコピー＆ペーストして実行
- [ ] 初期データが投入されたことを確認

### ステップ4: 各サービスの環境変数設定

#### eureka-server
- [ ] `SPRING_PROFILES_ACTIVE` = `docker`

#### config-server
- [ ] `SPRING_PROFILES_ACTIVE` = `docker`
- [ ] `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` = `http://eureka-server:8761/eureka/`

#### membership-service
- [ ] `SPRING_PROFILES_ACTIVE` = `docker`
- [ ] `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` = `http://eureka-server:8761/eureka/`
- [ ] `SPRING_DATASOURCE_URL` = `jdbc:postgresql://[PGHOST]:[PGPORT]/[PGDATABASE]`
- [ ] `SPRING_DATASOURCE_USERNAME` = `[PGUSER]`
- [ ] `SPRING_DATASOURCE_PASSWORD` = `[PGPASSWORD]`

#### payment-service
- [ ] `SPRING_PROFILES_ACTIVE` = `docker`
- [ ] `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` = `http://eureka-server:8761/eureka/`
- [ ] `SPRING_DATASOURCE_URL` = `jdbc:postgresql://[PGHOST]:[PGPORT]/[PGDATABASE]`
- [ ] `SPRING_DATASOURCE_USERNAME` = `[PGUSER]`
- [ ] `SPRING_DATASOURCE_PASSWORD` = `[PGPASSWORD]`

#### lesson-service
- [ ] `SPRING_PROFILES_ACTIVE` = `docker`
- [ ] `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` = `http://eureka-server:8761/eureka/`
- [ ] `SPRING_DATASOURCE_URL` = `jdbc:postgresql://[PGHOST]:[PGPORT]/[PGDATABASE]`
- [ ] `SPRING_DATASOURCE_USERNAME` = `[PGUSER]`
- [ ] `SPRING_DATASOURCE_PASSWORD` = `[PGPASSWORD]`

#### store-service
- [ ] `SPRING_PROFILES_ACTIVE` = `docker`
- [ ] `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` = `http://eureka-server:8761/eureka/`
- [ ] `SPRING_DATASOURCE_URL` = `jdbc:postgresql://[PGHOST]:[PGPORT]/[PGDATABASE]`
- [ ] `SPRING_DATASOURCE_USERNAME` = `[PGUSER]`
- [ ] `SPRING_DATASOURCE_PASSWORD` = `[PGPASSWORD]`

#### integration-service
- [ ] `SPRING_PROFILES_ACTIVE` = `docker`
- [ ] `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` = `http://eureka-server:8761/eureka/`
- [ ] `SPRING_DATASOURCE_URL` = `jdbc:postgresql://[PGHOST]:[PGPORT]/[PGDATABASE]`
- [ ] `SPRING_DATASOURCE_USERNAME` = `[PGUSER]`
- [ ] `SPRING_DATASOURCE_PASSWORD` = `[PGPASSWORD]`

#### api-gateway
- [ ] `SPRING_PROFILES_ACTIVE` = `docker`
- [ ] `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` = `http://eureka-server:8761/eureka/`
- [ ] 公開URLを取得: `https://________________.up.railway.app`

#### frontend
- [ ] `NEXT_PUBLIC_API_URL` = `https://[api-gatewayの公開URL]`
- [ ] `NODE_ENV` = `production`

---

## 🔍 デプロイ後の確認

### サービス確認
- [ ] PostgreSQLサービスが正常に起動している
- [ ] eureka-serverが正常に起動している
- [ ] config-serverが正常に起動している
- [ ] membership-serviceが正常に起動している
- [ ] payment-serviceが正常に起動している
- [ ] lesson-serviceが正常に起動している
- [ ] store-serviceが正常に起動している
- [ ] integration-serviceが正常に起動している
- [ ] api-gatewayが正常に起動している
- [ ] frontendが正常に起動している

### URL確認
- [ ] Eureka Dashboard: `https://eureka-server.up.railway.app`
- [ ] API Gateway: `https://api-gateway.up.railway.app`
- [ ] Frontend: `https://frontend.up.railway.app`

### 機能確認
- [ ] フロントエンドが表示される
- [ ] API Gatewayに接続できる
- [ ] データベースからデータを取得できる
- [ ] Eureka Dashboardでサービスが登録されている

---

## 🐛 トラブルシューティング

### データベース接続エラー
- [ ] PostgreSQLサービスの接続情報が正しいか確認
- [ ] 各サービスの環境変数が正しく設定されているか確認
- [ ] PostgreSQLサービスが正常に起動しているか確認

### Eureka接続エラー
- [ ] eureka-serverが正常に起動しているか確認
- [ ] `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`が正しく設定されているか確認
- [ ] eureka-serverの公開URLを使用している場合はHTTPSを使用

### サービス間通信エラー
- [ ] 各サービスの公開URLを取得
- [ ] 環境変数で公開URLを使用
- [ ] Railwayのサービス間通信設定を確認

---

## 📝 メモ

### PostgreSQL接続情報
```
PGHOST: _______________________________
PGPORT: _______________________________
PGDATABASE: _______________________________
PGUSER: _______________________________
PGPASSWORD: _______________________________
```

### サービス公開URL
```
Eureka Server: https://eureka-server.up.railway.app
API Gateway: https://api-gateway.up.railway.app
Frontend: https://frontend.up.railway.app
```

---

## 📚 参考資料

- [Railway公式ドキュメント](https://docs.railway.app)
- [RailwayでのDocker Compose使用](https://docs.railway.app/deploy/dockerfiles#docker-compose)
- [Railwayでの環境変数](https://docs.railway.app/deploy/environment-variables)

