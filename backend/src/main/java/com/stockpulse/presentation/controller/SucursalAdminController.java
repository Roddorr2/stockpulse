package com.stockpulse.presentation.controller;

import com.stockpulse.application.dto.SucursalRequestDTO;
import com.stockpulse.application.usecase.GestionarSucursalUseCase;
import com.stockpulse.domain.model.Sucursal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/branches")
@Tag(name = "Administración de Sucursales", description = "Endpoints para la gestión de sucursales por administradores")
@PreAuthorize("hasRole('ADMIN')")
public class SucursalAdminController {

    private final GestionarSucursalUseCase gestionarSucursalUseCase;

    public SucursalAdminController(GestionarSucursalUseCase gestionarSucursalUseCase) {
        this.gestionarSucursalUseCase = gestionarSucursalUseCase;
    }

    @Operation(summary = "Crear una nueva sucursal")
    @PostMapping
    public ResponseEntity<Sucursal> crearSucursal(@RequestBody SucursalRequestDTO dto) {
        Sucursal sucursal = gestionarSucursalUseCase.crearSucursal(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(sucursal);
    }

    @Operation(summary = "Actualizar una sucursal existente")
    @PutMapping("/{id}")
    public ResponseEntity<Sucursal> actualizarSucursal(@PathVariable UUID id, @RequestBody SucursalRequestDTO dto) {
        Sucursal sucursal = gestionarSucursalUseCase.actualizarSucursal(id, dto);
        return ResponseEntity.ok(sucursal);
    }
}
