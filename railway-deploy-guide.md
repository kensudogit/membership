# Railwayデプロイ実行ガイド

## 🚀 今すぐデプロイを開始する方法

### 方法1: Railway Dashboard経由（推奨・最も簡単）

#### ステップ1: Railwayアカウント作成（5分）

1. **https://railway.app** にアクセス
2. 「Start a New Project」をクリック
3. GitHubアカウントでサインイン
4. リポジトリへのアクセスを許可

#### ステップ2: プロジェクト作成（2分）

1. Railwayダッシュボードで「New Project」をクリック
2. 「Deploy from GitHub repo」を選択
3. リポジトリ `membership` を選択
4. **Root Directory**: `.` (ルートディレクトリ) を指定
5. 「Deploy」をクリック

**注意**: Railwayは自動的に`docker-compose.yml`を検出し、各サービスを個別にデプロイします。

#### ステップ3: PostgreSQLデータベースの追加（3分）

1. Railwayプロジェクトで「New」→「Database」→「Add PostgreSQL」を選択
2. PostgreSQLサービスが作成されます
3. **重要**: PostgreSQLサービスの「Variables」タブを開く
4. 以下の接続情報を**必ず控えておく**：
   - `PGHOST` = _______________________________
   - `PGPORT` = _______________________________
   - `PGDATABASE` = _______________________________
   - `PGUSER` = _______________________________
   - `PGPASSWORD` = _______________________________

#### ステップ4: データベースの初期化（5分）

1. PostgreSQLサービスの「Data」タブを開く
2. 「Connect」ボタンをクリック
3. SQL Editorが開きます
4. `init.sql` ファイルの内容をコピー＆ペースト
5. 「Run」ボタンをクリックして実行
6. 初期データが投入されたことを確認

#### ステップ5: 環境変数の設定（10分）

各サービスに対して、以下の環境変数を設定します。

**設定方法:**
1. Railwayダッシュボードで各サービスを選択
2. 「Variables」タブを開く
3. 「New Variable」をクリック
4. 環境変数名と値を入力
5. 「Add」をクリック

**🔹 eureka-server**
```
SPRING_PROFILES_ACTIVE = docker
```

**🔹 config-server**
```
SPRING_PROFILES_ACTIVE = docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE = http://eureka-server:8761/eureka/
```

**🔹 membership-service, payment-service, lesson-service, store-service, integration-service**
```
SPRING_PROFILES_ACTIVE = docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE = http://eureka-server:8761/eureka/
SPRING_DATASOURCE_URL = jdbc:postgresql://[PGHOST]:[PGPORT]/[PGDATABASE]
SPRING_DATASOURCE_USERNAME = [PGUSER]
SPRING_DATASOURCE_PASSWORD = [PGPASSWORD]
```

**重要**: `[PGHOST]`, `[PGPORT]`, `[PGDATABASE]`, `[PGUSER]`, `[PGPASSWORD]`は、ステップ3で控えたPostgreSQLの接続情報に置き換えてください。

**🔹 api-gateway**
```
SPRING_PROFILES_ACTIVE = docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE = http://eureka-server:8761/eureka/
```

**🔹 frontend**
```
NEXT_PUBLIC_API_URL = https://[api-gatewayの公開URL]
NODE_ENV = production
```

**注意**: `[api-gatewayの公開URL]`は、`api-gateway`サービスの「Settings」タブで確認できる公開URLに置き換えてください（例: `https://api-gateway-production.up.railway.app`）。

#### ステップ6: デプロイ確認（5分）

1. 各サービスのログを確認
2. エラーが発生していないか確認
3. 以下のURLにアクセスして動作確認：

**Eureka Dashboard:**
- `https://eureka-server.up.railway.app`

**API Gateway:**
- `https://api-gateway.up.railway.app`

**Frontend:**
- `https://frontend.up.railway.app`

---

## 📋 環境変数設定のコピー用テンプレート

各サービスで設定する環境変数を、`railway-env-template.txt`ファイルにまとめました。
このファイルを参照して、環境変数を設定してください。

---

## 🔧 トラブルシューティング

### データベース接続エラー

**エラー**: `Unable to determine Dialect without JDBC metadata`

**解決策:**
1. PostgreSQLサービスの「Variables」タブで接続情報を再確認
2. `SPRING_DATASOURCE_URL`に実際のホスト名が設定されているか確認
3. `SPRING_DATASOURCE_USERNAME`と`SPRING_DATASOURCE_PASSWORD`が正しく設定されているか確認
4. 各サービスを再デプロイ

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

---

## 📚 参考資料

- [Railway公式ドキュメント](https://docs.railway.app)
- [RailwayでのDocker Compose使用](https://docs.railway.app/deploy/dockerfiles#docker-compose)
- [Railwayでの環境変数](https://docs.railway.app/deploy/environment-variables)

