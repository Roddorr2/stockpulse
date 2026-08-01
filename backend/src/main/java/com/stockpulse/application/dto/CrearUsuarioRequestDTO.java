package com.stockpulse.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CrearUsuarioRequestDTO(
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    String email,

    @NotBlank(message = "La contraseña es obligatoria")
    String password,

    @NotBlank(message = "El nombre es obligatorio")
    String nombre,

    @NotNull(message = "El ID de rol es obligatorio")
    UUID rolId
) {
}
