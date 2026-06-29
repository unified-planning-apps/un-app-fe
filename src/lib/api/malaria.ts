/**
 * src/lib/api/malaria.ts
 * =======================
 * Calls backend `/paludisme/*` (src/api/routers/malaria.py).
 */

import { apiClient } from './client'
import type {
  AlerteEpidemiologique,
  CarteRisqueMalaria,
  CasPaludisme,
  ComparaisonRegionale,
  FacteursRisque,
  PredictionRisqueMalaria,
  StatsSaisonnieres,
  TendanceHebdoMalaria,
} from '#/lib/schemas/malaria'

export const malariaApi = {
  cas: (
    regionId: string,
    params?: { date_debut?: string; date_fin?: string; district?: string; limit?: number; offset?: number },
  ) => apiClient.get<CasPaludisme[]>(`/paludisme/cas/${regionId}`, { params }),

  risque: (regionId: string, horizonJours = 14) =>
    apiClient.get<PredictionRisqueMalaria>(`/paludisme/risque/${regionId}`, {
      params: { horizon_jours: horizonJours },
    }),

  carteRisqueNationale: (horizonJours = 14) =>
    apiClient.get<CarteRisqueMalaria>('/paludisme/carte-risque', {
      params: { horizon_jours: horizonJours },
    }),

  alertes: (params?: { region_id?: string; severite?: string; statut?: string }) =>
    apiClient.get<AlerteEpidemiologique[]>('/paludisme/alertes', { params }),

  acquitterAlerte: (alerteId: string, commentaire?: string) =>
    apiClient.post<{ statut: string; message: string }>(
      `/paludisme/alertes/${alerteId}/acquitter`,
      undefined,
      { params: { commentaire } },
    ),

  comparaisonRegionale: (dateReference?: string) =>
    apiClient.get<ComparaisonRegionale>('/paludisme/comparaison-regionale', {
      params: { date_reference: dateReference },
    }),

  saisonnalite: (regionId: string) =>
    apiClient.get<StatsSaisonnieres>(`/paludisme/saisonnalite/${regionId}`),

  facteursRisque: (regionId: string) =>
    apiClient.get<FacteursRisque>(`/paludisme/facteurs-risque/${regionId}`),

  tendanceHebdo: (regionId: string, semaines = 26) =>
    apiClient.get<TendanceHebdoMalaria>(`/paludisme/tendance/${regionId}`, {
      params: { semaines },
    }),

  /** Restricted: national/admin. */
  statistiquesNationales: () =>
    apiClient.get<Record<string, unknown>>('/paludisme/statistiques/national'),
}
