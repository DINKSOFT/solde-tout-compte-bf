# 🔄 Guide de Mise à Jour Git - Nouvelle Version avec Export

## 📋 Vue d'ensemble

Ce guide vous explique comment remplacer l'ancienne version de votre projet sur GitHub par la nouvelle version avec les fonctions d'export PDF et Excel.

---

## ✅ Prérequis

Avant de commencer, assurez-vous d'avoir :
- ✓ Git installé sur votre ordinateur
- ✓ Accès à votre repository GitHub existant
- ✓ La nouvelle version téléchargée et décompressée

---

## 🚀 MÉTHODE 1 : Mise à jour simple (RECOMMANDÉE)

Cette méthode remplace complètement les fichiers de votre projet.

### Étape 1 : Sauvegarder l'ancienne version (optionnel)

```bash
# Se placer dans votre projet actuel
cd chemin/vers/solde-tout-compte-bf

# Créer une branche de sauvegarde
git checkout -b backup-ancienne-version
git push origin backup-ancienne-version

# Revenir sur la branche principale
git checkout main
```

### Étape 2 : Remplacer les fichiers

**Option A : Remplacement manuel**

1. Ouvrir votre dossier de projet actuel
2. **Supprimer tous les fichiers** SAUF le dossier `.git`
3. Copier **tous les nouveaux fichiers** dans le dossier
4. Vérifier que le dossier `.git` est toujours présent

**Option B : Via ligne de commande**

```bash
# Se placer dans votre projet actuel
cd chemin/vers/solde-tout-compte-bf

# Sauvegarder le dossier .git
cp -r .git ../git-backup

# Supprimer tout sauf .git
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +

# Copier les nouveaux fichiers
cp -r chemin/vers/solde-tout-compte-final/* .

# Si besoin, restaurer .git
# cp -r ../git-backup .git
```

### Étape 3 : Commiter et pousser les changements

```bash
# Voir les modifications
git status

# Ajouter tous les changements
git add .

# Commiter avec un message clair
git commit -m "Ajout des fonctions d'export PDF et Excel

- Export PDF avec mise en forme et couleurs préservées
- Export Excel avec 3 feuilles (Synthèse, Périodes, IUTS)
- Ajout du champ nom du salarié
- Mise à jour des dépendances (jsPDF, xlsx)
- Documentation complète des exports"

# Pousser sur GitHub
git push origin main
```

**✅ C'est terminé ! Votre repository GitHub est à jour.**

---

## 🔄 MÉTHODE 2 : Mise à jour sélective

Si vous avez fait des modifications personnelles et voulez les conserver.

### Étape 1 : Identifier vos modifications

```bash
# Voir les fichiers modifiés
git status

# Voir le détail des modifications
git diff
```

### Étape 2 : Créer une branche pour tester

```bash
# Créer une nouvelle branche
git checkout -b mise-a-jour-export

# Copier les nouveaux fichiers
cp chemin/vers/solde-tout-compte-final/src/App.jsx src/
cp chemin/vers/solde-tout-compte-final/package.json .
cp chemin/vers/solde-tout-compte-final/GUIDE_EXPORT.md .

# Voir les changements
git status
git diff
```

### Étape 3 : Résoudre les conflits (si nécessaire)

Si vous avez modifié les mêmes fichiers :

```bash
# Git vous indiquera les conflits
git add .
git commit -m "Tentative de fusion"

# Éditer les fichiers en conflit
# Chercher les marqueurs <<<<<<< ======= >>>>>>>
# Choisir quelle version garder
```

### Étape 4 : Fusionner avec main

```bash
# Revenir sur main
git checkout main

# Fusionner la branche
git merge mise-a-jour-export

# Pousser
git push origin main
```

---

## 🆕 MÉTHODE 3 : Nouveau départ (repository frais)

Si vous voulez repartir à zéro avec un repository propre.

### Option A : Supprimer et recréer

```bash
# 1. Supprimer l'ancien repository sur GitHub
# (via l'interface web : Settings → Danger Zone → Delete repository)

# 2. Créer un nouveau repository
# (via l'interface web : New repository)

# 3. Initialiser le nouveau projet
cd chemin/vers/solde-tout-compte-final
git init
git add .
git commit -m "Version initiale avec export PDF et Excel"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/solde-tout-compte-bf.git
git push -u origin main
```

### Option B : Forcer l'écrasement (ATTENTION !)

```bash
# ⚠️ ATTENTION : Ceci écrase tout l'historique !

cd chemin/vers/solde-tout-compte-final
git init
git add .
git commit -m "Version avec export PDF et Excel"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/solde-tout-compte-bf.git
git push -f origin main
```

---

## 📝 Vérification après mise à jour

### 1. Vérifier sur GitHub

- Aller sur votre repository : `https://github.com/VOTRE-USERNAME/solde-tout-compte-bf`
- Vérifier que tous les nouveaux fichiers sont présents :
  - ✓ GUIDE_EXPORT.md
  - ✓ package.json mis à jour (avec jspdf et xlsx)
  - ✓ src/App.jsx (version avec exports)

### 2. Vérifier l'historique

```bash
# Voir les derniers commits
git log --oneline -5

# Voir les fichiers du dernier commit
git show --name-only
```

