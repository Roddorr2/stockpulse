package com.stockpulse.infrastructure.persistence.adapter;

import com.stockpulse.domain.model.Usuario;
import com.stockpulse.domain.repository.UsuarioRepository;
import com.stockpulse.infrastructure.persistence.entity.UsuarioJpaEntity;
import com.stockpulse.infrastructure.persistence.mapper.UsuarioPersistenceMapper;
import com.stockpulse.infrastructure.persistence.repository.SpringDataUsuarioRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class UsuarioPersistenceAdapter implements UsuarioRepository {

    private final SpringDataUsuarioRepository repository;
    private final UsuarioPersistenceMapper mapper;

    public UsuarioPersistenceAdapter(SpringDataUsuarioRepository repository, UsuarioPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<Usuario> findAll() {
        return repository.findAll().stream()
            .map(mapper::toDomain)
            .toList();
    }

    @Override
    public Optional<Usuario> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return repository.findByEmail(email).map(mapper::toDomain);
    }

    @Override
    public Usuario save(Usuario usuario) {
        UsuarioJpaEntity entity = mapper.toEntity(usuario);
        UsuarioJpaEntity saved = repository.save(entity);
        return mapper.toDomain(saved);
    }

}
