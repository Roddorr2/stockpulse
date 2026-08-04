package com.stockpulse.application.usecase;

import com.stockpulse.application.dto.LoginRequestDTO;
import com.stockpulse.application.dto.TokenResponseDTO;
import com.stockpulse.domain.exception.InvalidCredentialsException;
import com.stockpulse.domain.model.Usuario;
import com.stockpulse.domain.repository.UsuarioRepository;
import com.stockpulse.infrastructure.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;

public class AutenticarUsuarioUseCase {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AutenticarUsuarioUseCase(UsuarioRepository usuarioRepository,
                                   PasswordEncoder passwordEncoder,
                                   JwtTokenProvider tokenProvider) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public TokenResponseDTO ejecutar(LoginRequestDTO request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
            .orElseThrow(() -> new InvalidCredentialsException("Credenciales inválidas: email o contraseña incorrectos"));

        // Validar hash BCrypt
        if (!passwordEncoder.matches(request.password(), usuario.getPasswordHash())) {
            throw new InvalidCredentialsException("Credenciales inválidas: email o contraseña incorrectos");
        }

        String rolNombre = usuario.getRol() != null ? usuario.getRol().getNombre() : "CAJERO";

        String accessToken = tokenProvider.generarAccessToken(usuario.getId(), usuario.getEmail(), rolNombre);
        String refreshToken = tokenProvider.generarRefreshToken(usuario.getId(), usuario.getEmail());

        return new TokenResponseDTO(
            accessToken,
            refreshToken,
            "Bearer",
            tokenProvider.getAccessTokenExpirationMs(),
            usuario.getId(),
            usuario.getEmail(),
            usuario.getNombre(),
            rolNombre
        );
    }

}
