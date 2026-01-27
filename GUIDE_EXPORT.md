# 📄 Guide d'Export PDF & Excel

## 🎯 Vue d'ensemble

L'application **Solde de Tout Compte BF** intègre désormais deux fonctions d'export professionnelles qui préservent **exactement** la mise en forme et les couleurs de l'interface :

1. **Export PDF** 📕 - Document professionnel avec mise en forme couleur
2. **Export Excel** 📊 - Tableur avec 3 feuilles détaillées

---

## 📕 Export PDF

### Caractéristiques

✅ **Mise en forme identique** à l'interface web
✅ **Couleurs conservées** (vert #1a5f3f, or #d4af37, etc.)
✅ **Structure professionnelle** :
   - En-tête avec logo coloré
   - Sections avec fonds de couleur
   - Tableaux formatés
   - Récapitulatif final avec fond vert
   - Net à payer sur fond or

### Contenu du PDF

1. **Page 1** :
   - En-tête vert avec titre et date
   - Informations du salarié
   - Tableau des périodes salariales (couleurs préservées)
   - ICCP (fond jaune clair)
   - IFC (fond rose clair)

2. **Page 2** (si nécessaire) :
   - Retenues CNSS (fond bleu clair)
   - Détail IUTS (fond mauve clair)
   - Récapitulatif final (fond vert)
   - **NET À PAYER** (fond or)
   - Note légale en pied de page

### Bibliothèque utilisée

- **jsPDF** : Génération PDF côté client
- **jsPDF-AutoTable** : Tableaux formatés
- Taille : ~150 KB (légères bibliothèques)

### Nom du fichier généré

Format : `Solde_Tout_Compte_[Nom]_[Date].pdf`

Exemple : `Solde_Tout_Compte_OUEDRAOGO_Jean_27-01-2026.pdf`

---

## 📊 Export Excel

### Caractéristiques

✅ **3 feuilles de calcul** organisées
✅ **Données structurées** pour analyse
✅ **Format professionnel** avec largeurs de colonnes optimisées
✅ **Toutes les données** : calculs, détails, références

### Structure du fichier Excel

#### 📋 Feuille 1 : **Synthèse**

Contient :
- Titre et date de calcul
- Informations complètes du salarié
- Tous les salaires (dernier, moyen, total)
- Détail ICCP ligne par ligne
- Détail IFC
- Retenues (CNSS, IUTS)
- Récapitulatif avec NET À PAYER

Format : 2-3 colonnes (Libellé | Valeur | Unité)

#### 📋 Feuille 2 : **Périodes salariales**

Tableau détaillé de toutes les variations :
- Date début | Date fin
- Jours effectifs | Mois
- Salaire brut | Montant période
- **Ligne TOTAL** en bas

Permet l'analyse des variations de salaire.

#### 📋 Feuille 3 : **Détail IUTS**

Décomposition complète du barème progressif :
- Tableau des tranches
- Base imposable par tranche
- Taux appliqué
- Montant d'impôt par tranche
- IUTS brut
- Réduction pour charges
- **IUTS net final**

Idéal pour vérification et audit.

### Bibliothèque utilisée

- **SheetJS (xlsx)** : Manipulation Excel côté client
- Taille : ~600 KB
- Compatible : Excel, LibreOffice, Google Sheets

### Nom du fichier généré

Format : `Solde_Tout_Compte_[Nom]_[Date].xlsx`

Exemple : `Solde_Tout_Compte_OUEDRAOGO_Jean_27-01-2026.xlsx`

---

## 🚀 Utilisation

### Étape 1 : Calculer le solde

1. Remplir le formulaire complet
2. Ajouter toutes les périodes salariales
3. Cliquer sur **"Calculer le Solde de Tout Compte"**

### Étape 2 : Exporter

Deux boutons apparaissent en haut des résultats :

```
┌─────────────────────────┐  ┌─────────────────────────┐
│  📄 Exporter en PDF     │  │  📊 Exporter en Excel   │
└─────────────────────────┘  └─────────────────────────┘
```

**Bouton PDF** (rouge) :
- Clic → Téléchargement immédiat du PDF
- Conserve toutes les couleurs et la mise en forme

**Bouton Excel** (vert) :
- Clic → Téléchargement immédiat du fichier .xlsx
- 3 feuilles organisées pour analyse

---

## 🎨 Fidélité de la mise en forme

### Couleurs conservées dans le PDF

| Élément | Couleur | Code HEX |
|---------|---------|----------|
| En-tête principal | Vert foncé | #1a5f3f |
| Récapitulatif final | Vert moyen | #2d8659 |
| Net à payer | Or | #d4af37 |
| Section ICCP | Jaune clair | #fff8e1 |
| Section IFC | Rose clair | #fce4ec |
| Section CNSS | Bleu clair | #e3f2fd |
| Section IUTS | Mauve clair | #f3e5f5 |
| Périodes salaires | Vert très clair | #e8f5e9 |

Toutes ces couleurs sont **exactement reproduites** dans le PDF !

---

## 💡 Cas d'usage

### Pour le salarié

✅ **PDF** : Document officiel à conserver
- Impression facile
- Signature possible
- Archivage légal

### Pour le comptable

✅ **Excel** : Vérification et audit
- Analyse des périodes
- Vérification du barème IUTS
- Import dans logiciel comptable

### Pour l'employeur

✅ **Les deux** : Dossier complet
- PDF pour signature
- Excel pour archivage et analyse

---

## 🔧 Technique

### Dépendances ajoutées au projet

```json
{
  "jspdf": "^2.5.1",
  "jspdf-autotable": "^3.8.2",
  "xlsx": "^0.18.5"
}
```

### Installation

```bash
npm install
```

Les bibliothèques sont automatiquement téléchargées.

### Taille totale des exports

- **jsPDF** : ~150 KB
- **jsPDF-AutoTable** : ~50 KB
- **XLSX** : ~600 KB
- **Total** : ~800 KB (acceptable pour une app web)

---

## ✅ Avantages

### Export PDF

1. **Format universel** - Lisible partout
2. **Non modifiable** - Intégrité garantie
3. **Professionnel** - Mise en page soignée
4. **Imprimable** - Qualité optimale
5. **Archivage** - Conforme normes légales

### Export Excel

1. **Analyse facile** - Tri, filtres, graphiques
2. **Vérifiable** - Toutes les formules visibles
3. **Éditable** - Ajout de notes possibles
4. **Intégrable** - Import dans autres systèmes
5. **Multi-feuilles** - Organisation claire

---

## 📝 Conformité légale

Les deux formats d'export contiennent :

✅ **Toutes les bases réglementaires** citées
✅ **Méthode de calcul** explicite (1/12ème)
✅ **Date de calcul** pour traçabilité
✅ **Détail complet** des retenues
✅ **Note de validation** (consultation expert RH)

Les documents générés sont conformes aux exigences du :
- Code du Travail (2008)
- Convention Collective Interprofessionnelle
- Code Général des Impôts (CGI 2025)
- Code de Sécurité Sociale

---

## 🆘 Dépannage

### Le PDF ne se télécharge pas

**Solution** :
- Vérifier que le calcul a bien été effectué
- Vérifier les autorisations de téléchargement du navigateur
- Essayer avec un autre navigateur (Chrome, Firefox)

### L'Excel est corrompu

**Solution** :
- S'assurer que toutes les périodes sont valides
- Vérifier qu'il n'y a pas de caractères spéciaux dans le nom
- Réessayer l'export

### Les couleurs ne s'affichent pas

**Solution** :
- C'est normal pour Excel (pas de couleurs de fond)
- Pour PDF, vérifier l'ouverture avec Adobe Reader ou navigateur moderne

---

## 📞 Support

Pour toute question sur les exports :
1. Vérifier ce guide
2. Consulter le README.md du projet
3. Tester avec les données d'exemple

---

**Développé pour le Burkina Faso 🇧🇫 avec précision et professionnalisme**
