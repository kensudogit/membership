# 🚀 Railwayデプロイ - 今すぐ開始！

## デプロイ準備完了 ✅

Railwayへのデプロイに必要なファイルはすべて準備できました。

## 📋 作成したファイル

1. **`railway-deploy-guide.md`** - 詳細なデプロイ手順書
2. **`RAILWAY_DEPLOY_CHECKLIST.md`** - デプロイチェックリスト
3. **`railway-env-template.txt`** - 環境変数設定テンプレート
4. **`RAILWAY_DEPLOY_STEPS.md`** - ステップバイステップガイド
5. **`railway-quick-deploy.md`** - クイックデプロイガイド

## 🎯 次のステップ - デプロイを開始する

### オプション1: Railway Dashboard経由（推奨・最も簡単）

**1. Railwayアカウント作成**
   - https://railway.app にアクセス
   - 「Start a New Project」をクリック
   - GitHubアカウントでサインイン

**2. プロジェクト作成**
   - Railwayダッシュボードで「New Project」をクリック
   - 「Deploy from GitHub repo」を選択
   - リポジトリ `membership` を選択
   - **Root Directory**: `.` を指定
   - 「Deploy」をクリック

**3. PostgreSQLデータベースの追加**
   - Railwayプロジェクトで「New」→「Database」→「Add PostgreSQL」を選択
   - PostgreSQLサービスの「Variables」タブで接続情報を控える

**4. データベースの初期化**
   - PostgreSQLサービスの「Data」タブを開く
   - 「Connect」ボタンをクリック
   - SQL Editorで `init.sql` の内容をコピー＆ペーストして実行

**5. 環境変数の設定**
   - `railway-env-template.txt` を参照
   - 各サービスに対して環境変数を設定

**詳細な手順**: `railway-deploy-guide.md` を参照してください

---

### オプション2: Railway CLI経由

**1. Railway CLIのインストール**

```bash
npm install -g @railway/cli
```

または、Windowsで：

```bash
choco install railway
```

**2. ログイン**

```bash
railway login
```

**3. プロジェクト作成**

```bash
cd C:\workspace\membership
railway init
```

**4. デプロイ**

```bash
railway up
```

**注意**: Railway CLIを使用する場合でも、PostgreSQLデータベースの追加と環境変数の設定はDashboard経由で行う必要があります。

---

## 📝 重要な注意事項

### 1. PostgreSQL接続情報の記録

PostgreSQLサービスの「Variables」タブで確認した接続情報を必ず控えておいてください：
- `PGHOST`
- `PGPORT`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`

これらの情報は、各Spring Bootサービスで環境変数を設定する際に必要です。

### 2. 環境変数の設定順序

以下の順序で環境変数を設定することを推奨します：

1. **eureka-server** - まず起動
2. **config-server** - eureka-serverに依存
3. **membership-service, payment-service, lesson-service, store-service, integration-service** - postgresとeureka-serverに依存
4. **api-gateway** - すべてのサービスに依存
5. **frontend** - api-gatewayに依存

### 3. サービス間通信

Railwayでは、サービス名（例：`eureka-server`）を使用してサービス間通信を行います。ただし、サービス名が解決されない場合は、公開URLを使用してください。

---

## 🔍 デプロイ後の確認

デプロイが完了したら、以下のURLにアクセスして動作確認を行ってください：

- **Eureka Dashboard**: `https://eureka-server.up.railway.app`
- **API Gateway**: `https://api-gateway.up.railway.app`
- **Frontend**: `https://frontend.up.railway.app`

---

## 🆘 サポート

デプロイ中に問題が発生した場合：

1. **`railway-deploy-guide.md`** のトラブルシューティングセクションを参照
2. **`RAILWAY_DEPLOY_CHECKLIST.md`** で設定漏れを確認
3. Railway Dashboardのログを確認

---

## 📚 参考資料

- [Railway公式ドキュメント](https://docs.railway.app)
- [RailwayでのDocker Compose使用](https://docs.railway.app/deploy/dockerfiles#docker-compose)
- [Railwayでの環境変数](https://docs.railway.app/deploy/environment-variables)

---

## 🎉 準備完了！

すべての準備が整いました。上記の手順に従って、Railwayへのデプロイを開始してください。

**デプロイを開始する**: https://railway.app

