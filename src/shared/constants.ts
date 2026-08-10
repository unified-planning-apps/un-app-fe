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
    [Role.Admin]: 'Administrator',
    [Role.National]: 'National',
    [Role.Regional]: 'Regional',
    [Role.Viewer]: 'Read-only',
}

export { REGIONS, REGION_BY_ID, getRegionName, getRegionMeta } from '#/lib/regions'
export type { RegionMeta } from '#/lib/regions'
