package com.stockpulse.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record LowStockAlertDTO(
    UUID productoId,
    String skuProducto,
    String nombreProducto,
    UUID sucursalId,
    String nombreSucursal,
    int stockActual,
    int stockMinimo,
    String mensaje,
    LocalDateTime timestamp
) {
}
