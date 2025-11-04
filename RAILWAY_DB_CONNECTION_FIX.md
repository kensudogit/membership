# Railway PostgreSQL接続エラー対応ガイド

## エラーの原因

ログから以下のエラーが確認できます：

```
Connection to localhost:5432 refused
Unable to determine Dialect without JDBC metadata
No active profile set, falling back to 1 default profile: "default"
```

**原因**:
- `store-service`（および他のSpring Bootサービス）が`localhost:5432`に接続しようとしている
- RailwayではPostgreSQLサービスは別のホストで動作しているため、`localhost`では接続できない
- 環境変数`SPRING_DATASOURCE_URL`、`SPRING_DATASOURCE_USERNAME`、`SPRING_DATASOURCE_PASSWORD`が設定されていない、または正しく設定されていない
- `SPRING_PROFILES_ACTIVE=docker`が設定されていない

## 解決方法

### ステップ1: PostgreSQLサービスの接続情報を確認

1. Railwayダッシュボードでプロジェクトを開く
2. PostgreSQLサービス（`postgres`またはPostgreSQL）を選択
3. 「Variables」タブを開く
4. 以下の環境変数の値を確認・コピー：
   - `PGHOST` (例: `containers-us-west-xxx.railway.app`)
   - `PGPORT` (例: `5432`)
   - `PGDATABASE` (例: `railway`)
   - `PGUSER` (例: `postgres`)
   - `PGPASSWORD` (実際のパスワード)

### ステップ2: 各Spring Bootサービスに環境変数を設定

以下のサービスに対して、環境変数を設定してください：
- `membership-service`
- `payment-service`
- `lesson-service`
- `store-service`
- `integration-service`

#### 各サービスの設定手順

1. Railwayダッシュボードで、対象のサービス（例：`store-service`）を選択
2. 「Variables」タブを開く
3. 以下の環境変数を追加：

```env
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
SPRING_DATASOURCE_URL=jdbc:postgresql://[PGHOSTの値]:[PGPORTの値]/[PGDATABASEの値]
SPRING_DATASOURCE_USERNAME=[PGUSERの値]
SPRING_DATASOURCE_PASSWORD=[PGPASSWORDの値]
```

#### 実例

PostgreSQLサービスの「Variables」タブで以下の値が確認できた場合：
- `PGHOST`: `containers-us-west-xxx.railway.app`
- `PGPORT`: `5432`
- `PGDATABASE`: `railway`
- `PGUSER`: `postgres`
- `PGPASSWORD`: `your-actual-password`

各Spring Bootサービスに設定する環境変数：

```env
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
SPRING_DATASOURCE_URL=jdbc:postgresql://containers-us-west-xxx.railway.app:5432/railway
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-actual-password
```

### ステップ3: 環境変数設定の確認事項

⚠️ **重要な確認ポイント**：

1. **`SPRING_DATASOURCE_URL`の形式**
   - ✅ 正しい: `jdbc:postgresql://containers-us-west-xxx.railway.app:5432/railway`
   - ❌ 間違い: `jdbc:postgresql://localhost:5432/membership_db`
   - ❌ 間違い: `jdbc:postgresql://postgres:5432/membership_db`（Railwayではサービス名は使用できない）

2. **環境変数の値は実際の値を設定**
   - ✅ PostgreSQLサービスの「Variables」タブで確認した実際の値を使用
   - ❌ `${{PostgreSQL.PGHOST}}`のような変数参照形式は使用しない
   - ❌ `[PGHOSTの値]`のようなプレースホルダーをそのまま使用しない

3. **すべてのサービスに個別に設定**
   - `membership-service`、`payment-service`、`lesson-service`、`store-service`、`integration-service`の**各サービス**に対して、**個別に**環境変数を設定する必要があります

### ステップ4: サービスを再デプロイ

環境変数を設定した後：
1. 各サービスを再デプロイ（または自動的に再デプロイされる）
2. ログを確認して、エラーが解消されたか確認

## トラブルシューティング

### エラー: "Connection to localhost:5432 refused"

**原因**: `SPRING_DATASOURCE_URL`が`localhost`を指している、または環境変数が設定されていない

**解決策**:
1. PostgreSQLサービスの「Variables」タブで`PGHOST`の値を確認
2. 各Spring Bootサービスの「Variables」タブで`SPRING_DATASOURCE_URL`を確認
3. `SPRING_DATASOURCE_URL`が`jdbc:postgresql://[実際のPGHOSTの値]:[実際のPGPORTの値]/[実際のPGDATABASEの値]`の形式になっているか確認

### エラー: "No active profile set"

**原因**: `SPRING_PROFILES_ACTIVE=docker`が設定されていない

**解決策**:
1. 各Spring Bootサービスの「Variables」タブで`SPRING_PROFILES_ACTIVE=docker`を設定

### エラー: "Unable to determine Dialect without JDBC metadata"

**原因**: データベース接続情報が正しく設定されていない、またはデータベースに接続できない

**解決策**:
1. `SPRING_DATASOURCE_URL`、`SPRING_DATASOURCE_USERNAME`、`SPRING_DATASOURCE_PASSWORD`がすべて設定されているか確認
2. PostgreSQLサービスが正常に起動しているか確認（PostgreSQLサービスのログを確認）
3. 環境変数の値が正しいか確認（タイポや誤った値が設定されていないか）

### 環境変数が反映されない

**解決策**:
1. 環境変数を設定した後、サービスを再デプロイ（手動で再デプロイする必要がある場合がある）
2. ログを確認して、環境変数が正しく読み込まれているか確認（Spring Bootの起動ログに表示される場合がある）

## チェックリスト

各Spring Bootサービス（`membership-service`, `payment-service`, `lesson-service`, `store-service`, `integration-service`）に対して：

- [ ] `SPRING_PROFILES_ACTIVE=docker`が設定されている
- [ ] `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/`が設定されている
- [ ] `SPRING_DATASOURCE_URL`がPostgreSQLサービスの実際のホスト名を使用している（`localhost`や`postgres`ではない）
- [ ] `SPRING_DATASOURCE_USERNAME`がPostgreSQLサービスの`PGUSER`の値と一致している
- [ ] `SPRING_DATASOURCE_PASSWORD`がPostgreSQLサービスの`PGPASSWORD`の値と一致している
- [ ] すべての環境変数の値が実際の値（プレースホルダーではない）で設定されている

## 参考

詳細は`RAILWAY_DEPLOY.md`の「方法1：RailwayのPostgreSQLサービスを使用」セクションを参照してください。

