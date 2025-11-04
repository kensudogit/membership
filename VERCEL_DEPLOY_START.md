# Vercel完全公開モードデプロイ - クイックスタート

## 前提条件

✅ バックエンドAPIが既にデプロイされている（Railway/Renderなど）
✅ バックエンドAPIの公開URLを取得している

## デプロイ手順

### オプション1: バッチスクリプトを使用（推奨）

1. **コマンドプロンプトを開く**

2. **フロントエンドディレクトリに移動**
   ```bash
   cd C:\workspace\membership\frontend
   ```

3. **デプロイスクリプトを実行**
   ```bash
   deploy-vercel-public.bat
   ```

   スクリプトが自動的に以下を実行します：
   - Vercel CLIのインストール確認・インストール
   - Vercelへのログイン
   - 環境変数の設定
   - ビルドテスト
   - デプロイ実行

### オプション2: 手動でデプロイ

1. **Vercel CLIのインストール**
   ```bash
   npm i -g vercel
   ```

2. **ログイン**
   ```bash
   vercel login
   ```

3. **フロントエンドディレクトリに移動**
   ```bash
   cd C:\workspace\membership\frontend
   ```

4. **環境変数の設定**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL production
   # プロンプトでバックエンドAPIのURLを入力
   # 例: https://api-gateway-production.up.railway.app
   
   vercel env add BACKEND_API_URL production
   # 同じURLを入力
   ```

5. **デプロイ実行**
   ```bash
   vercel --prod
   ```

## デプロイ後の確認

1. **デプロイURLの確認**
   - デプロイ完了時に表示されるURLを確認
   - または Vercel Dashboard → Deployments で確認

2. **アプリケーションの動作確認**
   - ブラウザでデプロイURLにアクセス
   - 開発者ツール（F12）でAPIリクエストを確認

3. **環境変数の確認**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - 環境変数が正しく設定されているか確認

## トラブルシューティング

### ビルドエラーが発生する場合

```bash
cd C:\workspace\membership\frontend
npm run build
```

エラーメッセージを確認し、修正してください。

### API接続エラーが発生する場合

1. バックエンドAPIのURLが正しいか確認
2. バックエンドAPIが公開されているか確認
3. CORS設定を確認

### 環境変数が反映されない場合

1. 環境変数名に `NEXT_PUBLIC_` プレフィックスを付ける
2. デプロイ後に再設定
3. ブラウザのキャッシュをクリア

## 詳細情報

詳細な手順は `VERCEL_PUBLIC_DEPLOY.md` を参照してください。

## サポート

問題が発生した場合：

1. Vercel Dashboardのログを確認
2. ローカル環境でビルドテスト
3. Vercelコミュニティフォーラムで質問

