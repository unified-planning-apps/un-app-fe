/**
 * src/lib/api/predictions.ts
 * ===========================
 * Calls backend `/predictions/*` (src/api/routers/predictions.py).
 */

import { apiClient } from './client'
import type {
  ModeleSante,
  PerformanceBacktest,
  PredictionBatchRequest,
  PredictionBatchResult,
  PredictionCombinee,
  ResultatScenario,
  SHAPExplication,
  ScenarioWhatIf,
} from '#/lib/schemas/predictions'

export const predictionsApi = {
  combinee: (regionId: string, horizonJours = 14) =>
    apiClient.get<PredictionCombinee>(`/predictions/combinee/${regionId}`, {
      params: { horizon_jours: horizonJours },
    }),

  batch: (data: PredictionBatchRequest) =>
    apiClient.post<PredictionBatchResult>('/predictions/batch', data),

  simulerScenario: (data: ScenarioWhatIf) =>
    apiClient.post<ResultatScenario>('/predictions/scenario', data),

  explicabilite: (regionId: string, modele: 'paludisme' | 'nutrition') =>
    apiClient.get<SHAPExplication>(`/predictions/explicabilite/${regionId}/${modele}`),

  /** Restricted: national/admin. */
  santeModeles: () => apiClient.get<ModeleSante[]>('/predictions/sante-modeles'),

  /** Restricted: national/admin. */
  backtest: (regionId: string, modele: 'paludisme' | 'nutrition' = 'paludisme', periodeMois = 6) =>
    apiClient.get<PerformanceBacktest>(`/predictions/backtest/${regionId}`, {
      params: { modele, periode_mois: periodeMois },
    }),

  /** Restricted: admin. */
  forcerRetraining: (modele: 'paludisme' | 'nutrition' | 'tous') =>
    apiClient.post<{ statut: string; message: string }>(`/predictions/forcer-retraining/${modele}`),
}
