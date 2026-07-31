package com.stockpulse.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;
import java.util.UUID;

@Entity
@Table(name = "stocks", uniqueConstraints = {
    @UniqueConstraint(name = "uk_stock_producto_sucursal", columnNames = {"producto_id", "sucursal_id"})
})
public class StockJpaEntity {

    @Id
    private UUID id;

    @Column(name = "producto_id", nullable = false)
    private UUID productoId;

    @Column(name = "sucursal_id", nullable = false)
    private UUID sucursalId;

    @Column(nullable = false)
    private int cantidad;

    @Version
    @Column(nullable = false)
    private Long version;

    public StockJpaEntity() {
    }

    public StockJpaEntity(UUID id, UUID productoId, UUID sucursalId, int cantidad, Long version) {
        this.id = id;
        this.productoId = productoId;
        this.sucursalId = sucursalId;
        this.cantidad = cantidad;
        this.version = version;
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

    public UUID getSucursalId() {
        return sucursalId;
    }

    public void setSucursalId(UUID sucursalId) {
        this.sucursalId = sucursalId;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

}
