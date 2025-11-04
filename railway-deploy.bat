@echo off
echo ========================================
echo Railwayデプロイ準備スクリプト
echo ========================================
echo.

echo Railway CLIのインストール確認...
where railway >nul 2>&1
if %errorlevel% neq 0 (
    echo Railway CLIがインストールされていません。
    echo.
    echo インストール方法:
    echo   1. Chocolatey: choco install railway
    echo   2. npm: npm install -g @railway/cli
    echo   3. Scoop: scoop install railway
    echo.
    echo または、Railway Dashboard (https://railway.app) から直接デプロイしてください。
    echo.
    pause
    exit /b 1
)

echo Railway CLIがインストールされています。
echo.

echo Railwayにログインしていますか？
railway whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo Railwayにログインしてください:
    railway login
    echo.
)

echo ========================================
echo デプロイ手順
echo ========================================
echo.
echo 1. Railway Dashboard (https://railway.app) にアクセス
echo 2. 新しいプロジェクトを作成
echo 3. GitHubリポジトリを接続
echo 4. PostgreSQLデータベースを追加
echo 5. 各サービスの環境変数を設定
echo 6. デプロイを実行
echo.
echo 詳細な手順は RAILWAY_DEPLOY_STEPS.md を参照してください。
echo.
echo ========================================
echo 現在のプロジェクト情報
echo ========================================
railway status
echo.

pause

