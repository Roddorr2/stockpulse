package com.stockpulse.infrastructure.persistence.mapper;

import com.stockpulse.domain.model.DetalleVenta;
import com.stockpulse.domain.model.Venta;
import com.stockpulse.infrastructure.persistence.entity.DetalleVentaJpaEntity;
import com.stockpulse.infrastructure.persistence.entity.VentaJpaEntity;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class VentaPersistenceMapper {

    public VentaJpaEntity toEntity(Venta domain) {
        if (domain == null) {
            return null;
        }

        VentaJpaEntity entity = new VentaJpaEntity(
            domain.getId(),
            domain.getSucursalId(),
            domain.getUsuarioId(),
            domain.getTotal(),
            domain.getFecha()
        );

        if (domain.getDetalles() != null) {
            for (DetalleVenta d : domain.getDetalles()) {
                DetalleVentaJpaEntity dEntity = new DetalleVentaJpaEntity(
                    d.getId(),
                    entity,
                    d.getProductoId(),
                    d.getCantidad(),
                    d.getPrecioUnitario(),
                    d.getSubtotal()
                );
                entity.addDetalle(dEntity);
            }
        }

        return entity;
    }

    public Venta toDomain(VentaJpaEntity entity) {
        if (entity == null) {
            return null;
        }

        List<DetalleVenta> detalles = entity.getDetalles().stream()
            .map(d -> new DetalleVenta(
                d.getId(),
                d.getProductoId(),
                d.getCantidad(),
                d.getPrecioUnitario()
            ))
            .toList();

        return new Venta(
            entity.getId(),
            entity.getSucursalId(),
            entity.getUsuarioId(),
            entity.getFecha(),
            detalles
        );
    }

}
