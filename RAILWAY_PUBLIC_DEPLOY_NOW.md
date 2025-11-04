# 🚀 Railway完全公開モードデプロイ - 今すぐ開始

## ✅ 準備完了

Railwayへの完全公開モードデプロイに必要なファイルはすべて準備できました。

## 📋 デプロイ手順（ステップバイステップ）

### ステップ1: Railway Dashboardにアクセス（2分）

1. **https://railway.app** にアクセス
2. GitHubアカウントでサインイン
3. 「Start a New Project」をクリック

### ステップ2: プロジェクト作成（3分）

1. Railwayダッシュボードで「New Project」をクリック
2. 「Deploy from GitHub repo」を選択
3. リポジトリ `membership` を選択
4. **Root Directory**: `.` (ルートディレクトリ) を指定
5. 「Deploy」をクリック

**注意**: Railwayは自動的に`docker-compose.yml`を検出し、各サービスを個別にデプロイします。

### ステップ3: PostgreSQLデータベースの追加（5分）

1. Railwayプロジェクトで「New」→「Database」→「Add PostgreSQL」を選択
2. PostgreSQLサービスが作成されます
3. **重要**: PostgreSQLサービスの「Variables」タブを開く
4. 以下の接続情報を**必ず控えておく**：
   - `PGHOST` = _______________________________
   - `PGPORT` = _______________________________
   - `PGDATABASE` = _______________________________
   - `PGUSER` = _______________________________
   - `PGPASSWORD` = _______________________________

### ステップ4: データベースの初期化（5分）

1. PostgreSQLサービスの「Data」タブを開く
2. 「Connect」ボタンをクリック
3. SQL Editorが開きます
4. `init.sql` ファイルの内容をコピー＆ペースト
5. 「Run」ボタンをクリックして実行
6. 初期データが投入されたことを確認

### ステップ5: 環境変数の設定（15分）

各サービスに対して、以下の環境変数を設定します。

**設定方法:**
1. Railwayダッシュボードで各サービスを選択
2. 「Variables」タブを開く
3. 「New Variable」をクリック
4. 環境変数名と値を入力
5. 「Add」をクリック

#### 🔹 eureka-server

```
SPRING_PROFILES_ACTIVE=docker
```

#### 🔹 config-server（オプション - エラーが発生する場合は無視してもOK）

```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

#### 🔹 membership-service, payment-service, lesson-service, store-service, integration-service

**重要**: `[PGHOST]`, `[PGPORT]`, `[PGDATABASE]`, `[PGUSER]`, `[PGPASSWORD]`は、ステップ3で控えたPostgreSQLの接続情報に置き換えてください。

```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
SPRING_DATASOURCE_URL=jdbc:postgresql://[PGHOST]:[PGPORT]/[PGDATABASE]
SPRING_DATASOURCE_USERNAME=[PGUSER]
SPRING_DATASOURCE_PASSWORD=[PGPASSWORD]
```

**実例（PostgreSQLサービスの接続情報が以下の場合）:**
- PGHOST: `containers-us-west-xxx.railway.app`
- PGPORT: `5432`
- PGDATABASE: `railway`
- PGUSER: `postgres`
- PGPASSWORD: `your-password-here`

設定する環境変数:
```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
SPRING_DATASOURCE_URL=jdbc:postgresql://containers-us-west-xxx.railway.app:5432/railway
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-password-here
```

#### 🔹 api-gateway

```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

#### 🔹 frontend（一時的な設定 - ステップ6で更新）

```
NEXT_PUBLIC_API_URL=http://api-gateway:8080
NODE_ENV=production
```

### ステップ6: 完全公開モードの設定（重要！）（10分）

#### 6-1. 各サービスの公開URL生成

各サービス（eureka-server, api-gateway, frontend）に対して、公開URLを生成します：

1. Railwayダッシュボードで各サービスを選択
2. 「Settings」タブを開く
3. 「Generate Domain」をクリックして公開URLを生成
4. 公開URLが生成されます（例: `https://eureka-server-production.up.railway.app`）

**生成するサービス:**
- ✅ **eureka-server** - Eureka Dashboard用
- ✅ **api-gateway** - API Gateway用（重要！）
- ✅ **frontend** - フロントエンド用（重要！）

#### 6-2. 公開URLの確認

各サービスの公開URLを確認し、**必ず控えておく**：

- **Eureka Server**: `https://eureka-server-production.up.railway.app`
- **API Gateway**: `https://api-gateway-production.up.railway.app` ← **重要！**
- **Frontend**: `https://frontend-production.up.railway.app` ← **重要！**

**注意**: 実際のURLは、Railwayが自動生成するため、上記のURLとは異なる場合があります。
各サービスの「Settings」タブで実際の公開URLを確認してください。

#### 6-3. フロントエンドの環境変数更新

`frontend`サービスの環境変数 `NEXT_PUBLIC_API_URL` を、実際のAPI Gatewayの公開URLに更新：

1. `frontend`サービスの「Variables」タブを開く
2. `NEXT_PUBLIC_API_URL` を編集
3. 値を実際のAPI Gatewayの公開URLに変更（例: `https://api-gateway-production.up.railway.app`）
4. 「Save」をクリック

**更新後の環境変数:**
```
NEXT_PUBLIC_API_URL=https://api-gateway-production.up.railway.app
NODE_ENV=production
```

#### 6-4. CORS設定の確認（オプション）

API GatewayサービスでCORS設定を確認：

1. API Gatewayサービスの「Settings」タブを開く
2. 環境変数に以下を追加（必要に応じて）：

