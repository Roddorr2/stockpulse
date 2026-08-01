package com.stockpulse.infrastructure.config;

import com.stockpulse.application.usecase.CrearUsuarioUseCase;
import com.stockpulse.application.usecase.ObtenerMatrizStockUseCase;
import com.stockpulse.application.usecase.ObtenerUsuariosUseCase;
import com.stockpulse.application.usecase.TransferirStockUseCase;
import com.stockpulse.domain.event.DomainEventPublisher;
import com.stockpulse.domain.repository.ProductoRepository;
import com.stockpulse.domain.repository.StockRepository;
import com.stockpulse.domain.repository.SucursalRepository;
import com.stockpulse.domain.repository.TransferenciaStockRepository;
import com.stockpulse.domain.repository.UsuarioRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UseCaseConfig {

    @Bean
    public TransferirStockUseCase transferirStockUseCase(StockRepository stockRepository,
                                                           ProductoRepository productoRepository,
                                                           SucursalRepository sucursalRepository,
                                                           TransferenciaStockRepository transferenciaStockRepository,
                                                           DomainEventPublisher eventPublisher) {
        return new TransferirStockUseCase(stockRepository, productoRepository, sucursalRepository,
            transferenciaStockRepository, eventPublisher);
    }

    @Bean
    public ObtenerMatrizStockUseCase obtenerMatrizStockUseCase(StockRepository stockRepository) {
        return new ObtenerMatrizStockUseCase(stockRepository);
    }

    @Bean
    public ObtenerUsuariosUseCase obtenerUsuariosUseCase(UsuarioRepository usuarioRepository) {
        return new ObtenerUsuariosUseCase(usuarioRepository);
    }

    @Bean
    public CrearUsuarioUseCase crearUsuarioUseCase(UsuarioRepository usuarioRepository) {
        return new CrearUsuarioUseCase(usuarioRepository);
    }

}
