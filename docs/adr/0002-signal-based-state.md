# ADR-0002: Signals for component state

**Status:** Accepted  
**Date:** 2026-03-15

## Context

Local asynchronous state in Angular previously typically relied on `RxJS` (heavy use of `BehaviorSubject`, the `async` pipe in views, etc). In modern versions, Angular supports `Signals` which provide synchronous, fine-grained, and automatically trackable reactivity.

## Decision

We will adopt `Signals` instead of `RxJS` for internal and user interface state within components and services that do not require constant manipulation of data streams over time. `RxJS` will be relegated primarily to wrapping pure `HttpClient` requests.

Applied rules:
- Mutations will use `set()` or `update()` (never `mutate()`).
- Derived states will use `computed()`.
- Component I/O streams will use `input()`, `output()`, `model()`.

## Consequences

- **Positive:** Optimal change detection without the strict need to understand `zone.js`. Drastic simplification of templates and local data lifecycle without unsubscribing dependencies.
- **Negative:** Lower initial interoperability if certain old libraries only return or operate with Observables. (Manageable with `toSignal()`/`toObservable()` interoperability).
