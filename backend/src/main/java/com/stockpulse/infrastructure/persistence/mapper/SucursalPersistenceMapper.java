package com.stockpulse.infrastructure.persistence.mapper;

import com.stockpulse.domain.model.Sucursal;
import com.stockpulse.infrastructure.persistence.entity.SucursalJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class SucursalPersistenceMapper {

    public Sucursal toDomain(SucursalJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return new Sucursal(
            entity.getId(),
            entity.getNombre(),
            entity.getDireccion()
        );
    }

    public SucursalJpaEntity toEntity(Sucursal domain) {
        if (domain == null) {
            return null;
        }
        return new SucursalJpaEntity(
            domain.getId(),
            domain.getNombre(),
            domain.getDireccion()
        );
    }

}
