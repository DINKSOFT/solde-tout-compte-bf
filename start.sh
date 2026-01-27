#!/bin/bash

echo "========================================"
echo "  Solde de Tout Compte - Burkina Faso"
echo "  Installation et démarrage"
echo "========================================"
echo ""

echo "[1/3] Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "ERREUR: L'installation a échoué"
    exit 1
fi

echo ""
echo "[2/3] Vérification de l'installation..."
echo "✓ Installation réussie"

echo ""
echo "[3/3] Lancement de l'application..."
echo ""
echo "========================================"
echo "  Application disponible sur:"
echo "  http://localhost:3000"
echo "========================================"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"
echo ""

npm run dev
