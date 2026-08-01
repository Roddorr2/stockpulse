# Historias de Usuario — StockPulse

Formato: `Como <rol>, quiero <acción>, para <beneficio>`. Criterios de aceptación en Gherkin (Given/When/Then). Estimación en puntos de historia (Fibonacci: 1,2,3,5,8).

---

### US-01 — Registrar una venta 🟢 (COMPLETADO)
**Como** Cajero, **quiero** registrar la venta de uno o más productos, **para** descontar el stock automáticamente y emitir el comprobante.
**Prioridad:** Must · **Estimación:** 5 · **Estado:** 🟢 COMPLETADO (`POST /api/v1/sales`)

```gherkin
Escenario: Venta exitosa con stock disponible
  Dado que el producto "Mouse Inalámbrico" tiene 10 unidades en Sucursal 1
  Cuando el cajero registra una venta de 2 unidades
  Entonces el stock del producto en Sucursal 1 queda en 8 unidades
  Y la venta queda registrada con su detalle y total

Escenario: Venta rechazada por stock insuficiente
  Dado que el producto "Mouse Inalámbrico" tiene 1 unidad en Sucursal 1
  Cuando el cajero intenta registrar una venta de 2 unidades
  Entonces el sistema responde con error 422 Unprocessable Entity y no se modifica el stock
```

---

### US-02 — Prevenir sobreventa en concurrencia 🟢 (COMPLETADO)
**Como** Administrador, **quiero** que el sistema nunca permita vender más stock del disponible aunque dos cajeros vendan al mismo tiempo, **para** evitar descuadres de inventario.
**Prioridad:** Must · **Estimación:** 8 · **Estado:** 🟢 COMPLETADO (`@Version` Optimistic Locking)

```gherkin
Escenario: Dos ventas simultáneas sobre el último stock
  Dado que el producto "Teclado Mecánico" tiene 1 unidad en Sucursal 1
  Cuando dos cajeros distintos intentan vender 1 unidad al mismo tiempo
  Entonces solo una de las dos ventas se confirma
  Y la otra recibe un error de conflicto (409) indicando reintentar
  Y el stock final del producto es 0, nunca negativo
```

---

### US-03 — Recibir alertas de bajo stock en tiempo real 🟢 (COMPLETADO)
**Como** Encargado de Sucursal, **quiero** recibir una notificación instantánea cuando el stock de un producto cae bajo el mínimo configurado, **para** poder reabastecer antes de quedarme sin inventario.
**Prioridad:** Must · **Estimación:** 5 · **Estado:** 🟢 COMPLETADO (`/topic/stock-alerts/global`)

```gherkin
Escenario: Alerta disparada tras una venta o transferencia
  Dado que el producto "Cable HDMI" tiene stock mínimo configurado en 5
  Y actualmente tiene 6 unidades en Sucursal 1
  Cuando se registra una venta de 2 unidades
  Entonces el dashboard del encargado recibe una alerta vía WebSocket sin recargar la página
```

---

### US-04 — Transferir stock entre sucursales 🟢 (COMPLETADO)
**Como** Encargado de Sucursal, **quiero** transferir stock desde otra sucursal con excedente, **para** cubrir la demanda local sin esperar una nueva compra.
**Prioridad:** Must · **Estimación:** 5 · **Estado:** 🟢 COMPLETADO (`POST /api/v1/stock/transfer`)

```gherkin
Escenario: Transferencia exitosa
  Dado que Sucursal 2 tiene 20 unidades del producto "Monitor 24 pulgadas"
  Cuando el encargado selecciona el producto, las sucursales y el operador mediante desplegables dinámicos (<select>) y transfiere 5 unidades de Sucursal 2 a Sucursal 1
  Entonces Sucursal 2 queda con 15 unidades
  Y Sucursal 1 incrementa su stock en 5 unidades
  Y queda un registro de auditoría con el operador seleccionado y la fecha

Escenario: Transferencia rechazada por validaciones en cliente
  Dado que el encargado abre la modal de transferencia
  Cuando selecciona la misma sucursal en origen y destino, o especifica una cantidad superior al stock disponible en origen
  Entonces la interfaz deshabilita la confirmación y muestra una alerta indicando la restricción antes de enviar la petición al backend

Escenario: Transferencia rechazada por stock insuficiente en origen
  Dado que Sucursal 2 tiene solo 3 unidades del producto "Monitor 24 pulgadas"
  Cuando el encargado intenta transferir 5 unidades
  Entonces el sistema rechaza la operación y no modifica ningún stock
```

---

### US-05 — Autenticación y control de acceso por rol
**Como** usuario del sistema, **quiero** iniciar sesión y que mis permisos dependan de mi rol, **para** que solo pueda realizar las acciones que me corresponden.
**Prioridad:** Must · **Estimación:** 5

```gherkin
Escenario: Cajero intenta crear un producto
  Dado que un usuario con rol CAJERO ha iniciado sesión
  Cuando intenta hacer POST /api/v1/products
  Entonces el sistema responde 403 Forbidden
```

---

### US-06 — Consultar historial de ventas filtrado
**Como** Encargado de Sucursal, **quiero** filtrar el historial de ventas por fecha y producto, **para** analizar el desempeño de mi sucursal.
**Prioridad:** Should · **Estimación:** 3

---

### US-07 — Refrescar sesión sin re-loguear
**Como** usuario del sistema, **quiero** que mi sesión se renueve automáticamente con el refresh token, **para** no tener que iniciar sesión cada 15 minutos.
**Prioridad:** Should · **Estimación:** 3

---

### US-08 — Ver reporte agregado de stock total 🟢 (COMPLETADO)
**Como** Administrador, **quiero** ver el stock total de un producto sumado entre todas las sucursales, **para** decidir compras a nivel de cadena.
**Prioridad:** Could · **Estimación:** 3 · **Estado:** 🟢 COMPLETADO (`GET /api/v1/stock`)