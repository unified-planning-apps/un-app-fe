export const AppName = 'HealthShield';

/**
 * User roles — must match backend `src/utils/constants.py::UserRole` exactly.
 *   admin    → full access + user management
 *   national → all regions, no user management
 *   regional → restricted to own region
 *   viewer   → read-only
 */
export enum Role {
    Admin = 'admin',
    National = 'national',
    Regional = 'regional',
    Viewer = 'viewer',
}

export const ROLE_LABELS: Record<Role, string> = {
    [Role.Admin]: 'Administrateur',
    [Role.National]: 'National',
    [Role.Regional]: 'Régional',
    [Role.Viewer]: 'Lecture seule',
}

// Region data now lives in `#/lib/regions` (sourced from the backend's
// `config/regions_metadata.json`). Re-exported here for convenience /
// backward compatibility with existing imports of `shared/constants`.
export { REGIONS, REGION_BY_ID, getRegionName, getRegionMeta } from '#/lib/regions'
export type { RegionMeta } from '#/lib/regions'