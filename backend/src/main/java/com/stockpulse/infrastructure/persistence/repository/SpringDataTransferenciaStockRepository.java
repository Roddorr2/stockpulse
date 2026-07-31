package com.stockpulse.infrastructure.persistence.repository;

import com.stockpulse.infrastructure.persistence.entity.TransferenciaStockJpaEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataTransferenciaStockRepository extends JpaRepository<TransferenciaStockJpaEntity, UUID> {
}
