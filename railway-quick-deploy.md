# Railway クイックデプロイガイド

## 🚀 最速デプロイ手順

### 方法1: Railway Dashboard経由（推奨・最も簡単）

#### ステップ1: Railwayアカウント作成

1. https://railway.app にアクセス
2. 「Start a New Project」をクリック
3. GitHubアカウントでサインイン

#### ステップ2: プロジェクト作成

1. Railwayダッシュボードで「New Project」をクリック
2. 「Deploy from GitHub repo」を選択
3. リポジトリ `membership` を選択
4. **Root Directory**: `.` を指定

#### ステップ3: PostgreSQLデータベースの追加

1. Railwayプロジェクトで「New」→「Database」→「Add PostgreSQL」を選択
2. PostgreSQLサービスが作成されます
3. PostgreSQLサービスの「Variables」タブを開く
4. 以下の接続情報を**必ず控えておく**：
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`

#### ステップ4: データベースの初期化

1. PostgreSQLサービスの「Data」タブを開く
2. 「Connect」ボタンをクリック
3. SQL Editorで以下を実行：

```sql
-- init.sqlの内容をコピー＆ペースト
```

または、Railway CLIを使用：

```bash
railway connect postgres
psql < init.sql
```

#### ステップ5: 各サービスの環境変数設定

Railwayは自動的に`docker-compose.yml`を検出し、各サービスを個別にデプロイします。

各サービスに対して、以下の環境変数を設定してください：

**🔹 eureka-server**
```
SPRING_PROFILES_ACTIVE=docker
```

**🔹 config-server**
```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

**🔹 membership-service, payment-service, lesson-service, store-service, integration-service**
```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
SPRING_DATASOURCE_URL=jdbc:postgresql://[PGHOST]:[PGPORT]/[PGDATABASE]
SPRING_DATASOURCE_USERNAME=[PGUSER]
SPRING_DATASOURCE_PASSWORD=[PGPASSWORD]
```

**重要**: `[PGHOST]`, `[PGPORT]`, `[PGDATABASE]`, `[PGUSER]`, `[PGPASSWORD]`は、ステップ3で控えたPostgreSQLの接続情報に置き換えてください。

**実例**:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://containers-us-west-xxx.railway.app:5432/railway
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-password-here
```

**🔹 api-gateway**
```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

**🔹 frontend**
```
NEXT_PUBLIC_API_URL=https://your-api-gateway-service.up.railway.app
NODE_ENV=production
```

**注意**: `NEXT_PUBLIC_API_URL`は、`api-gateway`サービスの公開URL（`https://api-gateway.up.railway.app`など）に置き換えてください。

#### ステップ6: デプロイ確認

1. 各サービスのログを確認
2. Eureka Dashboard: `https://eureka-server.up.railway.app`
3. API Gateway: `https://api-gateway.up.railway.app`
4. Frontend: `https://frontend.up.railway.app`

---

### 方法2: Railway CLI経由

#### ステップ1: Railway CLIのインストール

```bash
npm install -g @railway/cli
```

または、Windowsで：

```bash
choco install railway
```

#### ステップ2: ログイン

```bash
railway login
```

#### ステップ3: プロジェクト作成

```bash
cd C:\workspace\membership
railway init
```

#### ステップ4: PostgreSQLデータベースの追加

Railway Dashboardから手動で追加：
1. Railway Dashboard → プロジェクト → 「New」→「Database」→「Add PostgreSQL」

#### ステップ5: 環境変数の設定

Railway CLIを使用して環境変数を設定：

```bash
# eureka-server
railway variables set SPRING_PROFILES_ACTIVE=docker --service eureka-server

# membership-service
railway variables set SPRING_PROFILES_ACTIVE=docker --service membership-service
railway variables set EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/ --service membership-service
railway variables set SPRING_DATASOURCE_URL=jdbc:postgresql://[PGHOST]:[PGPORT]/[PGDATABASE] --service membership-service
railway variables set SPRING_DATASOURCE_USERNAME=[PGUSER] --service membership-service
railway variables set SPRING_DATASOURCE_PASSWORD=[PGPASSWORD] --service membership-service

# 他のサービスも同様に設定
```

#### ステップ6: デプロイ

```bash
railway up
```

---

## 📋 環境変数設定のチェックリスト

各サービスで以下の環境変数が設定されているか確認してください：

- [ ] **eureka-server**: `SPRING_PROFILES_ACTIVE`
- [ ] **config-server**: `SPRING_PROFILES_ACTIVE`, `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`
- [ ] **membership-service**: `SPRING_PROFILES_ACTIVE`, `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`, `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
- [ ] **payment-service**: 同上
- [ ] **lesson-service**: 同上
- [ ] **store-service**: 同上
- [ ] **integration-service**: 同上
- [ ] **api-gateway**: `SPRING_PROFILES_ACTIVE`, `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`
- [ ] **frontend**: `NEXT_PUBLIC_API_URL`, `NODE_ENV`

---

## 🔧 トラブルシューティング

### データベース接続エラー

**エラー**: `Unable to determine Dialect without JDBC metadata`

**解決策**:
1. PostgreSQLサービスの「Variables」タブで接続情報を確認
2. `SPRING_DATASOURCE_URL`に実際のホスト名が設定されているか確認
3. `SPRING_DATASOURCE_USERNAME`と`SPRING_DATASOURCE_PASSWORD`が正しく設定されているか確認

### Eureka接続エラー

**エラー**: `Could not register service with Eureka`

**解決策**:
1. `eureka-server`が正常に起動しているか確認
2. `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`が正しく設定されているか確認
3. `eureka-server`の公開URLを使用する場合は、HTTPSを使用

### サービス間通信エラー

**エラー**: `Connection refused` または `Name resolution failed`

**解決策**:
1. 各サービスの公開URLを取得
2. 環境変数で公開URLを使用
3. Railwayのサービス間通信設定を確認

---

## 📚 参考資料

- [Railway公式ドキュメント](https://docs.railway.app)
- [RailwayでのDocker Compose使用](https://docs.railway.app/deploy/dockerfiles#docker-compose)
- [Railwayでの環境変数](https://docs.railway.app/deploy/environment-variables)

