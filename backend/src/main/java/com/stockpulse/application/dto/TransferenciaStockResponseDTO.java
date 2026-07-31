package com.stockpulse.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class TransferenciaStockResponseDTO {

    private UUID id;
    private UUID productoId;
    private UUID sucursalOrigenId;
    private UUID sucursalDestinoId;
    private int cantidad;
    private int stockOrigenRestante;
    private int stockDestinoActual;
    private LocalDateTime fecha;
    private UUID usuarioId;

    public TransferenciaStockResponseDTO() {
    }

    public TransferenciaStockResponseDTO(UUID id, UUID productoId, UUID sucursalOrigenId, UUID sucursalDestinoId,
                                        int cantidad, int stockOrigenRestante, int stockDestinoActual,
                                        LocalDateTime fecha, UUID usuarioId) {
        this.id = id;
        this.productoId = productoId;
        this.sucursalOrigenId = sucursalOrigenId;
        this.sucursalDestinoId = sucursalDestinoId;
        this.cantidad = cantidad;
        this.stockOrigenRestante = stockOrigenRestante;
        this.stockDestinoActual = stockDestinoActual;
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

    public int getStockOrigenRestante() {
        return stockOrigenRestante;
    }

    public void setStockOrigenRestante(int stockOrigenRestante) {
        this.stockOrigenRestante = stockOrigenRestante;
    }

    public int getStockDestinoActual() {
        return stockDestinoActual;
    }

    public void setStockDestinoActual(int stockDestinoActual) {
        this.stockDestinoActual = stockDestinoActual;
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
