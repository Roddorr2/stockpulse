package com.stockpulse.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record VentaResponseDTO(
    UUID id,
    UUID sucursalId,
    UUID usuarioId,
    BigDecimal total,
    LocalDateTime fecha,
    List<ItemVentaResponseDTO> items
) {
}
