package com.stockpulse.infrastructure.persistence.repository;

import com.stockpulse.infrastructure.persistence.entity.ProductoJpaEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SpringDataProductoRepository extends JpaRepository<ProductoJpaEntity, UUID> {
    
    @Query("SELECT p FROM ProductoJpaEntity p WHERE " +
           "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.sku) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<ProductoJpaEntity> searchByKeyword(@Param("keyword") String keyword);
    
}
