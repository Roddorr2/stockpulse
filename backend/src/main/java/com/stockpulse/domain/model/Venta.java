package com.stockpulse.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class Venta {

    private final UUID id;
    private final UUID sucursalId;
    private final UUID usuarioId;
    private final LocalDateTime fecha;
    private final List<DetalleVenta> detalles;
    private final BigDecimal total;

    public Venta(UUID id, UUID sucursalId, UUID usuarioId, LocalDateTime fecha, List<DetalleVenta> detalles) {
        if (detalles == null || detalles.isEmpty()) {
            throw new IllegalArgumentException("Una venta debe tener al menos un detalle de producto");
        }
        this.id = id != null ? id : UUID.randomUUID();
        this.sucursalId = sucursalId;
        this.usuarioId = usuarioId;
        this.fecha = fecha != null ? fecha : LocalDateTime.now();
        this.detalles = new ArrayList<>(detalles);
        this.total = this.detalles.stream()
            .map(DetalleVenta::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public UUID getId() {
        return id;
    }

    public UUID getSucursalId() {
        return sucursalId;
    }

    public UUID getUsuarioId() {
        return usuarioId;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public List<DetalleVenta> getDetalles() {
        return Collections.unmodifiableList(detalles);
    }

    public BigDecimal getTotal() {
        return total;
    }

}
