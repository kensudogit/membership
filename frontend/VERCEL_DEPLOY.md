# Vercel完全公開モードデプロイガイド

## 概要

このガイドでは、会員管理システムのフロントエンドをVercelに**完全公開モード**でデプロイする手順を説明します。

## デプロイ前の準備

### 1. Vercel CLIのインストール

```bash
npm install -g vercel
```

### 2. Vercelアカウントへのログイン

```bash
vercel login
```

### 3. バックエンドAPIの公開

フロントエンドをデプロイする前に、バックエンドAPIを公開サーバーにデプロイする必要があります。

**推奨サービス:**
- **Railway** (https://railway.app) - 簡単で無料枠あり
- **Render** (https://render.com) - 無料枠あり
- **Fly.io** (https://fly.io) - 無料枠あり
- **AWS/GCP/Azure** - エンタープライズ向け

バックエンドAPIの公開URLを取得してください。
例: `https://your-api.railway.app` または `https://api.your-domain.com`

### 4. 環境変数の準備

`.env.example`ファイルを参考に、以下の環境変数をVercelに設定します：

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
BACKEND_API_URL=https://your-backend-api-url.com
```

## デプロイ手順

### 方法1: Vercel CLI経由（推奨）

#### Windows環境の場合：

```batch
cd frontend
deploy-vercel.bat
```

または手動で：

```batch
cd frontend
vercel --prod
```

#### Unix/Mac環境の場合：

```bash
cd frontend
./deploy-vercel.sh
```

または手動で：

```bash
cd frontend
vercel --prod
```

### 方法2: Vercel Dashboard経由

1. **Vercelアカウント作成**
   - https://vercel.com にアクセス
   - GitHub/GitLab/Bitbucketアカウントでサインアップ

2. **プロジェクトのインポート**
   - Dashboard → "Add New..." → "Project"
   - Gitリポジトリを選択
   - **Root Directory**: `frontend` を指定

3. **プロジェクト設定**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **環境変数の設定**
   - Settings → Environment Variables
   - 以下の変数を追加：
     - `NEXT_PUBLIC_API_URL` = `https://your-backend-api-url.com`
     - `NEXT_PUBLIC_APP_URL` = （デプロイ後に自動設定）
     - `BACKEND_API_URL` = `https://your-backend-api-url.com`

5. **完全公開モードの確認**
   - `vercel.json`の`public: true`を確認
   - Settings → General → Publicプロジェクトの確認

6. **デプロイ実行**
   - "Deploy" ボタンをクリック

## デプロイ後の確認

1. **URLアクセス**
   - `https://your-app.vercel.app` にアクセス
   - アプリケーションが正常に表示されるか確認

2. **API接続確認**
   - ブラウザの開発者ツール（F12）を開く
   - NetworkタブでAPIリクエストを確認
   - エラーが発生していないか確認

3. **完全公開モードの確認**
   - Vercel Dashboard → Project → Settings
   - "Public"設定が有効になっているか確認

4. **ログ確認**
   - Vercel Dashboard → Deployments
   - 最新のデプロイメントのログを確認

## バックエンドAPIの公開方法（Railway例）

### RailwayでのバックエンドAPI公開

1. **Railwayアカウント作成**
   - https://railway.app にアクセス
   - GitHubアカウントでサインアップ

2. **新規プロジェクト作成**
   - "New Project" → "Deploy from GitHub repo"
   - リポジトリを選択

3. **サービス設定**
   - Docker Composeファイルを使用する場合:
     - "New" → "Service" → "GitHub Repo"
     - docker-compose.ymlを指定

   - 個別サービスをデプロイする場合:
     - API Gatewayサービスを選択
     - ポート: 8080（自動設定）

4. **環境変数の設定**
   - 必要な環境変数を設定
   - Eureka Server URL
   - Database URL（PostgreSQL）

5. **公開URLの取得**
   - サービス → Settings → Networking
   - 生成された公開URLをコピー
   - 例: `https://api-gateway-production.up.railway.app`

6. **Vercel環境変数に設定**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - `NEXT_PUBLIC_API_URL`にRailwayのURLを設定

## トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドテスト
cd frontend
npm run build
```

### 環境変数が反映されない

- 環境変数名に `NEXT_PUBLIC_` プレフィックスを付ける
- デプロイ後、環境変数を再設定
- ブラウザのキャッシュをクリア
- 再デプロイを実行

### API接続エラー（CORS）

- バックエンドAPIのCORS設定を確認
- `vercel.json`のヘッダー設定を確認
- バックエンドAPIが公開されているか確認
- 環境変数 `NEXT_PUBLIC_API_URL` が正しいか確認

### 画像が表示されない

`next.config.js`の`images.domains`にドメインを追加：

```javascript
images: {
  domains: [
    'localhost',
    '*.vercel.app',
    '*.railway.app',
    '*.render.com',
    '*.amazonaws.com',
    '*.cloudfront.net',
  ],
}
```

### 完全公開モードが有効にならない

- Vercel Dashboard → Project → Settings → General
- "Make this project public"を有効化
- `vercel.json`の`public: true`を確認

## カスタムドメインの設定

1. Vercel Dashboard → Project → Settings → Domains
2. ドメインを追加
3. DNS設定を更新（CNAMEレコード）

## 自動デプロイ

Gitリポジトリにプッシュすると自動的にデプロイされます：

- `main` ブランチ → プロダクション
- その他のブランチ → プレビュー

## セキュリティ設定（完全公開モード）

### 公開モードの確認項目

- ✅ `vercel.json`の`public: true`が設定されている
- ✅ 必要なCORSヘッダーが設定されている
- ✅ セキュリティヘッダーが設定されている
- ✅ 環境変数が適切に設定されている

### APIセキュリティ

- バックエンドAPIに認証を実装
- APIキーやトークンの管理（環境変数で管理）
- CORS設定の最適化
- レート制限の実装

## パフォーマンス最適化

1. **画像最適化**
   - Next.jsの画像最適化機能を使用
   - `next/image`コンポーネントを使用

2. **静的生成**
   - 可能な限り静的生成を使用
   - ISR（Incremental Static Regeneration）を活用

3. **バンドルサイズ**
   - 不要な依存関係を削除
   - 動的インポートを使用

## 参考資料

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/concepts/frameworks/nextjs)
- [環境変数の設定](https://vercel.com/docs/concepts/projects/environment-variables)
- [完全公開モード](https://vercel.com/docs/concepts/projects/public-private)

## サポート

問題が発生した場合：
1. Vercel Dashboardのログを確認
2. ローカル環境でビルドテスト
3. Vercelコミュニティフォーラムで質問
