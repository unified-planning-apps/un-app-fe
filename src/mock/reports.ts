/**
 * src/mock/reports.ts
 * --------------------
 * Mock data for reports endpoints (demo mode).
 */
import type { RapportHistorique, PlanificationRapport } from '#/lib/schemas/reports'

const dPast = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString() }

export const MOCK_REPORT_HISTORY: RapportHistorique[] = [
  { rapport_id: 'RPT-001', type_rapport: 'malaria_weekly', region_id: null, region_name: 'National', format: 'pdf', langue: 'fr', genere_le: dPast(2), genere_par: 'admin', statut: 'termine', taille_ko: 284, url_telechargement: null },
  { rapport_id: 'RPT-002', type_rapport: 'combined_weekly',   region_id: null, region_name: 'National', format: 'pdf', langue: 'fr', genere_le: dPast(9), genere_par: 'admin', statut: 'termine', taille_ko: 512, url_telechargement: null },
  { rapport_id: 'RPT-003', type_rapport: 'nutrition_weekly', region_id: 'MDG-SOF', region_name: 'Sofia', format: 'pdf', langue: 'fr', genere_le: dPast(14), genere_par: 'demo', statut: 'termine', taille_ko: 196, url_telechargement: null },
  { rapport_id: 'RPT-004', type_rapport: 'monthly', region_id: null, region_name: 'National', format: 'pdf', langue: 'fr', genere_le: dPast(30), genere_par: 'admin', statut: 'termine', taille_ko: 1024, url_telechargement: null },
]

export const MOCK_SCHEDULES: PlanificationRapport[] = [
  { planification_id: 'PLAN-001', type_rapport: 'malaria_weekly', frequence: 'hebdomadaire', destinataires_email: ['equipe@sante.mg', 'unicef.mdg@unicef.org'], format: 'pdf', langue: 'fr', actif: true, prochaine_execution: new Date(Date.now() + 3 * 86400000).toISOString() },
  { planification_id: 'PLAN-002', type_rapport: 'monthly', frequence: 'monthly', destinataires_email: ['direccion@sante.mg'], format: 'pdf', langue: 'fr', actif: true, prochaine_execution: new Date(Date.now() + 12 * 86400000).toISOString() },
]

export function getMockReportStatus(rapportId: string) {
  return { rapport_id: rapportId, statut: 'termine' as const, progression_pct: 100, message: 'Report generated successfully (demo)' }
}

export function getMockGenerateResponse() {
  return { rapport_id: `RPT-DEMO-${Date.now()}`, statut: 'en_cours' as const, message: 'Generation started (demo mode)' }
}
