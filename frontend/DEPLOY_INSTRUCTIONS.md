# Vercel完全公開モードデプロイ手順

## 🚀 クイックスタート

### ステップ1: 準備

1. **Vercel CLIのインストール**（未インストールの場合）
   ```bash
   npm install -g vercel
   ```

2. **Vercelにログイン**
   ```bash
   vercel login
   ```

### ステップ2: バックエンドAPIの公開（重要）

フロントエンドをデプロイする前に、バックエンドAPIを公開サーバーにデプロイしてください。

**推奨サービス:**
- **Railway** (https://railway.app) - 簡単で無料枠あり
- **Render** (https://render.com) - 無料枠あり
- **Fly.io** (https://fly.io) - 無料枠あり

バックエンドAPIの公開URLを取得してください。
例: `https://your-api.railway.app`

### ステップ3: 環境変数の設定

Vercel DashboardまたはCLIで以下の環境変数を設定：

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
BACKEND_API_URL=https://your-backend-api-url.com
```

### ステップ4: デプロイ実行

#### Windows環境の場合：

```batch
cd frontend
deploy-vercel.bat
```

#### Unix/Mac環境の場合：

```bash
cd frontend
./deploy-vercel.sh
```

#### または手動で：

```bash
cd frontend
vercel --prod --public
```

## 📋 デプロイ後の確認事項

1. ✅ Vercel Dashboardでデプロイメントの状態を確認
2. ✅ 生成されたURL（`https://your-app.vercel.app`）にアクセス
3. ✅ ブラウザの開発者ツール（F12）でエラーがないか確認
4. ✅ API接続が正常に動作するか確認

## 🔧 トラブルシューティング

### ビルドエラー

ローカルでビルドテスト：
```bash
cd frontend
npm run build
```

### 環境変数が反映されない

1. Vercel Dashboard → Project → Settings → Environment Variables
2. 環境変数を再設定
3. 再デプロイを実行

### API接続エラー

1. バックエンドAPIが公開されているか確認
2. `NEXT_PUBLIC_API_URL`が正しいか確認
3. CORS設定を確認

## 📚 詳細情報

詳細な手順は `VERCEL_DEPLOY.md` を参照してください。

