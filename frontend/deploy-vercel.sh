#!/bin/bash

# Vercelデプロイスクリプト

echo "=========================================="
echo "Vercel Deployment Script"
echo "=========================================="
echo ""

# Vercel CLIがインストールされているか確認
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI がインストールされていません。"
    echo "インストール: npm i -g vercel"
    exit 1
fi

# ログイン確認
echo "Vercelにログインしています..."
vercel login

# プロジェクトディレクトリに移動
cd frontend || exit 1

# 環境変数の確認
echo ""
echo "環境変数を確認してください："
echo "- NEXT_PUBLIC_API_URL"
echo "- NEXT_PUBLIC_APP_URL"
echo "- BACKEND_API_URL"
echo ""

read -p "続行しますか? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# ビルドテスト
echo ""
echo "ビルドテストを実行しています..."
npm run build

if [ $? -ne 0 ]; then
    echo "ビルドエラーが発生しました。"
    exit 1
fi

# デプロイ
echo ""
echo "Vercelにデプロイしています..."
echo "プロダクションデプロイの場合: vercel --prod"
echo "プレビューデプロイの場合: vercel"
echo ""

read -p "プロダクションデプロイですか? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel --prod
else
    vercel
fi

echo ""
echo "デプロイ完了！"
echo "=========================================="

