package com.stockpulse.presentation.controller;

import com.stockpulse.application.dto.FiltroVentasDTO;
import com.stockpulse.application.dto.RegistrarVentaRequestDTO;
import com.stockpulse.application.dto.VentaResponseDTO;
import com.stockpulse.application.usecase.ConsultarHistorialVentasUseCase;
import com.stockpulse.application.usecase.RegistrarVentaUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/sales")
@Tag(name = "Ventas", description = "Endpoints para el registro transaccional de ventas y control de inventario")
public class VentaController {

    private final RegistrarVentaUseCase registrarVentaUseCase;
    private final com.stockpulse.application.usecase.ConsultarHistorialVentasUseCase consultarHistorialVentasUseCase;

    public VentaController(RegistrarVentaUseCase registrarVentaUseCase, ConsultarHistorialVentasUseCase consultarHistorialVentasUseCase) {
        this.registrarVentaUseCase = registrarVentaUseCase;
        this.consultarHistorialVentasUseCase = consultarHistorialVentasUseCase;
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

    @Operation(summary = "Consultar el historial de ventas filtrado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Historial consultado con éxito")
    })
    @GetMapping
    @PreAuthorize("hasAnyRole('CAJERO', 'ADMIN', 'ENCARGADO_SUCURSAL')")
    public ResponseEntity<List<VentaResponseDTO>> getHistorialVentas(
            @RequestParam(required = false) UUID sucursalId,
            @RequestParam(required = false) UUID productoId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        
        FiltroVentasDTO filtro = new FiltroVentasDTO(sucursalId, productoId, fechaInicio, fechaFin);
        List<VentaResponseDTO> response = consultarHistorialVentasUseCase.ejecutar(filtro);
        return ResponseEntity.ok(response);
    }

}
