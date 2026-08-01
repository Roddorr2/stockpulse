package com.stockpulse.infrastructure.persistence.adapter;

import com.stockpulse.domain.model.Venta;
import com.stockpulse.domain.repository.VentaRepository;
import com.stockpulse.infrastructure.persistence.entity.VentaJpaEntity;
import com.stockpulse.infrastructure.persistence.mapper.VentaPersistenceMapper;
import com.stockpulse.infrastructure.persistence.repository.SpringDataVentaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class VentaPersistenceAdapter implements VentaRepository {

    private final SpringDataVentaRepository repository;
    private final VentaPersistenceMapper mapper;

    public VentaPersistenceAdapter(SpringDataVentaRepository repository, VentaPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Venta save(Venta venta) {
        VentaJpaEntity entity = mapper.toEntity(venta);
        VentaJpaEntity savedEntity = repository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Venta> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Venta> findAllBySucursalId(UUID sucursalId) {
        return repository.findAllBySucursalIdOrderByFechaDesc(sucursalId).stream()
            .map(mapper::toDomain)
            .toList();
    }

}
