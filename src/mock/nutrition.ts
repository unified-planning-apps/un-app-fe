/**
 * src/mock/nutrition.ts
 * ----------------------
 * Mock data for nutrition endpoints (demo mode).
 */

import type { AlerteNutrition, CarteRisqueNutrition, RecetteNutritionnelle } from '#/lib/schemas/nutrition'

const today = new Date().toISOString().slice(0, 10)
const dPast = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10) }

// ── Nutrition risk map ──────────────────────────────────────────────────
export const MOCK_CARTE_NUTRITION: CarteRisqueNutrition = {
  date_prediction: today,
  carte: [
    { region_id: 'MDG-ANA',  region_name: 'Analamanga',        score_risque: 0.28, niveau_risque: 'faible',     gam_actuel_pct: 8.2,  tendance: 'stable',  couleur: '#22c55e' },
    { region_id: 'MDG-VAK',  region_name: 'Vakinankaratra',    score_risque: 0.35, niveau_risque: 'moyen',      gam_actuel_pct: 11.4, tendance: 'stable',  couleur: '#eab308' },
    { region_id: 'MDG-ITM',  region_name: 'Itasy',             score_risque: 0.22, niveau_risque: 'faible',     gam_actuel_pct: 7.1,  tendance: 'baisse',  couleur: '#22c55e' },
    { region_id: 'MDG-BMT',  region_name: 'Bongolava',         score_risque: 0.41, niveau_risque: 'moyen',      gam_actuel_pct: 13.2, tendance: 'hausse',  couleur: '#eab308' },
    { region_id: 'MDG-MAT',  region_name: 'Matsiatra Ambony',  score_risque: 0.33, niveau_risque: 'moyen',      gam_actuel_pct: 10.8, tendance: 'stable',  couleur: '#eab308' },
    { region_id: 'MDG-ATI',  region_name: "Amoron'i Mania",    score_risque: 0.38, niveau_risque: 'moyen',      gam_actuel_pct: 12.1, tendance: 'stable',  couleur: '#eab308' },
    { region_id: 'MDG-VAT',  region_name: 'Vatovavy',          score_risque: 0.55, niveau_risque: 'élevé',      gam_actuel_pct: 17.8, tendance: 'hausse',  couleur: '#f97316' },
    { region_id: 'MDG-FIT',  region_name: 'Fitovinany',        score_risque: 0.51, niveau_risque: 'élevé',      gam_actuel_pct: 16.3, tendance: 'stable',  couleur: '#f97316' },
    { region_id: 'MDG-ANO',  region_name: 'Atsimo-Atsinanana', score_risque: 0.62, niveau_risque: 'élevé',      gam_actuel_pct: 19.4, tendance: 'hausse',  couleur: '#f97316' },
    { region_id: 'MDG-ATS',  region_name: 'Atsinanana',        score_risque: 0.44, niveau_risque: 'moyen',      gam_actuel_pct: 14.2, tendance: 'stable',  couleur: '#eab308' },
    { region_id: 'MDG-ANA2', region_name: 'Analanjirofo',      score_risque: 0.49, niveau_risque: 'moyen',      gam_actuel_pct: 15.6, tendance: 'hausse',  couleur: '#eab308' },
    { region_id: 'MDG-ALA',  region_name: 'Alaotra-Mangoro',   score_risque: 0.30, niveau_risque: 'faible',     gam_actuel_pct: 9.5,  tendance: 'baisse',  couleur: '#22c55e' },
    { region_id: 'MDG-BOE',  region_name: 'Boeny',             score_risque: 0.46, niveau_risque: 'moyen',      gam_actuel_pct: 14.8, tendance: 'stable',  couleur: '#eab308' },
    { region_id: 'MDG-SOF',  region_name: 'Sofia',             score_risque: 0.42, niveau_risque: 'moyen',      gam_actuel_pct: 13.7, tendance: 'stable',  couleur: '#eab308' },
    { region_id: 'MDG-BET',  region_name: 'Betsiboka',         score_risque: 0.38, niveau_risque: 'moyen',      gam_actuel_pct: 11.9, tendance: 'stable',  couleur: '#eab308' },
    { region_id: 'MDG-MEN',  region_name: 'Melaky',            score_risque: 0.57, niveau_risque: 'élevé',      gam_actuel_pct: 18.2, tendance: 'hausse',  couleur: '#f97316' },
    { region_id: 'MDG-MEN2', region_name: 'Menabe',            score_risque: 0.52, niveau_risque: 'élevé',      gam_actuel_pct: 16.7, tendance: 'stable',  couleur: '#f97316' },
    { region_id: 'MDG-DIA',  region_name: 'Diana',             score_risque: 0.26, niveau_risque: 'faible',     gam_actuel_pct: 8.4,  tendance: 'baisse',  couleur: '#22c55e' },
    { region_id: 'MDG-SAV',  region_name: 'Sava',              score_risque: 0.34, niveau_risque: 'moyen',      gam_actuel_pct: 11.0, tendance: 'stable',  couleur: '#eab308' },
    { region_id: 'MDG-IHO',  region_name: 'Ihorombe',          score_risque: 0.72, niveau_risque: 'très élevé', gam_actuel_pct: 22.8, tendance: 'hausse',  couleur: '#ef4444' },
    { region_id: 'MDG-ASO',  region_name: 'Atsimo-Andrefana',  score_risque: 0.78, niveau_risque: 'très élevé', gam_actuel_pct: 25.6, tendance: 'hausse',  couleur: '#ef4444' },
    { region_id: 'MDG_AND',  region_name: 'Androy',            score_risque: 0.82, niveau_risque: 'très élevé', gam_actuel_pct: 28.1, tendance: 'hausse',  couleur: '#ef4444' },
    { region_id: 'MDG-AAN',  region_name: 'Anosy',             score_risque: 0.69, niveau_risque: 'élevé',      gam_actuel_pct: 21.3, tendance: 'stable',  couleur: '#f97316' },
  ],
}

