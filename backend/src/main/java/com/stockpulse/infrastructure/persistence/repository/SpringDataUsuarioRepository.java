package com.stockpulse.infrastructure.persistence.repository;

import com.stockpulse.infrastructure.persistence.entity.UsuarioJpaEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpringDataUsuarioRepository extends JpaRepository<UsuarioJpaEntity, UUID> {
}
