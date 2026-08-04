package com.stockpulse.infrastructure.persistence.repository;

import com.stockpulse.application.dto.StockResponseDTO;
import com.stockpulse.infrastructure.persistence.entity.StockJpaEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SpringDataStockRepository extends JpaRepository<StockJpaEntity, UUID>, JpaSpecificationExecutor<StockJpaEntity> {

    Optional<StockJpaEntity> findByProductoIdAndSucursalId(UUID productoId, UUID sucursalId);

    @Query("""
        SELECT new com.stockpulse.application.dto.StockResponseDTO(
            s.id, p.id, p.sku, p.nombre, p.precio,
            suc.id, suc.nombre, s.cantidad, p.stockMinimo, s.version
        )
        FROM StockJpaEntity s
        JOIN ProductoJpaEntity p ON s.productoId = p.id
        JOIN SucursalJpaEntity suc ON s.sucursalId = suc.id
        ORDER BY suc.nombre ASC, p.nombre ASC
    """)
    List<StockResponseDTO> findAllWithDetails();

}
