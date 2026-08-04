package com.stockpulse.presentation.controller;

import com.stockpulse.application.dto.ReporteStockTotalDTO;
import com.stockpulse.application.dto.StockResponseDTO;
import com.stockpulse.application.usecase.GenerarReporteStockUseCase;
import com.stockpulse.application.usecase.ObtenerMatrizStockUseCase;
import com.stockpulse.infrastructure.persistence.entity.ProductoJpaEntity;
import com.stockpulse.infrastructure.persistence.entity.SucursalJpaEntity;
import com.stockpulse.infrastructure.persistence.repository.SpringDataProductoRepository;
import com.stockpulse.infrastructure.persistence.repository.SpringDataSucursalRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Consultas de Inventario y Catálogo", description = "Endpoints para obtener la matriz de existencias, productos y sucursales")
public class StockQueryController {

    private final ObtenerMatrizStockUseCase obtenerMatrizStockUseCase;
    private final GenerarReporteStockUseCase generarReporteStockUseCase;
    private final SpringDataProductoRepository productoRepository;
    private final SpringDataSucursalRepository sucursalRepository;

    public StockQueryController(ObtenerMatrizStockUseCase obtenerMatrizStockUseCase,
                                GenerarReporteStockUseCase generarReporteStockUseCase,
                                SpringDataProductoRepository productoRepository,
                                SpringDataSucursalRepository sucursalRepository) {
        this.obtenerMatrizStockUseCase = obtenerMatrizStockUseCase;
        this.generarReporteStockUseCase = generarReporteStockUseCase;
        this.productoRepository = productoRepository;
        this.sucursalRepository = sucursalRepository;
    }

    @Operation(summary = "Obtener matriz completa de stock por sucursal")
    @GetMapping("/stock")
    public ResponseEntity<List<StockResponseDTO>> obtenerMatrizStock() {
        return ResponseEntity.ok(obtenerMatrizStockUseCase.ejecutar());
    }

    @Operation(summary = "Obtener reporte agregado de stock total y valor inmovilizado")
    @GetMapping("/stock/report")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO_SUCURSAL')")
    public ResponseEntity<ReporteStockTotalDTO> getReporteStock(
            @RequestParam(required = false) UUID sucursalId) {
        return ResponseEntity.ok(generarReporteStockUseCase.ejecutar(sucursalId));
    }

    @Operation(summary = "Obtener lista de productos del catálogo")
    @GetMapping("/products")
    public ResponseEntity<List<ProductoJpaEntity>> obtenerProductos() {
        return ResponseEntity.ok(productoRepository.findAll());
    }

    @Operation(summary = "Obtener lista de sucursales activas")
    @GetMapping("/branches")
    public ResponseEntity<List<SucursalJpaEntity>> obtenerSucursales() {
        return ResponseEntity.ok(sucursalRepository.findAll());
    }

}
