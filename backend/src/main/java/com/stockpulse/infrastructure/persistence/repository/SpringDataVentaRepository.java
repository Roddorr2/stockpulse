package com.stockpulse.infrastructure.persistence.repository;

import com.stockpulse.infrastructure.persistence.entity.VentaJpaEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataVentaRepository extends JpaRepository<VentaJpaEntity, UUID> {

    List<VentaJpaEntity> findAllBySucursalIdOrderByFechaDesc(UUID sucursalId);

}
