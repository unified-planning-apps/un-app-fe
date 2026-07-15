# Changes — Frontend adapted to backend (UNICEF malaria/nutrition surveillance, Madagascar)

This frontend was rewired end-to-end to consume the real FastAPI backend
(`/auth`, `/meteo`, `/paludisme`, `/nutrition`, `/predictions`, `/rapports`).
The backend itself was **not modified** — it was used strictly as a reference.

## 1. New data layer (previously empty)
- `src/lib/api/*` — typed fetch client (`client.ts`) + one module per backend
  router (`auth.ts`, `weather.ts`, `malaria.ts`, `nutrition.ts`,
  `predictions.ts`, `reports.ts`).
- `src/lib/schemas/*` — zod schemas mirroring every backend Pydantic model
  used by the UI.
- `src/lib/regions.ts` — canonical 22-region metadata generated from the
  backend's `config/regions_metadata.json` (replaces the old hand-written
  region slug enum which didn't match backend IDs).
- `src/hooks/*` — react-query hooks per domain (`use-auth`, `use-weather`,
  `use-malaria`, `use-nutrition`, `use-predictions`, `use-reports`) plus a
  central `query-keys.ts` factory.
- `src/stores/auth-store.ts` — zustand store (persisted) holding the JWT and
  current user; the API client reads the token from here automatically.

## 2. Auth wired for real
- `routes/auth/signin.tsx` — now calls `POST /auth/login` (field renamed
  `email` → `username` to match the backend), stores the session, redirects.
- `routes/auth/register.tsx` — rebuilt to match `RegisterRequest` exactly
  (`username`, `email`, `full_name`, `organisation`, `role`, `region_id`).
  Removed the phone-number field (no backend support) and the old
  Agent/Guest roles (replaced with the backend's real
  `viewer/regional/national/admin`, self-registration limited to
  viewer/regional).
- `lib/validations/auth.ts` (duplicate, hand-rolled validation) was deleted
  — `lib/schemas/auth.ts` is now the single source of truth.

## 3. Routing bug fixed
`/admin/regions/$id/insight/*` was a **separate top-level route**, outside
the `_admin` pathless layout — visiting a region's detail page rendered
with no sidebar/header at all. Moved the whole `regions/$id/insight*` tree
under `admin/_admin/...` (URLs are unchanged, the pathless `_admin` segment
doesn't appear in the path) and regenerated `routeTree.gen.ts` accordingly.

## 4. Restyled `_admin.tsx` (admin shell)
Was using generic untouched Tailwind defaults, inconsistent with the rest
of the app. Rebuilt with the existing design tokens (CSS vars, Fraunces/
Manrope, rounded-2xl cards), added: route guard (redirects to `/auth/signin`
if not authenticated), a real sidebar with role-aware nav items, current
user card, and logout.

## 5. Mock data replaced with live data
- Dashboard, regions map, region "Analyse IA" tab now call the real
  endpoints (combined predictions, malaria/nutrition risk maps, alerts,
  weekly trends, national weather summary).
- `components/Map.tsx` now plots the real 22 regions and colors markers by
  live malaria risk level instead of a hardcoded lat/lng table.

## 6. New pages added (backend features with no prior UI)
- `/admin/weather` — national weather + active climate anomalies.
- `/admin/recipes` — nutrition recipes browser/filters.
- `/admin/reports` — generate/poll/download PDF reports, history, schedules
  (national/admin).
- `/admin/models` — ML model health/drift, force-retraining (admin).
- `/admin/users` — user list (admin only).
- `regions/$id/insight/scenario` — what-if scenario simulator (cyclone,
  drought, price shock) per region.

## 7. Cleanup
- Removed unused/empty: `components/layout/` (empty folder), `old.txt`,
  `lib/validations/` (superseded), commented-out `Header`/`Footer` (now
  fully removed, unused anywhere).
- `components/ReportDetail.tsx` and `components/WeatherDetail.tsx` were
  built but never imported anywhere — now actually used (climate cards in
  the AI tab, field-agent report cards in the region reports tab) instead
  of duplicated inline markup.
- Mounted a single `<Toaster />` (the project's existing themed
  `ui/sonner.tsx` wrapper) in `__root.tsx` for API error/success feedback
  app-wide.
- `/` now redirects to `/admin/dashboard` if already authenticated, else
  `/auth/signin` (was previously hardcoded to always go to signin).

## Notes / things to double-check on your side
- `VITE_API_BASE_URL` was added to `.env.local`, defaulting to
  `http://localhost:8000/api/v1` — point it at your running backend.
- `routeTree.gen.ts` was updated by hand to match the new file locations;
  running the dev server / build (TanStack Router's vite plugin) will
  regenerate it automatically and should produce an equivalent result.
- The "Rapports terrain" tab (field-agent submissions) on a region's detail
  page is intentionally still mock data — the backend has no endpoint for
  individual field-agent reports yet (this is different from the
  system-generated PDF reports under `/admin/reports`, which is fully wired).
- Self-registration is restricted to `viewer`/`regional` roles in the UI;
  the backend may have its own server-side restriction on who can create
  `admin`/`national` accounts — worth confirming server-side behavior.
