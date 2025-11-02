# Vercelデプロイガイド

## 前提条件

1. Vercelアカウント（https://vercel.com）
2. Vercel CLI（オプション）
3. Gitリポジトリ（GitHub、GitLab、Bitbucket）

## デプロイ方法

### 方法1: Vercel Dashboard経由（推奨）

1. **Vercelにログイン**
   - https://vercel.com にアクセス
   - GitHub/GitLab/Bitbucketアカウントでログイン

2. **プロジェクトのインポート**
   - "New Project" をクリック
   - Gitリポジトリから `membership/frontend` を選択

3. **プロジェクト設定**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. **環境変数の設定**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api.com
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   BACKEND_API_URL=https://your-backend-api.com
   ```

5. **デプロイ**
   - "Deploy" ボタンをクリック

### 方法2: Vercel CLI経由

1. **Vercel CLIのインストール**
   ```bash
   npm i -g vercel
   ```

2. **ログイン**
   ```bash
   vercel login
   ```

3. **プロジェクトディレクトリに移動**
   ```bash
   cd frontend
   ```

4. **デプロイ**
   ```bash
   # プレビューデプロイ
   vercel

   # プロダクションデプロイ
   vercel --prod
   ```

## 環境変数の設定

Vercel Dashboardで以下の環境変数を設定：

### 必須環境変数

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### 推奨環境変数

```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
BACKEND_API_URL=https://your-backend-api.com
NODE_ENV=production
```

## カスタムドメインの設定

1. Vercel Dashboard → Project Settings → Domains
2. ドメインを追加
3. DNS設定を確認

## バックエンドAPIの公開

バックエンドAPIも公開する必要があります：

### オプション1: 同じサーバーで公開
- バックエンドAPIを公開サーバーにデプロイ
- URLを環境変数に設定

### オプション2: Vercel Serverless Functions
- APIルートをNext.jsのAPI Routesとして実装
- `/api` 配下にAPIルートを作成

### オプション3: 既存の公開サーバー
- Heroku、AWS、GCP、Azureなどにデプロイ
- URLを環境変数に設定

## トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドテスト
npm run build
```

### 環境変数の問題

```bash
# Vercel CLIで環境変数を確認
vercel env ls
```

### 画像最適化エラー

`next.config.js`で画像ドメインを追加：
```javascript
images: {
  domains: ['your-image-domain.com'],
}
```

## デプロイ後の確認

1. **URLアクセス**
   - `https://your-app.vercel.app` にアクセス

2. **API接続確認**
   - ブラウザの開発者ツールでネットワークタブを確認
   - APIリクエストが正常に送信されているか確認

3. **エラーログ確認**
   - Vercel Dashboard → Deployments → Logs

## 自動デプロイの設定

Gitリポジトリにプッシュすると自動的にデプロイされます：

- `main` ブランチ → プロダクション環境
- その他のブランチ → プレビュー環境

## 参考リンク

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/concepts/frameworks/nextjs)

