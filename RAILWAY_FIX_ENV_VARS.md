# Railway環境変数設定 - 緊急修正手順

## 🔴 エラー原因

ログから、`store-service`がPostgreSQLに接続できていないことが確認されました。

**エラー**: `Connection to localhost:5432 refused`

**原因**: 環境変数が設定されていないため、デフォルトの`localhost:5432`に接続しようとしています。

## ✅ 解決方法

### ステップ1: PostgreSQLの接続情報を確認

1. Railwayダッシュボードで、PostgreSQLサービスを選択
2. 「Variables」タブを開く
3. 以下の接続情報を**必ず控えておく**：
   - `PGHOST` = _______________________________
   - `PGPORT` = _______________________________
   - `PGDATABASE` = _______________________________
   - `PGUSER` = _______________________________
   - `PGPASSWORD` = _______________________________

### ステップ2: 各サービスに環境変数を設定

以下のサービスに対して、環境変数を設定してください：

#### 🔹 store-service（緊急）

1. Railwayダッシュボードで`store-service`を選択
2. 「Variables」タブを開く
3. 以下の環境変数を追加：

```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
SPRING_DATASOURCE_URL=jdbc:postgresql://[PGHOST]:[PGPORT]/[PGDATABASE]
SPRING_DATASOURCE_USERNAME=[PGUSER]
SPRING_DATASOURCE_PASSWORD=[PGPASSWORD]
```

**重要**: `[PGHOST]`, `[PGPORT]`, `[PGDATABASE]`, `[PGUSER]`, `[PGPASSWORD]`は、ステップ1で控えたPostgreSQLの接続情報に置き換えてください。

**実例**:
```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
SPRING_DATASOURCE_URL=jdbc:postgresql://containers-us-west-xxx.railway.app:5432/railway
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-password-here
```

#### 🔹 membership-service, payment-service, lesson-service, integration-service

上記と同じ環境変数を設定してください。

#### 🔹 eureka-server

```
SPRING_PROFILES_ACTIVE=docker
```

#### 🔹 config-server

```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

#### 🔹 api-gateway

```
SPRING_PROFILES_ACTIVE=docker
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

#### 🔹 frontend

```
NEXT_PUBLIC_API_URL=https://[api-gatewayの公開URL]
NODE_ENV=production
```

### ステップ3: 環境変数設定後の確認

1. 各サービスの「Variables」タブで、環境変数が正しく設定されているか確認
2. 環境変数を設定した後、各サービスを再デプロイ（または自動的に再起動されます）

### ステップ4: デプロイ確認

1. 各サービスのログを確認
2. エラーが解消されているか確認
3. PostgreSQLへの接続が成功しているか確認

---

## 📋 環境変数設定チェックリスト

以下のサービスで環境変数が設定されているか確認してください：

### PostgreSQL接続が必要なサービス
- [ ] **store-service** - 環境変数設定済み
- [ ] **membership-service** - 環境変数設定済み
- [ ] **payment-service** - 環境変数設定済み
- [ ] **lesson-service** - 環境変数設定済み
- [ ] **integration-service** - 環境変数設定済み

### Eureka接続が必要なサービス
- [ ] **config-server** - 環境変数設定済み
- [ ] **api-gateway** - 環境変数設定済み
- [ ] **membership-service** - 環境変数設定済み
- [ ] **payment-service** - 環境変数設定済み
- [ ] **lesson-service** - 環境変数設定済み
- [ ] **store-service** - 環境変数設定済み
- [ ] **integration-service** - 環境変数設定済み

### その他のサービス
- [ ] **eureka-server** - 環境変数設定済み
- [ ] **frontend** - 環境変数設定済み

---

## 🔍 環境変数の確認方法

### Railway Dashboardでの確認

1. Railwayダッシュボードで各サービスを選択
2. 「Variables」タブを開く
3. 環境変数が表示されているか確認

### ログでの確認

環境変数が正しく設定されている場合、ログに以下のようなメッセージが表示されます：

```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

環境変数が設定されていない場合、以下のエラーが表示されます：

```
Connection to localhost:5432 refused
```

---

## ⚠️ 重要な注意事項

1. **PostgreSQL接続情報の取得**: PostgreSQLサービスの「Variables」タブで、接続情報を必ず確認してください
2. **環境変数の値**: `[PGHOST]`, `[PGPORT]`, `[PGDATABASE]`, `[PGUSER]`, `[PGPASSWORD]`は、実際の値に置き換えてください
3. **サービス名の使用**: Railwayでは、サービス名（`eureka-server`など）を使用してサービス間通信を行います
4. **公開URLの使用**: サービス名が解決されない場合は、公開URLを使用してください

---

## 🎯 次のステップ

環境変数を設定した後：

1. 各サービスが自動的に再起動されます
2. ログを確認して、エラーが解消されているか確認してください
3. すべてのサービスが正常に起動することを確認してください

---

## 📚 参考資料

- **環境変数テンプレート**: `railway-env-template.txt`
- **トラブルシューティング**: `RAILWAY_TROUBLESHOOTING.md`

