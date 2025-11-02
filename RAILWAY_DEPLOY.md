# 会員管理システム - Railwayデプロイガイド

## 概要

このガイドでは、`docker-compose.yml`を使用して会員管理システムをRailwayにデプロイする方法を説明します。

## Railwayでの`docker-compose.yml`デプロイについて

### 重要なポイント

**Railwayは`docker-compose.yml`を検出すると、各サービスを個別のサービスとして扱います。**

- 各サービス（`eureka-server`, `config-server`, `api-gateway`, `membership-service`, `payment-service`, `lesson-service`, `store-service`, `integration-service`, `postgres`, `frontend`）は独立したRailwayサービスとしてデプロイされます
- 各サービスに対して個別に環境変数を設定する必要があります
- サービス間の通信には、Railwayが提供する**サービス名**または**公開URL**を使用する必要があります

## デプロイ手順

### 1. Railwayプロジェクトの作成

1. **Railwayアカウントの作成**
   - https://railway.app にアクセス
   - GitHubアカウントでサインアップ

2. **新しいプロジェクトの作成**
   - Railwayダッシュボードで「New Project」をクリック
   - 「Deploy from GitHub repo」を選択
   - `membership` リポジトリを選択
   - **Root Directory**: `.` (ルートディレクトリ) を指定

### 2. PostgreSQLデータベースの追加（方法1：推奨）

**Railwayが提供するPostgreSQLサービスを使用する方法**：

1. Railwayプロジェクトで「New」→「Database」→「Add PostgreSQL」を選択
2. PostgreSQLサービスが作成され、接続情報が自動的に生成されます
3. PostgreSQLサービスの「Variables」タブで、接続情報を確認します：
   - `PGHOST` (ホスト名)
   - `PGPORT` (ポート番号、通常は5432)
   - `PGDATABASE` (データベース名)
   - `PGUSER` (ユーザー名)
   - `PGPASSWORD` (パスワード)

**重要**: これらの接続情報を控えておき、各Spring Bootサービスに設定します。

### 3. 各サービスの環境変数設定

Railwayダッシュボードで、各サービス（`eureka-server`, `config-server`, `api-gateway`, `membership-service`, `payment-service`, `lesson-service`, `store-service`, `integration-service`）に対して、以下の環境変数を設定します。

#### 共通環境変数

各Spring Bootサービスに対して、以下を設定：

```env
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

**重要**: Railwayでは、サービス名（例：`eureka-server`）を使用してサービス間通信を行います。しかし、Railwayの各サービスは独立しているため、**公開URLを使用する必要がある場合があります**。

#### データベース接続情報（方法1：RailwayのPostgreSQLサービスを使用）

RailwayのPostgreSQLサービスを追加した後、各Spring Bootサービス（`membership-service`, `payment-service`, `lesson-service`, `store-service`, `integration-service`）に対して、**PostgreSQLサービスの「Variables」タブで確認した接続情報を使用して**、以下の環境変数を設定します：

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://[PGHOSTの値]:[PGPORTの値]/[PGDATABASEの値]
SPRING_DATASOURCE_USERNAME=[PGUSERの値]
SPRING_DATASOURCE_PASSWORD=[PGPASSWORDの値]
```

**実例**（接続情報の例）：
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://containers-us-west-xxx.railway.app:5432/railway
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-password-here
```

**手順**：
1. PostgreSQLサービスの「Variables」タブを開く
2. `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`の値を確認
3. 各Spring Bootサービス（`membership-service`, `payment-service`, `lesson-service`, `store-service`, `integration-service`）の「Variables」タブを開く
4. 上記の3つの環境変数を、確認した値で設定する

**重要**: 
- 接続情報は**PostgreSQLサービスの「Variables」タブで確認した実際の値**を使用してください
- 各Spring Bootサービスに対して**個別に**環境変数を設定する必要があります
- `SPRING_DATASOURCE_URL`には、PostgreSQLサービスの**公開ホスト名**（`PGHOST`の値）を使用します

#### 各サービス固有の環境変数

##### eureka-server

```env
SPRING_PROFILES_ACTIVE=docker
```

##### config-server

```env
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

**注意**: Railwayでは、`eureka-server`のサービス名が正しく解決されない場合があります。その場合は、`eureka-server`の公開URL（例：`https://eureka-server.up.railway.app`）を使用してください。

##### membership-service, payment-service, lesson-service, store-service, integration-service

各サービスに対して、以下の環境変数を設定します（PostgreSQLサービスの接続情報を`[ ]`内の値に置き換えてください）：

```env
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
SPRING_DATASOURCE_URL=jdbc:postgresql://[PGHOST]:[PGPORT]/[PGDATABASE]
SPRING_DATASOURCE_USERNAME=[PGUSER]
SPRING_DATASOURCE_PASSWORD=[PGPASSWORD]
```

**実例**（PostgreSQLサービスの接続情報が以下の場合）：
- `PGHOST`: `containers-us-west-xxx.railway.app`
- `PGPORT`: `5432`
- `PGDATABASE`: `railway`
- `PGUSER`: `postgres`
- `PGPASSWORD`: `your-password-here`

```env
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
SPRING_DATASOURCE_URL=jdbc:postgresql://containers-us-west-xxx.railway.app:5432/railway
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-password-here
```

