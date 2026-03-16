# ADR-0001: Standalone Components (No NgModules)

**Status:** Accepted  
**Date:** 2026-03-15

## Context

Historically, Angular used the concept of `NgModules` to group and compile components, directives, and pipes, as well as configure dependency injection. As versions progressed, Angular introduced Standalone components to simplify application creation by bypassing the need for modules. In Angular 20+, `standalone: true` became the default.

## Decision

The project will use components, directives, and pipes in a 100% *standalone* manner. The use of `@NgModule` is not permitted.

## Consequences

- **Positive:** Reduced cognitive load by eliminating modules; the dependency injection tree and component imports are direct. Enhances lazy loading by making it component-by-component using simplified route control.
- **Negative:** Forces explicit importation of template dependencies (`imports: [...]`) directly in the decorator of the component where they are needed.
