package com.stockpulse.application.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class TransferirStockRequestDTO {

    @NotNull(message = "El ID del producto es obligatorio")
    private UUID productoId;

    @NotNull(message = "El ID de la sucursal de origen es obligatorio")
    private UUID sucursalOrigenId;

    @NotNull(message = "El ID de la sucursal de destino es obligatorio")
    private UUID sucursalDestinoId;

    @Min(value = 1, message = "La cantidad a transferir debe ser al menos 1")
    private int cantidad;

    @NotNull(message = "El ID del usuario es obligatorio")
    private UUID usuarioId;

    public TransferirStockRequestDTO() {
    }

    public TransferirStockRequestDTO(UUID productoId, UUID sucursalOrigenId, UUID sucursalDestinoId,
                                    int cantidad, UUID usuarioId) {
        this.productoId = productoId;
        this.sucursalOrigenId = sucursalOrigenId;
        this.sucursalDestinoId = sucursalDestinoId;
        this.cantidad = cantidad;
        this.usuarioId = usuarioId;
    }

    public UUID getProductoId() {
        return productoId;
    }

    public void setProductoId(UUID productoId) {
        this.productoId = productoId;
    }

    public UUID getSucursalOrigenId() {
        return sucursalOrigenId;
    }

    public void setSucursalOrigenId(UUID sucursalOrigenId) {
        this.sucursalOrigenId = sucursalOrigenId;
    }

    public UUID getSucursalDestinoId() {
        return sucursalDestinoId;
    }

    public void setSucursalDestinoId(UUID sucursalDestinoId) {
        this.sucursalDestinoId = sucursalDestinoId;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public UUID getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(UUID usuarioId) {
        this.usuarioId = usuarioId;
    }

}
