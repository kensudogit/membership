@echo off
echo Starting Membership System...

echo Starting PostgreSQL...
docker-compose up -d postgres

echo Waiting for PostgreSQL to be ready...
timeout /t 10

echo Starting Eureka Server...
start "Eureka Server" cmd /k "cd eureka-server && ..\gradlew bootRun"

timeout /t 15

echo Starting Membership Service...
start "Membership Service" cmd /k "cd membership-service && ..\gradlew bootRun"

echo Starting Payment Service...
start "Payment Service" cmd /k "cd payment-service && ..\gradlew bootRun"

echo Starting Lesson Service...
start "Lesson Service" cmd /k "cd lesson-service && ..\gradlew bootRun"

echo Starting Store Service...
start "Store Service" cmd /k "cd store-service && ..\gradlew bootRun"

timeout /t 15

echo Starting API Gateway...
start "API Gateway" cmd /k "cd api-gateway && ..\gradlew bootRun"

echo All services starting...
echo.
echo Services will be available at:
echo - Eureka Server: http://localhost:8761
echo - API Gateway: http://localhost:8080
echo - Frontend: http://localhost:3000

pause

