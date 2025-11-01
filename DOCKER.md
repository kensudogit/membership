# Docker環境セットアップガイド

## 概要

このプロジェクトは完全にDocker化されたマイクロサービスアーキテクチャです。全てのサービスをDockerコンテナで実行できます。

## 前提条件

- Docker Desktop (Windows/Mac) または Docker Engine (Linux)
- Docker Compose v3.8以上
- 最低8GB RAM (推奨: 16GB以上)
- 最低20GB ディスク容量

## クイックスタート

### 1. 全サービスの起動

```bash
# Windows
docker-start.bat

# Linux/Mac
docker-compose up -d --build
```

### 2. サービスの状態確認

```bash
docker-compose ps
```

### 3. ログの確認

```bash
# 全サービスのログ
docker-compose logs -f

# 特定のサービスのログ
docker-compose logs -f membership-service

# Windows（ログ確認スクリプト）
docker-logs.bat
```

### 4. サービスの停止

```bash
# Windows
docker-stop.bat

# Linux/Mac
docker-compose down
```

## サービス構成

### 起動順序

1. **PostgreSQL** - データベース（最初に起動）
2. **Eureka Server** - サービスディスカバリー
3. **Config Server** - 設定管理サーバー
4. **Microservices** - 各マイクロサービス
   - Membership Service (8081)
   - Payment Service (8082)
   - Lesson Service (8083)
   - Store Service (8084)
   - Integration Service (8085)
5. **API Gateway** - APIゲートウェイ (8080)
6. **Frontend** - フロントエンド (3000)

### ポートマッピング

| サービス | ポート | URL |
|---------|--------|-----|
| PostgreSQL | 5432 | `localhost:5432` |
| Eureka Server | 8761 | `http://localhost:8761` |
| Config Server | 8888 | `http://localhost:8888` |
| Membership Service | 8081 | `http://localhost:8081` |
| Payment Service | 8082 | `http://localhost:8082` |
| Lesson Service | 8083 | `http://localhost:8083` |
| Store Service | 8084 | `http://localhost:8084` |
| Integration Service | 8085 | `http://localhost:8085` |
| API Gateway | 8080 | `http://localhost:8080` |
| Frontend | 3000 | `http://localhost:3000` |

## Dockerコマンドリファレンス

### ビルドと起動

```bash
# 全サービスのビルドと起動
docker-compose up -d --build

# 特定のサービスのみビルド
docker-compose build membership-service

# キャッシュを使わずにビルド
docker-compose build --no-cache
```

### ログ管理

```bash
# 全サービスのログをリアルタイム表示
docker-compose logs -f

# 特定のサービスのログ（最後100行）
docker-compose logs --tail=100 membership-service

# ログの保存
docker-compose logs > docker-logs.txt
```

### サービスの管理

```bash
# サービス一覧の表示
docker-compose ps

# サービスの再起動
docker-compose restart membership-service

# サービスの停止
docker-compose stop membership-service

# サービスの削除とボリュームの削除
docker-compose down -v

# サービスの強制停止
docker-compose kill
```

### コンテナの操作

```bash
# コンテナ内のシェルアクセス
docker-compose exec membership-service sh

# コンテナのヘルスチェック
docker-compose ps

# コンテナのリソース使用状況
docker stats
```

### データベース操作

```bash
# PostgreSQLへの接続
docker-compose exec postgres psql -U membership_user -d membership_db

# データベースのバックアップ
docker-compose exec postgres pg_dump -U membership_user membership_db > backup.sql

# データベースのリストア
docker-compose exec -T postgres psql -U membership_user -d membership_db < backup.sql
```

## 環境変数

### データベース設定

```bash
POSTGRES_DB=membership_db
POSTGRES_USER=membership_user
POSTGRES_PASSWORD=membership_pass
```

### サービス間通信設定

各サービスはDockerネットワーク内で通信します：
- Eureka Server: `http://eureka-server:8761/eureka/`
- PostgreSQL: `postgres:5432`
- サービス間: サービス名で直接通信可能

## トラブルシューティング

### サービスが起動しない

```bash
# ログを確認
docker-compose logs [service-name]

# ヘルスチェックの状態確認
docker-compose ps

# コンテナの再ビルド
docker-compose up -d --build [service-name]
```

### ポートが既に使用されている

```bash
# 使用中のポートを確認
netstat -ano | findstr :8080

# docker-compose.ymlのポート番号を変更
```

### データベース接続エラー

```bash
# PostgreSQLのログを確認
docker-compose logs postgres

# PostgreSQLの状態確認
docker-compose exec postgres pg_isready -U membership_user
```

### メモリ不足

```bash
# Docker Desktopの設定でメモリを増やす
# Settings > Resources > Memory
# 推奨: 8GB以上
```

### ディスク容量不足

```bash
# 未使用のDockerリソースを削除
docker system prune -a --volumes

# ビルドキャッシュのクリア
docker builder prune
```

## 開発環境でのホットリロード

開発環境では、`docker-compose.override.yml`を作成してホットリロードを有効にできます：

```bash
cp docker-compose.override.yml.example docker-compose.override.yml
```

これにより、ソースコードの変更が自動的に反映されます（ホットリロード）。

## プロダクション環境

プロダクション環境では、以下を考慮してください：

1. **環境変数の管理**: `.env`ファイルまたはシークレット管理を使用
2. **リソース制限**: 各サービスに適切なCPU/メモリ制限を設定
3. **ヘルスチェック**: 適切なヘルスチェック設定
4. **ログ管理**: 集中ログ管理システムの導入
5. **モニタリング**: 監視ツールの導入
6. **バックアップ**: データベースの定期的なバックアップ

## パフォーマンス最適化

### ビルド時間の短縮

```bash
# マルチステージビルドを使用
# Dockerfileでビルドキャッシュを最適化
```

### 起動時間の短縮

```bash
# 不要なサービスの除外
docker-compose up -d postgres eureka-server membership-service
```

### リソース使用量の削減

```bash
# docker-compose.ymlでリソース制限を設定
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

## その他のコマンド

### 全サービスの再起動

```bash
docker-compose restart
```

### 全サービスの停止と削除

```bash
docker-compose down
```

### ボリュームも含めて削除

```bash
docker-compose down -v
```

### イメージの削除

```bash
docker-compose down --rmi all
```

## 参考情報

- [Docker公式ドキュメント](https://docs.docker.com/)
- [Docker Compose公式ドキュメント](https://docs.docker.com/compose/)
- [Spring Boot Dockerガイド](https://spring.io/guides/gs/spring-boot-docker/)

