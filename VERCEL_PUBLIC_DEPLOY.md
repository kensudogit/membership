# Vercel完全公開モードデプロイガイド

## 概要

このガイドでは、会員管理システムのフロントエンドをVercelに**完全公開モード**でデプロイする手順を説明します。

## 重要事項

⚠️ **Vercelはフロントエンド（Next.js）のみデプロイ可能です**

- バックエンド（Java Spring Boot）は別のサービス（Railway/Renderなど）にデプロイが必要
- PostgreSQLデータベースも別のサービス（Railway/Renderなど）にデプロイが必要
- フロントエンドからバックエンドAPIの**公開URL**に接続する設定が必要

## デプロイ前の準備

### 1. バックエンドAPIの公開URLを取得

バックエンドAPIが既にデプロイされている場合、その公開URLを確認してください。

**例:**
- Railway: `https://api-gateway-production.up.railway.app`
- Render: `https://api-gateway.onrender.com`
- その他: `https://your-api-domain.com`

### 2. 環境変数の準備

以下の環境変数を準備してください：

```
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app (デプロイ後に自動設定)
BACKEND_API_URL=https://your-backend-api-url.com (サーバーサイド用)
```

## Vercelデプロイ手順

### 方法1: Vercel CLI経由（推奨）

#### ステップ1: Vercel CLIのインストール

```bash
npm i -g vercel
```

#### ステップ2: ログイン

```bash
vercel login
```

ブラウザが開き、Vercelアカウントでログインします。

#### ステップ3: プロジェクトディレクトリに移動

```bash
cd C:\workspace\membership\frontend
```

#### ステップ4: ビルドテスト

```bash
npm run build
```

エラーが発生した場合は、修正してから次のステップに進んでください。

#### ステップ5: 環境変数の設定

デプロイ前に、環境変数を設定します：

```bash
vercel env add NEXT_PUBLIC_API_URL production
```

プロンプトでバックエンドAPIのURLを入力します。

**例:**
```
? What's the value of NEXT_PUBLIC_API_URL? https://api-gateway-production.up.railway.app
```

同様に、他の環境変数も設定：

```bash
vercel env add BACKEND_API_URL production
```

#### ステップ6: デプロイ実行

**完全公開モード（プロダクション）でデプロイ:**

```bash
vercel --prod
```

**プレビューデプロイ:**

```bash
vercel
```

#### ステップ7: デプロイ後の確認

デプロイが完了すると、以下のようなURLが表示されます：

```
✅ Production: https://your-app.vercel.app
```

### 方法2: Vercel Dashboard経由

#### ステップ1: Vercelアカウント作成

1. https://vercel.com にアクセス
2. GitHub/GitLab/Bitbucketアカウントでサインアップ

#### ステップ2: プロジェクトのインポート

1. Dashboard → "Add New..." → "Project"
2. Gitリポジトリを選択
3. **Root Directory**: `frontend` を指定

#### ステップ3: プロジェクト設定

```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

#### ステップ4: 環境変数の設定

Settings → Environment Variables で以下を追加：

- `NEXT_PUBLIC_API_URL` = `https://your-backend-api-url.com`
- `BACKEND_API_URL` = `https://your-backend-api-url.com`

**重要:** 環境変数名に `NEXT_PUBLIC_` プレフィックスを付けると、クライアントサイドで使用可能になります。

#### ステップ5: デプロイ実行

"Deploy" ボタンをクリック

#### ステップ6: 公開設定

デプロイ後、Settings → General で以下を確認：

- **Public**: `Enabled` (完全公開モード)
- **Production Domain**: 自動的に設定されます

## Windows用バッチスクリプト

`deploy-vercel.bat` を実行することで、自動的にデプロイできます：

```batch
cd C:\workspace\membership\frontend
deploy-vercel.bat
```

## デプロイ後の確認

### 1. URLアクセス

デプロイされたURL（例: `https://your-app.vercel.app`）にアクセスし、アプリケーションが正常に表示されるか確認します。

### 2. API接続確認

1. ブラウザの開発者ツール（F12）を開く
2. NetworkタブでAPIリクエストを確認
3. エラーが発生していないか確認

**確認ポイント:**
- APIリクエストがバックエンドAPIのURLに送信されているか
- CORSエラーが発生していないか
- レスポンスが正常に返ってきているか

### 3. ログ確認

Vercel Dashboard → Deployments → 最新のデプロイメント → Logs でログを確認します。

## 完全公開モードの設定

### vercel.jsonの確認

`vercel.json` の `public: true` が設定されていることを確認：

```json
{
  "public": true,
  ...
}
```

### カスタムドメインの設定（オプション）

1. Vercel Dashboard → Project → Settings → Domains
2. ドメインを追加
3. DNS設定を更新

## トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドテスト
cd frontend
npm run build
```

エラーメッセージを確認し、修正してください。

### 環境変数が反映されない

- 環境変数名に `NEXT_PUBLIC_` プレフィックスを付ける
- デプロイ後、環境変数を再設定
- ブラウザのキャッシュをクリア
- ハードリロード（Ctrl+Shift+R）

### API接続エラー

**CORSエラーが発生する場合:**

1. バックエンドAPIのCORS設定を確認
2. `vercel.json` のCORSヘッダー設定を確認
3. API GatewayのCORS設定を確認

**接続が拒否される場合:**

1. バックエンドAPIが公開されているか確認
2. 環境変数 `NEXT_PUBLIC_API_URL` が正しいか確認
3. バックエンドAPIのログを確認

### 画像が表示されない

`next.config.js` の `images.domains` にドメインを追加：

```javascript
images: {
  domains: [
    'your-api-domain.com',
    '*.vercel.app',
  ],
}
```

## 自動デプロイの設定

Gitリポジトリにプッシュすると自動的にデプロイされます：

- `main` ブランチ → プロダクション
- その他のブランチ → プレビュー

## セキュリティ設定

### 公開モードの確認

- `vercel.json` の `public: true` を確認
- 必要なヘッダーが設定されているか確認

### APIセキュリティ

- バックエンドAPIに認証を実装
- APIキーやトークンの管理
- CORS設定の最適化

## パフォーマンス最適化

1. **画像最適化**
   - Next.jsの画像最適化機能を使用
   - `next/image` コンポーネントを使用

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
- [完全公開モードの設定](https://vercel.com/docs/concepts/projects/project-configuration#public)

## サポート

問題が発生した場合：

1. Vercel Dashboardのログを確認
2. ローカル環境でビルドテスト
3. Vercelコミュニティフォーラムで質問

## 次のステップ

デプロイが完了したら：

1. バックエンドAPIとの接続を確認
2. すべての機能が正常に動作するかテスト
3. カスタムドメインの設定（オプション）
4. モニタリングとログの設定

