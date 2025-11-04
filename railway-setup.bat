@echo off
echo ========================================
echo Railwayデプロイセットアップ
echo ========================================
echo.

echo ステップ1: Railway CLIのインストール確認
echo ----------------------------------------
where railway >nul 2>&1
if %errorlevel% neq 0 (
    echo Railway CLIがインストールされていません。
    echo.
    echo インストール方法を選択してください:
    echo   1. npmを使用 (推奨)
    echo   2. Chocolateyを使用
    echo   3. Scoopを使用
    echo   4. スキップしてDashboardから手動デプロイ
    echo.
    set /p choice="選択 (1-4): "
    
    if "%choice%"=="1" (
        echo npmでインストール中...
        call npm install -g @railway/cli
    ) else if "%choice%"=="2" (
        echo Chocolateyでインストール中...
        call choco install railway -y
    ) else if "%choice%"=="3" (
        echo Scoopでインストール中...
        call scoop install railway
    ) else (
        echo Dashboardから手動デプロイしてください。
        echo https://railway.app にアクセスしてプロジェクトを作成してください。
        pause
        exit /b 0
    )
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
) else (
    echo 既にログイン済みです。
    railway whoami
)

echo.
echo ステップ3: プロジェクトの作成
echo ----------------------------------------
echo 新しいプロジェクトを作成しますか？ (Y/N)
set /p create="選択: "
if /i "%create%"=="Y" (
    railway init
) else (
    echo 既存のプロジェクトを使用します。
)

echo.
echo ステップ4: デプロイ設定
echo ----------------------------------------
echo Railwayプロジェクトが作成されました。
echo.
echo 次のステップ:
echo 1. Railway Dashboard (https://railway.app) にアクセス
echo 2. PostgreSQLデータベースを追加
echo 3. 各サービスの環境変数を設定
echo 4. デプロイを実行
echo.
echo 詳細は RAILWAY_DEPLOY_STEPS.md を参照してください。
echo.

pause

