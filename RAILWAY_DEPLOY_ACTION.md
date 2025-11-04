# 🚀 Railwayデプロイ - 実行手順

## 今すぐデプロイを開始する

### 方法1: Railway Dashboard経由（推奨）

#### ステップ1: Railwayアカウント作成

1. **https://railway.app** にアクセス
2. 「Start a New Project」をクリック
3. GitHubアカウントでサインイン

#### ステップ2: プロジェクト作成

1. Railwayダッシュボードで「New Project」をクリック
2. 「Deploy from GitHub repo」を選択
3. リポジトリ `membership` を選択
4. **Root Directory**: `.` (ルートディレクトリ) を指定
5. 「Deploy」をクリック

**注意**: Railwayは自動的に`docker-compose.yml`を検出し、各サービスを個別にデプロイします。

#### ステップ3: PostgreSQLデータベースの追加

1. Railwayプロジェクトで「New」→「Database」→「Add PostgreSQL」を選択
2. PostgreSQLサービスが作成されます
3. **重要**: PostgreSQLサービスの「Variables」タブを開く
4. 以下の接続情報を**必ず控えておく**：
   - `PGHOST` = _______________________________
   - `PGPORT` = _______________________________
   - `PGDATABASE` = _______________________________
   - `PGUSER` = _______________________________
   - `PGPASSWORD` = _______________________________

#### ステップ4: データベースの初期化

1. PostgreSQLサービスの「Data」タブを開く
2. 「Connect」ボタンをクリック
3. SQL Editorが開きます
4. `init.sql` ファイルの内容をコピー＆ペースト
5. 「Run」ボタンをクリックして実行

#### ステップ5: 環境変数の設定

各サービスに対して、以下の環境変数を設定します。

**設定方法:**
1. Railwayダッシュボードで各サービスを選択
2. 「Variables」タブを開く
3. 「New Variable」をクリック
4. 環境変数名と値を入力
5. 「Add」をクリック

**環境変数一覧** (`railway-env-template.txt` を参照):

**eureka-server:**
```
SPRING_PROFILES_ACTIVE=docker
```

**config-server:**
```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

**membership-service, payment-service, lesson-service, store-service, integration-service:**
```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
SPRING_DATASOURCE_URL=jdbc:postgresql://[PGHOST]:[PGPORT]/[PGDATABASE]
SPRING_DATASOURCE_USERNAME=[PGUSER]
SPRING_DATASOURCE_PASSWORD=[PGPASSWORD]
```

**重要**: `[PGHOST]`, `[PGPORT]`, `[PGDATABASE]`, `[PGUSER]`, `[PGPASSWORD]`は、ステップ3で控えたPostgreSQLの接続情報に置き換えてください。

**api-gateway:**
```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

**frontend:**
```
NEXT_PUBLIC_API_URL=https://[api-gatewayの公開URL]
NODE_ENV=production
```

**注意**: `[api-gatewayの公開URL]`は、ステップ6で生成した公開URLに置き換えてください。

#### ステップ6: 完全公開モードの設定

各サービス（eureka-server, api-gateway, frontend）に対して：

1. Railwayダッシュボードで各サービスを選択
2. 「Settings」タブを開く
3. 「Generate Domain」をクリックして公開URLを生成
4. 公開URLを確認

**生成される公開URLの例:**
- Eureka Server: `https://eureka-server-production.up.railway.app`
- API Gateway: `https://api-gateway-production.up.railway.app`
- Frontend: `https://frontend-production.up.railway.app`

#### ステップ7: フロントエンドの環境変数更新

`frontend`サービスの環境変数 `NEXT_PUBLIC_API_URL` を、ステップ6で生成したAPI Gatewayの公開URLに更新：

```
NEXT_PUBLIC_API_URL=https://api-gateway-production.up.railway.app
```

#### ステップ8: デプロイ確認

1. 各サービスのログを確認
2. エラーが発生していないか確認
3. 公開URLにアクセスして動作確認

---

### 方法2: Railway CLI経由

#### ステップ1: Railway CLIのインストール

```bash
npm install -g @railway/cli
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

#### ステップ4: デプロイ

```bash
railway up
```

**注意**: Railway CLIを使用する場合でも、PostgreSQLデータベースの追加と環境変数の設定はDashboard経由で行う必要があります。

---

## 📋 デプロイ後の確認チェックリスト

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

---

## 🔧 トラブルシューティング

### データベース接続エラー

**エラー**: `Unable to determine Dialect without JDBC metadata`

**解決策:**
1. PostgreSQLサービスの「Variables」タブで接続情報を再確認
2. `SPRING_DATASOURCE_URL`に実際のホスト名が設定されているか確認
3. 各サービスを再デプロイ

### Eureka接続エラー

**エラー**: `Could not register service with Eureka`

**解決策:**
1. `eureka-server`が正常に起動しているか確認
2. `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`が正しく設定されているか確認

### サービス間通信エラー

**エラー**: `Connection refused` または `Name resolution failed`

**解決策:**
1. 各サービスの公開URLを取得
2. 環境変数で公開URLを使用

---

## 🎯 次のステップ

デプロイが完了したら：

1. **カスタムドメインの設定**（オプション）
2. **環境変数の最適化**
3. **モニタリングの設定**
4. **バックアップの設定**

---

## 📚 参考資料

- **詳細な手順**: `RAILWAY_PUBLIC_DEPLOY.md`
- **チェックリスト**: `RAILWAY_DEPLOY_CHECKLIST.md`
- **環境変数テンプレート**: `railway-env-template.txt`

---

## 🎉 デプロイ開始

**Railway Dashboard**: https://railway.app

すべての準備が整いました。上記の手順に従って、Railwayへの完全公開モードデプロイを開始してください。

