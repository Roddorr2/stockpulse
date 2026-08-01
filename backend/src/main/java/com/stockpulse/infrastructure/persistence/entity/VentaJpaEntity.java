package com.stockpulse.infrastructure.persistence.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ventas")
public class VentaJpaEntity {

    @Id
    private UUID id;

    @Column(name = "sucursal_id", nullable = false)
    private UUID sucursalId;

    @Column(name = "usuario_id", nullable = false)
    private UUID usuarioId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleVentaJpaEntity> detalles = new ArrayList<>();

    public VentaJpaEntity() {
    }

    public VentaJpaEntity(UUID id, UUID sucursalId, UUID usuarioId, BigDecimal total, LocalDateTime fecha) {
        this.id = id;
        this.sucursalId = sucursalId;
        this.usuarioId = usuarioId;
        this.total = total;
        this.fecha = fecha;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getSucursalId() {
        return sucursalId;
    }

    public void setSucursalId(UUID sucursalId) {
        this.sucursalId = sucursalId;
    }

    public UUID getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(UUID usuarioId) {
        this.usuarioId = usuarioId;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public List<DetalleVentaJpaEntity> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleVentaJpaEntity> detalles) {
        this.detalles = detalles;
    }

    public void addDetalle(DetalleVentaJpaEntity detalle) {
        detalles.add(detalle);
        detalle.setVenta(this);
    }

}
