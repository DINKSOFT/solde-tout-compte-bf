# ⚡ Mise à Jour Express - 2 Minutes Chrono

## 🎯 Objectif
Remplacer votre ancienne version sur GitHub par la nouvelle version avec export PDF/Excel.

---

## 🚀 Option 1 : Script Automatique (LE PLUS SIMPLE)

### Windows
1. Copier tous les nouveaux fichiers dans votre dossier de projet existant
2. Double-cliquer sur `mise-a-jour-git.bat`
3. ✅ C'est tout !

### Mac / Linux
1. Copier tous les nouveaux fichiers dans votre dossier de projet existant
2. Ouvrir un terminal dans le dossier
3. Exécuter : `./mise-a-jour-git.sh`
4. ✅ C'est tout !

**Le script fait tout automatiquement :**
- Sauvegarde l'ancienne version
- Ajoute les nouveaux fichiers
- Crée un commit descriptif
- Pousse sur GitHub

---

## 💻 Option 2 : Ligne de Commande Manuelle

```bash
# 1. Se placer dans votre projet actuel
cd chemin/vers/solde-tout-compte-bf

# 2. Sauvegarder l'ancienne version (optionnel mais recommandé)
git checkout -b backup-ancienne-version
git push origin backup-ancienne-version
git checkout main

# 3. Copier les nouveaux fichiers
# (copier manuellement tous les fichiers SAUF .git)

# 4. Ajouter et commiter
git add .
git commit -m "Ajout export PDF et Excel"

# 5. Pousser sur GitHub
git push origin main

# ✅ Terminé !
```

---

## 🔍 Vérification Rapide

### Sur GitHub
Aller sur `https://github.com/VOTRE-USERNAME/solde-tout-compte-bf`

Vérifier que ces fichiers sont présents :
- ✓ GUIDE_EXPORT.md (nouveau)
- ✓ package.json (mis à jour avec jspdf et xlsx)
- ✓ src/App.jsx (version avec exports)

### Sur Render
- Attendre 2-3 minutes
- Render redéploie automatiquement
- Tester : `https://votre-site.onrender.com`

### Test des exports
1. Remplir le formulaire
2. Calculer le solde
3. Cliquer "Exporter en PDF" → ✓ fichier téléchargé
4. Cliquer "Exporter en Excel" → ✓ fichier téléchargé

---

## 🆘 En cas de problème

### Erreur "uncommitted changes"
```bash
git stash
git pull
git stash pop
```

### Erreur "failed to push"
```bash
git pull --rebase origin main
git push origin main
```

### Tout casser et recommencer
```bash
git fetch origin
git reset --hard origin/main
```

---

## 📋 Checklist Ultra-Rapide

- [ ] Copier les nouveaux fichiers
- [ ] Exécuter le script OU commandes manuelles
- [ ] Vérifier sur GitHub
- [ ] Attendre redéploiement Render (2-3 min)
- [ ] Tester les exports
- [ ] ✅ Mise à jour OK !

---

**Pour plus de détails :** Consultez GUIDE_MISE_A_JOUR_GIT.md

**Temps total :** 2-3 minutes ⏱️
