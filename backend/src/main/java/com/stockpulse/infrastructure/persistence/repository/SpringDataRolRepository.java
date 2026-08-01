package com.stockpulse.infrastructure.persistence.repository;

import com.stockpulse.infrastructure.persistence.entity.RolJpaEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataRolRepository extends JpaRepository<RolJpaEntity, UUID> {

    Optional<RolJpaEntity> findByNombre(String nombre);

}
