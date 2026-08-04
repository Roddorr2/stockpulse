package com.stockpulse.application.dto;

import java.util.UUID;

public record TokenResponseDTO(
    String accessToken,
    String refreshToken,
    String tokenType,
    long expiresInMs,
    UUID usuarioId,
    String email,
    String nombre,
    String rol
) {
}
