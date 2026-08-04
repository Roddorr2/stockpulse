package com.stockpulse.application.usecase;

import com.stockpulse.application.dto.CrearUsuarioRequestDTO;
import com.stockpulse.application.dto.UsuarioResponseDTO;
import com.stockpulse.domain.exception.ResourceNotFoundException;
import com.stockpulse.domain.model.Rol;
import com.stockpulse.domain.model.Usuario;
import com.stockpulse.domain.repository.RolRepository;
import com.stockpulse.domain.repository.UsuarioRepository;
import java.util.UUID;

public class CrearUsuarioUseCase {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    public CrearUsuarioUseCase(UsuarioRepository usuarioRepository, RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
    }

    public UsuarioResponseDTO ejecutar(CrearUsuarioRequestDTO request) {
        usuarioRepository.findByEmail(request.email()).ifPresent(u -> {
            throw new IllegalArgumentException("Ya existe un usuario registrado con el email: " + request.email());
        });

        Rol rol = rolRepository.findById(request.rolId())
            .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con ID: " + request.rolId()));

        UUID newId = UUID.randomUUID();
        // TODO: En producción inyectar PasswordEncoder real
        String passwordHash = "$2a$10$20NBXeL95sz16jSrMBR7Cu7sKnDJXneuFmnwo7vWacidZYxbVUSsW";

        Usuario usuario = new Usuario(newId, request.email(), passwordHash, request.nombre(), rol);
        Usuario guardado = usuarioRepository.save(usuario);

        return new UsuarioResponseDTO(guardado.getId(), guardado.getEmail(), guardado.getNombre(), guardado.getRolId());
    }

}
