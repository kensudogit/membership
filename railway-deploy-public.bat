@echo off
chcp 65001 >nul
echo ========================================
echo Railway完全公開モードデプロイ
echo ========================================
echo.

REM 現在のディレクトリを確認
if not exist "docker-compose.yml" (
    echo エラー: membershipプロジェクトのルートディレクトリで実行してください。
    echo 現在のディレクトリ: %CD%
    pause
    exit /b 1
)

echo ステップ1: Railway CLIのインストール確認
echo ----------------------------------------
where railway >nul 2>&1
if %errorlevel% neq 0 (
    echo Railway CLIがインストールされていません。インストール中...
    call npm install -g @railway/cli
    if %errorlevel% neq 0 (
        echo Railway CLIのインストールに失敗しました。
        echo 手動でインストールしてください: npm install -g @railway/cli
        pause
        exit /b 1
    )
    echo Railway CLIのインストールが完了しました。
) else (
    echo Railway CLIは既にインストールされています。
    railway --version
)

echo.
echo ステップ2: Railwayにログイン
echo ----------------------------------------
railway whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo Railwayにログインしていません。
    echo ブラウザが開いてログイン画面が表示されます。
    railway login
    if %errorlevel% neq 0 (
        echo ログインに失敗しました。
        pause
        exit /b 1
    )
) else (
    echo 既にログイン済みです。
    railway whoami
)

echo.
echo ステップ3: プロジェクトの確認
echo ----------------------------------------
echo 現在のディレクトリ: %CD%
echo.
railway status >nul 2>&1
if %errorlevel% neq 0 (
    echo 新しいRailwayプロジェクトを作成しますか？ (Y/N)
    set /p create="選択: "
    if /i "%create%"=="Y" (
        echo Railwayプロジェクトを作成中...
        railway init
        if %errorlevel% neq 0 (
            echo プロジェクトの作成に失敗しました。
            pause
            exit /b 1
        )
    ) else (
        echo 既存のプロジェクトを使用します。
        echo Railway Dashboardでプロジェクトを選択してください。
    )
) else (
    echo 既存のプロジェクトに接続されています。
    railway status
)

echo.
echo ========================================
echo デプロイ準備完了
echo ========================================
echo.
echo 次のステップ:
echo.
echo 1. Railway Dashboard (https://railway.app) にアクセス
echo 2. プロジェクトを選択
echo 3. 「New」→「Database」→「Add PostgreSQL」でPostgreSQLを追加
echo 4. PostgreSQLサービスの「Variables」タブで接続情報を控える
echo 5. PostgreSQLサービスの「Data」タブで init.sql を実行
echo 6. 各サービスの「Variables」タブで環境変数を設定（railway-env-template.txtを参照）
echo 7. 各サービス（eureka-server, api-gateway, frontend）の「Settings」タブで「Generate Domain」をクリック
echo 8. frontendサービスの NEXT_PUBLIC_API_URL を実際のAPI Gatewayの公開URLに更新
echo 9. 各サービスのログを確認してエラーがないか確認
echo.
echo 詳細は RAILWAY_PUBLIC_DEPLOY_NOW.md を参照してください。
echo.
echo Railway Dashboard: https://railway.app
echo.

pause

