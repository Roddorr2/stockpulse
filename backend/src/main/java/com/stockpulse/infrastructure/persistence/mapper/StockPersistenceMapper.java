package com.stockpulse.infrastructure.persistence.mapper;

import com.stockpulse.domain.model.Stock;
import com.stockpulse.infrastructure.persistence.entity.StockJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class StockPersistenceMapper {

    public Stock toDomain(StockJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return new Stock(
            entity.getId(),
            entity.getProductoId(),
            entity.getSucursalId(),
            entity.getCantidad(),
            entity.getVersion()
        );
    }

    public StockJpaEntity toEntity(Stock domain) {
        if (domain == null) {
            return null;
        }
        return new StockJpaEntity(
            domain.getId(),
            domain.getProductoId(),
            domain.getSucursalId(),
            domain.getCantidad(),
            domain.getVersion()
        );
    }

}
