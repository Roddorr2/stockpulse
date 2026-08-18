package com.stockpulse.unit;

import com.stockpulse.application.dto.CrearUsuarioRequestDTO;
import com.stockpulse.application.dto.UsuarioResponseDTO;
import com.stockpulse.application.usecase.CrearUsuarioUseCase;
import com.stockpulse.domain.exception.ResourceNotFoundException;
import com.stockpulse.domain.model.Rol;
import com.stockpulse.domain.model.Usuario;
import com.stockpulse.domain.repository.RolRepository;
import com.stockpulse.domain.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CrearUsuarioUseCaseTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private RolRepository rolRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private CrearUsuarioUseCase useCase;

    private UUID rolId;
    private Rol rol;

    @BeforeEach
    void setUp() {
        useCase = new CrearUsuarioUseCase(usuarioRepository, rolRepository, passwordEncoder);
        rolId = UUID.randomUUID();
        rol = new Rol(rolId, "ADMIN");
    }

    @Test
    void ejecutar_exito_creaUsuario() {
        CrearUsuarioRequestDTO request = new CrearUsuarioRequestDTO("test@test.com", "pass", "Test User", rolId);
        
        when(usuarioRepository.findByEmail(request.email())).thenReturn(Optional.empty());
        when(rolRepository.findById(rolId)).thenReturn(Optional.of(rol));
        when(passwordEncoder.encode("pass")).thenReturn("encoded_pass");
        
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(i -> i.getArguments()[0]);

        UsuarioResponseDTO response = useCase.ejecutar(request);

        assertNotNull(response);
        assertEquals("test@test.com", response.email());
        assertEquals("Test User", response.nombre());
        assertEquals(rolId, response.rolId());
        
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void ejecutar_lanzaExcepcion_cuandoEmailYaExiste() {
        CrearUsuarioRequestDTO request = new CrearUsuarioRequestDTO("test@test.com", "pass", "Test User", rolId);
        
        when(usuarioRepository.findByEmail(request.email())).thenReturn(Optional.of(new Usuario(UUID.randomUUID(), "test@test.com", "pass", "Test User", rol)));
        
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> useCase.ejecutar(request));
        assertEquals("Ya existe un usuario registrado con el email: test@test.com", ex.getMessage());
        
        verify(rolRepository, never()).findById(any());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void ejecutar_lanzaExcepcion_cuandoRolNoExiste() {
        CrearUsuarioRequestDTO request = new CrearUsuarioRequestDTO("test@test.com", "pass", "Test User", rolId);
        
        when(usuarioRepository.findByEmail(request.email())).thenReturn(Optional.empty());
        when(rolRepository.findById(rolId)).thenReturn(Optional.empty());
        
        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class, () -> useCase.ejecutar(request));
        assertEquals("Rol no encontrado con ID: " + rolId, ex.getMessage());
        
        verify(usuarioRepository, never()).save(any());
    }
}
