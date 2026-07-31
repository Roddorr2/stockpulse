package com.stockpulse.application.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record TransferirStockRequestDTO(
    @NotNull(message = "El ID del producto es obligatorio")
    UUID productoId,

    @NotNull(message = "El ID de la sucursal de origen es obligatorio")
    UUID sucursalOrigenId,

    @NotNull(message = "El ID de la sucursal de destino es obligatorio")
    UUID sucursalDestinoId,

    @Min(value = 1, message = "La cantidad a transferir debe ser al menos 1")
    int cantidad,

    @NotNull(message = "El ID del usuario es obligatorio")
    UUID usuarioId
) {
}
