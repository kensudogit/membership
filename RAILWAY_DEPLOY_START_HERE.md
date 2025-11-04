# 🚀 Railway完全公開モードデプロイ - ここから始める

## ✅ 準備完了！

Railwayへの完全公開モードデプロイに必要なファイルはすべて準備できました。

## 📋 今すぐデプロイを開始する

### 方法1: Railway Dashboard経由（推奨）

1. **https://railway.app** にアクセス
2. GitHubアカウントでサインイン
3. 「Start a New Project」をクリック
4. 「Deploy from GitHub repo」を選択
5. リポジトリ `membership` を選択
6. 「Deploy」をクリック

### 方法2: Railway CLI経由

1. 新しいコマンドプロンプトを開く
2. プロジェクトディレクトリに移動:
   ```bash
   cd C:\workspace\membership
   ```
3. デプロイスクリプトを実行:
   ```bash
   railway-deploy-public.bat
   ```

## 📋 デプロイ手順（8ステップ）

### ステップ1: プロジェクト作成（3分）
- Railway Dashboardで「New Project」→「Deploy from GitHub repo」
- リポジトリ `membership` を選択
- 「Deploy」をクリック

### ステップ2: PostgreSQLデータベースの追加（5分）
- 「New」→「Database」→「Add PostgreSQL」
- PostgreSQLサービスの「Variables」タブで接続情報を控える

### ステップ3: データベースの初期化（5分）
- PostgreSQLサービスの「Data」タブで「Connect」
- `init.sql` の内容をコピー＆ペーストして実行

### ステップ4: 環境変数の設定（15分）
各サービスに対して、`railway-env-template.txt` を参照して環境変数を設定

### ステップ5: 完全公開モードの設定（10分）
各サービス（eureka-server, api-gateway, frontend）の「Settings」→「Generate Domain」で公開URLを生成

### ステップ6: フロントエンドの環境変数更新（2分）
`frontend`サービスの `NEXT_PUBLIC_API_URL` を実際のAPI Gatewayの公開URLに更新

### ステップ7: デプロイ確認（10分）
各サービスのログを確認してエラーがないか確認

### ステップ8: 動作確認（5分）
公開URLにアクセスして動作を確認

## 📚 詳細な手順

詳細な手順は以下のファイルを参照してください：

- **`RAILWAY_PUBLIC_DEPLOY_NOW.md`** - 完全公開モードデプロイガイド（詳細）
- **`RAILWAY_PUBLIC_DEPLOY.md`** - 完全公開モードデプロイガイド（元のバージョン）
- **`railway-env-template.txt`** - 環境変数設定テンプレート
- **`RAILWAY_TROUBLESHOOTING.md`** - トラブルシューティングガイド

## 🎯 デプロイ開始

**Railway Dashboard**: https://railway.app

## 💡 重要事項

### ⚠️ 必ず実行すること

1. **PostgreSQLの接続情報を控える**
   - PostgreSQLサービスの「Variables」タブで接続情報を確認
   - `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` を控える

2. **環境変数を正しく設定する**
   - 各サービス（membership-service, payment-service, lesson-service, store-service, integration-service）の `SPRING_DATASOURCE_URL` に実際のPostgreSQLホスト名を設定
   - `localhost:5432` ではなく、実際のPostgreSQLホスト名（例: `containers-us-west-xxx.railway.app:5432`）を使用

3. **公開URLを生成する**
   - eureka-server, api-gateway, frontend の各サービスで「Generate Domain」をクリック
   - 生成された公開URLを控える

4. **フロントエンドの環境変数を更新する**
   - `frontend`サービスの `NEXT_PUBLIC_API_URL` を実際のAPI Gatewayの公開URLに更新

### ✅ デプロイ後の確認

- [ ] すべてのサービスが正常に起動している
- [ ] 公開URLにアクセスできる
- [ ] フロントエンドからAPI Gatewayに接続できる
- [ ] データベースからデータを取得できる

## 🎉 デプロイ完了

すべてのサービスが正常にデプロイされ、公開URLにアクセスできるようになりました！

---

**問題が発生した場合**: `RAILWAY_TROUBLESHOOTING.md` を参照してください。

