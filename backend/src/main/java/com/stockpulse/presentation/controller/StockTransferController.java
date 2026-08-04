package com.stockpulse.presentation.controller;

import com.stockpulse.application.dto.TransferenciaStockResponseDTO;
import com.stockpulse.application.dto.TransferirStockRequestDTO;
import com.stockpulse.application.usecase.TransferirStockUseCase;
import com.stockpulse.presentation.exception.ErrorResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/stock")
@Tag(name = "Gestión de Inventario", description = "Endpoints para control y transferencia de existencias entre sucursales")
public class StockTransferController {

    private final TransferirStockUseCase transferirStockUseCase;

    public StockTransferController(TransferirStockUseCase transferirStockUseCase) {
        this.transferirStockUseCase = transferirStockUseCase;
    }

    @Operation(
        summary = "Transferir stock entre sucursales",
        description = "Transfiere atómicamente una cantidad de producto desde una sucursal origen hacia una sucursal destino. Valida stock suficiente y maneja concurrencia optimista."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Transferencia realizada con éxito",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = TransferenciaStockResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Stock insuficiente, sucursales idénticas o payload inválido",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Producto o sucursal de origen no encontrada",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class))
        ),
        @ApiResponse(
            responseCode = "409",
            description = "Conflicto de concurrencia optimista (el stock fue modificado por otra transacción)",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDTO.class))
        )
    })
    @PostMapping("/transfer")
    @PreAuthorize("hasAnyRole('ENCARGADO_SUCURSAL', 'ADMIN')")
    public ResponseEntity<TransferenciaStockResponseDTO> transferirStock(
            @Valid @RequestBody TransferirStockRequestDTO request) {
        TransferenciaStockResponseDTO response = transferirStockUseCase.ejecutar(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
