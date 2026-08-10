/**
 * src/mock/malaria.ts
 * -------------------
 * Mock data for malaria endpoints (demo mode).
 * Typed against lib/schemas/malaria.ts.
 */

import type {
  AlerteEpidemiologique,
  CarteRisqueMalaria,
  TendanceHebdoMalaria,
} from '#/lib/schemas/malaria'

const today = new Date().toISOString().slice(0, 10)
const dPast = (n: number) => {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10)
}

// ── Risk map (all 22 regions) ─────────────────────────────────────────────
export const MOCK_CARTE_RISQUE: CarteRisqueMalaria = {
  date_prediction: today,
  horizon_jours: 14,
  carte: [
    { region_id: 'MDG-ANA', region_name: 'Analamanga',         score_risque: 0.31, niveau_risque: 'moyen',      cas_prevus_14j: 142, couleur: '#eab308' },
    { region_id: 'MDG-VAK', region_name: 'Vakinankaratra',     score_risque: 0.22, niveau_risque: 'faible',     cas_prevus_14j: 74,  couleur: '#22c55e' },
    { region_id: 'MDG-ITM', region_name: 'Itasy',              score_risque: 0.18, niveau_risque: 'faible',     cas_prevus_14j: 38,  couleur: '#22c55e' },
    { region_id: 'MDG-BMT', region_name: 'Bongolava',          score_risque: 0.44, niveau_risque: 'moyen',      cas_prevus_14j: 198, couleur: '#eab308' },
    { region_id: 'MDG-MAT', region_name: 'Matsiatra Ambony',   score_risque: 0.27, niveau_risque: 'faible',     cas_prevus_14j: 96,  couleur: '#22c55e' },
    { region_id: 'MDG-ATI', region_name: "Amoron'i Mania",     score_risque: 0.36, niveau_risque: 'moyen',      cas_prevus_14j: 128, couleur: '#eab308' },
    { region_id: 'MDG-VAT', region_name: 'Vatovavy',           score_risque: 0.52, niveau_risque: 'élevé',      cas_prevus_14j: 310, couleur: '#f97316' },
    { region_id: 'MDG-FIT', region_name: 'Fitovinany',         score_risque: 0.48, niveau_risque: 'moyen',      cas_prevus_14j: 266, couleur: '#eab308' },
    { region_id: 'MDG-ANO', region_name: 'Atsimo-Atsinanana',  score_risque: 0.61, niveau_risque: 'élevé',      cas_prevus_14j: 389, couleur: '#f97316' },
    { region_id: 'MDG-ATS', region_name: 'Atsinanana',         score_risque: 0.55, niveau_risque: 'élevé',      cas_prevus_14j: 344, couleur: '#f97316' },
    { region_id: 'MDG-ANA2',region_name: 'Analanjirofo',       score_risque: 0.68, niveau_risque: 'élevé',      cas_prevus_14j: 452, couleur: '#f97316' },
    { region_id: 'MDG-ALA', region_name: 'Alaotra-Mangoro',    score_risque: 0.42, niveau_risque: 'moyen',      cas_prevus_14j: 213, couleur: '#eab308' },
    { region_id: 'MDG-BOE', region_name: 'Boeny',              score_risque: 0.74, niveau_risque: 'très élevé', cas_prevus_14j: 621, couleur: '#ef4444' },
    { region_id: 'MDG-SOF', region_name: 'Sofia',              score_risque: 0.79, niveau_risque: 'très élevé', cas_prevus_14j: 712, couleur: '#ef4444' },
    { region_id: 'MDG-BET', region_name: 'Betsiboka',          score_risque: 0.66, niveau_risque: 'élevé',      cas_prevus_14j: 398, couleur: '#f97316' },
    { region_id: 'MDG-MEN', region_name: 'Melaky',             score_risque: 0.57, niveau_risque: 'élevé',      cas_prevus_14j: 321, couleur: '#f97316' },
    { region_id: 'MDG-MEN2',region_name: 'Menabe',             score_risque: 0.49, niveau_risque: 'moyen',      cas_prevus_14j: 248, couleur: '#eab308' },
    { region_id: 'MDG-DIA', region_name: 'Diana',              score_risque: 0.38, niveau_risque: 'moyen',      cas_prevus_14j: 176, couleur: '#eab308' },
    { region_id: 'MDG-SAV', region_name: 'Sava',               score_risque: 0.45, niveau_risque: 'moyen',      cas_prevus_14j: 229, couleur: '#eab308' },
    { region_id: 'MDG-IHO', region_name: 'Ihorombe',           score_risque: 0.29, niveau_risque: 'faible',     cas_prevus_14j: 88,  couleur: '#22c55e' },
    { region_id: 'MDG-ASO', region_name: 'Atsimo-Andrefana',   score_risque: 0.20, niveau_risque: 'faible',     cas_prevus_14j: 54,  couleur: '#22c55e' },
    { region_id: 'MDG_AND', region_name: 'Androy',             score_risque: 0.14, niveau_risque: 'faible',     cas_prevus_14j: 31,  couleur: '#22c55e' },
    { region_id: 'MDG-AAN', region_name: 'Anosy',              score_risque: 0.25, niveau_risque: 'faible',     cas_prevus_14j: 67,  couleur: '#22c55e' },
  ],
}

