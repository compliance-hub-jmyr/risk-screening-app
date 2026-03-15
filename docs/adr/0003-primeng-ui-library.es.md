# ADR-0003: PrimeNG como librería de UI

**Estado:** Aceptado  
**Fecha:** 2026-03-15

## Contexto

Debida Diligencia de Proveedores requiere interfaces de usuario densas, incluyendo tablas de datos con paginadores configurables, ordenamiento, filtrado y renderizado dinámico de resultados asíncronos en componentes nodales (ej. Modales). Desarrollar componentes como tablas complejas (data grids) desde cero incrementa el tiempo de desarrollo.

## Decisión

Adoptar [PrimeNG](https://primeng.org/) v21+ como la principal biblioteca de componentes de UI.

## Consecuencias

- **Positivas:** PrimeNG contiene docenas de componentes altamente comprobados, entre ellos un `<p-table>` completo y maduro ideal para la estructura tipo dashboard administrativo de este sistema.
- **Negativas:** Puede haber acoplamiento a PrimeNG; debemos abstraer lo más pesado o limitarnos al menor código dependiente posible si a futuro necesitamos rediseñar drásticamente.