##### api-gateway

```env
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

##### frontend

```env
NEXT_PUBLIC_API_URL=http://api-gateway:8080
NODE_ENV=production
```

**注意**: `frontend`サービスの場合、`api-gateway`の公開URLを使用する必要があります：

```env
NEXT_PUBLIC_API_URL=https://your-api-gateway-service.up.railway.app
NODE_ENV=production
```

### 4. デプロイ順序

Railwayは`docker-compose.yml`を検出すると、自動的に各サービスをデプロイしようとします。ただし、依存関係を考慮して、以下の順序でデプロイすることを推奨します：

1. **PostgreSQL** (Railwayが提供するPostgreSQLサービス)
2. **eureka-server** (サービスディスカバリー)
3. **config-server** (eureka-serverに依存)
4. **membership-service**, **payment-service**, **lesson-service**, **store-service**, **integration-service** (postgresとeureka-serverに依存)
5. **api-gateway** (すべてのサービスに依存)
6. **frontend** (api-gatewayに依存)

### 5. サービス間通信の設定

Railwayでは、各サービスは独立したコンテナとして実行されるため、**サービス名を使用した内部通信が正しく動作しない場合があります**。

この場合、以下のいずれかの方法で対処できます：

#### 方法1: 公開URLを使用

各サービスの公開URLを取得し、環境変数で設定：

```env
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=https://eureka-server.up.railway.app/eureka/
```

#### 方法2: Railwayのサービス名を使用

Railwayが提供するサービス名を使用：

```env
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://${{EurekaServer.HOST}}:8761/eureka/
```

#### 方法3: 内部ネットワークを使用

Railwayは内部的にサービス名を解決できる場合があります。デフォルトの設定を試してください。

## トラブルシューティング

### データベース接続エラー

エラー: `Unable to determine Dialect without JDBC metadata` または `Unable to create requested service [org.hibernate.engine.jdbc.env.spi.JdbcEnvironment]`

**原因**: データベース接続情報が正しく設定されていない

**解決策**:
1. **PostgreSQLサービスが追加されているか確認**
   - Railwayプロジェクトで、PostgreSQLサービスが存在するか確認
   - PostgreSQLサービスの「Variables」タブで、接続情報が表示されているか確認

2. **各Spring Bootサービスで環境変数が設定されているか確認**
   - `membership-service`, `payment-service`, `lesson-service`, `store-service`, `integration-service`の各サービスで、以下が設定されているか確認：
     - `SPRING_DATASOURCE_URL`（例：`jdbc:postgresql://containers-us-west-xxx.railway.app:5432/railway`）
     - `SPRING_DATASOURCE_USERNAME`（例：`postgres`）
     - `SPRING_DATASOURCE_PASSWORD`（実際のパスワード）
   
3. **環境変数の値が正しいか確認**
   - `SPRING_DATASOURCE_URL`には、PostgreSQLサービスの`PGHOST`、`PGPORT`、`PGDATABASE`の値を**実際の値**で設定してください（変数参照形式は使用しません）
   - `SPRING_DATASOURCE_USERNAME`には、PostgreSQLサービスの`PGUSER`の値を設定してください
   - `SPRING_DATASOURCE_PASSWORD`には、PostgreSQLサービスの`PGPASSWORD`の値を設定してください

4. **PostgreSQLサービスが正常に起動しているか確認**
   - PostgreSQLサービスのログを確認し、エラーが発生していないか確認
   - PostgreSQLサービスの「Variables」タブで、接続情報が正しく生成されているか確認

5. **サービスを再デプロイ**
   - 環境変数を設定した後、各Spring Bootサービスを再デプロイしてください

### Eureka接続エラー

エラー: `Could not register service with Eureka`

**原因**: Eurekaサーバーへの接続が失敗している

**解決策**:
1. `eureka-server`が正常に起動しているか確認
2. `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`環境変数が正しく設定されているか確認
3. `eureka-server`の公開URLを使用している場合、HTTPSを使用しているか確認
4. Railwayのログで、Eurekaへの接続試行を確認

### サービス間通信エラー

エラー: `Connection refused` または `Name resolution failed`

**原因**: サービス名が正しく解決されない

**解決策**:
1. 各サービスの公開URLを取得
2. 環境変数で公開URLを使用
3. Railwayのサービス間通信設定を確認

## 代替案: 個別サービスとしてデプロイ

`docker-compose.yml`を使用せず、各サービスを個別にデプロイする方法：

1. **各サービス用のDockerfileを作成**
2. **各サービスを個別のRailwayサービスとして追加**
3. **各サービスに対して環境変数を個別に設定**

この方法の利点：
- より細かい制御が可能
- 各サービスを独立してスケール可能
- 環境変数の設定が明確

## 参考資料

- [Railway公式ドキュメント](https://docs.railway.app)
- [RailwayでのDocker Compose使用](https://docs.railway.app/deploy/dockerfiles#docker-compose)
- [Railwayでの環境変数](https://docs.railway.app/deploy/environment-variables)

## サポート

問題が発生した場合：
1. Railwayダッシュボードのログを確認
2. 各サービスの環境変数を確認
3. Railwayコミュニティフォーラムで質問

