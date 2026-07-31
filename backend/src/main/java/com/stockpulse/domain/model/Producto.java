package com.stockpulse.domain.model;

import java.math.BigDecimal;
import java.util.UUID;

public class Producto {

    private UUID id;
    private String sku;
    private String nombre;
    private BigDecimal precio;
    private int stockMinimo;

    public Producto() {
    }

    public Producto(UUID id, String sku, String nombre, BigDecimal precio, int stockMinimo) {
        this.id = id;
        this.sku = sku;
        this.nombre = nombre;
        this.precio = precio;
        this.stockMinimo = stockMinimo;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public int getStockMinimo() {
        return stockMinimo;
    }

    public void setStockMinimo(int stockMinimo) {
        this.stockMinimo = stockMinimo;
    }

}
