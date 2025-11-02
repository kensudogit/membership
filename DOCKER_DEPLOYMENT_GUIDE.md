# 会員管理システム - Dockerコンテナ環境のデプロイガイド

## 概要

このガイドでは、会員管理システムのDockerコンテナ環境（バックエンド）をデプロイする方法を説明します。

**重要**: VercelはDockerコンテナを直接デプロイできません。バックエンドは以下のサービスを使用してください：

- **Railway** (推奨)
- **Render**
- **Fly.io**
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**

## デプロイ構成

### フロントエンド
- **サービス**: Vercel
- **ステータス**: デプロイ済み ✅
- **URL**: https://frontend-ob34guq98-kensudogits-projects.vercel.app

### バックエンド（Dockerコンテナ）
- **サービス**: Railway（推奨）または他のコンテナサービス
- **ステータス**: デプロイが必要

## Railwayでのデプロイ手順（推奨）

### 1. Railwayアカウントの作成

1. https://railway.app にアクセス
2. GitHubアカウントでサインアップ

### 2. プロジェクトの作成

1. Railwayダッシュボードで「New Project」をクリック
2. 「Deploy from GitHub repo」を選択
3. `membership` リポジトリを選択
4. **Root Directory**: `.` (ルートディレクトリ) を指定

### 3. PostgreSQLデータベースの追加

1. Railwayプロジェクトで「New」→「Database」→「Add PostgreSQL」を選択
2. PostgreSQLサービスの「Variables」タブで、接続情報を確認：
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`

### 4. 各サービスの環境変数設定

各Spring Bootサービス（`eureka-server`, `config-server`, `api-gateway`, `membership-service`, `payment-service`, `lesson-service`, `store-service`, `integration-service`）に対して、以下の環境変数を設定：

#### 共通環境変数

```env
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

#### データベース接続情報（各Spring Bootサービス）

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://[PGHOSTの値]:[PGPORTの値]/[PGDATABASEの値]
SPRING_DATASOURCE_USERNAME=[PGUSERの値]
SPRING_DATASOURCE_PASSWORD=[PGPASSWORDの値]
```

**実例**:
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://containers-us-west-xxx.railway.app:5432/railway
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-password-here
```

詳細は`RAILWAY_DEPLOY.md`を参照してください。

## デプロイ後の設定

### 1. バックエンドAPI URLの取得

Railwayでデプロイ後、`api-gateway`サービスの公開URLを取得します。
例: `https://api-gateway-production.up.railway.app`

### 2. Vercelの環境変数を更新

1. Vercel Dashboardにアクセス: https://vercel.com/kensudogits-projects/frontend/settings/environment-variables
2. 以下の環境変数を設定：
   - `NEXT_PUBLIC_API_URL` = RailwayのAPI GatewayのURL
   - `NEXT_PUBLIC_APP_URL` = https://frontend-ob34guq98-kensudogits-projects.vercel.app
   - `BACKEND_API_URL` = RailwayのAPI GatewayのURL

### 3. Vercelの再デプロイ

環境変数を設定した後、Vercelで再デプロイ：

```bash
cd membership\frontend
vercel --prod --public
```

または、Vercel Dashboardで「Redeploy」をクリック

## 代替デプロイサービス

### Render

1. https://render.com にアクセス
2. 「New」→「Blueprint」を選択
3. `docker-compose.yml`を含むGitHubリポジトリを指定
4. デプロイを開始

### Fly.io

1. https://fly.io にアクセス
2. `flyctl` CLIをインストール
3. `fly launch`コマンドでデプロイ

詳細は各サービスのドキュメントを参照してください。

## トラブルシューティング

### データベース接続エラー

- PostgreSQLサービスが正常に起動しているか確認
- 各Spring Bootサービスで環境変数が正しく設定されているか確認
- `SPRING_DATASOURCE_URL`が実際の値（変数参照ではない）で設定されているか確認

### Eureka接続エラー

- `eureka-server`が正常に起動しているか確認
- `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`が正しく設定されているか確認
- サービス間通信が正しく動作しているか確認

詳細は`RAILWAY_DEPLOY.md`の「トラブルシューティング」セクションを参照してください。