### 3. Tester en local

```bash
# Cloner le repository mis à jour
git clone https://github.com/VOTRE-USERNAME/solde-tout-compte-bf.git test-clone
cd test-clone

# Installer et tester
npm install
npm run dev

# Vérifier que les exports fonctionnent
```

---

## 🔧 Commandes Git utiles

### Annuler des changements

```bash
# Annuler les modifications non commitées
git checkout -- fichier.js

# Annuler le dernier commit (garder les changements)
git reset --soft HEAD~1

# Annuler le dernier commit (supprimer les changements)
git reset --hard HEAD~1
```

### Voir l'état du projet

```bash
# Statut actuel
git status

# Historique des commits
git log --oneline --graph --all

# Différences avec la dernière version
git diff HEAD
```

### Gérer les branches

```bash
# Lister toutes les branches
git branch -a

# Créer une nouvelle branche
git checkout -b nom-branche

# Supprimer une branche
git branch -d nom-branche

# Supprimer une branche sur GitHub
git push origin --delete nom-branche
```

---

## 🐛 Dépannage

### Problème : "Your local changes would be overwritten"

```bash
# Sauvegarder vos modifications temporairement
git stash

# Faire votre mise à jour
git pull

# Récupérer vos modifications
git stash pop
```

### Problème : "Failed to push"

```bash
# Récupérer les changements distants
git pull --rebase origin main

# Pousser à nouveau
git push origin main
```

### Problème : Conflit de fusion

```bash
# Voir les fichiers en conflit
git status

# Éditer chaque fichier et choisir la version à garder
# Chercher les marqueurs :
# <<<<<<< HEAD
# Votre version
# =======
# Leur version
# >>>>>>> branch-name

# Une fois résolu
git add fichier-resolu.js
git commit -m "Résolution du conflit"
```

### Problème : Trop de fichiers node_modules poussés

```bash
# Supprimer node_modules de Git
git rm -r --cached node_modules

# S'assurer que .gitignore contient
echo "node_modules" >> .gitignore

# Commiter
git add .gitignore
git commit -m "Retrait node_modules du repository"
git push
```

---

## 📦 Après la mise à jour sur GitHub

### Redéployer sur Render

**Option 1 : Automatique**
- Render détecte automatiquement le nouveau commit
- Le redéploiement se lance automatiquement
- Attendre 2-3 minutes

**Option 2 : Manuel**
- Aller sur Render Dashboard
- Sélectionner votre site
- Cliquer "Manual Deploy" → "Deploy latest commit"

### Tester le site en production

```
https://votre-site.onrender.com
```

Vérifier :
- ✓ L'application se charge
- ✓ Le formulaire fonctionne
- ✓ Le calcul s'effectue
- ✓ Les boutons d'export apparaissent
- ✓ L'export PDF fonctionne
- ✓ L'export Excel fonctionne

---

## ✅ Checklist complète de mise à jour

- [ ] Sauvegarder l'ancienne version (git branch)
- [ ] Remplacer les fichiers (garder .git)
- [ ] Vérifier package.json (jspdf, xlsx)
- [ ] Vérifier src/App.jsx (nouvelles fonctions)
- [ ] git add .
- [ ] git commit avec message descriptif
- [ ] git push origin main
- [ ] Vérifier sur GitHub (tous les fichiers présents)
- [ ] Attendre le redéploiement Render
- [ ] Tester en production
- [ ] Tester les exports PDF et Excel
- [ ] ✅ Mise à jour terminée !

---

## 💡 Bonnes pratiques

### Messages de commit clairs

```bash
# ❌ Mauvais
git commit -m "update"

# ✅ Bon
git commit -m "Ajout des fonctions d'export PDF et Excel

- Intégration jsPDF pour export PDF coloré
- Intégration xlsx pour export Excel 3 feuilles
- Ajout champ nom du salarié
- Documentation complète dans GUIDE_EXPORT.md"
```

### Commits réguliers

```bash
# Faire des commits fréquents avec des changements logiques
git add package.json
git commit -m "Ajout dépendances jsPDF et xlsx"

git add src/App.jsx
git commit -m "Ajout fonctions exporterPDF et exporterExcel"

git add GUIDE_EXPORT.md
git commit -m "Ajout documentation des exports"
```

### Utiliser les branches

```bash
# Pour chaque nouvelle fonctionnalité
git checkout -b feature/nom-fonctionnalite

# Travailler, commiter

# Fusionner quand c'est prêt
git checkout main
git merge feature/nom-fonctionnalite
```

---

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :

1. **Vérifier le statut** : `git status`
2. **Voir les erreurs** : Lire attentivement les messages
3. **Chercher l'erreur** : Google + message d'erreur exact
4. **Annuler si besoin** : `git reset --hard origin/main`

---

## 📞 Commandes de secours

### Tout casser et recommencer

```bash
# ⚠️ ATTENTION : Perd toutes les modifications locales !

# Revenir à la dernière version sur GitHub
git fetch origin
git reset --hard origin/main

# Si vraiment tout est cassé
rm -rf .git
git clone https://github.com/VOTRE-USERNAME/solde-tout-compte-bf.git
```

---

**Bonne mise à jour ! 🚀🇧🇫**
