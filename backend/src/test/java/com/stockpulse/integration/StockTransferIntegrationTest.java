package com.stockpulse.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stockpulse.StockPulseApplication;
import com.stockpulse.application.dto.TransferirStockRequestDTO;
import com.stockpulse.infrastructure.persistence.entity.ProductoJpaEntity;
import com.stockpulse.infrastructure.persistence.entity.StockJpaEntity;
import com.stockpulse.infrastructure.persistence.entity.SucursalJpaEntity;
import com.stockpulse.infrastructure.persistence.repository.SpringDataProductoRepository;
import com.stockpulse.infrastructure.persistence.repository.SpringDataStockRepository;
import com.stockpulse.infrastructure.persistence.repository.SpringDataSucursalRepository;
import com.stockpulse.infrastructure.persistence.repository.SpringDataTransferenciaStockRepository;
import com.stockpulse.infrastructure.persistence.repository.SpringDataVentaRepository;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(classes = StockPulseApplication.class)
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
class StockTransferIntegrationTest {

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
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SpringDataProductoRepository productoRepository;

    @Autowired
    private SpringDataSucursalRepository sucursalRepository;

    @Autowired
    private SpringDataStockRepository stockRepository;

    @Autowired
    private SpringDataTransferenciaStockRepository transferenciaStockRepository;

    @Autowired
    private SpringDataVentaRepository ventaRepository;

    private UUID productoId;
    private UUID sucursalOrigenId;
    private UUID sucursalDestinoId;
    private UUID usuarioId;

    @BeforeEach
    void setUp() {
        stockRepository.deleteAll();
        transferenciaStockRepository.deleteAll();
        ventaRepository.deleteAll();
        productoRepository.deleteAll();
        sucursalRepository.deleteAll();

        productoId = UUID.randomUUID();
        sucursalOrigenId = UUID.randomUUID();
        sucursalDestinoId = UUID.randomUUID();
        usuarioId = UUID.fromString("aaaa1111-aaaa-1111-aaaa-111111111111");

        // Populate database via JPA Repositories
        productoRepository.save(new ProductoJpaEntity(productoId, "SKU-IPHONE", "iPhone 15 Pro", new BigDecimal("999.99"), 5));
        sucursalRepository.save(new SucursalJpaEntity(sucursalOrigenId, "Sucursal Central", "Av. Principal 123"));
        sucursalRepository.save(new SucursalJpaEntity(sucursalDestinoId, "Sucursal Norte", "Calle 45 #12"));

        stockRepository.save(new StockJpaEntity(UUID.randomUUID(), productoId, sucursalOrigenId, 30, 0L));
        stockRepository.save(new StockJpaEntity(UUID.randomUUID(), productoId, sucursalDestinoId, 5, 0L));
    }

    @Test
    @DisplayName("Integración completa: Transferencia HTTP 200 con Testcontainers y PostgreSQL real")
    void transferirStock_EndpointCompleto_Retorna200YActualizaPostgres() throws Exception {
        TransferirStockRequestDTO request = new TransferirStockRequestDTO(
            productoId, sucursalOrigenId, sucursalDestinoId, 10, usuarioId
        );

        mockMvc.perform(post("/api/v1/stock/transfer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.productoId").value(productoId.toString()))
            .andExpect(jsonPath("$.sucursalOrigenId").value(sucursalOrigenId.toString()))
            .andExpect(jsonPath("$.sucursalDestinoId").value(sucursalDestinoId.toString()))
            .andExpect(jsonPath("$.cantidad").value(10))
            .andExpect(jsonPath("$.stockOrigenRestante").value(20))
            .andExpect(jsonPath("$.stockDestinoActual").value(15));

        // Verify Database Persistence
        StockJpaEntity stockOrigenBD = stockRepository.findByProductoIdAndSucursalId(productoId, sucursalOrigenId).orElseThrow();
        StockJpaEntity stockDestinoBD = stockRepository.findByProductoIdAndSucursalId(productoId, sucursalDestinoId).orElseThrow();

        assertEquals(20, stockOrigenBD.getCantidad());
        assertEquals(15, stockDestinoBD.getCantidad());
        assertEquals(1, transferenciaStockRepository.count());
    }

    @Test
    @DisplayName("Integración completa: Devuelve HTTP 400 cuando el stock es insuficiente en base de datos")
    void transferirStock_StockInsuficiente_Retorna400() throws Exception {
        TransferirStockRequestDTO request = new TransferirStockRequestDTO(
            productoId, sucursalOrigenId, sucursalDestinoId, 500, usuarioId
        );

        mockMvc.perform(post("/api/v1/stock/transfer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Regla de Negocio Violada"))
            .andExpect(jsonPath("$.message").exists());
    }

}
