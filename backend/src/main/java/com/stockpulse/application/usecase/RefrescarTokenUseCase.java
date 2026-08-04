package com.stockpulse.application.usecase;

import com.stockpulse.application.dto.RefreshTokenRequestDTO;
import com.stockpulse.application.dto.TokenResponseDTO;
import com.stockpulse.domain.exception.ResourceNotFoundException;
import com.stockpulse.domain.model.Usuario;
import com.stockpulse.domain.repository.UsuarioRepository;
import com.stockpulse.infrastructure.security.JwtTokenProvider;

public class RefrescarTokenUseCase {

    private final UsuarioRepository usuarioRepository;
    private final JwtTokenProvider tokenProvider;

    public RefrescarTokenUseCase(UsuarioRepository usuarioRepository, JwtTokenProvider tokenProvider) {
        this.usuarioRepository = usuarioRepository;
        this.tokenProvider = tokenProvider;
    }

    public TokenResponseDTO ejecutar(RefreshTokenRequestDTO request) {
        String refreshToken = request.refreshToken();

        if (!tokenProvider.validarToken(refreshToken) || !"REFRESH".equals(tokenProvider.obtenerTokenType(refreshToken))) {
            throw new IllegalArgumentException("Refresh token inválido o expirado");
        }

        String email = tokenProvider.obtenerEmailDelToken(refreshToken);
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));

        String rolNombre = usuario.getRol() != null ? usuario.getRol().getNombre() : "CAJERO";

        String newAccessToken = tokenProvider.generarAccessToken(usuario.getId(), usuario.getEmail(), rolNombre);
        String newRefreshToken = tokenProvider.generarRefreshToken(usuario.getId(), usuario.getEmail());

        return new TokenResponseDTO(
            newAccessToken,
            newRefreshToken,
            "Bearer",
            tokenProvider.getAccessTokenExpirationMs(),
            usuario.getId(),
            usuario.getEmail(),
            usuario.getNombre(),
            rolNombre
        );
    }

}
