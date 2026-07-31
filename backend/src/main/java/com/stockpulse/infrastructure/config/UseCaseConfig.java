package com.stockpulse.infrastructure.config;

import com.stockpulse.application.usecase.TransferirStockUseCase;
import com.stockpulse.domain.repository.ProductoRepository;
import com.stockpulse.domain.repository.StockRepository;
import com.stockpulse.domain.repository.TransferenciaStockRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UseCaseConfig {

    @Bean
    public TransferirStockUseCase transferirStockUseCase(StockRepository stockRepository,
                                                           ProductoRepository productoRepository,
                                                           TransferenciaStockRepository transferenciaStockRepository) {
        return new TransferirStockUseCase(stockRepository, productoRepository, transferenciaStockRepository);
    }

}
