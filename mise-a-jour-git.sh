#!/bin/bash

echo "========================================"
echo "  MISE À JOUR GIT - Version Export"
echo "========================================"
echo ""

# Vérifier si c'est un repository Git
if [ ! -d .git ]; then
    echo "❌ ERREUR: Ce dossier n'est pas un repository Git !"
    echo "Assurez-vous d'être dans le bon dossier."
    exit 1
fi

echo "✓ Repository Git détecté"
echo ""

# Sauvegarder l'ancienne version
echo "[1/5] Sauvegarde de l'ancienne version..."
DATE=$(date +%Y%m%d)
git checkout -b "backup-avant-export-$DATE"
git push origin "backup-avant-export-$DATE"
git checkout main
echo "✓ Sauvegarde créée : backup-avant-export-$DATE"
echo ""

# Afficher les fichiers modifiés
echo "[2/5] Fichiers à mettre à jour :"
git status --short
echo ""

# Ajouter tous les changements
echo "[3/5] Ajout des nouveaux fichiers..."
git add .
echo "✓ Fichiers ajoutés"
echo ""

# Créer le commit
echo "[4/5] Création du commit..."
git commit -m "Ajout des fonctions d'export PDF et Excel

- Export PDF avec mise en forme et couleurs préservées
- Export Excel avec 3 feuilles (Synthèse, Périodes, IUTS)
- Ajout du champ nom du salarié
- Mise à jour des dépendances (jsPDF, xlsx)
- Documentation complète dans GUIDE_EXPORT.md"

if [ $? -eq 0 ]; then
    echo "✓ Commit créé avec succès"
else
    echo "❌ Erreur lors du commit"
    exit 1
fi
echo ""

# Pousser sur GitHub
echo "[5/5] Envoi sur GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✓ Mise à jour envoyée sur GitHub"
else
    echo "❌ Erreur lors de l'envoi"
    echo "Vérifiez vos identifiants GitHub"
    exit 1
fi
echo ""

echo "========================================"
echo "  ✅ MISE À JOUR TERMINÉE !"
echo "========================================"
echo ""
echo "📌 Votre repository GitHub a été mis à jour."
echo "🚀 Render va redéployer automatiquement dans 2-3 minutes."
echo ""
echo "🔗 Vérifiez sur : https://github.com/VOTRE-USERNAME/solde-tout-compte-bf"
echo ""
