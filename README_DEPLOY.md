# 🚀 Railwayデプロイ - クイックリファレンス

## 今すぐデプロイを開始

### 1. Railway Dashboardにアクセス
**https://railway.app**

### 2. プロジェクト作成
- 「New Project」→「Deploy from GitHub repo」→ リポジトリ `membership` を選択

### 3. PostgreSQLデータベース追加
- 「New」→「Database」→「Add PostgreSQL」

### 4. データベース初期化
- PostgreSQLサービスの「Data」タブで `init.sql` を実行

### 5. 環境変数設定
- `railway-env-template.txt` を参照して各サービスに設定

### 6. 公開URL生成
- 各サービス（eureka-server, api-gateway, frontend）の「Settings」→「Generate Domain」

### 7. フロントエンド環境変数更新
- `frontend`サービスの `NEXT_PUBLIC_API_URL` を実際のAPI Gatewayの公開URLに更新

---

## 📋 重要なファイル

- **`RAILWAY_DEPLOY_FINAL.md`** - 最終デプロイ手順（このファイル）
- **`RAILWAY_PUBLIC_DEPLOY.md`** - 完全公開モードデプロイガイド
- **`railway-env-template.txt`** - 環境変数設定テンプレート
- **`RAILWAY_DEPLOY_CHECKLIST.md`** - デプロイチェックリスト

---

## 🔍 デプロイ後の確認

- Eureka Dashboard: `https://eureka-server-production.up.railway.app`
- API Gateway: `https://api-gateway-production.up.railway.app`
- Frontend: `https://frontend-production.up.railway.app`

**注意**: 実際のURLは各サービスの「Settings」タブで確認してください。

---

## 🆘 サポート

問題が発生した場合：
1. `RAILWAY_DEPLOY_FINAL.md` のトラブルシューティングセクションを参照
2. Railway Dashboardのログを確認

