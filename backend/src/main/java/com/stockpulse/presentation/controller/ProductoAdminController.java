package com.stockpulse.presentation.controller;

import com.stockpulse.application.dto.ProductoRequestDTO;
import com.stockpulse.application.usecase.GestionarProductoUseCase;
import com.stockpulse.domain.model.Producto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.stockpulse.application.usecase.ConsultarProductosUseCase;

@RestController
@RequestMapping("/api/v1/admin/products")
@Tag(name = "Administración de Productos", description = "Endpoints para la gestión de productos por administradores")
@PreAuthorize("hasRole('ADMIN')")
public class ProductoAdminController {

    private final GestionarProductoUseCase gestionarProductoUseCase;
    private final ConsultarProductosUseCase consultarProductosUseCase;

    public ProductoAdminController(GestionarProductoUseCase gestionarProductoUseCase,
                                   ConsultarProductosUseCase consultarProductosUseCase) {
        this.gestionarProductoUseCase = gestionarProductoUseCase;
        this.consultarProductosUseCase = consultarProductosUseCase;
    }

    @Operation(summary = "Obtener todos los productos (activos e inactivos)")
    @GetMapping
    public ResponseEntity<List<Producto>> obtenerTodosLosProductos(
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(consultarProductosUseCase.ejecutar(q, false));
    }

    @Operation(summary = "Crear un nuevo producto")
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody ProductoRequestDTO dto) {
        Producto producto = gestionarProductoUseCase.crearProducto(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(producto);
    }

    @Operation(summary = "Actualizar un producto existente")
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable UUID id, @RequestBody ProductoRequestDTO dto) {
        Producto producto = gestionarProductoUseCase.actualizarProducto(id, dto);
        return ResponseEntity.ok(producto);
    }

    @Operation(summary = "Desactivar un producto")
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> desactivarProducto(@PathVariable UUID id) {
        gestionarProductoUseCase.desactivarProducto(id);
        return ResponseEntity.noContent().build();
    }
}
