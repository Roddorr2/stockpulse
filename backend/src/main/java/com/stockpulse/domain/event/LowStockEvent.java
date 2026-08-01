package com.stockpulse.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

public record LowStockEvent(
    UUID productoId,
    String skuProducto,
    String nombreProducto,
    UUID sucursalId,
    String nombreSucursal,
    int stockActual,
    int stockMinimo,
    LocalDateTime fecha
) {
}
