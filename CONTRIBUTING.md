# Contribution Guidelines

This guide details the conventions for contributing to the frontend (`risk-screening-app`).

## Gitflow

We follow the exact same flow as the backend:
- `main`: Stable releases.
- `develop`: Main integration branch.
- `feature/*`, `bugfix/*`, `release/*`, `hotfix/*`.

## Conventional Commits

Follow the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/) standard.

Examples:
```bash
feat(suppliers): create supplier registration form
fix(screening): handle empty results array from API
refactor(core): move error interceptor to core layer
```

## Directory Structure

Angular code must be organized inside `src/app`:

- `core/`: Singleton services (`providedIn: 'root'`), HTTP interceptors, route guards, shared domain models. **Nothing in core should import anything from features.**
- `shared/`: "Dumb" UI components, pipes, directives. They must not inject business services.
- `features/`: "Smart" components and views organized by domain:
  - `auth/`
  - `suppliers/`
  - `screening/`
  Each feature must manage its own state, local services, and routing.

## Angular Conventions (Based on v21+)

> **MANDATORY:** The following rules are strict and must be respected at all times.

1. **Standalone Components:** Do NOT use `NgModules`. All components, directives, and pipes must be *standalone* (the `standalone: true` flag is no longer necessary in Angular 20+ as it is the default).
2. **Signals:** Use signals (`signal`, `computed`, `effect`) for component state. Prefer `update` and `set` for signal mutations; avoid RxJS unless necessary for pure network events, where the `async` pipe or `toSignal()` come into play.
3. **I/O Signals:** Use the new `input()`, `output()`, and `model()` functions instead of `@Input()` and `@Output()` decorators.
4. **Native Control Flow:** Use `@if`, `@for`, and `@switch` in the template instead of `*ngIf`, `*ngFor`, and `*ngSwitch`.
5. **Reactive Forms:** Structure component forms using **Reactive Forms** exclusively. *Template-driven forms* are not permitted.
6. **Styles and Classes:** Do not use `[ngClass]` or `[ngStyle]`, prefer specific bindings such as `[class.my-class]="condition"` or `[style.color]="value"`.
7. **Host Bindings:** Do not use the `@HostBinding` or `@HostListener` decorators. Move configuration into the `@Component` decorators `host: {}` property instead.
8. **Dependency Injection:** Use the `inject()` function instead of constructor injection.

## Accessibility

- All application views MUST pass accessibility checks like axe or WCAG AA minimums (keyboard navigation, color contrast, ARIA attributes).
- Use `NgOptimizedImage` for static images (inline base64 not supported by this directive).
- Tests must be written using **Jest + Angular Testing Library**.
