package com.stockpulse.application.dto;

import java.math.BigDecimal;
import java.util.List;

public record ReporteStockTotalDTO(
    List<ItemReporteStockDTO> items,
    BigDecimal valorGlobalInmovilizado
) {
}
