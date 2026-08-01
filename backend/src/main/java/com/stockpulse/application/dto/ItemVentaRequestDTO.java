package com.stockpulse.application.dto;

import java.util.UUID;

public record ItemVentaRequestDTO(
    UUID productoId,
    int cantidad
) {
}
