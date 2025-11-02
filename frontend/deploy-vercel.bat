@echo off
echo ==========================================
echo Vercel Deployment Script
echo ==========================================
echo.

REM Vercel CLIがインストールされているか確認
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI がインストールされていません。
    echo インストール: npm i -g vercel
    pause
    exit /b 1
)

REM ログイン確認
echo Vercelにログインしています...
vercel login

REM プロジェクトディレクトリに移動
cd frontend
if %ERRORLEVEL% NEQ 0 (
    echo frontend ディレクトリが見つかりません。
    pause
    exit /b 1
)

REM 環境変数の確認
echo.
echo 環境変数を確認してください：
echo - NEXT_PUBLIC_API_URL
echo - NEXT_PUBLIC_APP_URL
echo - BACKEND_API_URL
echo.

set /p CONTINUE="続行しますか? (y/n): "
if /i not "%CONTINUE%"=="y" exit /b 1

REM ビルドテスト
echo.
echo ビルドテストを実行しています...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ビルドエラーが発生しました。
    pause
    exit /b 1
)

REM デプロイ
echo.
echo Vercelにデプロイしています...
set /p PROD="プロダクションデプロイですか? (y/n): "

if /i "%PROD%"=="y" (
    vercel --prod
) else (
    vercel
)

echo.
echo デプロイ完了！
echo ==========================================
pause