// ── Active alerts ─────────────────────────────────────────────────────────
export const MOCK_MALARIA_ALERTS: AlerteEpidemiologique[] = [
  { alerte_id: 'ALT-001', region_id: 'MDG-SOF', region_name: 'Sofia', type_alerte: 'seuil_epidemique', severite: 'urgent', statut: 'active', date_detection: dPast(3), description: 'Epidemic threshold exceeded — 712 cases predicted over 14 days, +38% vs previous period', indicateur_declencheur: 'cas_hebdo', valeur_observee: 712, seuil_alerte: 520 },
  { alerte_id: 'ALT-002', region_id: 'MDG-BOE', region_name: 'Boeny', type_alerte: 'seuil_epidemique', severite: 'alerte', statut: 'active', date_detection: dPast(5), description: 'Rising trend in Boeny region — climate conditions favourable to vectors', indicateur_declencheur: 'score_risque', valeur_observee: 0.74, seuil_alerte: 0.70 },
  { alerte_id: 'ALT-003', region_id: 'MDG-ANA2', region_name: 'Analanjirofo', type_alerte: 'tendance_rising', severite: 'surveillance', statut: 'active', date_detection: dPast(8), description: 'Gradual case increase over 3 weeks — enhanced surveillance recommended', indicateur_declencheur: 'tendance_7j', valeur_observee: 452, seuil_alerte: 350 },
]

// ── Weekly trend per region ──────────────────────────────────────────────
const TREND_BASE: Record<string, number> = {
  'MDG-SOF': 92, 'MDG-BOE': 78, 'MDG-ANA2': 58, 'MDG-ANO': 48,
  'MDG-VAT': 39, 'MDG-BET': 50, 'MDG-ANA': 18, 'MDG-MEN': 40,
}

export function getMockWeeklyTrend(regionId: string, semaines: number): TendanceHebdoMalaria {
  const base = TREND_BASE[regionId] ?? 20
  const data = Array.from({ length: semaines }, (_, i) => {
    const variation = Math.round(Math.sin(i / 2) * base * 0.35)
    return {
      region_id: regionId,
      semaine_epidemio: 1 + i,
      annee: new Date().getFullYear(),
      cas_confirmes: Math.max(0, base + variation),
      cas_suspects: Math.round((base + variation) * 1.4),
      taux_positivite_tdr_pct: 18 + Math.round(Math.cos(i / 3) * 8),
      deces: Math.round(Math.max(0, (base + variation) * 0.008)),
    }
  })
  return {
    region_id: regionId,
    periode_debut: dPast(semaines * 7),
    periode_fin: today,
    total_cas_periode: data.reduce((s, d) => s + d.cas_confirmes, 0),
    moyenne_hebdo: Math.round(data.reduce((s, d) => s + d.cas_confirmes, 0) / semaines),
    tendance: base > 50 ? 'rising' : 'stable',
    variation_pct_vs_periode_prec: base > 50 ? 14.3 : -3.1,
    data,
  }
}
