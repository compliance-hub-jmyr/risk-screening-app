# Changelog

Todos los cambios notables de este proyecto se documentan aquí.

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versionado: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [1.0.1] - 2026-03-16

### Corregido

- `nginx.conf` — se agregó `Cache-Control: no-cache` para `index.html` para evitar que los navegadores cacheen el punto de entrada entre despliegues. Los assets con hash (JS/CSS) siguen cacheándose con `immutable, 1y`. Esto corrige un problema en Brave y Edge donde el `index.html` cacheado referenciaba nombres de archivos desactualizados tras un nuevo deploy, causando errores 404 en archivos CSS/JS.

---

## [1.0.0] - 2026-03-16

### Agregado

#### Core Setup (`feature/ts-core-000-setup`)

- Inicialización del proyecto Angular (zoneless, standalone, OnPush).
- Configuración de ESLint, Prettier, Tailwind CSS y PrimeNG v19.
- Creación de `README.md`, `CONTRIBUTING.md` y ADRs iniciales (`docs/adr/*`).
- `ApiVersionInterceptor` — agrega el header `api-version` a todas las peticiones HTTP salientes.
- `AuthInterceptor` — adjunta el token Bearer a las peticiones autorizadas.
- `ErrorHandlerInterceptor` — manejador global de errores HTTP con feedback por toast.
- `ToastService` — servicio singleton para notificaciones de éxito/error/info/aviso.
- `LoadingService` — señal de estado de carga global consumida por el spinner.
- Token `TOKEN_PROVIDER` — abstracción inyectable del access token.

#### Autenticación (`feature/us-iam-001-sign-in`)

- `LoginComponent` — formulario de inicio de sesión con validación de email/contraseña y mapeo de errores del servidor.
- `AuthService` — gestiona el almacenamiento y expiración del token de sesión.
- `authGuard` — redirige a usuarios no autenticados a `/login`.
- `guestGuard` — redirige a usuarios ya autenticados fuera de `/login`.

#### Layout (`feature/ts-sup-000-layout`)

- `ShellComponent` — shell principal de la aplicación con `<router-outlet>`.
- `HeaderComponent` — barra de navegación superior con info del usuario, enlaces y cierre de sesión; navegación flotante tipo pill para móvil.

#### Proveedores — Listado (`feature/us-sup-002-list-suppliers`)

- `SuppliersListComponent` — tabla de proveedores con paginación, ordenamiento y filtros en servidor usando `p-table` de PrimeNG.
- Carga diferida con filas skeleton durante la petición.
- Panel de filtros (nombre legal, RUC/NIT, país, estado, nivel de riesgo) con debounce e indicador de filtros activos.
- Panel de filtros colapsable en móvil.
- Estado vacío con mensaje contextual cuando hay filtros activos.
- Menú de acciones por fila (`...`) con ítems contextuales.

#### Proveedores — Crear (`feature/us-sup-001-create-supplier`)

- `SupplierFormComponent` (modo `create`) — formulario reactivo con todos los campos del proveedor, validación en línea y mapeo de errores del servidor.
- Dialog "Agregar proveedor" integrado en el listado; recarga la tabla al guardar.

#### Proveedores — Editar (`feature/us-sup-004-update-supplier`)

- `SupplierFormComponent` (modo `edit`) — precarga el formulario con los datos existentes del proveedor.
- `SupplierService.update()` — `PUT /suppliers/:id`.
- Dialog de edición integrado en el menú de acciones por fila; recarga la tabla al guardar.

#### Proveedores — Ejecutar Screening (`feature/us-sup-006-run-screening`)

- `ScreeningDialogComponent` — interfaz completa de screening lanzada desde el menú de acciones por fila.
- Selector de fuentes: OFAC, World Bank, ICIJ — todas desmarcadas por defecto; se requiere al menos una para ejecutar.
- `ScreeningService.search()` — `GET /lists/search` con mapeo correcto de parámetros de fuente (`OFAC→ofac`, `WORLD_BANK→worldbank`, `ICIJ→icij`).
- Tres tablas de resultados independientes, una por fuente, cada una con badge de fuente, enlace al sitio oficial y conteo de coincidencias.
  - **OFAC**: Nombre / Dirección / Tipo / Programa(s) / Lista / Score (pill con color: rojo ≥90%, naranja ≥70%, amarillo en otro caso).
  - **World Bank**: Nombre empresa / Dirección / País / Fecha desde / Fecha hasta / Motivo.
  - **ICIJ**: Entidad / Jurisdicción / Vinculado a / Fuente de datos.
- Fila "sin coincidencias" en verde cuando una fuente seleccionada devuelve cero resultados.
- Banner resumen global: rojo con conteo si hay resultados, verde si está limpio.
- Banner de error ante falla HTTP.
- Dialog maximizable (70 rem de ancho).
- Modelos `ScreeningRequest` / `ScreeningResponse` / `ScreeningEntry` / `ListSource`.

#### Proveedores — Eliminar (`feature/us-sup-005-delete-supplier`)

- `DeleteConfirmDialogComponent` — dialog de acción destructiva con confirmación escrita.
- El usuario debe escribir el nombre legal exacto del proveedor (sensible a mayúsculas) para habilitar el botón "Eliminar proveedor".
- Banner de advertencia ("Esta acción no se puede deshacer") y estado spinner durante la eliminación.
- `SupplierService.delete()` — `DELETE /suppliers/:id`.
- Al confirmar: notificación toast y recarga de la tabla desde la página 0.

#### Proveedores — Ver Detalle (`feature/us-sup-003-view-supplier-details`)

- `SupplierDetailsComponent` — dialog de solo lectura con todos los campos del proveedor agrupados por sección.
  - **Identificación**: RUC/NIT, País (nombre completo + código ISO).
  - **Contacto**: Email (enlace mailto), Teléfono (enlace tel), Sitio web (enlace externo), Dirección.
  - **Financiero**: Facturación anual formateada con separador de miles.
  - **Notas**: mostradas solo si existen, preservando saltos de línea.
  - **Auditoría**: timestamps de creación y última modificación con nombre del actor.
- Badges de estado y nivel de riesgo en el encabezado del dialog.
- Se abre desde el menú de acciones por fila; no realiza llamada HTTP adicional (usa los datos ya cargados en la fila).

#### Despliegue & CI/CD (`feature/inf-001-docker-and-production-config`)

- Dockerfile multi-stage: build en Node → `nginx-unprivileged` con usuario non-root, puerto 8080.
- `nginx.conf` — ruteo SPA (`try_files`), cache de assets estáticos (1 año immutable para archivos con hash), compresión gzip.
- `environment.ts` — URL de API de producción apuntando al dominio del backend en Azure Container Apps.
- GitHub Actions CI workflow (`ci.yml`) — build en push/PR a `main`/`develop`.
- GitHub Actions CD workflow (`cd.yml`) — Docker build, push a Docker Hub (`jhosepmyr/riskscreening-web`), deploy a Azure Container Apps via patrón `workflow_run`.

---

[1.0.0]: https://github.com/compliance-hub-jmyr/risk-screening-app/releases/tag/v1.0.0
