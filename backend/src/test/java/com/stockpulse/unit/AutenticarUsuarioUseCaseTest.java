package com.stockpulse.unit;

import com.stockpulse.application.dto.LoginRequestDTO;
import com.stockpulse.application.dto.TokenResponseDTO;
import com.stockpulse.application.usecase.AutenticarUsuarioUseCase;
import com.stockpulse.domain.exception.InvalidCredentialsException;
import com.stockpulse.domain.model.Rol;
import com.stockpulse.domain.model.Usuario;
import com.stockpulse.domain.repository.UsuarioRepository;
import com.stockpulse.infrastructure.security.JwtTokenProvider;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AutenticarUsuarioUseCaseTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    private AutenticarUsuarioUseCase useCase;

    private UUID usuarioId;
    private Rol rolAdmin;
    private Usuario usuario;

    @BeforeEach
    void setUp() {
        useCase = new AutenticarUsuarioUseCase(usuarioRepository, passwordEncoder, tokenProvider);
        usuarioId = UUID.randomUUID();
        rolAdmin = new Rol(UUID.randomUUID(), "ADMIN");
        usuario = new Usuario(usuarioId, "admin@stockpulse.com", "$2a$10$hash", "Admin User", rolAdmin);
    }

    @Test
    void autenticar_exito_retornaTokensYDatosUsuario() {
        LoginRequestDTO request = new LoginRequestDTO("admin@stockpulse.com", "password123");

        when(usuarioRepository.findByEmail("admin@stockpulse.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("password123", "$2a$10$hash")).thenReturn(true);
        when(tokenProvider.generarAccessToken(usuarioId, "admin@stockpulse.com", "ADMIN")).thenReturn("mock.access.token");
        when(tokenProvider.generarRefreshToken(usuarioId, "admin@stockpulse.com")).thenReturn("mock.refresh.token");
        when(tokenProvider.getAccessTokenExpirationMs()).thenReturn(900000L);

        TokenResponseDTO response = useCase.ejecutar(request);

        assertNotNull(response);
        assertEquals("mock.access.token", response.accessToken());
        assertEquals("mock.refresh.token", response.refreshToken());
        assertEquals("Bearer", response.tokenType());
        assertEquals("ADMIN", response.rol());
    }

    @Test
    void autenticar_passwordIncorrecta_lanzaExcepcion() {
        LoginRequestDTO request = new LoginRequestDTO("admin@stockpulse.com", "wrongpassword");

        when(usuarioRepository.findByEmail("admin@stockpulse.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("wrongpassword", "$2a$10$hash")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> useCase.ejecutar(request));
    }

}
