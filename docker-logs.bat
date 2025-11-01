@echo off
echo ========================================
echo Membership System - Service Logs
echo ========================================
echo.
echo Available services:
echo   1. postgres
echo   2. eureka-server
echo   3. config-server
echo   4. membership-service
echo   5. payment-service
echo   6. lesson-service
echo   7. store-service
echo   8. integration-service
echo   9. api-gateway
echo  10. frontend
echo  11. all (all services)
echo.
set /p service="Enter service name (or 'all'): "

if "%service%"=="all" (
    echo Showing logs for all services...
    docker-compose logs -f
) else (
    echo Showing logs for %service%...
    docker-compose logs -f %service%
)

pause

