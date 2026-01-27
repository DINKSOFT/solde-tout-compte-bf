import React, { useState } from 'react';
import { Calculator, Calendar, TrendingUp, FileText, Info, Plus, Trash2, Edit3 } from 'lucide-react';

// ========== CONSTANTES RÉGLEMENTAIRES BF 2025 ==========
const CNSS_RATE = 0.055;
const CNSS_PLAFOND = 800000;
const IFC_RATE = 0.25;
const CONGES_JOURS_PAR_MOIS = 2.5;

// Barème IUTS 2025 (7 tranches)
const BAREME_IUTS = [
  { min: 0, max: 30000, taux: 0 },
  { min: 30001, max: 50000, taux: 0.121 },
  { min: 50001, max: 80000, taux: 0.139 },
  { min: 80001, max: 120000, taux: 0.157 },
  { min: 120001, max: 170000, taux: 0.184 },
  { min: 170001, max: 250000, taux: 0.217 },
  { min: 250001, max: Infinity, taux: 0.25 }
];

// Réductions IUTS par charge de famille
const REDUCTION_CHARGES = {
  0: 0,
  1: 0.08,
  2: 0.10,
  3: 0.12,
  4: 0.14
};

const SoldeToutCompteBF = () => {
  // États du formulaire
  const [formData, setFormData] = useState({
    dateDebut: '',
    dateFin: '',
    joursCongesPris: '',
    motifRupture: 'fin_cdd',
    chargesFamille: '0',
    categorie: 'non_cadre'
  });

  // Historique des salaires (avec période de référence)
  const [historiqueSalaires, setHistoriqueSalaires] = useState([
    { id: 1, dateDebut: '', dateFin: '', salaireBrut: '', actif: true }
  ]);

  const [resultat, setResultat] = useState(null);

  // ========== GESTION DE L'HISTORIQUE DES SALAIRES ==========
  
  const ajouterPeriodeSalaire = () => {
    const newId = Math.max(...historiqueSalaires.map(s => s.id), 0) + 1;
    setHistoriqueSalaires([
      ...historiqueSalaires,
      { id: newId, dateDebut: '', dateFin: '', salaireBrut: '', actif: true }
    ]);
  };

  const supprimerPeriodeSalaire = (id) => {
    if (historiqueSalaires.length > 1) {
      setHistoriqueSalaires(historiqueSalaires.filter(s => s.id !== id));
    }
  };

  const modifierPeriodeSalaire = (id, field, value) => {
    setHistoriqueSalaires(
      historiqueSalaires.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  // ========== FONCTIONS DE CALCUL ==========
  
  const calculerAnciennete = (debut, fin) => {
    const d1 = new Date(debut);
    const d2 = new Date(fin);
    const diffMs = d2 - d1;
    const diffJours = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const mois = diffJours / 30.44;
    const annees = mois / 12;
    return { mois: Math.floor(mois), annees, joursTotal: diffJours };
  };

  const calculerRemunerationTotalePeriodiqueAvecVariations = (periodes, dateDebutContrat, dateFinContrat) => {
    let remunerationTotale = 0;
    let detailPeriodes = [];
    let dernierSalaire = 0;

    // Trier les périodes par date de début
    const periodesTriees = [...periodes]
      .filter(p => p.salaireBrut && p.dateDebut && p.dateFin)
      .sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut));

    if (periodesTriees.length === 0) {
      return { remunerationTotale: 0, detailPeriodes: [], dernierSalaire: 0, salaireGlobalMoyen: 0 };
    }

    periodesTriees.forEach((periode) => {
      const debut = new Date(Math.max(new Date(periode.dateDebut), new Date(dateDebutContrat)));
      const fin = new Date(Math.min(new Date(periode.dateFin), new Date(dateFinContrat)));
      
      if (debut <= fin) {
        const joursEffectifs = Math.floor((fin - debut) / (1000 * 60 * 60 * 24)) + 1;
        const moisEffectifs = joursEffectifs / 30.44;
        const salaireBrut = parseFloat(periode.salaireBrut);
        const montantPeriode = salaireBrut * moisEffectifs;
        
        remunerationTotale += montantPeriode;
        dernierSalaire = salaireBrut;
        
        detailPeriodes.push({
          dateDebut: debut.toISOString().split('T')[0],
          dateFin: fin.toISOString().split('T')[0],
          joursEffectifs,
          moisEffectifs: Math.round(moisEffectifs * 100) / 100,
          salaireBrut,
          montantPeriode
        });
      }
    });

    const anciennete = calculerAnciennete(dateDebutContrat, dateFinContrat);
    const salaireGlobalMoyen = anciennete.mois > 0 ? remunerationTotale / anciennete.mois : dernierSalaire;

    return { 
      remunerationTotale, 
      detailPeriodes, 
      dernierSalaire,
      salaireGlobalMoyen
    };
  };

  const calculerICCP = (remunerationTotale, anciennete, joursDejaConsommes) => {
    const { mois } = anciennete;
    
    // Droits acquis (2,5 jours par mois complet)
    const joursAcquis = mois * CONGES_JOURS_PAR_MOIS;
    
    // Droits restants
    const joursRestants = Math.max(0, joursAcquis - joursDejaConsommes);
    
    // Méthode du 1/12ème : ICCP = (Rémunération totale perçue / 12) × (Jours restants / Jours ouvrables moyens)
    // Formule simplifiée réglementaire BF : ICCP = (Rémunération totale / 12) si tous les congés sont à payer
    // Calcul proportionnel selon les jours restants
    const montantTotal1_12eme = remunerationTotale / 12;
    const montantICCP = (joursRestants / joursAcquis) * montantTotal1_12eme;
    
    return {
      joursAcquis: Math.round(joursAcquis * 10) / 10,
      joursConsommes: joursDejaConsommes,
      joursRestants: Math.round(joursRestants * 10) / 10,
      montantTotal1_12eme,
      montant: montantICCP,
      remunerationTotaleReference: remunerationTotale
    };
  };

  const calculerIFC = (salaireGlobalMoyen, anciennete, motif) => {
    if (motif !== 'fin_cdd') {
      return {
        applicable: false,
        montant: 0,
        detail: 'Non applicable (démission ou autre motif)'
      };
    }

    const { annees } = anciennete;
    
    // IFC = 25% du salaire global moyen × ancienneté
    const montantIFC = salaireGlobalMoyen * IFC_RATE * annees;
    
    return {
      applicable: true,
      montant: montantIFC,
      tauxApplique: IFC_RATE,
      ancienneteAnnees: Math.round(annees * 100) / 100,
      salaireGlobalMoyen,
      detail: `Fin de CDD : 25% × ${Math.round(annees * 100) / 100} années`
    };
  };

  const calculerCNSS = (assiette) => {
    const assiettePlafonnee = Math.min(assiette, CNSS_PLAFOND);
    const montant = assiettePlafonnee * CNSS_RATE;
    
    return {
      assiette: assiettePlafonnee,
      taux: CNSS_RATE,
      montant,
      plafonne: assiette > CNSS_PLAFOND
    };
  };

  const calculerIUTS = (brutImposable, cnss, abattement, charges) => {
    const baseAvantAbattement = brutImposable - cnss;
    const baseImposable = baseAvantAbattement * (1 - abattement);
    
    let iutsTotal = 0;
    let detailTranches = [];
    
    for (let i = 0; i < BAREME_IUTS.length; i++) {
      const tranche = BAREME_IUTS[i];
      
      if (baseImposable > tranche.min) {
        const montantTranche = Math.min(baseImposable, tranche.max) - tranche.min;
        const impotTranche = montantTranche * tranche.taux;
        iutsTotal += impotTranche;
        
        if (montantTranche > 0) {
          detailTranches.push({
            tranche: `${tranche.min.toLocaleString()} - ${tranche.max === Infinity ? '∞' : tranche.max.toLocaleString()}`,
            base: montantTranche,
            taux: tranche.taux * 100,
            montant: impotTranche
          });
        }
      }
    }
    
    const tauxReduction = REDUCTION_CHARGES[Math.min(charges, 4)] || 0;
    const reduction = iutsTotal * tauxReduction;
    const iutsNet = iutsTotal - reduction;
    
    return {
      baseImposable,
      iutsBrut: iutsTotal,
      reduction,
      tauxReduction,
      iutsNet,
      detailTranches
    };
  };

  const calculerSolde = () => {
    const joursCongesPris = parseFloat(formData.joursCongesPris) || 0;
    const chargesFamille = parseInt(formData.chargesFamille) || 0;
    const abattement = formData.categorie === 'cadre' ? 0.25 : 0.20;
    
    if (!formData.dateDebut || !formData.dateFin) {
      alert('Veuillez renseigner les dates de début et fin du contrat');
      return;
    }

    // Validation des périodes de salaire
    const periodesValides = historiqueSalaires.filter(
      p => p.salaireBrut && p.dateDebut && p.dateFin
    );

    if (periodesValides.length === 0) {
      alert('Veuillez renseigner au moins une période de salaire complète');
      return;
    }

    // 1. Calcul ancienneté
    const anciennete = calculerAnciennete(formData.dateDebut, formData.dateFin);
    
    // 2. Calcul rémunération totale avec variations
    const { 
      remunerationTotale, 
      detailPeriodes, 
      dernierSalaire,
      salaireGlobalMoyen 
    } = calculerRemunerationTotalePeriodiqueAvecVariations(
      periodesValides, 
      formData.dateDebut, 
      formData.dateFin
    );
    
    // 3. Calcul ICCP (basé sur la rémunération totale selon règle 1/12ème)
    const iccp = calculerICCP(remunerationTotale, anciennete, joursCongesPris);
    
    // 4. Calcul IFC (basé sur le salaire global moyen)
    const ifc = calculerIFC(salaireGlobalMoyen, anciennete, formData.motifRupture);
    
    // 5. Calcul retenues
    // CNSS sur (Dernier salaire + ICCP)
    const assietteCNSS = dernierSalaire + iccp.montant;
    const cnss = calculerCNSS(assietteCNSS);
    
    // IUTS sur (Dernier salaire + ICCP) - IFC est exonérée
    const brutImposable = dernierSalaire + iccp.montant;
    const iuts = calculerIUTS(brutImposable, cnss.montant, abattement, chargesFamille);
    
    // 6. Calcul net à payer
    const brutTotal = dernierSalaire + iccp.montant + ifc.montant;
    const retenuesTotal = cnss.montant + iuts.iutsNet;
    const netAPayer = brutTotal - retenuesTotal;
    
    setResultat({
      dernierSalaire,
      salaireGlobalMoyen,
      remunerationTotale,
      detailPeriodesSalaires: detailPeriodes,
      anciennete,
      iccp,
      ifc,
      cnss,
      iuts,
      abattement,
      chargesFamille,
      brutTotal,
      retenuesTotal,
      netAPayer
    });
  };

  const formatCFA = (montant) => {
    return `${Math.round(montant).toLocaleString('fr-FR')} FCFA`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a5f3f 0%, #2d8659 50%, #1a5f3f 100%)',
      fontFamily: "'Merriweather', 'Georgia', serif",
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* En-tête */}
        <div style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.98), rgba(255,255,255,0.95))',
          borderRadius: '20px 20px 0 0',
          padding: '40px',
          boxShadow: '0 -5px 40px rgba(0,0,0,0.15)',
          borderBottom: '4px solid #d4af37'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
            <Calculator size={48} color="#1a5f3f" strokeWidth={2.5} />
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '2.8rem',
                color: '#1a5f3f',
                fontWeight: 700,
                letterSpacing: '-0.5px'
              }}>
                Solde de Tout Compte
              </h1>
              <p style={{
                margin: '8px 0 0 0',
                fontSize: '1.1rem',
                color: '#666',
                fontWeight: 400
              }}>
                Burkina Faso • Réglementation 2025 • Avec variations salariales
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            marginTop: '25px',
            padding: '20px',
            background: '#f8f5ef',
            borderRadius: '12px',
            border: '1px solid #e8dcc4'
          }}>
            <InfoBadge icon={<FileText size={16} />} label="Méthode 1/12ème" />
            <InfoBadge icon={<TrendingUp size={16} />} label="Variations salariales" />
            <InfoBadge icon={<Calendar size={16} />} label="CGI 2025 • CCI" />
          </div>
        </div>

        {/* Formulaire */}
        <div style={{
          background: 'white',
          padding: '40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            color: '#1a5f3f',
            marginBottom: '30px',
            fontWeight: 600
          }}>
            Informations générales
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px',
            marginBottom: '40px'
          }}>
            <FormField
              label="Date de début du contrat"
              name="dateDebut"
              type="date"
              value={formData.dateDebut}
              onChange={handleChange}
            />

            <FormField
              label="Date de fin du contrat"
              name="dateFin"
              type="date"
              value={formData.dateFin}
              onChange={handleChange}
            />

            <FormField
              label="Jours de congés déjà pris"
              name="joursCongesPris"
              type="number"
              value={formData.joursCongesPris}
              onChange={handleChange}
              placeholder="Ex: 10"
              suffix="jours"
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px'
          }}>
            <FormSelect
              label="Motif de rupture"
              name="motifRupture"
              value={formData.motifRupture}
              onChange={handleChange}
              options={[
                { value: 'fin_cdd', label: 'Fin de CDD à terme' },
                { value: 'demission', label: 'Démission' }
              ]}
            />

            <FormSelect
              label="Catégorie professionnelle"
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              options={[
                { value: 'non_cadre', label: 'Non-cadre (Abattement 20%)' },
                { value: 'cadre', label: 'Cadre (Abattement 25%)' }
              ]}
            />

            <FormSelect
              label="Charges de famille"
              name="chargesFamille"
              value={formData.chargesFamille}
              onChange={handleChange}
              options={[
                { value: '0', label: '0 charge (0% réduction)' },
                { value: '1', label: '1 charge (8% réduction)' },
                { value: '2', label: '2 charges (10% réduction)' },
                { value: '3', label: '3 charges (12% réduction)' },
                { value: '4', label: '4+ charges (14% réduction)' }
              ]}
            />
          </div>

          {/* SECTION HISTORIQUE DES SALAIRES */}
          <div style={{
            marginTop: '50px',
            padding: '30px',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '16px',
            border: '2px solid #1a5f3f'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.6rem',
                color: '#1a5f3f',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Edit3 size={24} />
                Historique des salaires
              </h3>
              <button
                onClick={ajouterPeriodeSalaire}
                style={{
                  padding: '12px 24px',
                  background: '#1a5f3f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Merriweather', serif"
                }}
                onMouseEnter={(e) => e.target.style.background = '#2d8659'}
                onMouseLeave={(e) => e.target.style.background = '#1a5f3f'}
              >
                <Plus size={18} />
                Ajouter une période
              </button>
            </div>

            <p style={{
              margin: '0 0 25px 0',
              color: '#555',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              padding: '15px',
              background: 'white',
              borderRadius: '8px',
              borderLeft: '4px solid #d4af37'
            }}>
              <strong>📊 Important :</strong> Renseignez toutes les périodes avec leurs salaires respectifs. 
              Le calcul de l'ICCP utilisera la <strong>méthode du 1/12ème de la rémunération totale perçue</strong> 
              pendant toute la durée du contrat, conforme au Code du Travail 2008.
            </p>

            {historiqueSalaires.map((periode, index) => (
              <div key={periode.id} style={{
                marginBottom: '20px',
                padding: '25px',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #dee2e6',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <h4 style={{
                    margin: 0,
                    fontSize: '1.1rem',
                    color: '#1a5f3f',
                    fontWeight: 600
                  }}>
                    Période {index + 1}
                  </h4>
                  {historiqueSalaires.length > 1 && (
                    <button
                      onClick={() => supprimerPeriodeSalaire(periode.id)}
                      style={{
                        padding: '8px 16px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#c82333'}
                      onMouseLeave={(e) => e.target.style.background = '#dc3545'}
                    >
                      <Trash2 size={14} />
                      Supprimer
                    </button>
                  )}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px'
                }}>
                  <FormField
                    label="Date début période"
                    name={`dateDebut_${periode.id}`}
                    type="date"
                    value={periode.dateDebut}
                    onChange={(e) => modifierPeriodeSalaire(periode.id, 'dateDebut', e.target.value)}
                  />
                  <FormField
                    label="Date fin période"
                    name={`dateFin_${periode.id}`}
                    type="date"
                    value={periode.dateFin}
                    onChange={(e) => modifierPeriodeSalaire(periode.id, 'dateFin', e.target.value)}
                  />
                  <FormField
                    label="Salaire brut mensuel"
                    name={`salaire_${periode.id}`}
                    type="number"
                    value={periode.salaireBrut}
                    onChange={(e) => modifierPeriodeSalaire(periode.id, 'salaireBrut', e.target.value)}
                    placeholder="Ex: 250000"
                    suffix="FCFA"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={calculerSolde}
            style={{
              marginTop: '35px',
              width: '100%',
              padding: '18px',
              background: 'linear-gradient(135deg, #1a5f3f 0%, #2d8659 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(26, 95, 63, 0.3)',
              fontFamily: "'Merriweather', serif"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(26, 95, 63, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(26, 95, 63, 0.3)';
            }}
          >
            <Calculator size={20} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
            Calculer le Solde de Tout Compte
          </button>
        </div>

        {/* Résultats */}
        {resultat && (
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '0 0 20px 20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            marginTop: '2px'
          }}>
            <h2 style={{
              fontSize: '2rem',
              color: '#1a5f3f',
              marginBottom: '30px',
              fontWeight: 700,
              borderBottom: '3px solid #d4af37',
              paddingBottom: '15px'
            }}>
              Décompte Final
            </h2>

            {/* Synthèse ancienneté */}
            <SectionCard title="Ancienneté et Période" color="#e8f5e9">
              <InfoRow 
                label="Période travaillée" 
                value={`${resultat.anciennete.mois} mois (${Math.round(resultat.anciennete.annees * 100) / 100} années)`} 
              />
              <InfoRow 
                label="Nombre de jours total" 
                value={`${resultat.anciennete.joursTotal} jours`} 
              />
            </SectionCard>

            {/* Détail des périodes salariales */}
            <SectionCard title="Détail des Périodes Salariales (avec variations)" color="#e3f2fd">
              <div style={{
                overflowX: 'auto',
                marginBottom: '15px'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.95rem'
                }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#1a5f3f' }}>Période</th>
                      <th style={{ padding: '12px', textAlign: 'right', color: '#1a5f3f' }}>Jours</th>
                      <th style={{ padding: '12px', textAlign: 'right', color: '#1a5f3f' }}>Mois</th>
                      <th style={{ padding: '12px', textAlign: 'right', color: '#1a5f3f' }}>Salaire brut</th>
                      <th style={{ padding: '12px', textAlign: 'right', color: '#1a5f3f' }}>Montant période</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultat.detailPeriodesSalaires.map((p, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f3f5' }}>
                        <td style={{ padding: '12px' }}>
                          {new Date(p.dateDebut).toLocaleDateString('fr-FR')} → {new Date(p.dateFin).toLocaleDateString('fr-FR')}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>{p.joursEffectifs}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>{p.moisEffectifs}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>
                          {formatCFA(p.salaireBrut)}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#1a5f3f' }}>
                          {formatCFA(p.montantPeriode)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#e8f5e9', fontWeight: 700, borderTop: '2px solid #1a5f3f' }}>
                      <td colSpan="4" style={{ padding: '12px', color: '#1a5f3f' }}>TOTAL RÉMUNÉRATION PERÇUE</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#1a5f3f', fontSize: '1.1rem' }}>
                        {formatCFA(resultat.remunerationTotale)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <InfoRow 
                label="Dernier salaire brut mensuel" 
                value={formatCFA(resultat.dernierSalaire)} 
                strong 
              />
              <InfoRow 
                label="Salaire global moyen (pour IFC)" 
                value={formatCFA(resultat.salaireGlobalMoyen)} 
                strong 
              />
            </SectionCard>

            {/* ICCP */}
            <SectionCard title="Indemnité Compensatrice de Congés Payés (ICCP)" color="#fff8e1">
              <InfoRow 
                label="Rémunération totale de référence" 
                value={formatCFA(resultat.iccp.remunerationTotaleReference)} 
              />
              <InfoRow 
                label="Montant 1/12ème (base réglementaire)" 
                value={formatCFA(resultat.iccp.montantTotal1_12eme)} 
                highlight 
              />
              <InfoRow 
                label="Jours acquis (2,5 jours/mois)" 
                value={`${resultat.iccp.joursAcquis} jours`} 
              />
              <InfoRow 
                label="Jours déjà consommés" 
                value={`${resultat.iccp.joursConsommes} jours`} 
                highlight 
              />
              <InfoRow 
                label="Jours restants à indemniser" 
                value={`${resultat.iccp.joursRestants} jours`} 
                highlight 
              />
              <InfoRow 
                label="Montant ICCP (prorata jours restants)" 
                value={formatCFA(resultat.iccp.montant)} 
                strong 
              />
              <InfoNote>
                <Info size={16} style={{ flexShrink: 0 }} />
                <span>Calcul selon la méthode du 1/12ème de la rémunération totale perçue (Code du Travail 2008)</span>
              </InfoNote>
            </SectionCard>

            {/* IFC */}
            <SectionCard title="Indemnité de Fin de Contrat (IFC)" color="#fce4ec">
              {resultat.ifc.applicable ? (
                <>
                  <InfoRow 
                    label="Salaire global moyen" 
                    value={formatCFA(resultat.ifc.salaireGlobalMoyen)} 
                  />
                  <InfoRow 
                    label="Base de calcul" 
                    value={`${formatCFA(resultat.ifc.salaireGlobalMoyen)} × 25% × ${resultat.ifc.ancienneteAnnees} ans`} 
                  />
                  <InfoRow 
                    label="Montant IFC" 
                    value={formatCFA(resultat.ifc.montant)} 
                    strong 
                  />
                  <InfoNote>
                    <Info size={16} style={{ flexShrink: 0 }} />
                    <span>Exonérée d'IUTS et de CNSS (Convention Collective)</span>
                  </InfoNote>
                </>
              ) : (
                <InfoRow 
                  label="Statut" 
                  value={resultat.ifc.detail} 
                  highlight 
                />
              )}
            </SectionCard>

            {/* CNSS */}
            <SectionCard title="Retenue CNSS (5,5%)" color="#e3f2fd">
              <InfoRow 
                label="Assiette de calcul" 
                value={`${formatCFA(resultat.dernierSalaire)} + ${formatCFA(resultat.iccp.montant)}`} 
              />
              <InfoRow 
                label="Assiette plafonnée" 
                value={formatCFA(resultat.cnss.assiette)} 
                highlight={resultat.cnss.plafonne} 
              />
              {resultat.cnss.plafonne && (
                <InfoNote>
                  <Info size={16} style={{ flexShrink: 0 }} />
                  <span>Plafond CNSS appliqué : 800 000 FCFA</span>
                </InfoNote>
              )}
              <InfoRow 
                label="Montant CNSS" 
                value={formatCFA(resultat.cnss.montant)} 
                strong 
              />
            </SectionCard>

            {/* IUTS */}
            <SectionCard title="Impôt Unique sur les Traitements et Salaires (IUTS)" color="#f3e5f5">
              <InfoRow 
                label="Brut imposable" 
                value={formatCFA(resultat.dernierSalaire + resultat.iccp.montant)} 
              />
              <InfoRow 
                label="CNSS déduite" 
                value={`- ${formatCFA(resultat.cnss.montant)}`} 
              />
              <InfoRow 
                label="Abattement forfaitaire" 
                value={`${resultat.abattement * 100}% (${formData.categorie === 'cadre' ? 'Cadre' : 'Non-cadre'})`} 
              />
              <InfoRow 
                label="Base imposable" 
                value={formatCFA(resultat.iuts.baseImposable)} 
                strong 
              />

              <div style={{ 
                margin: '20px 0', 
                padding: '15px', 
                background: 'rgba(156, 39, 176, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(156, 39, 176, 0.2)'
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#7b1fa2', fontSize: '0.95rem' }}>
                  Détail du barème progressif :
                </h4>
                {resultat.iuts.detailTranches.map((tranche, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: idx < resultat.iuts.detailTranches.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{ color: '#555' }}>
                      {tranche.tranche} @ {tranche.taux}%
                    </span>
                    <span style={{ fontWeight: 600, color: '#7b1fa2' }}>
                      {formatCFA(tranche.montant)}
                    </span>
                  </div>
                ))}
              </div>

              <InfoRow 
                label="IUTS brut calculé" 
                value={formatCFA(resultat.iuts.iutsBrut)} 
              />
              
              {resultat.iuts.tauxReduction > 0 && (
                <>
                  <InfoRow 
                    label={`Réduction charges (${resultat.chargesFamille} charge${resultat.chargesFamille > 1 ? 's' : ''})`}
                    value={`- ${formatCFA(resultat.iuts.reduction)} (${resultat.iuts.tauxReduction * 100}%)`}
                    highlight 
                  />
                </>
              )}

              <InfoRow 
                label="IUTS net à retenir" 
                value={formatCFA(resultat.iuts.iutsNet)} 
                strong 
              />
            </SectionCard>

            {/* Décompte final */}
            <div style={{
              marginTop: '40px',
              padding: '35px',
              background: 'linear-gradient(135deg, #1a5f3f 0%, #2d8659 100%)',
              borderRadius: '16px',
              color: 'white',
              boxShadow: '0 8px 30px rgba(26, 95, 63, 0.4)'
            }}>
              <h3 style={{
                margin: '0 0 25px 0',
                fontSize: '1.8rem',
                fontWeight: 700,
                borderBottom: '2px solid rgba(255,255,255,0.3)',
                paddingBottom: '15px'
              }}>
                Récapitulatif Final
              </h3>

              <div style={{ display: 'grid', gap: '15px' }}>
                <FinalRow 
                  label="Dernier salaire brut" 
                  value={formatCFA(resultat.dernierSalaire)} 
                />
                <FinalRow 
                  label="+ ICCP (1/12ème rémunération totale)" 
                  value={formatCFA(resultat.iccp.montant)} 
                />
                <FinalRow 
                  label="+ IFC (exonérée)" 
                  value={formatCFA(resultat.ifc.montant)} 
                />
                <div style={{ 
                  borderTop: '2px solid rgba(255,255,255,0.4)', 
                  margin: '10px 0' 
                }} />
                <FinalRow 
                  label="= Brut total" 
                  value={formatCFA(resultat.brutTotal)} 
                  strong 
                />
                
                <div style={{ 
                  borderTop: '1px dashed rgba(255,255,255,0.3)', 
                  margin: '15px 0' 
                }} />
                
                <FinalRow 
                  label="- Retenue CNSS" 
                  value={formatCFA(resultat.cnss.montant)} 
                  deduction 
                />
                <FinalRow 
                  label="- Retenue IUTS" 
                  value={formatCFA(resultat.iuts.iutsNet)} 
                  deduction 
                />
                <FinalRow 
                  label="= Total retenues" 
                  value={formatCFA(resultat.retenuesTotal)} 
                  deduction 
                  strong 
                />
                
                <div style={{ 
                  borderTop: '3px solid #d4af37', 
                  margin: '20px 0' 
                }} />
                
                <div style={{
                  padding: '20px',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  border: '2px solid #d4af37'
                }}>
                  <FinalRow 
                    label="NET À PAYER" 
                    value={formatCFA(resultat.netAPayer)} 
                    strong 
                    large 
                  />
                </div>
              </div>
            </div>

            {/* Note légale */}
            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: '#fff8e1',
              borderRadius: '10px',
              border: '1px solid #ffd54f',
              fontSize: '0.9rem',
              color: '#666',
              lineHeight: '1.7'
            }}>
              <strong style={{ color: '#f57c00', display: 'block', marginBottom: '8px' }}>
                ⚖️ Bases réglementaires :
              </strong>
              Code du Travail (2008) • Convention Collective Interprofessionnelle • 
              Code Général des Impôts (CGI 2025) • Code de Sécurité Sociale du Burkina Faso.
              <br />
              <strong>Méthode de calcul ICCP :</strong> 1/12ème de la rémunération totale perçue durant la période de référence, 
              conforme à l'article sur les congés payés.
              <br />
              <em>Ce calcul est fourni à titre indicatif. Consultez un expert RH ou juridique pour validation.</em>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== COMPOSANTS RÉUTILISABLES ==========

const InfoBadge = ({ icon, label }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'white',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: '#1a5f3f',
    fontWeight: 500,
    border: '1px solid #e0e0e0'
  }}>
    {icon}
    {label}
  </div>
);

const FormField = ({ label, name, type, value, onChange, placeholder, suffix }) => (
  <div>
    <label style={{
      display: 'block',
      marginBottom: '8px',
      fontSize: '0.95rem',
      fontWeight: 600,
      color: '#333'
    }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 14px',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          fontSize: '1rem',
          transition: 'border-color 0.2s',
          fontFamily: "'Merriweather', serif"
        }}
        onFocus={(e) => e.target.style.borderColor = '#1a5f3f'}
        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
      />
      {suffix && (
        <span style={{
          position: 'absolute',
          right: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#999',
          fontSize: '0.9rem'
        }}>
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const FormSelect = ({ label, name, value, onChange, options }) => (
  <div>
    <label style={{
      display: 'block',
      marginBottom: '8px',
      fontSize: '0.95rem',
      fontWeight: 600,
      color: '#333'
    }}>
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '12px 14px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '1rem',
        fontFamily: "'Merriweather', serif",
        cursor: 'pointer'
      }}
      onFocus={(e) => e.target.style.borderColor = '#1a5f3f'}
      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const SectionCard = ({ title, color, children }) => (
  <div style={{
    marginTop: '25px',
    padding: '25px',
    background: color,
    borderRadius: '12px',
    border: '1px solid rgba(0,0,0,0.08)'
  }}>
    <h3 style={{
      margin: '0 0 20px 0',
      fontSize: '1.3rem',
      color: '#1a5f3f',
      fontWeight: 700
    }}>
      {title}
    </h3>
    {children}
  </div>
);

const InfoRow = ({ label, value, strong, highlight }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    fontSize: strong ? '1.1rem' : '1rem'
  }}>
    <span style={{ 
      color: '#555',
      fontWeight: strong ? 600 : 400
    }}>
      {label}
    </span>
    <span style={{ 
      fontWeight: strong ? 700 : 600,
      color: highlight ? '#d32f2f' : (strong ? '#1a5f3f' : '#333')
    }}>
      {value}
    </span>
  </div>
);

const InfoNote = ({ children }) => (
  <div style={{
    marginTop: '12px',
    padding: '12px',
    background: 'rgba(26, 95, 63, 0.05)',
    borderRadius: '8px',
    display: 'flex',
    gap: '10px',
    fontSize: '0.9rem',
    color: '#1a5f3f',
    fontStyle: 'italic'
  }}>
    {children}
  </div>
);

const FinalRow = ({ label, value, strong, deduction, large }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: large ? '1.6rem' : (strong ? '1.2rem' : '1.05rem'),
    fontWeight: strong ? 700 : 400,
    color: deduction ? '#ffccbc' : 'white'
  }}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default SoldeToutCompteBF;
