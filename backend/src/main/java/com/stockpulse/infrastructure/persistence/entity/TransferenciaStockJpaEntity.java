package com.stockpulse.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transferencias_stock")
public class TransferenciaStockJpaEntity {

    @Id
    private UUID id;

    @Column(name = "producto_id", nullable = false)
    private UUID productoId;

    @Column(name = "sucursal_origen_id", nullable = false)
    private UUID sucursalOrigenId;

    @Column(name = "sucursal_destino_id", nullable = false)
    private UUID sucursalDestinoId;

    @Column(nullable = false)
    private int cantidad;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(name = "usuario_id", nullable = false)
    private UUID usuarioId;

    public TransferenciaStockJpaEntity() {
    }

    public TransferenciaStockJpaEntity(UUID id, UUID productoId, UUID sucursalOrigenId, UUID sucursalDestinoId,
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
