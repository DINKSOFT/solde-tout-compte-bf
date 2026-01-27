# 📘 Guide Complet : Hébergement sur Render

## 🎯 Vue d'ensemble

Ce guide vous accompagne pas à pas pour héberger votre application "Solde de Tout Compte" sur Render, un service d'hébergement gratuit et performant.

---

## ✅ Prérequis

Avant de commencer, assurez-vous d'avoir :
- ✓ Un compte GitHub (gratuit)
- ✓ Un compte Render (gratuit) - créer sur render.com
- ✓ Git installé sur votre ordinateur
- ✓ Les fichiers du projet téléchargés

---

## 🚀 MÉTHODE 1 : Déploiement via GitHub (RECOMMANDÉ)

### Étape 1 : Préparer le projet localement

**1.1** Ouvrir un terminal/invite de commandes

**1.2** Naviguer vers le dossier du projet
```bash
cd chemin/vers/solde-tout-compte-app
```

**1.3** Initialiser Git
```bash
git init
git add .
git commit -m "Premier déploiement - Application Solde de Tout Compte"
```

### Étape 2 : Créer un repository GitHub

**2.1** Aller sur https://github.com et se connecter

**2.2** Cliquer sur le bouton "+" en haut à droite → "New repository"

**2.3** Remplir les informations :
- **Repository name** : `solde-tout-compte-bf`
- **Description** : "Application de calcul de Solde de Tout Compte - Burkina Faso 2025"
- **Visibilité** : Public (ou Private si vous préférez)
- ❌ Ne PAS cocher "Add a README file"

**2.4** Cliquer sur "Create repository"

**2.5** Copier l'URL du repository (format : https://github.com/VOTRE-USERNAME/solde-tout-compte-bf.git)

### Étape 3 : Pousser le code sur GitHub

**3.1** Dans votre terminal, exécuter :
```bash
git remote add origin https://github.com/VOTRE-USERNAME/solde-tout-compte-bf.git
git branch -M main
git push -u origin main
```

**3.2** Vérifier sur GitHub que tous les fichiers sont bien présents

### Étape 4 : Déployer sur Render

**4.1** Aller sur https://render.com et se connecter

**4.2** Sur le dashboard, cliquer sur **"New +"** → **"Static Site"**

**4.3** Connecter votre compte GitHub :
- Cliquer sur "Connect GitHub"
- Autoriser Render à accéder à vos repositories

**4.4** Sélectionner votre repository `solde-tout-compte-bf`

**4.5** Configurer le déploiement :

```
Name:                solde-tout-compte-bf
Branch:              main
Build Command:       npm install && npm run build
Publish Directory:   dist
```

**4.6** Cliquer sur **"Create Static Site"**

### Étape 5 : Attendre le déploiement

**5.1** Render va :
- ✓ Cloner votre repository
- ✓ Installer les dépendances (npm install)
- ✓ Construire l'application (npm run build)
- ✓ Déployer le site

**5.2** Le processus prend environ 2-3 minutes

**5.3** Une fois terminé, vous verrez "Deploy successful ✓"

### Étape 6 : Accéder à votre site

Votre application sera accessible à l'URL :
```
https://solde-tout-compte-bf.onrender.com
```

**🎉 Félicitations ! Votre application est en ligne !**

---

## 🔄 Mettre à jour l'application

Pour publier des modifications :

```bash
# 1. Faire vos modifications dans le code

# 2. Sauvegarder et commiter
git add .
git commit -m "Description de vos modifications"

# 3. Pousser sur GitHub
git push

# 4. Render redéploiera automatiquement !
```

---

## 🆓 MÉTHODE 2 : Déploiement sans GitHub

Si vous ne voulez pas utiliser GitHub :

### Option A : Upload direct sur Render

**Malheureusement, Render ne permet pas l'upload direct de fichiers.**
**Vous devez utiliser Git/GitHub.**

### Option B : Hébergements alternatifs gratuits

Si vous ne souhaitez vraiment pas utiliser GitHub, voici des alternatives :

#### 1. **Netlify Drop**
- Aller sur https://app.netlify.com/drop
- Faire un build local : `npm run build`
- Glisser-déposer le dossier `dist/`
- Site instantanément en ligne !

#### 2. **Vercel**
- Similaire à Render
- Aussi performant
- Nécessite aussi GitHub

#### 3. **GitHub Pages** (gratuit)
- Si vous avez déjà GitHub
- Processus simplifié
- Parfait pour sites statiques

---

## ⚙️ Configuration avancée Render

### Variables d'environnement (optionnel)

Si vous voulez ajouter des variables :
1. Dans Render Dashboard → votre site
2. Aller dans "Environment"
3. Ajouter les variables nécessaires

### Domaine personnalisé

Pour utiliser votre propre domaine (ex: solde.votresite.com) :

1. Dans Render Dashboard → votre site → "Settings"
2. Section "Custom Domains"
3. Cliquer "Add Custom Domain"
4. Suivre les instructions DNS

---

## 🐛 Dépannage

### Problème : Le déploiement échoue

**Solution 1** : Vérifier les logs dans Render
- Cliquer sur votre déploiement
- Lire les messages d'erreur

**Solution 2** : Vérifier package.json
- S'assurer que toutes les dépendances sont listées
- Versions correctes de Node/npm

### Problème : La page est blanche

**Solution** : Vérifier vite.config.js
- Le fichier doit être présent
- Configuration correcte

### Problème : Git push échoue

**Solution** :
```bash
# Vérifier la connexion
git remote -v

# Re-configurer si nécessaire
git remote set-url origin https://github.com/VOTRE-USERNAME/solde-tout-compte-bf.git
```

---

## 💡 Astuces

### Activer le HTTPS automatique
✅ Render active HTTPS par défaut - rien à faire !

### Performances
✅ Render utilise un CDN global - site rapide partout !

### Mises à jour automatiques
✅ Chaque `git push` redéploie automatiquement

### Logs et monitoring
✅ Accessible dans le Dashboard Render

---

## 📞 Support

- **Render Documentation** : https://render.com/docs
- **GitHub Help** : https://docs.github.com
- **Vite Documentation** : https://vitejs.dev

---

## ✨ Récapitulatif rapide

```bash
# 1. Initialiser Git
git init
git add .
git commit -m "Initial commit"

# 2. Créer repo GitHub
# (via interface web)

# 3. Pousser le code
git remote add origin URL-DE-VOTRE-REPO
git push -u origin main

# 4. Déployer sur Render
# New + → Static Site → Connecter GitHub
# Build: npm install && npm run build
# Publish: dist

# 5. Votre site est en ligne ! 🎉
```

---

**Bonne chance avec votre déploiement ! 🚀🇧🇫**
