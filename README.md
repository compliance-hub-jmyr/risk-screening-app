# Risk Screening App

[![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?logo=angular)](https://angular.dev/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-21-EF2D5E?logo=primeng)](https://primeng.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)

> Frontend SPA for **automated supplier due diligence** and background checks against international high-risk lists — OFAC SDN, World Bank Debarred Firms, ICIJ Offshore Leaks.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Tech Stack](#tech-stack)
- [Architecture Decision Records (ADRs)](#architecture-decision-records-adrs)

---

## Overview

Single Page Application (SPA) developed in Angular 21 for compliance officers to:
- Register, edit, and delete suppliers (identification, contact, billing, etc.).
- List suppliers with sorting and filtering.
- Run automated screenings against international high-risk lists (OFAC, World Bank, Offshore Leaks) from a popup modal.
- View hit results returned by the API via dynamic tables.

The system consumes the REST API services exposed by `RiskScreening.API`.

---

## Architecture

The frontend follows a **Standalone Components** architecture with a clear separation between core modules, shared capabilities, and business features. State management is performed using **Signals**, Angular's native reactive primitive.

---

## Repository Structure

> This repository (`risk-screening-app`) only contains the Angular frontend. The .NET backend is available at `risk-screening-api`.

```
risk-screening-app/
|-- docs/
|   `-- adr/                                  # Architecture Decision Records
|       |-- 0001-angular-standalone-components.md
|       |-- 0002-signal-based-state.md
|       `-- 0003-primeng-ui-library.md
|
|-- src/
|   |-- app/
|   |   |-- core/                             # Global services, interceptors, guards
|   |   |-- features/                         # Business capabilities
|   |   |   |-- auth/                         # Authentication & Login flow
|   |   |   |-- screening/                    # List screening flow
|   |   |   `-- suppliers/                    # Supplier management
|   |   |-- shared/                           # Reusable UI components, pipes, directives
|   |   `-- app.component.ts
|   `-- main.ts
|
|-- CHANGELOG.md
|-- CONTRIBUTING.md
`-- README.md
```

---

## Tech Stack

| Layer            | Technology             | Version |
|------------------|------------------------|---------|
| Framework        | Angular                | 21.2.x  |
| Language         | TypeScript             | 5.x     |
| UI Components    | PrimeNG                | 21.1.3  |
| Forms            | Angular Reactive Forms | —       |
| State Management | Angular Signals        | —       |
| HTTP             | Angular HttpClient     | —       |

---

## Architecture Decision Records (ADRs)

| ADR                                                          | Decision                             | Status   |
|--------------------------------------------------------------|--------------------------------------|----------|
| [ADR-0001](./docs/adr/0001-angular-standalone-components.md) | Standalone Components (No NgModules) | Accepted |
| [ADR-0002](./docs/adr/0002-signal-based-state.md)            | Signals for component state          | Accepted |
| [ADR-0003](./docs/adr/0003-primeng-ui-library.md)            | PrimeNG as UI component library      | Accepted |

---

<p align="center">Developed as a deliverable for the EY Technical Assessment — .NET Developer 2026</p>
