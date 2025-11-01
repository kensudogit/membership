@echo off
echo ========================================
echo Membership System - Docker Startup
echo ========================================
echo.

echo Building and starting all services...
docker-compose up -d --build

echo.
echo Waiting for services to be ready...
timeout /t 30

echo.
echo ========================================
echo Services Status:
echo ========================================
docker-compose ps

echo.
echo ========================================
echo Access URLs:
echo ========================================
echo Frontend:        http://localhost:3000
echo API Gateway:     http://localhost:8080
echo Eureka Dashboard: http://localhost:8761
echo.
echo Membership Service:  http://localhost:8081
echo Payment Service:     http://localhost:8082
echo Lesson Service:      http://localhost:8083
echo Store Service:       http://localhost:8084
echo Integration Service: http://localhost:8085
echo.
echo ========================================
echo Logs can be viewed with:
echo   docker-compose logs -f [service-name]
echo.
echo To stop all services:
echo   docker-compose down
echo ========================================

pause

