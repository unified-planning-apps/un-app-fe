/**
 * src/mock/predictions.ts
 * -------------------------
 * Mock data for predictions endpoints (demo mode).
 */

import type { PredictionCombinee, PredictionBatchResult, ResultatScenario, SanteModele } from '#/lib/schemas/predictions'

const today = new Date().toISOString()

// ── Combined prediction per region ────────────────────────────────────────
const PRED_BASE: Record<string, Partial<PredictionCombinee>> = {
  'MDG-SOF': { score_paludisme: 0.79, score_nutrition: 0.42, niveau_paludisme: 'très élevé', niveau_nutrition: 'moyen', niveau_alerte_global: 'rouge', couleur_carte: '#ef4444', cas_paludisme_prevus_14j: 712, gam_prevu_pct: 13.7, population_a_risque: 180000, enfants_vulnerables: 32000 },
  'MDG-BOE': { score_paludisme: 0.74, score_nutrition: 0.46, niveau_paludisme: 'très élevé', niveau_nutrition: 'moyen', niveau_alerte_global: 'rouge', couleur_carte: '#ef4444', cas_paludisme_prevus_14j: 621, gam_prevu_pct: 14.8, population_a_risque: 145000, enfants_vulnerables: 26000 },
  'MDG-ANA2': { score_paludisme: 0.68, score_nutrition: 0.49, niveau_paludisme: 'élevé', niveau_nutrition: 'moyen', niveau_alerte_global: 'orange', couleur_carte: '#f97316', cas_paludisme_prevus_14j: 452, gam_prevu_pct: 15.6, population_a_risque: 120000, enfants_vulnerables: 21000 },
  'MDG_AND': { score_paludisme: 0.14, score_nutrition: 0.82, niveau_paludisme: 'faible', niveau_nutrition: 'très élevé', niveau_alerte_global: 'rouge', couleur_carte: '#ef4444', cas_paludisme_prevus_14j: 31, gam_prevu_pct: 28.1, population_a_risque: 210000, enfants_vulnerables: 48000 },
  'MDG-ASO': { score_paludisme: 0.20, score_nutrition: 0.78, niveau_paludisme: 'faible', niveau_nutrition: 'très élevé', niveau_alerte_global: 'orange', couleur_carte: '#f97316', cas_paludisme_prevus_14j: 54, gam_prevu_pct: 25.6, population_a_risque: 190000, enfants_vulnerables: 41000 },
  'MDG-ANA': { score_paludisme: 0.31, score_nutrition: 0.28, niveau_paludisme: 'moyen', niveau_nutrition: 'faible', niveau_alerte_global: 'jaune', couleur_carte: '#eab308', cas_paludisme_prevus_14j: 142, gam_prevu_pct: 8.2, population_a_risque: 85000, enfants_vulnerables: 12000 },
}

const DEFAULT_PRED: Partial<PredictionCombinee> = {
  score_paludisme: 0.38, score_nutrition: 0.35, niveau_paludisme: 'moyen', niveau_nutrition: 'moyen',
  niveau_alerte_global: 'jaune', couleur_carte: '#eab308', cas_paludisme_prevus_14j: 180,
  gam_prevu_pct: 12.0, population_a_risque: 95000, enfants_vulnerables: 16000,
}

const TOP_FACTEURS = [
  { nom: 'Pluviométrie 14j', contribution_pct: 28.4, valeur: 1.2, modele: 'paludisme', shap_value: 0.28, rang: 1 },
  { nom: 'Température moyenne', contribution_pct: 18.7, valeur: 0.8, modele: 'paludisme', shap_value: 0.19, rang: 2 },
  { nom: 'GAM historique', contribution_pct: 14.2, valeur: 0.6, modele: 'nutrition', shap_value: 0.14, rang: 3 },
  { nom: 'Disponibilité alimentaire', contribution_pct: 11.8, valeur: 0.5, modele: 'nutrition', shap_value: 0.12, rang: 4 },
]

export function getMockCombinedPrediction(regionId: string): PredictionCombinee {
  const base = { ...DEFAULT_PRED, ...PRED_BASE[regionId] }
  return {
    prediction_id: `PRED-${regionId}-${Date.now()}`,
    region_id: regionId,
    region_name: regionId,
    date_prediction: today,
    horizon_jours: 14,
    score_composite: ((base.score_paludisme! + base.score_nutrition!) / 2),
    temperature_prevue_c: 26,
    precipitations_prevues_mm: 8,
    top_facteurs_risque: TOP_FACTEURS,
    recommandations_prioritaires: [
      'Renforcer la distribution de moustiquaires imprégnées dans les fokontany à risque',
      'Intensifier la surveillance épidémiologique hebdomadaire',
      'Assurer la disponibilité des stocks RUTF dans les CSB',
      'Organiser des séances de sensibilisation nutrition pour les mères',
    ],
    niveau_confiance: 0.78,
    ...base,
  } as PredictionCombinee
}

