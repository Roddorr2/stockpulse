package com.stockpulse.application.dto;

import java.math.BigDecimal;

public record ProductoRequestDTO(
    String sku,
    String nombre,
    BigDecimal precio,
    int stockMinimo,
    boolean activo
) {}
