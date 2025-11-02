@echo off
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
    echo インストール: npm i -g vercel
    echo.
    set /p INSTALL="今すぐインストールしますか? (y/n): "
    if /i "%INSTALL%"=="y" (
        npm i -g vercel
    ) else (
        pause
        exit /b 1
    )
)

REM ログイン確認
echo.
echo Vercelにログインしています...
vercel whoami >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ログインが必要です。
    vercel login
)

REM 環境変数の確認
echo.
echo ==========================================
echo 環境変数の確認
echo ==========================================
echo.
echo 以下の環境変数がVercelに設定されているか確認してください：
echo - NEXT_PUBLIC_API_URL (バックエンドAPIのURL)
echo - NEXT_PUBLIC_APP_URL (アプリケーションのURL、デプロイ後に自動設定)
echo - BACKEND_API_URL (サーバーサイド用のAPI URL)
echo.
echo 注意: バックエンドAPIを先に公開してください。
echo       Railway, Render, Fly.ioなどを使用できます。
echo.
set /p CONTINUE="続行しますか? (y/n): "
if /i not "%CONTINUE%"=="y" (
    echo デプロイをキャンセルしました。
    pause
    exit /b 1
)

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
echo ==========================================
echo Vercelに完全公開モードでデプロイ中...
echo ==========================================
echo.
set /p PROD="プロダクションデプロイ（完全公開モード）ですか? (y/n): "

if /i "%PROD%"=="y" (
    echo.
    echo プロダクションデプロイを実行します...
    vercel --prod --public
) else (
    echo.
    echo プレビューデプロイを実行します...
    vercel --public
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================
    echo デプロイ完了！
    echo ==========================================
    echo.
    echo 次のステップ：
    echo 1. Vercel Dashboardで環境変数を設定
    echo 2. デプロイメントのURLを確認
    echo 3. バックエンドAPIとの接続を確認
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

