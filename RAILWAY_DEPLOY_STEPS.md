# Railwayデプロイ手順 - ステップバイステップガイド

## 🚀 クイックデプロイ手順

### ステップ1: Railwayアカウントの作成

1. https://railway.app にアクセス
2. 「Start a New Project」をクリック
3. GitHubアカウントでサインイン

### ステップ2: プロジェクトの作成

1. Railwayダッシュボードで「New Project」をクリック
2. 「Deploy from GitHub repo」を選択
3. リポジトリ `membership` を選択
4. **Root Directory**: `.` (ルートディレクトリ) を指定

### ステップ3: PostgreSQLデータベースの追加

1. Railwayプロジェクトで「New」→「Database」→「Add PostgreSQL」を選択
2. PostgreSQLサービスが作成されます
3. PostgreSQLサービスの「Variables」タブを開き、以下の接続情報を**必ず控えておいてください**：
   - `PGHOST` (ホスト名)
   - `PGPORT` (ポート番号、通常は5432)
   - `PGDATABASE` (データベース名)
   - `PGUSER` (ユーザー名)
   - `PGPASSWORD` (パスワード)

### ステップ4: データベースの初期化

PostgreSQLサービスが作成されたら、以下の手順で初期データを投入します：

1. PostgreSQLサービスの「Data」タブを開く
2. 「Connect」ボタンをクリック
3. 以下のSQLを実行：

```sql
-- init.sqlの内容をコピー＆ペーストして実行
```

または、Railway CLIを使用：

```bash
railway connect postgres
psql < init.sql
```

### ステップ5: docker-compose.ymlのデプロイ

Railwayは自動的に`docker-compose.yml`を検出し、各サービスを個別にデプロイします。

**注意**: Railwayでは、`docker-compose.yml`の各サービスが独立したサービスとして扱われます。

### ステップ6: 各サービスの環境変数設定

Railwayダッシュボードで、各サービスに対して環境変数を設定します。

#### 6-1. eureka-server

```env
SPRING_PROFILES_ACTIVE=docker
```

#### 6-2. config-server

```env
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

**注意**: `eureka-server`のサービス名が解決されない場合は、公開URLを使用してください。

#### 6-3. membership-service, payment-service, lesson-service, store-service, integration-service

各サービスに対して、以下の環境変数を設定します。
**`[ ]`内の値は、ステップ3で控えたPostgreSQLの接続情報に置き換えてください。**

```env
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
SPRING_DATASOURCE_URL=jdbc:postgresql://[PGHOST]:[PGPORT]/[PGDATABASE]
SPRING_DATASOURCE_USERNAME=[PGUSER]
SPRING_DATASOURCE_PASSWORD=[PGPASSWORD]
```

**実例**（PostgreSQLサービスの接続情報が以下の場合）：
- `PGHOST`: `containers-us-west-xxx.railway.app`
- `PGPORT`: `5432`
- `PGDATABASE`: `railway`
- `PGUSER`: `postgres`
- `PGPASSWORD`: `your-password-here`

```env
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
SPRING_DATASOURCE_URL=jdbc:postgresql://containers-us-west-xxx.railway.app:5432/railway
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-password-here
```

#### 6-4. api-gateway

```env
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

#### 6-5. frontend

**重要**: `api-gateway`の公開URLを取得してから設定してください。

```env
NEXT_PUBLIC_API_URL=https://your-api-gateway-service.up.railway.app
NODE_ENV=production
```

### ステップ7: デプロイ順序の確認

Railwayは自動的にデプロイしますが、以下の順序で起動することを確認してください：

1. ✅ PostgreSQL (RailwayのPostgreSQLサービス)
2. ✅ eureka-server (サービスディスカバリー)
3. ✅ config-server (eureka-serverに依存)
4. ✅ membership-service, payment-service, lesson-service, store-service, integration-service (postgresとeureka-serverに依存)
5. ✅ api-gateway (すべてのサービスに依存)
6. ✅ frontend (api-gatewayに依存)

### ステップ8: デプロイ後の確認

1. **各サービスのログを確認**
   - Railwayダッシュボードで各サービスのログを確認
   - エラーが発生していないか確認

2. **ヘルスチェック**
   - Eureka Dashboard: `https://eureka-server.up.railway.app`
   - API Gateway: `https://api-gateway.up.railway.app`
   - Frontend: `https://frontend.up.railway.app`

3. **API接続確認**
   - FrontendからAPI Gatewayに接続できるか確認

## 🔧 トラブルシューティング

### データベース接続エラー

**エラー**: `Unable to determine Dialect without JDBC metadata`

**解決策**:
1. PostgreSQLサービスの「Variables」タブで接続情報を確認
2. 各Spring Bootサービスで環境変数が正しく設定されているか確認
3. `SPRING_DATASOURCE_URL`に実際のホスト名が設定されているか確認

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

## 📝 環境変数設定のコピー用テンプレート

### eureka-server
```
SPRING_PROFILES_ACTIVE=docker
```

### config-server
```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

### membership-service, payment-service, lesson-service, store-service, integration-service
```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
SPRING_DATASOURCE_URL=jdbc:postgresql://[PGHOST]:[PGPORT]/[PGDATABASE]
SPRING_DATASOURCE_USERNAME=[PGUSER]
SPRING_DATASOURCE_PASSWORD=[PGPASSWORD]
```

### api-gateway
```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

### frontend
```
NEXT_PUBLIC_API_URL=https://your-api-gateway-service.up.railway.app
NODE_ENV=production
```

## 📚 参考資料

- [Railway公式ドキュメント](https://docs.railway.app)
- [RailwayでのDocker Compose使用](https://docs.railway.app/deploy/dockerfiles#docker-compose)
- [Railwayでの環境変数](https://docs.railway.app/deploy/environment-variables)

