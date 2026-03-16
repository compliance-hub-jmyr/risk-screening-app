# Guía de Contribución

Esta guía detalla las convenciones para contribuir al frontend (`risk-screening-app`).

## Gitflow

Sigue exactamente el mismo flujo que el backend:
- `main`: Releases estables.
- `develop`: Rama de integración principal.
- `feature/*`, `bugfix/*`, `release/*`, `hotfix/*`.

## Conventional Commits

Sigue el estándar de [Conventional Commits v1.0.0](https://www.conventionalcommits.org/).

Ejemplos:
```bash
feat(suppliers): create supplier registration form
fix(screening): handle empty results array from API
refactor(core): move error interceptor to core layer
```

## Estructura de Directorios

El código de Angular debe organizarse dentro de `src/app`:

- `core/`: Servicios singleton (`providedIn: 'root'`), interceptores HTTP, guards de rutas, modelos de dominio compartidos. **Nada en core debe importar nada de features.**
- `shared/`: Componentes UI "tontos" (dumb components), pipes, directivas. No deben inyectar servicios de negocio.
- `features/`: Componentes "inteligentes" y vistas organizados por dominio:
  - `auth/`
  - `suppliers/`
  - `screening/`
  Cada feature debe manejar su propio estado, servicios locales y enrutamiento.

## Convenciones de Angular (Basado en v21+)

> **OBLIGATORIO:** Las siguientes reglas son estrictas y deben respetarse en todo momento.

1. **Standalone Components:** NO DEBEN usarse `NgModules`. Todos los componentes, directivas y pipes deben ser *standalone* (el flag `standalone: true` ya no es necesario en Angular 20+ al ser por defecto).
2. **Signals:** Usa signals (`signal`, `computed`, `effect`) para el estado del componente. `update`, `set` para mutaciones de señales; evitar RxJS a menos que sea inevitable por eventos de red puros, donde `async` pipe o `toSignal()` entran en juego.
3. **Señales de I/O:** Usa las nuevas funciones `input()`, `output()` y `model()` en vez de los decoradores `@Input()`, `@Output()`.
4. **Control Flow nativo:** Usa `@if`, `@for` y `@switch` en el template en lugar de `*ngIf`, `*ngFor` y `*ngSwitch`.
5. **Formularios Reactivos:** Usa **Reactive Forms** exclusivamente. No está permitido el uso de *Template-driven forms*.
6. **Estilos y Clases:** No usar `[ngClass]` o `[ngStyle]`, prefiere los bindings específicos `[class.mi-clase]="condicion"` o `[style.color]="valor"`.
7. **Host Bindings:** No uses los decoradores `@HostBinding` o `@HostListener`. Mueve estas configuraciones a la propiedad `host: {}` del decorador del componente en su defecto.
8. **Inyección de Dependencias:** Usa la función `inject()` en lugar de la inyección por constructor.

## Accesibilidad

- Todas las vistas de la aplicación DEBEN pasar revisiones de "axe" o pruebas WCAG AA (teclado, contraste de colores, ARIA attributes).
- Usa `NgOptimizedImage` para imágenes estáticas (no admite base64 inlined).

## Pruebas

- Pruebas unitarias mediante **Jest + Angular Testing Library**.
- Probar un comportamiento final y no detalles de implementación internos del componente.
