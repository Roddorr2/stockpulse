package com.stockpulse.infrastructure.persistence.mapper;

import com.stockpulse.domain.model.Producto;
import com.stockpulse.infrastructure.persistence.entity.ProductoJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class ProductoPersistenceMapper {

    public Producto toDomain(ProductoJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return new Producto(
            entity.getId(),
            entity.getSku(),
            entity.getNombre(),
            entity.getPrecio(),
            entity.getStockMinimo(),
            entity.isActivo()
        );
    }

    public ProductoJpaEntity toEntity(Producto domain) {
        if (domain == null) {
            return null;
        }
        return new ProductoJpaEntity(
            domain.getId(),
            domain.getSku(),
            domain.getNombre(),
            domain.getPrecio(),
            domain.getStockMinimo(),
            domain.isActivo()
        );
    }

}
