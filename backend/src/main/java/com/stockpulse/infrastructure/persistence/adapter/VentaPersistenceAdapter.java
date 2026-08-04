package com.stockpulse.infrastructure.persistence.adapter;

import com.stockpulse.domain.model.Venta;
import com.stockpulse.domain.repository.VentaRepository;
import com.stockpulse.infrastructure.persistence.entity.VentaJpaEntity;
import com.stockpulse.infrastructure.persistence.mapper.VentaPersistenceMapper;
import com.stockpulse.infrastructure.persistence.repository.SpringDataVentaRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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

    @Override
    public List<Venta> findByFiltros(UUID sucursalId, UUID productoId, LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        Specification<VentaJpaEntity> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (sucursalId != null) {
                predicates.add(cb.equal(root.get("sucursalId"), sucursalId));
            }
            if (productoId != null) {
                Join<Object, Object> detalles = root.join("detalles");
                predicates.add(cb.equal(detalles.get("productoId"), productoId));
            }
            if (fechaInicio != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("fecha"), fechaInicio));
            }
            if (fechaFin != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("fecha"), fechaFin));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return repository.findAll(spec, Sort.by(Sort.Direction.DESC, "fecha")).stream()
            .map(mapper::toDomain)
            .toList();
    }

}
