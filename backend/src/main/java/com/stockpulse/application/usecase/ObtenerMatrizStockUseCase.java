package com.stockpulse.application.usecase;

import com.stockpulse.application.dto.StockResponseDTO;
import com.stockpulse.domain.repository.StockRepository;
import java.util.List;

public class ObtenerMatrizStockUseCase {

    private final StockRepository stockRepository;

    public ObtenerMatrizStockUseCase(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public List<StockResponseDTO> ejecutar() {
        return stockRepository.findAllWithDetails();
    }

}
