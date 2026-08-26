package com.stockpulse.infrastructure.persistence.adapter;

import com.stockpulse.domain.model.Producto;
import com.stockpulse.domain.repository.ProductoRepository;
import com.stockpulse.infrastructure.persistence.entity.ProductoJpaEntity;
import com.stockpulse.infrastructure.persistence.mapper.ProductoPersistenceMapper;
import com.stockpulse.infrastructure.persistence.repository.SpringDataProductoRepository;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class ProductoPersistenceAdapter implements ProductoRepository {

    private final SpringDataProductoRepository repository;
    private final ProductoPersistenceMapper mapper;

    public ProductoPersistenceAdapter(SpringDataProductoRepository repository, ProductoPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Producto> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Producto save(Producto producto) {
        ProductoJpaEntity entity = mapper.toEntity(producto);
        ProductoJpaEntity savedEntity = repository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public java.util.List<Producto> findAll() {
        return repository.findAll().stream().map(mapper::toDomain).toList();
    }

    @Override
    public java.util.List<Producto> searchByKeyword(String keyword) {
        return repository.searchByKeyword(keyword).stream().map(mapper::toDomain).toList();
    }

    @Override
    public java.util.List<Producto> findByActivoTrue() {
        return repository.findByActivoTrue().stream().map(mapper::toDomain).toList();
    }

    @Override
    public java.util.List<Producto> searchByKeywordAndActivoTrue(String keyword) {
        return repository.searchByKeywordAndActivoTrue(keyword).stream().map(mapper::toDomain).toList();
    }

}