// ── Nutrition alerts ──────────────────────────────────────────────────────
export const MOCK_NUTRITION_ALERTS: AlerteNutrition[] = [
  { alerte_id: 'NUT-001', region_id: 'MDG_AND', region_name: 'Androy', type_alerte: 'crise_nutritionnelle', severite: 'crise', statut: 'active', date_detection: dPast(7), description: 'GAM 28.1% — seuil de crise humanitaire (>20%) dépassé. Intervention RUTF urgente requise.', indicateur: 'gam_pct', valeur: 28.1, seuil: 20.0 },
  { alerte_id: 'NUT-002', region_id: 'MDG-ASO', region_name: 'Atsimo-Andrefana', type_alerte: 'crise_nutritionnelle', severite: 'urgence', statut: 'active', date_detection: dPast(4), description: 'GAM 25.6% en hausse continue — sécheresse prolongée impactant la disponibilité alimentaire.', indicateur: 'gam_pct', valeur: 25.6, seuil: 20.0 },
  { alerte_id: 'NUT-003', region_id: 'MDG-IHO', region_name: 'Ihorombe', type_alerte: 'seuil_urgence', severite: 'alerte', statut: 'active', date_detection: dPast(10), description: 'GAM 22.8% — surveillance renforcée, stocks RUTF à reconstituer.', indicateur: 'gam_pct', valeur: 22.8, seuil: 20.0 },
]

