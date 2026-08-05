package com.stockpulse.application.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record StockResponseDTO(
    UUID id,
    UUID productoId,
    String skuProducto,
    String nombreProducto,
    BigDecimal precioProducto,
    UUID sucursalId,
    String nombreSucursal,
    int cantidad,
    int stockMinimo,
    Long version,
    boolean productoActivo
) {
}
