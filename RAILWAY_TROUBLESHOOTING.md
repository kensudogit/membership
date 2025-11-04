# Railwayデプロイ - トラブルシューティングガイド

## 🔴 CRASHED状態の場合の対処法

### ステップ1: ログを確認する（最重要）

1. Railwayダッシュボードで、CRASHED状態のデプロイメントをクリック
2. 「Logs」タブを開く
3. エラーメッセージを確認

### ステップ2: よくあるエラーと解決策

#### エラー1: データベース接続エラー

**エラーメッセージ例:**
```
Unable to determine Dialect without JDBC metadata
Connection refused
```

**解決策:**
1. PostgreSQLデータベースが追加されているか確認
2. PostgreSQLサービスの「Variables」タブで接続情報を確認
3. 各Spring Bootサービス（membership-service, payment-service, lesson-service, store-service, integration-service）の環境変数を確認：
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`

**確認方法:**
- 各サービスの「Variables」タブを開く
- 上記の3つの環境変数が正しく設定されているか確認
- `SPRING_DATASOURCE_URL`には、PostgreSQLサービスの`PGHOST`の値を使用

#### エラー2: Eureka接続エラー

**エラーメッセージ例:**
```
Could not register service with Eureka
Connection refused to eureka-server
```

**解決策:**
1. `eureka-server`サービスが正常に起動しているか確認
2. 各サービスの環境変数 `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` が正しく設定されているか確認
3. `eureka-server`が先に起動していることを確認

#### エラー3: Dockerイメージビルドエラー

**エラーメッセージ例:**
```
Build failed
Docker build error
```

**解決策:**
1. Dockerfileが正しく設定されているか確認
2. `docker-compose.yml`が正しく設定されているか確認
3. ビルドログを確認して具体的なエラーを特定

#### エラー4: ポート競合エラー

**エラーメッセージ例:**
```
Port already in use
Address already in use
```

**解決策:**
1. Railwayが自動的にポートを割り当てるため、通常は発生しない
2. 各サービスのポート設定を確認

### ステップ3: 環境変数の確認チェックリスト

各サービスで以下の環境変数が設定されているか確認：

#### eureka-server
- [ ] `SPRING_PROFILES_ACTIVE=docker`

#### config-server
- [ ] `SPRING_PROFILES_ACTIVE=docker`
- [ ] `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/`

#### membership-service, payment-service, lesson-service, store-service, integration-service
- [ ] `SPRING_PROFILES_ACTIVE=docker`
- [ ] `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/`
- [ ] `SPRING_DATASOURCE_URL=jdbc:postgresql://[PGHOST]:[PGPORT]/[PGDATABASE]`
- [ ] `SPRING_DATASOURCE_USERNAME=[PGUSER]`
- [ ] `SPRING_DATASOURCE_PASSWORD=[PGPASSWORD]`

**重要**: `[PGHOST]`, `[PGPORT]`, `[PGDATABASE]`, `[PGUSER]`, `[PGPASSWORD]`は、PostgreSQLサービスの「Variables」タブで確認した実際の値に置き換えてください。

#### api-gateway
- [ ] `SPRING_PROFILES_ACTIVE=docker`
- [ ] `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/`

#### frontend
- [ ] `NEXT_PUBLIC_API_URL=https://[api-gatewayの公開URL]`
- [ ] `NODE_ENV=production`

### ステップ4: デプロイ順序の確認

以下の順序でサービスが起動することを確認：

1. ✅ PostgreSQL（RailwayのPostgreSQLサービス）
2. ✅ eureka-server（サービスディスカバリー）
3. ✅ config-server（eureka-serverに依存）
4. ✅ membership-service, payment-service, lesson-service, store-service, integration-service（postgresとeureka-serverに依存）
5. ✅ api-gateway（すべてのサービスに依存）
6. ✅ frontend（api-gatewayに依存）

### ステップ5: Restartを実行する

**環境変数とログを確認した後、以下の手順でRestartを実行：**

1. ログでエラー原因を特定
2. 環境変数が正しく設定されているか確認
3. 問題が解決されたら「Restart」ボタンをクリック
4. デプロイメントのログを監視して、正常に起動することを確認

### ステップ6: デプロイ後の確認

デプロイが完了したら：

1. 各サービスのログを確認
2. エラーが発生していないか確認
3. 公開URLにアクセスして動作確認

---

## 📋 デプロイ前の確認チェックリスト

「Restart」をクリックする前に、以下を確認してください：

- [ ] PostgreSQLデータベースが追加されている
- [ ] PostgreSQLサービスの接続情報が控えてある
- [ ] 各サービスの環境変数が正しく設定されている
- [ ] `eureka-server`が先に起動している
- [ ] ログでエラー原因を特定した
- [ ] エラー原因を修正した

---

## 🎯 推奨手順

1. **まずログを確認** - CRASHEDの原因を特定
2. **環境変数を確認** - 必要な環境変数が設定されているか確認
3. **問題を修正** - エラー原因を修正
4. **Restartを実行** - 問題が解決したらRestartをクリック

---

## 💡 ヒント

- ログを必ず確認してください。エラー原因が明確になります
- 環境変数は各サービスで個別に設定する必要があります
- PostgreSQLの接続情報は、PostgreSQLサービスの「Variables」タブで確認できます
- サービス間の依存関係を考慮して、順番に起動することを確認してください

