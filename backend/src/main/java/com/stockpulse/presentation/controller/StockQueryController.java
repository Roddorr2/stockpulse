package com.stockpulse.presentation.controller;

import com.stockpulse.application.dto.StockResponseDTO;
import com.stockpulse.application.usecase.ObtenerMatrizStockUseCase;
import com.stockpulse.infrastructure.persistence.entity.ProductoJpaEntity;
import com.stockpulse.infrastructure.persistence.entity.SucursalJpaEntity;
import com.stockpulse.infrastructure.persistence.entity.UsuarioJpaEntity;
import com.stockpulse.infrastructure.persistence.repository.SpringDataProductoRepository;
import com.stockpulse.infrastructure.persistence.repository.SpringDataSucursalRepository;
import com.stockpulse.infrastructure.persistence.repository.SpringDataUsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Consultas de Inventario y Catálogo", description = "Endpoints para obtener la matriz de existencias, productos, sucursales y usuarios")
public class StockQueryController {

    private final ObtenerMatrizStockUseCase obtenerMatrizStockUseCase;
    private final SpringDataProductoRepository productoRepository;
    private final SpringDataSucursalRepository sucursalRepository;
    private final SpringDataUsuarioRepository usuarioRepository;

    public StockQueryController(ObtenerMatrizStockUseCase obtenerMatrizStockUseCase,
                                SpringDataProductoRepository productoRepository,
                                SpringDataSucursalRepository sucursalRepository,
                                SpringDataUsuarioRepository usuarioRepository) {
        this.obtenerMatrizStockUseCase = obtenerMatrizStockUseCase;
        this.productoRepository = productoRepository;
        this.sucursalRepository = sucursalRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Operation(summary = "Obtener matriz completa de stock por sucursal")
    @GetMapping("/stock")
    public ResponseEntity<List<StockResponseDTO>> obtenerMatrizStock() {
        return ResponseEntity.ok(obtenerMatrizStockUseCase.ejecutar());
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

    @Operation(summary = "Obtener lista de usuarios registrados")
    @GetMapping("/users")
    public ResponseEntity<List<UsuarioJpaEntity>> obtenerUsuarios() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

}
