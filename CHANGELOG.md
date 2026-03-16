# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.1] - 2026-03-16

### Fixed

- `nginx.conf` — added `Cache-Control: no-cache` for `index.html` to prevent browsers from caching the entry point across deployments. Hashed assets (JS/CSS) remain cached with `immutable, 1y`. This fixes a cross-browser issue (Brave, Edge) where a cached `index.html` referenced stale asset filenames after a new deploy, resulting in 404 errors for CSS/JS files.

---

## [1.0.0] - 2026-03-16

### Added

#### Core Setup (`feature/ts-core-000-setup`)

- Scaffolded base Angular project (zoneless, standalone, OnPush).
- Configured ESLint, Prettier, Tailwind CSS, and PrimeNG v19.
- Configured `README.md`, `CONTRIBUTING.md`, and initial ADRs (`docs/adr/*`).
- `ApiVersionInterceptor` — appends `api-version` header to all outgoing HTTP requests.
- `AuthInterceptor` — attaches Bearer token to authorized requests.
- `ErrorHandlerInterceptor` — global HTTP error handler with toast feedback.
- `ToastService` — singleton service for success/error/info/warn notifications.
- `LoadingService` — global loading state signal consumed by the loading spinner.
- `TOKEN_PROVIDER` token — injectable access-token abstraction.

#### Authentication (`feature/us-iam-001-sign-in`)

- `LoginComponent` — sign-in form with email/password validation and server error mapping.
- `AuthService` — manages session token storage and expiry.
- `authGuard` — redirects unauthenticated users to `/login`.
- `guestGuard` — redirects already-authenticated users away from `/login`.

#### Layout (`feature/ts-sup-000-layout`)

- `ShellComponent` — main app shell with `<router-outlet>`.
- `HeaderComponent` — top navigation bar with user info, nav links, and sign-out; responsive mobile floating pill nav.

#### Suppliers — List (`feature/us-sup-002-list-suppliers`)

- `SuppliersListComponent` — fully paginated, server-sorted, and filtered suppliers table using PrimeNG `p-table`.
- Lazy loading with skeleton rows during fetch.
- Filter panel (legal name, tax ID, country, status, risk level) with debounced input and active filter count badge.
- Collapsible filter panel on mobile.
- Empty state with contextual message when filters are active.
- Row actions menu (`...`) with per-row contextual items.

#### Suppliers — Create (`feature/us-sup-001-create-supplier`)

- `SupplierFormComponent` (mode `create`) — reactive form with all supplier fields, inline validation, and server-side error mapping.
- "Add supplier" dialog wired into the list; reloads table on success.

#### Suppliers — Edit (`feature/us-sup-004-update-supplier`)

- `SupplierFormComponent` (mode `edit`) — pre-populates form with existing supplier data.
- `SupplierService.update()` — `PUT /suppliers/:id`.
- Edit dialog wired into the row actions menu; reloads table on success.

#### Suppliers — Run Screening (`feature/us-sup-006-run-screening`)

- `ScreeningDialogComponent` — full screening UI launched from the row actions menu.
- Source selector: OFAC, World Bank, ICIJ — all unchecked by default; at least one required to run.
- `ScreeningService.search()` — `GET /lists/search` with correct source param mapping (`OFAC→ofac`, `WORLD_BANK→worldbank`, `ICIJ→icij`).
- Three independent result tables, one per source, each with source badge, official site link, and hit count.
  - **OFAC**: Name / Address / Type / Program(s) / List / Score (colour-coded pill: red ≥90%, orange ≥70%, yellow otherwise).
  - **World Bank**: Firm Name / Address / Country / From Date / To Date / Grounds.
  - **ICIJ**: Entity / Jurisdiction / Linked To / Data From.
- Green "no matches" inline row when a selected source returns zero results.
- Global summary banner: red with hit count if results found, green if clean.
- Error banner on HTTP failure.
- Maximizable dialog (70 rem wide).
- `ScreeningRequest` / `ScreeningResponse` / `ScreeningEntry` / `ListSource` models.

#### Suppliers — Delete (`feature/us-sup-005-delete-supplier`)

- `DeleteConfirmDialogComponent` — destructive action dialog with typed confirmation.
- User must type the supplier's exact legal name (case-sensitive) to enable the "Delete supplier" button.
- Warning banner ("This action cannot be undone") and spinner state during deletion.
- `SupplierService.delete()` — `DELETE /suppliers/:id`.
- On success: toast notification and table reload from page 0.

#### Suppliers — View Details (`feature/us-sup-003-view-supplier-details`)

- `SupplierDetailsComponent` — read-only details dialog showing all supplier fields grouped by section.
  - **Identification**: Tax ID, Country (full name + ISO code).
  - **Contact**: Email (mailto link), Phone (tel link), Website (external link), Address.
  - **Financial**: Annual billing formatted with thousands separator.
  - **Notes**: shown only when present, preserving line breaks.
  - **Audit**: created/updated timestamps with actor names.
- Status and risk level badges in the dialog header.
- Launched from the row actions menu; no extra HTTP call (uses already-loaded row data).

#### Deployment & CI/CD (`feature/inf-001-docker-and-production-config`)

- Multi-stage Dockerfile: Node build → `nginx-unprivileged` with non-root user, port 8080.
- `nginx.conf` — SPA routing (`try_files`), static asset caching (1 year immutable for hashed files), gzip compression.
- `environment.ts` — production API URL pointing to Azure Container Apps backend domain.
- GitHub Actions CI workflow (`ci.yml`) — build on push/PR to `main`/`develop`.
- GitHub Actions CD workflow (`cd.yml`) — Docker build, push to Docker Hub (`jhosepmyr/riskscreening-web`), deploy to Azure Container Apps via `workflow_run` pattern.

---

[1.0.0]: https://github.com/compliance-hub-jmyr/risk-screening-app/releases/tag/v1.0.0
