# ADR-0003: PrimeNG as UI library

**Status:** Accepted  
**Date:** 2026-03-15

## Context

Supplier Due Diligence requires dense user interfaces, including data tables with configurable paginators, sorting, filtering, and dynamic rendering of asynchronous results in nodal components (e.g., Modals). Developing components like complex tables (data grids) from scratch increases development time.

## Decision

Adopt [PrimeNG](https://primeng.org/) v21+ as the main UI component library.

## Consequences

- **Positive:** PrimeNG contains dozens of highly tested components, including a complete and mature `<p-table>` ideal for the administrative dashboard-like structure of this system.
- **Negative:** There may be coupling to PrimeNG; we must abstract the heaviest parts or limit ourselves to the least dependent code possible if we need to drastically redesign in the future.
