# 🇧🇫 Solde de Tout Compte - Burkina Faso 2025

Application de calcul de Solde de Tout Compte conforme à la réglementation burkinabè 2025.

## 📋 Fonctionnalités

- ✅ Gestion des variations salariales sur toute la période du contrat
- ✅ Calcul ICCP selon la méthode du 1/12ème réglementaire
- ✅ Calcul IFC basé sur le salaire global moyen
- ✅ Barème IUTS 2025 (7 tranches) avec réductions familiales
- ✅ Retenue CNSS plafonnée à 800 000 FCFA
- ✅ Interface professionnelle et responsive

## 🚀 Déploiement sur Render

### Méthode 1 : Via GitHub (Recommandé)

1. **Créer un repository GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Solde de Tout Compte BF"
   git branch -M main
   git remote add origin https://github.com/VOTRE-USERNAME/solde-tout-compte-bf.git
   git push -u origin main
   ```

2. **Déployer sur Render**
   - Aller sur [render.com](https://render.com)
   - Cliquer sur "New +" → "Static Site"
   - Connecter votre repository GitHub
   - Configurer :
     - **Name**: `solde-tout-compte-bf` (ou votre choix)
     - **Branch**: `main`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
   - Cliquer sur "Create Static Site"

3. **Votre site sera disponible à** : `https://solde-tout-compte-bf.onrender.com`

### Méthode 2 : Déploiement manuel (sans Git)

1. **Aller sur Render Dashboard**
   - Créer un nouveau "Static Site"
   - Choisir "Deploy from Git" ou "Public Git Repository"

2. **Configuration**
   ```
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

### Méthode 3 : Via Render CLI

```bash
# Installer Render CLI
npm install -g render-cli

# Se connecter
render login

# Déployer
render deploy
```

## 💻 Développement local

### Installation

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### Build pour production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`

## 📦 Structure du projet

```
solde-tout-compte-app/
├── src/
│   ├── App.jsx          # Composant principal
│   └── main.jsx         # Point d'entrée React
├── public/              # Fichiers statiques
├── index.html           # HTML principal
├── package.json         # Dépendances
├── vite.config.js       # Configuration Vite
└── README.md           # Documentation
```

## ⚖️ Conformité réglementaire

Cette application respecte strictement :
- **Code du Travail (2008)** : Acquisition des congés (2,5 jours/mois)
- **Convention Collective Interprofessionnelle (CCI)** : IFC à 25%
- **Code Général des Impôts (CGI 2025)** : Barème IUTS 7 tranches
- **Code de Sécurité Sociale** : CNSS 5,5% plafonnée

## 🔧 Technologies utilisées

- **React 18** : Framework UI
- **Vite** : Build tool ultra-rapide
- **Lucide React** : Icônes modernes
- **CSS-in-JS** : Styling inline pour portabilité

## 📱 Support

- Desktop : ✅ Chrome, Firefox, Safari, Edge
- Mobile : ✅ iOS Safari, Android Chrome
- Tablette : ✅ iPad, Android tablets

## 📄 Licence

Ce projet est fourni à titre indicatif. Consultez un expert RH ou juridique pour validation des calculs.

---

**Développé avec ❤️ pour le Burkina Faso 🇧🇫**
"# solde-tout-compte-bf" 
