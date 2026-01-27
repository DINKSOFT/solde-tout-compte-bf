@echo off
echo ========================================
echo   MISE A JOUR GIT - Version Export
echo ========================================
echo.

echo [ETAPE 1/5] Verification du repository Git...
if not exist .git (
    echo ERREUR: Ce dossier n'est pas un repository Git !
    echo Assurez-vous d'etre dans le bon dossier.
    pause
    exit /b 1
)

echo [ETAPE 2/5] Sauvegarde de l'ancienne version...
git checkout -b backup-avant-export-%date:~-4,4%%date:~-7,2%%date:~-10,2%
git push origin backup-avant-export-%date:~-4,4%%date:~-7,2%%date:~-10,2%
git checkout main

echo.
echo [ETAPE 3/5] Ajout des nouveaux fichiers...
git add .

echo.
echo [ETAPE 4/5] Creation du commit...
git commit -m "Ajout des fonctions d'export PDF et Excel" -m "- Export PDF avec mise en forme et couleurs preservees" -m "- Export Excel avec 3 feuilles (Synthese, Periodes, IUTS)" -m "- Ajout du champ nom du salarie" -m "- Mise a jour des dependances (jsPDF, xlsx)"

echo.
echo [ETAPE 5/5] Envoi sur GitHub...
git push origin main

echo.
echo ========================================
echo   MISE A JOUR TERMINEE !
echo ========================================
echo.
echo Votre repository GitHub a ete mis a jour.
echo Render va redéployer automatiquement dans 2-3 minutes.
echo.

pause
