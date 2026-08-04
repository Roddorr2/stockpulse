package com.stockpulse.infrastructure.persistence.repository;

import com.stockpulse.infrastructure.persistence.entity.VentaJpaEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SpringDataVentaRepository extends JpaRepository<VentaJpaEntity, UUID>, JpaSpecificationExecutor<VentaJpaEntity> {

    List<VentaJpaEntity> findAllBySucursalIdOrderByFechaDesc(UUID sucursalId);

}
