package com.stockpulse.infrastructure.persistence.adapter;

import com.stockpulse.domain.model.Rol;
import com.stockpulse.domain.repository.RolRepository;
import com.stockpulse.infrastructure.persistence.entity.RolJpaEntity;
import com.stockpulse.infrastructure.persistence.mapper.RolPersistenceMapper;
import com.stockpulse.infrastructure.persistence.repository.SpringDataRolRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class RolPersistenceAdapter implements RolRepository {

    private final SpringDataRolRepository repository;
    private final RolPersistenceMapper mapper;

    public RolPersistenceAdapter(SpringDataRolRepository repository, RolPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Rol> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Rol> findByNombre(String nombre) {
        return repository.findByNombre(nombre).map(mapper::toDomain);
    }

    @Override
    public Rol save(Rol rol) {
        RolJpaEntity entity = mapper.toEntity(rol);
        RolJpaEntity savedEntity = repository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public List<Rol> findAll() {
        return repository.findAll().stream().map(mapper::toDomain).toList();
    }

}
