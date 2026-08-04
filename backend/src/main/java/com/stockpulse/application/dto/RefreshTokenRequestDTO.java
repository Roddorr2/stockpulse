package com.stockpulse.application.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequestDTO(
    @NotBlank(message = "El refresh token no puede estar vacío")
    String refreshToken
) {
}
