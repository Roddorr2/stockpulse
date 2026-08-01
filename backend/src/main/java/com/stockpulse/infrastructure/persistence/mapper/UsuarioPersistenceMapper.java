package com.stockpulse.infrastructure.persistence.mapper;

import com.stockpulse.domain.model.Usuario;
import com.stockpulse.infrastructure.persistence.entity.UsuarioJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class UsuarioPersistenceMapper {

    private final RolPersistenceMapper rolMapper;

    public UsuarioPersistenceMapper(RolPersistenceMapper rolMapper) {
        this.rolMapper = rolMapper;
    }

    public Usuario toDomain(UsuarioJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return new Usuario(
            entity.getId(),
            entity.getEmail(),
            entity.getPasswordHash(),
            entity.getNombre(),
            rolMapper.toDomain(entity.getRol())
        );
    }

    public UsuarioJpaEntity toEntity(Usuario domain) {
        if (domain == null) {
            return null;
        }
        return new UsuarioJpaEntity(
            domain.getId(),
            domain.getEmail(),
            domain.getPasswordHash(),
            domain.getNombre(),
            rolMapper.toEntity(domain.getRol())
        );
    }

}
