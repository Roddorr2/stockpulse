package com.stockpulse.application.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ItemVentaResponseDTO(
    UUID productoId,
    String skuProducto,
    String nombreProducto,
    int cantidad,
    BigDecimal precioUnitario,
    BigDecimal subtotal
) {
}
