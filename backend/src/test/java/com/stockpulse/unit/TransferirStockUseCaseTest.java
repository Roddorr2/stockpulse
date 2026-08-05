package com.stockpulse.unit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.stockpulse.application.dto.TransferenciaStockResponseDTO;
import com.stockpulse.application.dto.TransferirStockRequestDTO;
import com.stockpulse.application.usecase.TransferirStockUseCase;
import com.stockpulse.domain.event.DomainEventPublisher;
import com.stockpulse.domain.event.LowStockEvent;
import com.stockpulse.domain.exception.InsufficientStockException;
import com.stockpulse.domain.exception.ResourceNotFoundException;
import com.stockpulse.domain.exception.SameBranchTransferException;
import com.stockpulse.domain.model.Producto;
import com.stockpulse.domain.model.Stock;
import com.stockpulse.domain.model.TransferenciaStock;
import com.stockpulse.domain.model.Sucursal;
import com.stockpulse.domain.repository.ProductoRepository;
import com.stockpulse.domain.repository.StockRepository;
import com.stockpulse.domain.repository.SucursalRepository;
import com.stockpulse.domain.repository.TransferenciaStockRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TransferirStockUseCaseTest {

    @Mock
    private StockRepository stockRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private SucursalRepository sucursalRepository;

    @Mock
    private TransferenciaStockRepository transferenciaStockRepository;

    @Mock
    private DomainEventPublisher eventPublisher;

    private TransferirStockUseCase useCase;

    private UUID productoId;
    private UUID sucursalOrigenId;
    private UUID sucursalDestinoId;
    private UUID usuarioId;
    private Sucursal sucursalOrigen;

    @BeforeEach
    void setUp() {
        useCase = new TransferirStockUseCase(stockRepository, productoRepository, sucursalRepository,
            transferenciaStockRepository, eventPublisher);
        productoId = UUID.randomUUID();
        sucursalOrigenId = UUID.randomUUID();
        sucursalDestinoId = UUID.randomUUID();
        usuarioId = UUID.randomUUID();
        sucursalOrigen = new Sucursal(sucursalOrigenId, "Sucursal Central (Bogotá)", "Av. El Dorado #68B-31");
    }

    @Test
    @DisplayName("Camino feliz: Transfiere stock exitosamente cuando hay suficiente inventario")
    void ejecutar_TransferenciaExitosa_ActualizaStocksYGuardaRecibo() {
        // Arrange
        TransferirStockRequestDTO request = new TransferirStockRequestDTO(
            productoId, sucursalOrigenId, sucursalDestinoId, 10, usuarioId
        );

        Producto producto = new Producto(productoId, "PROD-001", "Laptop Gaming", new BigDecimal("1200.00"), 5, true);
        Stock stockOrigen = new Stock(UUID.randomUUID(), productoId, sucursalOrigenId, 50, 1L);
        Stock stockDestino = new Stock(UUID.randomUUID(), productoId, sucursalDestinoId, 5, 1L);

        when(productoRepository.findById(productoId)).thenReturn(Optional.of(producto));
        when(sucursalRepository.findById(sucursalOrigenId)).thenReturn(Optional.of(sucursalOrigen));
        when(stockRepository.findByProductoIdAndSucursalId(productoId, sucursalOrigenId))
            .thenReturn(Optional.of(stockOrigen));
        when(stockRepository.findByProductoIdAndSucursalId(productoId, sucursalDestinoId))
            .thenReturn(Optional.of(stockDestino));

        when(stockRepository.save(any(Stock.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(transferenciaStockRepository.save(any(TransferenciaStock.class)))
            .thenAnswer(invocation -> {
                TransferenciaStock t = invocation.getArgument(0);
                return new TransferenciaStock(t.getId(), t.getProductoId(), t.getSucursalOrigenId(),
                    t.getSucursalDestinoId(), t.getCantidad(), LocalDateTime.now(), t.getUsuarioId());
            });

        // Act
        TransferenciaStockResponseDTO result = useCase.ejecutar(request);

        // Assert
        assertNotNull(result);
        assertEquals(40, result.stockOrigenRestante());
        assertEquals(15, result.stockDestinoActual());
        assertEquals(10, result.cantidad());
        assertEquals(productoId, result.productoId());

        verify(stockRepository).save(stockOrigen);
        verify(stockRepository).save(stockDestino);
        verify(transferenciaStockRepository).save(any(TransferenciaStock.class));
        verify(eventPublisher, never()).publish(any());
    }

    @Test
    @DisplayName("Dispara LowStockEvent cuando el stock resultante de origen es menor o igual al stock mínimo")
    void ejecutar_StockOrigenCaeBajoMinimo_DisparaLowStockEvent() {
        // Arrange
        TransferirStockRequestDTO request = new TransferirStockRequestDTO(
            productoId, sucursalOrigenId, sucursalDestinoId, 45, usuarioId
        );

        Producto producto = new Producto(productoId, "PROD-001", "Laptop Gaming", new BigDecimal("1200.00"), 10, true);
        Stock stockOrigen = new Stock(UUID.randomUUID(), productoId, sucursalOrigenId, 50, 1L);
        Stock stockDestino = new Stock(UUID.randomUUID(), productoId, sucursalDestinoId, 0, 1L);

        when(productoRepository.findById(productoId)).thenReturn(Optional.of(producto));
        when(sucursalRepository.findById(sucursalOrigenId)).thenReturn(Optional.of(sucursalOrigen));
        when(stockRepository.findByProductoIdAndSucursalId(productoId, sucursalOrigenId))
            .thenReturn(Optional.of(stockOrigen));
        when(stockRepository.findByProductoIdAndSucursalId(productoId, sucursalDestinoId))
            .thenReturn(Optional.of(stockDestino));

        when(stockRepository.save(any(Stock.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(transferenciaStockRepository.save(any(TransferenciaStock.class)))
            .thenAnswer(invocation -> {
                TransferenciaStock t = invocation.getArgument(0);
                return new TransferenciaStock(t.getId(), t.getProductoId(), t.getSucursalOrigenId(),
                    t.getSucursalDestinoId(), t.getCantidad(), LocalDateTime.now(), t.getUsuarioId());
            });

        // Act
        TransferenciaStockResponseDTO result = useCase.ejecutar(request);

        // Assert
        assertEquals(5, result.stockOrigenRestante());
        verify(eventPublisher).publish(any(LowStockEvent.class));
    }

    @Test
    @DisplayName("Caso de error: Lanza InsufficientStockException si el stock de origen es menor a lo solicitado")
    void ejecutar_StockInsuficienteEnOrigen_LanzaInsufficientStockException() {
        // Arrange
        TransferirStockRequestDTO request = new TransferirStockRequestDTO(
            productoId, sucursalOrigenId, sucursalDestinoId, 100, usuarioId
        );

        Producto producto = new Producto(productoId, "PROD-001", "Laptop Gaming", new BigDecimal("1200.00"), 5, true);
        Stock stockOrigen = new Stock(UUID.randomUUID(), productoId, sucursalOrigenId, 15, 1L);

        when(productoRepository.findById(productoId)).thenReturn(Optional.of(producto));
        when(sucursalRepository.findById(sucursalOrigenId)).thenReturn(Optional.of(sucursalOrigen));
        when(stockRepository.findByProductoIdAndSucursalId(productoId, sucursalOrigenId))
            .thenReturn(Optional.of(stockOrigen));

        // Act & Assert
        InsufficientStockException exception = assertThrows(
            InsufficientStockException.class,
            () -> useCase.ejecutar(request)
        );

        assertNotNull(exception.getMessage());
        verify(stockRepository, never()).save(any());
        verify(transferenciaStockRepository, never()).save(any());
        verify(eventPublisher, never()).publish(any());
    }

    @Test
    @DisplayName("Caso de error: Lanza SameBranchTransferException si sucursal origen y destino son iguales")
    void ejecutar_SucursalOrigenYDestinoIguales_LanzaSameBranchTransferException() {
        // Arrange
        TransferirStockRequestDTO request = new TransferirStockRequestDTO(
            productoId, sucursalOrigenId, sucursalOrigenId, 10, usuarioId
        );

        // Act & Assert
        assertThrows(
            SameBranchTransferException.class,
            () -> useCase.ejecutar(request)
        );

        verify(productoRepository, never()).findById(any());
        verify(stockRepository, never()).save(any());
        verify(eventPublisher, never()).publish(any());
    }

    @Test
    @DisplayName("Caso de error: Lanza ResourceNotFoundException si el producto no existe")
    void ejecutar_ProductoNoExistente_LanzaResourceNotFoundException() {
        // Arrange
        TransferirStockRequestDTO request = new TransferirStockRequestDTO(
            productoId, sucursalOrigenId, sucursalDestinoId, 10, usuarioId
        );

        when(productoRepository.findById(productoId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(
            ResourceNotFoundException.class,
            () -> useCase.ejecutar(request)
        );

        verify(stockRepository, never()).findByProductoIdAndSucursalId(any(), any());
        verify(eventPublisher, never()).publish(any());
    }

}
