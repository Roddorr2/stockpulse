package com.stockpulse.application.dto;

import java.util.List;
import java.util.UUID;

public record RegistrarVentaRequestDTO(
    UUID sucursalId,
    UUID usuarioId,
    List<ItemVentaRequestDTO> items
) {
}
