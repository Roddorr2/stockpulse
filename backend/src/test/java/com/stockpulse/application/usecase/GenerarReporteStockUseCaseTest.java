package com.stockpulse.application.usecase;

import com.stockpulse.application.dto.ReporteStockTotalDTO;
import com.stockpulse.domain.model.Producto;
import com.stockpulse.domain.model.Stock;
import com.stockpulse.domain.repository.ProductoRepository;
import com.stockpulse.domain.repository.StockRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GenerarReporteStockUseCaseTest {

    private StockRepository stockRepository;
    private ProductoRepository productoRepository;
    private GenerarReporteStockUseCase useCase;

    @BeforeEach
    void setUp() {
        stockRepository = mock(StockRepository.class);
        productoRepository = mock(ProductoRepository.class);
        useCase = new GenerarReporteStockUseCase(stockRepository, productoRepository);
    }

    @Test
    void debeGenerarReporteCorrectamenteAgrupandoStockYSumandoValores() {
        UUID sucursal1 = UUID.randomUUID();
        UUID sucursal2 = UUID.randomUUID();
        UUID productoId1 = UUID.randomUUID();
        UUID productoId2 = UUID.randomUUID();

        // 2 stocks para producto1 (en diferentes sucursales) y 1 stock para producto2
        Stock s1 = new Stock(UUID.randomUUID(), productoId1, sucursal1, 10, 0L);
        Stock s2 = new Stock(UUID.randomUUID(), productoId1, sucursal2, 5, 0L);
        Stock s3 = new Stock(UUID.randomUUID(), productoId2, sucursal1, 20, 0L);

        when(stockRepository.findByFiltros(null)).thenReturn(List.of(s1, s2, s3));

        Producto p1 = new Producto(productoId1, "SKU-1", "Prod 1", BigDecimal.valueOf(100), 5, true);
        Producto p2 = new Producto(productoId2, "SKU-2", "Prod 2", BigDecimal.valueOf(50), 10, true);

        when(productoRepository.findById(productoId1)).thenReturn(Optional.of(p1));
        when(productoRepository.findById(productoId2)).thenReturn(Optional.of(p2));

        ReporteStockTotalDTO reporte = useCase.ejecutar(null);

        assertEquals(2, reporte.items().size(), "Debe agrupar en 2 productos");
        
        assertEquals(BigDecimal.valueOf(2500), reporte.valorGlobalInmovilizado());

        var item1 = reporte.items().stream().filter(i -> i.productoId().equals(productoId1)).findFirst().get();
        assertEquals(15, item1.cantidadTotal());
        assertEquals(BigDecimal.valueOf(1500), item1.valorTotalInmovilizado());

        var item2 = reporte.items().stream().filter(i -> i.productoId().equals(productoId2)).findFirst().get();
        assertEquals(20, item2.cantidadTotal());
        assertEquals(BigDecimal.valueOf(1000), item2.valorTotalInmovilizado());
    }
}
