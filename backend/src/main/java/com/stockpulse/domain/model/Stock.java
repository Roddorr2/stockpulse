package com.stockpulse.domain.model;

import com.stockpulse.domain.exception.InsufficientStockException;
import com.stockpulse.domain.exception.InvalidTransferQuantityException;
import java.util.UUID;

public class Stock {

    private UUID id;
    private UUID productoId;
    private UUID sucursalId;
    private int cantidad;
    private Long version;

    public Stock() {
    }

    public Stock(UUID id, UUID productoId, UUID sucursalId, int cantidad, Long version) {
        this.id = id;
        this.productoId = productoId;
        this.sucursalId = sucursalId;
        this.cantidad = cantidad;
        this.version = version;
    }

    public void disminuirStock(int cantidadARestar) {
        disminuirStock(cantidadARestar, null);
    }

    public void disminuirStock(int cantidadARestar, String nombreSucursal) {
        if (cantidadARestar <= 0) {
            throw new InvalidTransferQuantityException("La cantidad a transferir debe ser mayor a cero");
        }
        if (this.cantidad < cantidadARestar) {
            String sucursalLabel = (nombreSucursal != null && !nombreSucursal.isBlank())
                ? nombreSucursal
                : this.sucursalId.toString();
            throw new InsufficientStockException(
                String.format("Stock insuficiente en la sucursal %s. Stock disponible: %d, solicitado: %d",
                    sucursalLabel, this.cantidad, cantidadARestar)
            );
        }
        this.cantidad -= cantidadARestar;
    }

    public void aumentarStock(int cantidadAAgregar) {
        if (cantidadAAgregar <= 0) {
            throw new InvalidTransferQuantityException("La cantidad a agregar debe ser mayor a cero");
        }
        this.cantidad += cantidadAAgregar;
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
