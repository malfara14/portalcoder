@echo off
echo ========================================
echo    Coder Factory - Backend Server
echo ========================================
echo.

echo Instalando dependencias...
call npm install

echo.
echo Iniciando servidor...
echo Servidor rodando em: http://localhost:3000
echo Dashboard: http://localhost:3000/dashboard
echo.

call npm start

pause
