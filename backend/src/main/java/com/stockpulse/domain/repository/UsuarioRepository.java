package com.stockpulse.domain.repository;

import com.stockpulse.domain.model.Usuario;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository {

    List<Usuario> findAll();

    Optional<Usuario> findById(UUID id);

    Optional<Usuario> findByEmail(String email);

    Usuario save(Usuario usuario);

}
