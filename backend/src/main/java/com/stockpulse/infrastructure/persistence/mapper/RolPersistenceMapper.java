package com.stockpulse.infrastructure.persistence.mapper;

import com.stockpulse.domain.model.Rol;
import com.stockpulse.infrastructure.persistence.entity.RolJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class RolPersistenceMapper {

    public RolJpaEntity toEntity(Rol domain) {
        if (domain == null) {
            return null;
        }
        return new RolJpaEntity(domain.getId(), domain.getNombre());
    }

    public Rol toDomain(RolJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return new Rol(entity.getId(), entity.getNombre());
    }

}
