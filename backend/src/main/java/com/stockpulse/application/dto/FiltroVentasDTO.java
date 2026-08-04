package com.stockpulse.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record FiltroVentasDTO(
    UUID sucursalId,
    UUID productoId,
    LocalDateTime fechaInicio,
    LocalDateTime fechaFin
) {
}
