package com.stockpulse.presentation.controller;

import com.stockpulse.application.dto.LoginRequestDTO;
import com.stockpulse.application.dto.RefreshTokenRequestDTO;
import com.stockpulse.application.dto.TokenResponseDTO;
import com.stockpulse.application.usecase.AutenticarUsuarioUseCase;
import com.stockpulse.application.usecase.RefrescarTokenUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Autenticación y Sesiones (JWT)", description = "Endpoints para inicio de sesión y renovación de tokens de acceso")
public class AuthController {

    private final AutenticarUsuarioUseCase autenticarUsuarioUseCase;
    private final RefrescarTokenUseCase refrescarTokenUseCase;

    public AuthController(AutenticarUsuarioUseCase autenticarUsuarioUseCase,
                          RefrescarTokenUseCase refrescarTokenUseCase) {
        this.autenticarUsuarioUseCase = autenticarUsuarioUseCase;
        this.refrescarTokenUseCase = refrescarTokenUseCase;
    }

    @Operation(summary = "Iniciar sesión y obtener token de acceso JWT")
    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        TokenResponseDTO response = autenticarUsuarioUseCase.ejecutar(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Refrescar token de acceso mediante un refresh token válido")
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponseDTO> refresh(@Valid @RequestBody RefreshTokenRequestDTO request) {
        TokenResponseDTO response = refrescarTokenUseCase.ejecutar(request);
        return ResponseEntity.ok(response);
    }

}
