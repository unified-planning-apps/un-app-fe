/**
 * src/hooks/query-keys.ts
 * ========================
 * Centralized react-query key factory so invalidations stay consistent
 * across the app (one source of truth per domain).
 */

export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
    users: ['auth', 'users'] as const,
  },
  weather: {
    current: (regionId: string) => ['weather', 'current', regionId] as const,
    forecast: (regionId: string, jours: number) => ['weather', 'forecast', regionId, jours] as const,
    history: (regionId: string, debut: string, fin: string) =>
      ['weather', 'history', regionId, debut, fin] as const,
    indices: (regionId: string) => ['weather', 'indices', regionId] as const,
    anomalies: (regionId?: string) => ['weather', 'anomalies', regionId] as const,
    national: ['weather', 'national'] as const,
  },
  malaria: {
    cas: (regionId: string) => ['malaria', 'cas', regionId] as const,
    risque: (regionId: string, horizon: number) => ['malaria', 'risque', regionId, horizon] as const,
    carteRisque: (horizon: number) => ['malaria', 'carte-risque', horizon] as const,
    alertes: (regionId?: string) => ['malaria', 'alertes', regionId] as const,
    comparaison: ['malaria', 'comparaison'] as const,
    saisonnalite: (regionId: string) => ['malaria', 'saisonnalite', regionId] as const,
    facteursRisque: (regionId: string) => ['malaria', 'facteurs-risque', regionId] as const,
    tendance: (regionId: string, semaines: number) => ['malaria', 'tendance', regionId, semaines] as const,
    statsNational: ['malaria', 'stats-national'] as const,
  },
  nutrition: {
    statut: (regionId: string) => ['nutrition', 'statut', regionId] as const,
    risque: (regionId: string, horizon: number) => ['nutrition', 'risque', regionId, horizon] as const,
    disponibilite: (regionId: string) => ['nutrition', 'disponibilite', regionId] as const,
    recettes: (filters: Record<string, unknown>) => ['nutrition', 'recettes', filters] as const,
    recetteDetail: (id: string) => ['nutrition', 'recette', id] as const,
    stocks: (regionId: string) => ['nutrition', 'stocks', regionId] as const,
    alertes: (regionId?: string) => ['nutrition', 'alertes', regionId] as const,
    soudure: (regionId?: string) => ['nutrition', 'soudure', regionId] as const,
    tendance: (regionId: string, mois: number) => ['nutrition', 'tendance', regionId, mois] as const,
    carteRisque: ['nutrition', 'carte-risque'] as const,
    statsNational: ['nutrition', 'stats-national'] as const,
  },
  predictions: {
    combinee: (regionId: string, horizon: number) => ['predictions', 'combinee', regionId, horizon] as const,
    explicabilite: (regionId: string, modele: string) =>
      ['predictions', 'explicabilite', regionId, modele] as const,
    santeModeles: ['predictions', 'sante-modeles'] as const,
    backtest: (regionId: string, modele: string, periode: number) =>
      ['predictions', 'backtest', regionId, modele, periode] as const,
  },
  reports: {
    statut: (rapportId: string) => ['reports', 'statut', rapportId] as const,
    historique: (filters: Record<string, unknown>) => ['reports', 'historique', filters] as const,
    hebdoJson: (regionId: string) => ['reports', 'hebdo-json', regionId] as const,
    planifications: ['reports', 'planifications'] as const,
    statistiques: ['reports', 'statistiques'] as const,
  },
}
