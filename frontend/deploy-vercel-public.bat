@echo off
chcp 65001 >nul
echo ==========================================
echo Vercel完全公開モードデプロイスクリプト
echo ==========================================
echo.

REM 現在のディレクトリを確認
if not exist "package.json" (
    echo エラー: frontendディレクトリで実行してください。
    echo 現在のディレクトリ: %CD%
    pause
    exit /b 1
)

REM Vercel CLIがインストールされているか確認
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI がインストールされていません。
    echo.
    echo インストールを開始します...
    call npm i -g vercel
    if %ERRORLEVEL% NEQ 0 (
        echo インストールに失敗しました。
        pause
        exit /b 1
    )
    echo インストール完了！
)

REM ログイン確認
echo.
echo ==========================================
echo Vercelログイン確認
echo ==========================================
vercel whoami >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ログインが必要です。
    echo ブラウザが開きます。Vercelアカウントでログインしてください。
    vercel login
    if %ERRORLEVEL% NEQ 0 (
        echo ログインに失敗しました。
        pause
        exit /b 1
    )
) else (
    vercel whoami
    echo.
)

REM 環境変数の確認
echo.
echo ==========================================
echo 環境変数の確認
echo ==========================================
echo.
echo 以下の環境変数がVercelに設定されているか確認してください：
echo - NEXT_PUBLIC_API_URL (バックエンドAPIのURL)
echo - BACKEND_API_URL (サーバーサイド用のAPI URL)
echo.
echo 注意: バックエンドAPIを先に公開してください。
echo       Railway, Render, Fly.ioなどを使用できます。
echo.
echo バックエンドAPIのURLを入力してください:
set /p API_URL="API URL (例: https://api-gateway-production.up.railway.app): "

if "%API_URL%"=="" (
    echo エラー: API URLが入力されていません。
    pause
    exit /b 1
)

echo.
echo 環境変数を設定します...
echo 注意: プロンプトが表示されたら、以下のURLを入力してください:
echo %API_URL%
echo.
vercel env add NEXT_PUBLIC_API_URL production
vercel env add BACKEND_API_URL production

echo.
echo 環境変数設定完了！
echo デプロイ後にVercel Dashboardで環境変数を確認してください。
echo.

REM ビルドテスト
echo.
echo ==========================================
echo ビルドテストを実行中...
echo ==========================================
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ビルドエラーが発生しました。
    echo エラーを修正してから再度実行してください。
    pause
    exit /b 1
)

echo.
echo ビルドテスト成功！
echo.

REM デプロイ
echo.
echo ==========================================
echo Vercelに完全公開モードでデプロイ中...
echo ==========================================
echo.
echo プロダクションデプロイ（完全公開モード）を実行します...
echo 注意: vercel.json の public: true 設定により完全公開モードになります
vercel --prod

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================
    echo デプロイ完了！
    echo ==========================================
    echo.
    echo 次のステップ：
    echo 1. Vercel DashboardでデプロイメントのURLを確認
    echo 2. バックエンドAPIとの接続を確認
    echo 3. ブラウザでアプリケーションを開いて動作確認
    echo.
    echo Vercel Dashboard: https://vercel.com/dashboard
    echo.
) else (
    echo.
    echo ==========================================
    echo デプロイエラーが発生しました
    echo ==========================================
    echo.
    echo ログを確認してください。
    echo Vercel Dashboardで詳細を確認できます。
    echo.
)

pause