// ── SHAP explanation ────────────────────────────────────────────────────
export function getMockShap(regionId: string, modele: 'paludisme' | 'nutrition') {
  const isM = modele === 'paludisme'
  return {
    region_id: regionId, modele, date_prediction: today,
    valeur_predite: isM ? 0.62 : 0.44, valeur_base: 0.35,
    features: [
      { nom: isM ? 'Pluviométrie 14j' : 'GAM historique', shap_value: 0.28, contribution_pct: 28.4, valeur: 1.2, rang: 1, modele },
      { nom: isM ? 'Température moy.' : 'Score FCS', shap_value: 0.19, contribution_pct: 18.7, valeur: 0.8, rang: 2, modele },
      { nom: isM ? 'Humidité sol' : 'Variation prix riz', shap_value: 0.14, contribution_pct: 13.9, valeur: 0.6, rang: 3, modele },
      { nom: isM ? 'Zones humides %' : 'Accès marchés', shap_value: 0.11, contribution_pct: 11.1, valeur: 0.4, rang: 4, modele },
      { nom: isM ? 'Cas historiques 4sem' : 'Stunting historique', shap_value: 0.09, contribution_pct: 9.2, valeur: 0.3, rang: 5, modele },
    ],
  }
}

// ── Model health ──────────────────────────────────────────────────────────
export const MOCK_MODEL_HEALTH: SanteModele[] = [
  { modele: 'paludisme', version: '2.3.1', statut: 'surveillance', drift_score: 0.142, nb_predictions_7j: 1247, date_entrainement: '2025-06-15T08:00:00Z', metriques: { mae: 18.4, rmse: 24.7, mape_pct: 12.3 } },
  { modele: 'nutrition', version: '1.8.4', statut: 'optimal', drift_score: 0.078, nb_predictions_7j: 891, date_entrainement: '2025-07-01T08:00:00Z', metriques: { mae: 1.2, rmse: 1.8, mape_pct: 9.1 } },
]

// ── Backtest result ──────────────────────────────────────────────────────
export function getMockBacktest(_regionId: string, _modele: string) {
  return { mae: 16.8, rmse: 22.4, mape_pct: 11.6, correlation: 0.84, biais: -2.3, nb_semaines: 12 }
}

// ── Batch result ─────────────────────────────────────────────────────────
export function getMockBatch(regions: string[]): PredictionBatchResult {
  return {
    batch_id: `BATCH-${Date.now()}`,
    horodatage: today,
    horizon_jours: 14,
    total_regions: regions.length,
    regions_ok: regions.length,
    regions_erreur: [],
    predictions: regions.map((r) => getMockCombinedPrediction(r)),
    resume_national: { score_moyen: 0.44, regions_alerte: 3 },
  }
}

// ── What-if scenario ─────────────────────────────────────────────────────
export function getMockScenario(params: { region_id: string; scenario_cyclone?: boolean; scenario_secheresse?: boolean; delta_temperature_c?: number; choc_prix_alimentaires_pct?: number }): ResultatScenario {
  const isCyclone = params.scenario_cyclone
  const isDrought = params.scenario_secheresse
  const deltaP = isCyclone ? 0.28 : isDrought ? -0.08 : (params.delta_temperature_c ?? 0) * 0.04
  const deltaN = isDrought ? 0.22 : isCyclone ? 0.12 : (params.choc_prix_alimentaires_pct ?? 0) * 0.002
  return {
    region_id: params.region_id, horizon_jours: params.horizon_jours ?? 30,
    scenario_applique: isCyclone ? 'cyclone' : isDrought ? 'secheresse' : 'personnalise',
    delta_score_paludisme: deltaP, delta_score_nutrition: deltaN,
    cas_additionnels_paludisme: Math.round(deltaP * 800),
    enfants_additionnels_malnutris: Math.round(deltaN * 4200),
    analyse_impact: isCyclone
      ? 'Un cyclone tropical augmenterait significativement les gîtes larvaires (+280% précipitations estimées). L\'impact nutritionnel serait modéré mais rapide via la destruction des cultures et des routes d\'accès.'
      : isDrought
      ? 'La sécheresse réduit le risque paludéen (moins de gîtes larvaires) mais aggrave fortement la malnutrition par la réduction des récoltes et l\'augmentation des prix alimentaires.'
      : 'Impact modéré selon les paramètres saisis.',
    recommandations_scenario: isCyclone
      ? ['Pré-positionner les stocks de moustiquaires', 'Activer le plan de continuité des CSB', 'Prévoir une distribution RUTF préventive']
      : ['Renforcer la surveillance nutritionnelle', 'Activer les mécanismes de transferts monétaires', 'Sécuriser les stocks alimentaires locaux'],
  }
}
