@echo off
echo ========================================
echo Railway完全公開モードデプロイ
echo ========================================
echo.

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
echo ステップ3: プロジェクトの作成
echo ----------------------------------------
echo 現在のディレクトリ: %CD%
echo.
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
    railway status
)

echo.
echo ========================================
echo デプロイ準備完了
echo ========================================
echo.
echo 次のステップ:
echo 1. Railway Dashboard (https://railway.app) にアクセス
echo 2. PostgreSQLデータベースを追加
echo 3. 各サービスの環境変数を設定（railway-env-template.txtを参照）
echo 4. デプロイを実行
echo.
echo 詳細は railway-deploy-guide.md を参照してください。
echo.

pause

