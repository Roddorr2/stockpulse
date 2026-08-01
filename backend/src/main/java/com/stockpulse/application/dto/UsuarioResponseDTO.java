package com.stockpulse.application.dto;

import java.util.UUID;

public record UsuarioResponseDTO(
    UUID id,
    String email,
    String nombre,
    UUID rolId
) {
}
