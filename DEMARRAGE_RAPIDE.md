# 🚀 Démarrage Rapide - 5 minutes chrono !

## Option 1️⃣ : Test en local (le plus simple)

### Windows
1. Double-cliquer sur `start.bat`
2. Ouvrir http://localhost:3000
3. ✅ C'est tout !

### Mac / Linux
1. Ouvrir un terminal
2. Exécuter : `./start.sh`
3. Ouvrir http://localhost:3000
4. ✅ C'est tout !

---

## Option 2️⃣ : Héberger en ligne sur Render (gratuit)

### Étape 1 : Créer un compte GitHub
- Aller sur https://github.com
- Cliquer "Sign up" (gratuit)
- Suivre les instructions

### Étape 2 : Créer un repository
- Sur GitHub, cliquer le bouton "+" → "New repository"
- Nom : `solde-tout-compte-bf`
- Cliquer "Create repository"

### Étape 3 : Pousser le code
Ouvrir un terminal dans le dossier du projet :

```bash
git init
git add .
git commit -m "Premier déploiement"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/solde-tout-compte-bf.git
git push -u origin main
```

### Étape 4 : Déployer sur Render
- Aller sur https://render.com (créer un compte gratuit)
- Cliquer "New +" → "Static Site"
- Connecter votre GitHub
- Sélectionner le repository `solde-tout-compte-bf`
- Configuration :
  ```
  Build Command:       npm install && npm run build
  Publish Directory:   dist
  ```
- Cliquer "Create Static Site"

### Étape 5 : Attendre 2-3 minutes
✅ Votre site sera disponible sur : `https://solde-tout-compte-bf.onrender.com`

---

## 🆘 Besoin d'aide ?

Consultez le fichier `GUIDE_HEBERGEMENT.md` pour un guide détaillé pas à pas.

---

## 📋 Checklist avant déploiement

- ✅ Compte GitHub créé
- ✅ Compte Render créé
- ✅ Git installé sur votre ordinateur
- ✅ Les fichiers du projet téléchargés

---

**C'est parti ! 🚀**
