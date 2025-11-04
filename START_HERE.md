# 🚀 Railwayデプロイ - ここから始める

## ✅ 準備完了！

Railwayへの完全公開モードデプロイに必要なファイルはすべて準備できました。

## 📋 今すぐデプロイを開始する

### 1. Railway Dashboardにアクセス

**https://railway.app** にアクセスして、以下の手順を実行してください。

### 2. プロジェクト作成

1. Railwayダッシュボードで「New Project」をクリック
2. 「Deploy from GitHub repo」を選択
3. リポジトリ `membership` を選択
4. **Root Directory**: `.` (ルートディレクトリ) を指定
5. 「Deploy」をクリック

### 3. PostgreSQLデータベースの追加

1. Railwayプロジェクトで「New」→「Database」→「Add PostgreSQL」を選択
2. PostgreSQLサービスの「Variables」タブで接続情報を控える

### 4. データベースの初期化

1. PostgreSQLサービスの「Data」タブを開く
2. 「Connect」ボタンをクリック
3. `init.sql` の内容をコピー＆ペーストして実行

### 5. 環境変数の設定

各サービスに対して、`railway-env-template.txt` を参照して環境変数を設定

### 6. 完全公開モードの設定

各サービス（eureka-server, api-gateway, frontend）の「Settings」→「Generate Domain」で公開URLを生成

### 7. フロントエンドの環境変数更新

`frontend`サービスの `NEXT_PUBLIC_API_URL` を実際のAPI Gatewayの公開URLに更新

---

## 📚 詳細な手順

詳細な手順は以下のファイルを参照してください：

- **`RAILWAY_DEPLOY_FINAL.md`** - 最終デプロイ手順（詳細）
- **`RAILWAY_PUBLIC_DEPLOY.md`** - 完全公開モードデプロイガイド
- **`RAILWAY_DEPLOY_CHECKLIST.md`** - デプロイチェックリスト
- **`railway-env-template.txt`** - 環境変数設定テンプレート

---

## 🎯 デプロイ開始

**Railway Dashboard**: https://railway.app

---

## 💡 ヒント

- PostgreSQLの接続情報は必ず控えておいてください
- 公開URLは各サービスの「Settings」タブで確認できます
- 問題が発生した場合は、各サービスのログを確認してください

