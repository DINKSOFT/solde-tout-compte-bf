@echo off
echo ========================================
echo   Solde de Tout Compte - Burkina Faso
echo   Installation et demarrage
echo ========================================
echo.

echo [1/3] Installation des dependances...
call npm install

echo.
echo [2/3] Verification de l'installation...
if %errorlevel% neq 0 (
    echo ERREUR: L'installation a echoue
    pause
    exit /b 1
)

echo.
echo [3/3] Lancement de l'application...
echo.
echo ========================================
echo   Application disponible sur:
echo   http://localhost:3000
echo ========================================
echo.
echo Appuyez sur Ctrl+C pour arreter
echo.

call npm run dev

pause
