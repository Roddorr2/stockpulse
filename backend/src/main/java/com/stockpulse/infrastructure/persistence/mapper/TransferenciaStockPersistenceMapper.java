package com.stockpulse.infrastructure.persistence.mapper;

import com.stockpulse.domain.model.TransferenciaStock;
import com.stockpulse.infrastructure.persistence.entity.TransferenciaStockJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class TransferenciaStockPersistenceMapper {

    public TransferenciaStock toDomain(TransferenciaStockJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return new TransferenciaStock(
            entity.getId(),
            entity.getProductoId(),
            entity.getSucursalOrigenId(),
            entity.getSucursalDestinoId(),
            entity.getCantidad(),
            entity.getFecha(),
            entity.getUsuarioId()
        );
    }

    public TransferenciaStockJpaEntity toEntity(TransferenciaStock domain) {
        if (domain == null) {
            return null;
        }
        return new TransferenciaStockJpaEntity(
            domain.getId(),
            domain.getProductoId(),
            domain.getSucursalOrigenId(),
            domain.getSucursalDestinoId(),
            domain.getCantidad(),
            domain.getFecha(),
            domain.getUsuarioId()
        );
    }

}
