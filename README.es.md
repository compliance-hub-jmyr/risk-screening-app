# Risk Screening App

[![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?logo=angular)](https://angular.dev/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-21-EF2D5E?logo=primeng)](https://primeng.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)

> Frontend SPA para **debida diligencia automatizada de proveedores** y cruce contra listas internacionales de alto riesgo — OFAC SDN, World Bank Debarred Firms, ICIJ Offshore Leaks.

---

## Tabla de Contenido

- [Descripción General](#descripción-general)
- [Arquitectura](#arquitectura)
- [Estructura del Repositorio](#estructura-del-repositorio)
- [Stack Tecnológico](#stack-tecnológico)
- [Decisiones de Arquitectura (ADRs)](#decisiones-de-arquitectura-adrs)

---

## Descripción General

Aplicación web SPA (Single Page Application) desarrollada en Angular 21 para que oficiales de compliance puedan:
- Registrar, editar y eliminar proveedores (identificación, contacto, facturación, etc.).
- Listar proveedores con ordenamiento y filtros.
- Ejecutar screening automatizado contra listas internacionales de alto riesgo (OFAC, World Bank, Offshore Leaks) desde una ventana emergente.
- Visualizar los resultados de los "hits" retornados por el API mediante tablas dinámicas.

El sistema consume los servicios expuestos por `RiskScreening.API`.

---

## Arquitectura

El frontend sigue una arquitectura basada en **Standalone Components** con una clara separación entre módulos de core, funcionalidades compartidas (Shared) y funcionalidades de negocio (Features). La gestión de estado se realiza a través de **Signals**, la primitiva reactiva nativa de Angular.

---

## Estructura del Repositorio

> Este repositorio (`risk-screening-app`) contiene exclusivamente el frontend en Angular. El backend .NET se encuentra en `risk-screening-api`.

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
|   |   |-- core/                             # Servicios globales, interceptores, guards
|   |   |-- features/                         # Funcionalidades de negocio
|   |   |   |-- auth/                         # Autenticación y Login
|   |   |   |-- screening/                    # Flujo de cruce con listas
|   |   |   `-- suppliers/                    # Gestión de proveedores
|   |   |-- shared/                           # Componentes UI reutilizables, pipes, directivas
|   |   `-- app.component.ts
|   `-- main.ts
|
|-- CHANGELOG.md
|-- CONTRIBUTING.md
`-- README.md
```

---

## Stack Tecnológico

| Capa             | Tecnología             | Versión |
|------------------|------------------------|---------|
| Framework        | Angular                | 21.2.x  |
| Lenguaje         | TypeScript             | 5.x     |
| UI Components    | PrimeNG                | 21.1.3  |
| Formularios      | Angular Reactive Forms | —       |
| State Management | Angular Signals        | —       |
| HTTP             | Angular HttpClient     | —       |

---

## Decisiones de Arquitectura (ADRs)

| ADR                                                          | Decisión                                     | Estado   |
|--------------------------------------------------------------|----------------------------------------------|----------|
| [ADR-0001](./docs/adr/0001-angular-standalone-components.md) | Componentes Standalone (Sin NgModules)       | Accepted |
| [ADR-0002](./docs/adr/0002-signal-based-state.md)            | Signals para manejo de estado en componentes | Accepted |
| [ADR-0003](./docs/adr/0003-primeng-ui-library.md)            | PrimeNG como librería de componentes UI      | Accepted |

---

<p align="center">Desarrollado como entregable para la Prueba Técnica EY — .NET Developer 2026</p>
