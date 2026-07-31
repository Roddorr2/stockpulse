package com.stockpulse.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class TransferenciaStock {

    private UUID id;
    private UUID productoId;
    private UUID sucursalOrigenId;
    private UUID sucursalDestinoId;
    private int cantidad;
    private LocalDateTime fecha;
    private UUID usuarioId;

    public TransferenciaStock() {
    }

    public TransferenciaStock(UUID id, UUID productoId, UUID sucursalOrigenId, UUID sucursalDestinoId,
                              int cantidad, LocalDateTime fecha, UUID usuarioId) {
        this.id = id;
        this.productoId = productoId;
        this.sucursalOrigenId = sucursalOrigenId;
        this.sucursalDestinoId = sucursalDestinoId;
        this.cantidad = cantidad;
        this.fecha = fecha;
        this.usuarioId = usuarioId;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public UUID getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(UUID usuarioId) {
        this.usuarioId = usuarioId;
    }

}
