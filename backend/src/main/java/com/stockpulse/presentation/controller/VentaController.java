package com.stockpulse.presentation.controller;

import com.stockpulse.application.dto.RegistrarVentaRequestDTO;
import com.stockpulse.application.dto.VentaResponseDTO;
import com.stockpulse.application.usecase.RegistrarVentaUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/sales")
@Tag(name = "Ventas", description = "Endpoints para el registro transaccional de ventas y control de inventario")
public class VentaController {

    private final RegistrarVentaUseCase registrarVentaUseCase;

    public VentaController(RegistrarVentaUseCase registrarVentaUseCase) {
        this.registrarVentaUseCase = registrarVentaUseCase;
    }

    @Operation(summary = "Registrar una venta descontando stock automáticamente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Venta registrada exitosamente"),
        @ApiResponse(responseCode = "422", description = "Stock insuficiente en la sucursal seleccionada"),
        @ApiResponse(responseCode = "409", description = "Conflicto de concurrencia optimista al modificar stock"),
        @ApiResponse(responseCode = "404", description = "Producto o sucursal no encontrada")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('CAJERO', 'ADMIN', 'ENCARGADO_SUCURSAL')")
    public ResponseEntity<VentaResponseDTO> registrarVenta(@RequestBody RegistrarVentaRequestDTO request) {
        VentaResponseDTO response = registrarVentaUseCase.ejecutar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
