package com.stockpulse.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record TransferenciaStockResponseDTO(
    UUID id,
    UUID productoId,
    UUID sucursalOrigenId,
    UUID sucursalDestinoId,
    int cantidad,
    int stockOrigenRestante,
    int stockDestinoActual,
    LocalDateTime fecha,
    UUID usuarioId
) {
}
