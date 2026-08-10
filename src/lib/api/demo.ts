/**
 * src/lib/api/demo.ts
 * --------------------
 * Demo service — implements the same function signatures as the real API
 * modules (weather.ts, malaria.ts, etc.) but returns mock data from
 * src/mock/ with a small artificial delay to simulate network latency.
 *
 * Consumed by hooks when IS_DEMO === true.
 * NEVER import real API modules here — this file must work with no backend.
 */

import {
  getMockCurrentWeather, getMockForecast, getMockWeatherHistory,
  MOCK_ANOMALIES, MOCK_NATIONAL_WEATHER,
} from '#/mock/weather'
import {
  MOCK_CARTE_RISQUE, MOCK_MALARIA_ALERTS, getMockWeeklyTrend,
} from '#/mock/malaria'
import {
  MOCK_CARTE_NUTRITION, MOCK_NUTRITION_ALERTS, MOCK_RECIPES,
} from '#/mock/nutrition'
import {
  getMockCombinedPrediction, getMockShap, MOCK_MODEL_HEALTH,
  getMockBacktest, getMockBatch, getMockScenario,
} from '#/mock/predictions'
import {
  MOCK_REPORT_HISTORY, MOCK_SCHEDULES,
  getMockReportStatus, getMockGenerateResponse,
} from '#/mock/reports'
import { DEMO_USERS_LIST, DEMO_TOKEN_RESPONSE } from '#/mock/auth'

import type { ScenarioWhatIf } from '#/lib/schemas/predictions'
import type { GenerateReportRequest } from '#/lib/schemas/reports'

/** Simulate a realistic network round-trip. */
const delay = <T>(data: T, ms = 220): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms))

// ── Weather ────────────────────────────────────────────────────────────────
export const demoWeatherApi = {
  current:         (regionId: string)                        => delay(getMockCurrentWeather(regionId)),
  forecast:        (regionId: string, jours = 7)             => delay(getMockForecast(regionId, jours)),
  history:         (regionId: string, debut: string, fin: string) => delay(getMockWeatherHistory(regionId, debut, fin)),
  climateIndices:  (_regionId: string)                       => delay([]),
  activeAnomalies: (_params?: object)                        => delay(MOCK_ANOMALIES),
  nationalSummary: ()                                        => delay(MOCK_NATIONAL_WEATHER),
}

// ── Malaria ────────────────────────────────────────────────────────────────
export const demoMalariaApi = {
  cas:                  (_r: string, _p?: object)            => delay([]),
  risque:               (regionId: string)                   => delay(getMockCombinedPrediction(regionId)),
  carteRisqueNationale: (_horizonJours?: number)             => delay(MOCK_CARTE_RISQUE),
  alertes:              (_params?: object)                   => delay(MOCK_MALARIA_ALERTS),
  acquitterAlerte:      (_alerteId: string)                  => delay({ success: true }),
  tendanceHebdo:        (regionId: string, semaines: number) => delay(getMockWeeklyTrend(regionId, semaines)),
  saisonnier:           (_regionId: string)                  => delay([]),
  facteurs:             (_regionId: string)                  => delay({}),
  comparaison:          (_ids: string[])                     => delay([]),
}

// ── Nutrition ──────────────────────────────────────────────────────────────
export const demoNutritionApi = {
  statut:               (_regionId: string)                  => delay(null),
  risque:               (_regionId: string)                  => delay(null),
  carteRisqueNationale: ()                                   => delay(MOCK_CARTE_NUTRITION),
  alertes:              (_params?: object)                   => delay(MOCK_NUTRITION_ALERTS),
  alimentaire:          (_regionId: string)                  => delay(null),
  stocks:               (_regionId: string)                  => delay(null),
  updateStocks:         (_regionId: string, _data: object)   => delay({ success: true }),
  recettes:             (_params?: object)                   => delay(MOCK_RECIPES),
  recetteDetail:        (id: string)                        => delay(MOCK_RECIPES.find((r) => r.recette_id === id) ?? MOCK_RECIPES[0]),
  contextualRecipes:    (_regionId: string)                  => delay(MOCK_RECIPES),
}

// ── Predictions ────────────────────────────────────────────────────────────
export const demoPredictionsApi = {
  combinee:   (regionId: string)                               => delay(getMockCombinedPrediction(regionId)),
  shap:       (regionId: string, modele: 'paludisme' | 'nutrition') => delay(getMockShap(regionId, modele)),
  sante:      ()                                               => delay(MOCK_MODEL_HEALTH),
  backtest:   (regionId: string, modele: string)               => delay(getMockBacktest(regionId, modele)),
  batch:      (req: { regions: string[] })                     => delay(getMockBatch(req.regions)),
  scenario:   (params: ScenarioWhatIf)                         => delay(getMockScenario(params)),
  retrain:    (_modele: string)                                => delay({ started: true }),
}

// ── Reports ────────────────────────────────────────────────────────────────
export const demoReportsApi = {
  generer:        (_req: GenerateReportRequest)               => delay(getMockGenerateResponse()),
  statut:         (id: string)                               => delay(getMockReportStatus(id)),
  historique:     (_params?: object)                         => delay(MOCK_REPORT_HISTORY),
  planifications: ()                                         => delay(MOCK_SCHEDULES),
  supprimer:      (_id: string)                              => delay({ success: true }),
  exporter:       (_params: object)                          => delay('region_id,date,cas\nMDG-ANA,2025-07-01,142\n'),
}

// ── Auth ───────────────────────────────────────────────────────────────────
export const demoAuthApi = {
  login:          (_creds: object)                           => delay(DEMO_TOKEN_RESPONSE),
  me:             ()                                         => delay(DEMO_TOKEN_RESPONSE.user),
  listUsers:      ()                                         => delay(DEMO_USERS_LIST),
  changePassword: (_req: object)                            => delay({ message: 'Password updated (demo).' }),
  forgotPassword: (_req: object)                            => delay({ message: 'Link sent (demo — no real email).' }),
  resetPassword:  (_req: object)                            => delay({ message: 'Password reset (demo).' }),
  register:       (_req: object)                            => delay(DEMO_TOKEN_RESPONSE.user),
}
