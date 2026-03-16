# ADR-0002: Signals para manejo de estado en componentes

**Estado:** Aceptado  
**Fecha:** 2026-03-15

## Contexto

El estado local asíncrono en Angular típicamente solía depender de `RxJS` (uso intensivo de `BehaviorSubject`, el pipe `async` en vistas, etc). Modernamente, Angular soporta `Signals` que proveen reactividad síncrona, de grano fino y rastreable automágicamente.

## Decisión

Adoptaremos `Signals` en lugar de `RxJS` para el estado interno y de interface de usuario dentro de componentes y servicios que no requieran manipulación constante de streamings en el tiempo. `RxJS` quedará relegado primariamente para envolver las peticiones `HttpClient` puras.

Reglas aplicadas:
- Mutaciones usarán `set()` o `update()` (nunca `mutate()`).
- Estados derivados usarán `computed()`.
- Flujos de E/S de componentes usarán `input()`, `output()`, `model()`.

## Consecuencias

- **Positivas:** Detección de cambios óptima sin necesidad estricta de entender `zone.js`. Simplificación drástica de las plantillas y del ciclo de vida de los datos locales sin dependencias de desuscripciones.
- **Negativas:** Menor interoperabilidad inicial si ciertas librerías viejas solo retornan u operan con Observables. (Manejable con interoperabilidad `toSignal()`/`toObservable()`).
