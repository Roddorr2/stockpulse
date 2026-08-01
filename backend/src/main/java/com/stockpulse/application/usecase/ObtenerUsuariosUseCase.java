package com.stockpulse.application.usecase;

import com.stockpulse.application.dto.UsuarioResponseDTO;
import com.stockpulse.domain.repository.UsuarioRepository;
import java.util.List;

public class ObtenerUsuariosUseCase {

    private final UsuarioRepository usuarioRepository;

    public ObtenerUsuariosUseCase(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<UsuarioResponseDTO> ejecutar() {
        return usuarioRepository.findAll().stream()
            .map(u -> new UsuarioResponseDTO(u.getId(), u.getEmail(), u.getNombre(), u.getRolId()))
            .toList();
    }

}