// ── Recipes ────────────────────────────────────────────────────────────────
export const MOCK_RECIPES: RecetteNutritionnelle[] = [
  {
    recette_id: 'REC-001', nom: 'Ravitoto sy Kitoza', nom_malgache: 'Ravitoto sy Kitoza',
    cible: ['famille', 'femmes_enceintes'], saison: ['saison_pluies', 'saison_seche'],
    calories_kcal: 420, proteines_g: 22, glucides_g: 48, lipides_g: 15,
    fer_mg: 6.5, vitamine_a_ug: 120, zinc_mg: 3.2, score_nutritionnel: 78,
    temps_preparation_min: 30, cout_estime_ariary: 3500, actif: true,
    ingredients: [{ nom: 'Feuilles de manioc pilées', quantite_g: 200, disponible_localement: true }, { nom: 'Kitoza (viande séchée)', quantite_g: 100, disponible_localement: true }, { nom: 'Ail', quantite_g: 10, disponible_localement: true }],
    instructions: 'Faire revenir l\'ail dans l\'huile. Ajouter le kitoza et les feuilles de manioc. Cuire 20 min à feu doux. Servir avec du riz.',
  },
  {
    recette_id: 'REC-002', nom: 'Bouillie enrichie à la banane', nom_malgache: "Vary amin'ny akondro",
    cible: ['enfants_6_23m', 'enfants_2_5ans'], saison: ['saison_pluies', 'saison_seche'],
    calories_kcal: 180, proteines_g: 4, glucides_g: 35, lipides_g: 3,
    fer_mg: 2.1, vitamine_a_ug: 45, zinc_mg: 0.8, score_nutritionnel: 82,
    temps_preparation_min: 15, cout_estime_ariary: 1200, actif: true,
    ingredients: [{ nom: 'Farine de riz', quantite_g: 50, disponible_localement: true }, { nom: 'Banane mûre', quantite_g: 80, disponible_localement: true }, { nom: 'Lait en poudre', quantite_g: 10, disponible_localement: true }],
    instructions: 'Délayer la farine dans un peu d\'eau froide. Porter 250ml d\'eau à ébullition. Verser la farine en remuant. Cuire 10 min. Écraser la banane et incorporer avec le lait en poudre.',
  },
  {
    recette_id: 'REC-003', nom: 'Soupe de légumes à la spiruline', nom_malgache: 'Haza miaraka amin\'ny spiruline',
    cible: ['enfants_2_5ans', 'femmes_enceintes', 'femmes_allaitantes'], saison: ['saison_seche'],
    calories_kcal: 120, proteines_g: 8, glucides_g: 16, lipides_g: 3,
    fer_mg: 4.8, vitamine_a_ug: 280, zinc_mg: 1.5, score_nutritionnel: 91,
    temps_preparation_min: 20, cout_estime_ariary: 1800, actif: true,
    ingredients: [{ nom: 'Poudre de spiruline', quantite_g: 5, disponible_localement: false }, { nom: 'Carottes', quantite_g: 80, disponible_localement: true }, { nom: 'Patates douces', quantite_g: 100, disponible_localement: true }],
    instructions: 'Cuire les légumes en dés dans 500ml d\'eau pendant 15 min. Mixer. Incorporer la spiruline hors du feu pour préserver les nutriments.',
  },
  {
    recette_id: 'REC-004', nom: 'Légumes sautés aux arachides', nom_malgache: 'Laoka voanjo',
    cible: ['famille', 'enfants_2_5ans'], saison: ['saison_pluies', 'saison_seche'],
    calories_kcal: 310, proteines_g: 12, glucides_g: 28, lipides_g: 18,
    fer_mg: 3.4, vitamine_a_ug: 190, zinc_mg: 2.1, score_nutritionnel: 74,
    temps_preparation_min: 25, cout_estime_ariary: 2200, actif: true,
    ingredients: [{ nom: 'Arachides grillées', quantite_g: 80, disponible_localement: true }, { nom: 'Épinards locaux', quantite_g: 150, disponible_localement: true }, { nom: 'Oignons', quantite_g: 50, disponible_localement: true }],
    instructions: 'Faire revenir les oignons. Ajouter les épinards et faire sauter 5 min. Incorporer les arachides concassées. Assaisonner et servir.',
  },
  {
    recette_id: 'REC-005', nom: 'Haricots rouges au gingembre', nom_malgache: 'Tsaramaso mena',
    cible: ['famille', 'femmes_allaitantes'], saison: ['saison_pluies', 'saison_seche'],
    calories_kcal: 280, proteines_g: 16, glucides_g: 42, lipides_g: 4,
    fer_mg: 5.8, vitamine_a_ug: 60, zinc_mg: 2.8, score_nutritionnel: 85,
    temps_preparation_min: 45, cout_estime_ariary: 1600, actif: true,
    ingredients: [{ nom: 'Haricots rouges secs', quantite_g: 150, disponible_localement: true }, { nom: 'Gingembre frais', quantite_g: 15, disponible_localement: true }, { nom: 'Tomates', quantite_g: 100, disponible_localement: true }],
    instructions: 'Faire tremper les haricots 8h. Cuire 45 min. Préparer la sauce tomate-gingembre. Mélanger et laisser mijoter 10 min.',
  },
]