```
CORS_ALLOWED_ORIGINS=https://frontend-production.up.railway.app
```

### ステップ7: デプロイ確認（10分）

1. **各サービスのログを確認**
   - Railwayダッシュボードで各サービスのログを確認
   - エラーが発生していないか確認
   - 特に `membership-service`, `payment-service`, `lesson-service`, `store-service`, `integration-service` のデータベース接続エラーがないか確認

2. **公開URLへのアクセス確認**
   - Eureka Dashboard: `https://eureka-server-production.up.railway.app`
   - API Gateway: `https://api-gateway-production.up.railway.app`
   - Frontend: `https://frontend-production.up.railway.app`

3. **機能確認**
   - ✅ フロントエンドが表示される
   - ✅ API Gatewayに接続できる
   - ✅ データベースからデータを取得できる
   - ✅ Eureka Dashboardでサービスが登録されている

### ステップ8: カスタムドメインの設定（オプション）

1. Railwayダッシュボードで各サービスを選択
2. 「Settings」タブを開く
3. 「Domains」セクションでカスタムドメインを追加
4. DNS設定を更新

---

## 📋 公開URLの一覧

デプロイが完了したら、以下のURLが生成されます：

- **Eureka Dashboard**: `https://eureka-server-production.up.railway.app`
- **API Gateway**: `https://api-gateway-production.up.railway.app`
- **Frontend**: `https://frontend-production.up.railway.app`

**注意**: 実際のURLは、Railwayが自動生成するため、上記のURLとは異なる場合があります。
各サービスの「Settings」タブで実際の公開URLを確認してください。

---

## 🔒 セキュリティ設定

### 1. 環境変数の保護

- 機密情報（パスワード、APIキーなど）は環境変数で管理
- Railway Dashboardで環境変数を設定
- 公開リポジトリに機密情報をコミットしない

### 2. CORS設定

API GatewayサービスでCORS設定を確認：

```
CORS_ALLOWED_ORIGINS=https://frontend-production.up.railway.app
```

### 3. 認証設定

必要に応じて、各サービスで認証を設定：

- OAuth2/JWT認証
- APIキー認証
- IPアドレス制限

---

## 🔧 トラブルシューティング

### データベース接続エラー

**エラー**: `Unable to determine Dialect without JDBC metadata` または `Connection refused`

**解決策:**
1. PostgreSQLサービスの「Variables」タブで接続情報を再確認
2. `SPRING_DATASOURCE_URL`に実際のホスト名（`PGHOST`の値）が設定されているか確認
3. `SPRING_DATASOURCE_USERNAME`と`SPRING_DATASOURCE_PASSWORD`が正しく設定されているか確認
4. 各サービスを再デプロイ（「Restart」ボタンをクリック）

### Eureka接続エラー

**エラー**: `Could not register service with Eureka`

**解決策:**
1. `eureka-server`が正常に起動しているか確認
2. `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`が正しく設定されているか確認
3. `eureka-server`の公開URLを使用する場合は、HTTPSを使用

### サービス間通信エラー

**エラー**: `Connection refused` または `Name resolution failed`

**解決策:**
1. 各サービスの公開URLを取得
2. 環境変数で公開URLを使用
3. Railwayのサービス間通信設定を確認

### CORSエラー

**エラー**: `CORS policy: No 'Access-Control-Allow-Origin' header is present`

**解決策:**
1. API GatewayサービスでCORS設定を確認
2. `CORS_ALLOWED_ORIGINS`環境変数を設定
3. フロントエンドの公開URLを許可リストに追加

---

## 📝 デプロイ後の確認チェックリスト

- [ ] PostgreSQLサービスが正常に起動している
- [ ] eureka-serverが正常に起動している
- [ ] config-serverが正常に起動している（エラーが発生する場合は無視してもOK）
- [ ] membership-serviceが正常に起動している
- [ ] payment-serviceが正常に起動している
- [ ] lesson-serviceが正常に起動している
- [ ] store-serviceが正常に起動している
- [ ] integration-serviceが正常に起動している
- [ ] api-gatewayが正常に起動している
- [ ] frontendが正常に起動している
- [ ] Eureka Dashboardでサービスが登録されている
- [ ] フロントエンドからAPI Gatewayに接続できる
- [ ] データベースからデータを取得できる
- [ ] 公開URLにアクセスできる
- [ ] CORS設定が正しく設定されている

---

## 🎯 次のステップ

デプロイが完了したら：

1. **カスタムドメインの設定**（オプション）
   - Railway Dashboard → プロジェクト → 「Settings」→「Domains」
   - カスタムドメインを追加

2. **環境変数の最適化**
   - 本番環境用の設定を追加
   - セキュリティ設定の強化

3. **モニタリングの設定**
   - Railway Dashboardでログを確認
   - メトリクスを監視

4. **バックアップの設定**
   - PostgreSQLデータベースのバックアップ設定
   - 定期的なバックアップのスケジュール設定

---

## 📚 参考資料

- [Railway公式ドキュメント](https://docs.railway.app)
- [RailwayでのDocker Compose使用](https://docs.railway.app/deploy/dockerfiles#docker-compose)
- [Railwayでの環境変数](https://docs.railway.app/deploy/environment-variables)
- [Railwayでの公開設定](https://docs.railway.app/deploy/domains)

---

## 🎉 デプロイ完了

すべてのサービスが正常にデプロイされ、公開URLにアクセスできるようになりました！

**デプロイを開始する**: https://railway.app

