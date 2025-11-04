# Railwayデプロイ - クイックスタート

## 🚀 最も簡単なデプロイ方法

### ステップ1: Railwayアカウント作成（2分）

1. https://railway.app にアクセス
2. 「Start a New Project」をクリック
3. GitHubアカウントでサインイン

### ステップ2: プロジェクト作成（1分）

1. Railwayダッシュボードで「New Project」をクリック
2. 「Deploy from GitHub repo」を選択
3. リポジトリ `membership` を選択
4. **Root Directory**: `.` を指定
5. 「Deploy」をクリック

### ステップ3: PostgreSQLデータベースの追加（2分）

1. Railwayプロジェクトで「New」→「Database」→「Add PostgreSQL」を選択
2. PostgreSQLサービスの「Variables」タブで接続情報を控える

### ステップ4: データベースの初期化（3分）

1. PostgreSQLサービスの「Data」タブを開く
2. 「Connect」ボタンをクリック
3. `init.sql` の内容をコピー＆ペーストして実行

### ステップ5: 環境変数の設定（10分）

各サービスに対して、`railway-env-template.txt` を参照して環境変数を設定

**詳細な手順**: `railway-deploy-guide.md` を参照

---

## 📁 ファイル一覧

- **`RAILWAY_DEPLOY_NOW.md`** - デプロイ開始ガイド（このファイル）
- **`railway-deploy-guide.md`** - 詳細なデプロイ手順書
- **`RAILWAY_DEPLOY_CHECKLIST.md`** - デプロイチェックリスト
- **`railway-env-template.txt`** - 環境変数設定テンプレート
- **`RAILWAY_DEPLOY_STEPS.md`** - ステップバイステップガイド
- **`railway-quick-deploy.md`** - クイックデプロイガイド

---

## 🎯 今すぐデプロイを開始

**Railway Dashboard**: https://railway.app

---

## 📞 サポート

問題が発生した場合：
1. `railway-deploy-guide.md` のトラブルシューティングセクションを参照
2. Railway Dashboardのログを確認

