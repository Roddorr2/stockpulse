package com.stockpulse.infrastructure.persistence.repository;

import com.stockpulse.StockPulseApplication;
import com.stockpulse.infrastructure.persistence.entity.ProductoJpaEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = StockPulseApplication.class)
@Testcontainers
@ActiveProfiles("test")
class SpringDataProductoRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
        .withDatabaseName("stockpulse_test_db")
        .withUsername("test_user")
        .withPassword("test_pass");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.enabled", () -> "true");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "none");
    }

    @Autowired
    private SpringDataProductoRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void findByActivoTrue_debeRetornarSoloProductosActivos() {
        // Arrange
        ProductoJpaEntity activo = new ProductoJpaEntity(UUID.randomUUID(), "ACT-123", "Producto Activo", BigDecimal.TEN, 5, true);
        ProductoJpaEntity inactivo = new ProductoJpaEntity(UUID.randomUUID(), "INACT-123", "Producto Inactivo", BigDecimal.TEN, 5, false);

        repository.save(activo);
        repository.save(inactivo);

        // Act
        List<ProductoJpaEntity> result = repository.findByActivoTrue();

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getSku()).isEqualTo("ACT-123");
    }
}
