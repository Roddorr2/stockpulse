package com.stockpulse.application.usecase;

import com.stockpulse.application.dto.ItemReporteStockDTO;
import com.stockpulse.application.dto.ReporteStockTotalDTO;
import com.stockpulse.domain.model.Producto;
import com.stockpulse.domain.model.Stock;
import com.stockpulse.domain.repository.ProductoRepository;
import com.stockpulse.domain.repository.StockRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

public class GenerarReporteStockUseCase {

    private final StockRepository stockRepository;
    private final ProductoRepository productoRepository;

    public GenerarReporteStockUseCase(StockRepository stockRepository, ProductoRepository productoRepository) {
        this.stockRepository = stockRepository;
        this.productoRepository = productoRepository;
    }

    public ReporteStockTotalDTO ejecutar(UUID sucursalId) {
        List<Stock> stocks = stockRepository.findByFiltros(sucursalId);
        
        Map<UUID, Integer> stockAgrupado = stocks.stream()
            .collect(Collectors.groupingBy(
                Stock::getProductoId,
                Collectors.summingInt(Stock::getCantidad)
            ));
            
        List<ItemReporteStockDTO> items = stockAgrupado.entrySet().stream()
            .map(entry -> {
                UUID productoId = entry.getKey();
                int cantidadTotal = entry.getValue();
                
                Producto producto = productoRepository.findById(productoId)
                    .orElseThrow(() -> new IllegalStateException("Producto no encontrado durante la generación del reporte: " + productoId));
                
                BigDecimal precio = producto.getPrecio();
                BigDecimal valorTotal = precio.multiply(BigDecimal.valueOf(cantidadTotal));
                
                return new ItemReporteStockDTO(
                    producto.getId(),
                    producto.getSku(),
                    producto.getNombre(),
                    cantidadTotal,
                    precio,
                    valorTotal
                );
            })
            .toList();
            
        BigDecimal valorGlobal = items.stream()
            .map(ItemReporteStockDTO::valorTotalInmovilizado)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        return new ReporteStockTotalDTO(items, valorGlobal);
    }
}
