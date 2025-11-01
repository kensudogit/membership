@echo off
echo ========================================
echo Membership System - Docker Build
echo ========================================
echo.

echo Building all Docker images...
docker-compose build --no-cache

echo.
echo ========================================
echo Build completed!
echo ========================================
echo.
echo To start all services:
echo   docker-compose up -d
echo.
echo Or use: docker-start.bat
echo.

pause

