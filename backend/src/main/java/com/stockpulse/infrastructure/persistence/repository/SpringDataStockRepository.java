package com.stockpulse.infrastructure.persistence.repository;

import com.stockpulse.infrastructure.persistence.entity.StockJpaEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataStockRepository extends JpaRepository<StockJpaEntity, UUID> {

    Optional<StockJpaEntity> findByProductoIdAndSucursalId(UUID productoId, UUID sucursalId);

}
