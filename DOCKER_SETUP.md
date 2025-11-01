# Docker環境セットアップ - 簡易版

## クイックスタート

### Windows環境

```bash
# 全サービスの起動
docker-start.bat

# サービスの停止
docker-stop.bat

# ログの確認
docker-logs.bat
```

### Linux/Mac環境

```bash
# 全サービスの起動
docker-compose up -d --build

# サービスの停止
docker-compose down

# ログの確認
docker-compose logs -f
```

## 起動確認

起動後、以下のURLにアクセスしてサービスが正常に起動しているか確認してください：

- **フロントエンド**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Membership Service**: http://localhost:8081/swagger-ui.html
- **Payment Service**: http://localhost:8082/swagger-ui.html
- **Lesson Service**: http://localhost:8083/swagger-ui.html

## サービス構成

### 起動順序

1. **PostgreSQL** (5432)
2. **Eureka Server** (8761)
3. **Config Server** (8888)
4. **Microservices** (8081-8085)
5. **API Gateway** (8080)
6. **Frontend** (3000)

### ネットワーク

全サービスは`membership-network`というDockerネットワーク内で通信します。

## トラブルシューティング

### サービスが起動しない

```bash
# ログを確認
docker-compose logs [service-name]

# サービス一覧を確認
docker-compose ps
```

### ポートが使用中

docker-compose.ymlのポート番号を変更してください。

### データベース接続エラー

PostgreSQLが正常に起動しているか確認：
```bash
docker-compose logs postgres
```

詳細は [DOCKER.md](DOCKER.md) を参照してください。

