# 会員管理システム - Vercelデプロイガイド

## 概要

このガイドでは、会員管理システムのフロントエンドをVercelに完全公開モードでデプロイする手順を説明します。

## デプロイ前の準備

### 1. バックエンドAPIの公開

フロントエンドをデプロイする前に、バックエンドAPIを公開サーバーにデプロイする必要があります。

**オプション:**
- Heroku
- AWS (ECS, EC2, Lambda)
- Google Cloud Platform
- Azure
- Railway
- Render

バックエンドAPIの公開URLを取得してください。

### 2. 環境変数の準備

以下の環境変数を準備：

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
BACKEND_API_URL=https://your-backend-api.com
```

## Vercelデプロイ手順

### 方法1: Vercel Dashboard経由（推奨）

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
     - `NEXT_PUBLIC_API_URL`
     - `NEXT_PUBLIC_APP_URL`
     - `BACKEND_API_URL`

5. **デプロイ実行**
   - "Deploy" ボタンをクリック

### 方法2: Vercel CLI経由

1. **CLIのインストール**
   ```bash
   npm i -g vercel
   ```

2. **ログイン**
   ```bash
   vercel login
   ```

3. **デプロイ**
   ```bash
   cd frontend
   vercel --prod
   ```

Windows環境の場合：
```batch
cd frontend
call deploy-vercel.bat
```

## デプロイ後の確認

1. **URLアクセス**
   - `https://your-app.vercel.app` にアクセス
   - アプリケーションが正常に表示されるか確認

2. **API接続確認**
   - ブラウザの開発者ツール（F12）を開く
   - NetworkタブでAPIリクエストを確認
   - エラーが発生していないか確認

3. **ログ確認**
   - Vercel Dashboard → Deployments
   - 最新のデプロイメントのログを確認

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

### API接続エラー

- CORS設定を確認
- バックエンドAPIが公開されているか確認
- 環境変数 `NEXT_PUBLIC_API_URL` が正しいか確認

### 画像が表示されない

`next.config.js`の`images.domains`にドメインを追加

## カスタムドメインの設定

1. Vercel Dashboard → Project → Settings → Domains
2. ドメインを追加
3. DNS設定を更新

## 自動デプロイ

Gitリポジトリにプッシュすると自動的にデプロイされます：

- `main` ブランチ → プロダクション
- その他のブランチ → プレビュー

## セキュリティ設定

### 公開モードの確認

- `vercel.json`の`public: true`を確認
- 必要なヘッダーが設定されているか確認

### APIセキュリティ

- バックエンドAPIに認証を実装
- APIキーやトークンの管理
- CORS設定の最適化

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

## サポート

問題が発生した場合：
1. Vercel Dashboardのログを確認
2. ローカル環境でビルドテスト
3. Vercelコミュニティフォーラムで質問

