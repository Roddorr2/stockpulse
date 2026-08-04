package com.stockpulse.application.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ItemReporteStockDTO(
    UUID productoId,
    String sku,
    String nombre,
    int cantidadTotal,
    BigDecimal precioBase,
    BigDecimal valorTotalInmovilizado
) {
}
