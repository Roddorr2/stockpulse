package com.stockpulse.infrastructure.config;

import com.stockpulse.application.usecase.AutenticarUsuarioUseCase;
import com.stockpulse.application.usecase.ConsultarHistorialVentasUseCase;
import com.stockpulse.application.usecase.CrearUsuarioUseCase;
import com.stockpulse.application.usecase.GenerarReporteStockUseCase;
import com.stockpulse.application.usecase.ObtenerMatrizStockUseCase;
import com.stockpulse.application.usecase.ObtenerUsuariosUseCase;
import com.stockpulse.application.usecase.RefrescarTokenUseCase;
import com.stockpulse.application.usecase.RegistrarVentaUseCase;
import com.stockpulse.application.usecase.TransferirStockUseCase;
import com.stockpulse.domain.event.DomainEventPublisher;
import com.stockpulse.domain.repository.ProductoRepository;
import com.stockpulse.domain.repository.RolRepository;
import com.stockpulse.domain.repository.StockRepository;
import com.stockpulse.domain.repository.SucursalRepository;
import com.stockpulse.domain.repository.TransferenciaStockRepository;
import com.stockpulse.domain.repository.UsuarioRepository;
import com.stockpulse.domain.repository.VentaRepository;
import com.stockpulse.infrastructure.security.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

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
    public RegistrarVentaUseCase registrarVentaUseCase(StockRepository stockRepository,
                                                         ProductoRepository productoRepository,
                                                         SucursalRepository sucursalRepository,
                                                         VentaRepository ventaRepository,
                                                         DomainEventPublisher eventPublisher) {
        return new RegistrarVentaUseCase(stockRepository, productoRepository, sucursalRepository,
            ventaRepository, eventPublisher);
    }

    @Bean
    public AutenticarUsuarioUseCase autenticarUsuarioUseCase(UsuarioRepository usuarioRepository,
                                                               PasswordEncoder passwordEncoder,
                                                               JwtTokenProvider tokenProvider) {
        return new AutenticarUsuarioUseCase(usuarioRepository, passwordEncoder, tokenProvider);
    }

    @Bean
    public RefrescarTokenUseCase refrescarTokenUseCase(UsuarioRepository usuarioRepository,
                                                        JwtTokenProvider tokenProvider) {
        return new RefrescarTokenUseCase(usuarioRepository, tokenProvider);
    }

    @Bean
    public ConsultarHistorialVentasUseCase consultarHistorialVentasUseCase(VentaRepository ventaRepository, ProductoRepository productoRepository) {
        return new ConsultarHistorialVentasUseCase(ventaRepository, productoRepository);
    }

    @Bean
    public ObtenerUsuariosUseCase obtenerUsuariosUseCase(UsuarioRepository usuarioRepository) {
        return new ObtenerUsuariosUseCase(usuarioRepository);
    }

    @Bean
    public CrearUsuarioUseCase crearUsuarioUseCase(UsuarioRepository usuarioRepository, RolRepository rolRepository, PasswordEncoder passwordEncoder) {
        return new CrearUsuarioUseCase(usuarioRepository, rolRepository, passwordEncoder);
    }

    @Bean
    public GenerarReporteStockUseCase generarReporteStockUseCase(StockRepository stockRepository, ProductoRepository productoRepository) {
        return new GenerarReporteStockUseCase(stockRepository, productoRepository);
    }

}
