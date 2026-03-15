# ADR-0001: Componentes Standalone (Sin NgModules)

**Estado:** Aceptado  
**Fecha:** 2026-03-15

## Contexto

Históricamente, Angular utilizó el concepto de `NgModules` para agrupar y compilar componentes, directivas y pipes, además de configurar inyección de dependencias. Con el paso de las versiones, Angular introdujo los componentes Standalone para simplificar la creación de aplicaciones omitiendo la necesidad de módulos. En Angular 20+, `standalone: true` se convirtió en el valor predeterminado.

## Decisión

El proyecto utilizará componentes, directivas y pipes de forma 100% *standalone*. No se permite el uso de `@NgModule`.

## Consecuencias

- **Positivas:** Reducción de la carga cognitiva al eliminar los módulos; el árbol de inyección y las importaciones de componentes son directas. Mejora el lazy loading al hacerlo componente a componente usando control de rutas simplificado.
- **Negativas:** Obliga a importar explícitamente las dependencias de plantillas (`imports: [...]`) directamente en el decorador del componente en el que se necesite.
