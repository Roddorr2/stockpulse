# Requerimientos Funcionales — StockPulse

Prioridad según MoSCoW: **M**ust have / **S**hould have / **C**ould have / **W**on't have (este release).

| ID | Requerimiento | Actor | Prioridad | Estado |
|---|---|---|---|---|
| FR-01 | El sistema debe permitir crear, editar, desactivar y buscar productos (SKU, nombre, precio, stock mínimo) | Administrador | Must | Pendiente |
| FR-02 | El sistema debe permitir crear y editar sucursales | Administrador | Must | Pendiente |
| FR-03 | El sistema debe permitir registrar una venta que descuente stock de la sucursal correspondiente | Cajero | Must | 🟢 **COMPLETADO** |
| FR-04 | El sistema debe rechazar una venta si el stock resultante sería negativo, incluso bajo solicitudes concurrentes sobre el mismo producto | Cajero | Must | 🟢 **COMPLETADO** |
| FR-05 | El sistema debe permitir transferir stock de una sucursal a otra, validando que la sucursal origen tenga stock suficiente | Encargado de Sucursal | Must | 🟢 **COMPLETADO** |
| FR-06 | El sistema debe emitir una alerta en tiempo real (WebSocket) cuando el stock de un producto en una sucursal cae bajo su umbral mínimo configurado | Encargado de Sucursal | Must | 🟢 **COMPLETADO** |
| FR-07 | El sistema debe autenticar usuarios mediante JWT y restringir acciones según su rol (`ADMIN`, `ENCARGADO_SUCURSAL`, `CAJERO`) | Todos | Must | Pendiente |
| FR-08 | El sistema debe permitir consultar el historial de ventas filtrado por sucursal, rango de fechas y producto | Encargado / Admin | Should | Pendiente |
| FR-09 | El sistema debe registrar auditoría (usuario, fecha) de cada transferencia de stock | Admin | Should | 🟢 **COMPLETADO** |
| FR-10 | El sistema debe permitir búsqueda paginada y filtrada de productos por nombre, categoría o SKU | Todos los roles autenticados | Should | Pendiente |
| FR-11 | El sistema debe permitir refrescar el token de acceso usando un refresh token válido sin re-loguear | Todos | Should | Pendiente |
| FR-12 | El sistema debe exponer un reporte agregado de stock total por producto a través de todas las sucursales | Admin | Could | 🟢 **COMPLETADO** |
| FR-13 | El sistema debe permitir exportar el historial de ventas a CSV | Admin | Could | Pendiente |
| FR-14 | El sistema debe soportar múltiples canales de notificación de alertas (ej. email) además de WebSocket | — | Won't | Fuera de alcance MVP |

## Reglas de negocio explícitas (no son "features", son invariantes que el dominio debe proteger siempre)

- **RN-01:** El stock de un producto en una sucursal nunca puede ser negativo, sin excepción, incluso bajo carga concurrente.
- **RN-02:** Una transferencia de stock es una operación atómica: si falla el descuento en origen o el incremento en destino, ninguno de los dos se aplica.
- **RN-03:** Solo un `ADMIN` puede crear o desactivar productos y sucursales.
- **RN-04:** Un `CAJERO` solo puede registrar ventas en la sucursal a la que está asignado.
- **RN-05:** El umbral de "bajo stock" es configurable por producto, no un valor global fijo.