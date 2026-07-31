package com.stockpulse.infrastructure.persistence.adapter;

import com.stockpulse.domain.model.Sucursal;
import com.stockpulse.domain.repository.SucursalRepository;
import com.stockpulse.infrastructure.persistence.entity.SucursalJpaEntity;
import com.stockpulse.infrastructure.persistence.mapper.SucursalPersistenceMapper;
import com.stockpulse.infrastructure.persistence.repository.SpringDataSucursalRepository;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class SucursalPersistenceAdapter implements SucursalRepository {

    private final SpringDataSucursalRepository repository;
    private final SucursalPersistenceMapper mapper;

    public SucursalPersistenceAdapter(SpringDataSucursalRepository repository, SucursalPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Sucursal> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Sucursal save(Sucursal sucursal) {
        SucursalJpaEntity entity = mapper.toEntity(sucursal);
        SucursalJpaEntity savedEntity = repository.save(entity);
        return mapper.toDomain(savedEntity);
    }

}
