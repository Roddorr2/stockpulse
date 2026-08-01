package com.stockpulse.unit;

import com.stockpulse.application.dto.ItemVentaRequestDTO;
import com.stockpulse.application.dto.RegistrarVentaRequestDTO;
import com.stockpulse.application.dto.VentaResponseDTO;
import com.stockpulse.application.usecase.RegistrarVentaUseCase;
import com.stockpulse.domain.event.DomainEventPublisher;
import com.stockpulse.domain.event.LowStockEvent;
import com.stockpulse.domain.exception.InsufficientStockException;
import com.stockpulse.domain.model.Producto;
import com.stockpulse.domain.model.Stock;
import com.stockpulse.domain.model.Sucursal;
import com.stockpulse.domain.model.Venta;
import com.stockpulse.domain.repository.ProductoRepository;
import com.stockpulse.domain.repository.StockRepository;
import com.stockpulse.domain.repository.SucursalRepository;
import com.stockpulse.domain.repository.VentaRepository;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegistrarVentaUseCaseTest {

    @Mock
    private StockRepository stockRepository;

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private SucursalRepository sucursalRepository;

    @Mock
    private VentaRepository ventaRepository;

    @Mock
    private DomainEventPublisher eventPublisher;

    private RegistrarVentaUseCase useCase;

    private UUID productoId;
    private UUID sucursalId;
    private UUID usuarioId;
    private Sucursal sucursal;

    @BeforeEach
    void setUp() {
        useCase = new RegistrarVentaUseCase(stockRepository, productoRepository, sucursalRepository,
            ventaRepository, eventPublisher);
        productoId = UUID.randomUUID();
        sucursalId = UUID.randomUUID();
        usuarioId = UUID.randomUUID();
        sucursal = new Sucursal(sucursalId, "Sucursal Central", "Av. Principal #123");
    }

    @Test
    void registrarVenta_exito_descuentaStockCorrectamente() {
        Producto producto = new Producto(productoId, "SKU-1", "Laptop Pro", new BigDecimal("1000.00"), 5);
        Stock stock = new Stock(UUID.randomUUID(), productoId, sucursalId, 10, 0L);
        RegistrarVentaRequestDTO request = new RegistrarVentaRequestDTO(
            sucursalId, usuarioId, List.of(new ItemVentaRequestDTO(productoId, 2))
        );

        when(sucursalRepository.findById(sucursalId)).thenReturn(Optional.of(sucursal));
        when(productoRepository.findById(productoId)).thenReturn(Optional.of(producto));
        when(stockRepository.findByProductoIdAndSucursalId(productoId, sucursalId)).thenReturn(Optional.of(stock));
        when(ventaRepository.save(any(Venta.class))).thenAnswer(invocation -> invocation.getArgument(0));

        VentaResponseDTO response = useCase.ejecutar(request);

        assertNotNull(response);
        assertEquals(sucursalId, response.sucursalId());
        assertEquals(new BigDecimal("2000.00"), response.total());
        assertEquals(8, stock.getCantidad());
        verify(stockRepository).save(stock);
        verify(eventPublisher, never()).publish(any(LowStockEvent.class));
    }

    @Test
    void registrarVenta_disparaAlertaBajoStock_cuandoSaldoCaeBajoMinimo() {
        Producto producto = new Producto(productoId, "SKU-1", "Laptop Pro", new BigDecimal("1000.00"), 5);
        Stock stock = new Stock(UUID.randomUUID(), productoId, sucursalId, 6, 0L);
        RegistrarVentaRequestDTO request = new RegistrarVentaRequestDTO(
            sucursalId, usuarioId, List.of(new ItemVentaRequestDTO(productoId, 2))
        );

        when(sucursalRepository.findById(sucursalId)).thenReturn(Optional.of(sucursal));
        when(productoRepository.findById(productoId)).thenReturn(Optional.of(producto));
        when(stockRepository.findByProductoIdAndSucursalId(productoId, sucursalId)).thenReturn(Optional.of(stock));
        when(ventaRepository.save(any(Venta.class))).thenAnswer(invocation -> invocation.getArgument(0));

        useCase.ejecutar(request);

        assertEquals(4, stock.getCantidad());
        ArgumentCaptor<LowStockEvent> eventCaptor = ArgumentCaptor.forClass(LowStockEvent.class);
        verify(eventPublisher).publish(eventCaptor.capture());
        LowStockEvent event = eventCaptor.getValue();
        assertEquals(productoId, event.productoId());
        assertEquals(4, event.stockActual());
    }

    @Test
    void registrarVenta_lanzaExcepcion_cuandoStockEsInsuficiente() {
        Producto producto = new Producto(productoId, "SKU-1", "Laptop Pro", new BigDecimal("1000.00"), 5);
        Stock stock = new Stock(UUID.randomUUID(), productoId, sucursalId, 2, 0L);
        RegistrarVentaRequestDTO request = new RegistrarVentaRequestDTO(
            sucursalId, usuarioId, List.of(new ItemVentaRequestDTO(productoId, 5))
        );

        when(sucursalRepository.findById(sucursalId)).thenReturn(Optional.of(sucursal));
        when(productoRepository.findById(productoId)).thenReturn(Optional.of(producto));
        when(stockRepository.findByProductoIdAndSucursalId(productoId, sucursalId)).thenReturn(Optional.of(stock));

        assertThrows(InsufficientStockException.class, () -> useCase.ejecutar(request));
        verify(ventaRepository, never()).save(any());
    }

    @Test
    void registrarVenta_lanzaExcepcion_cuandoItemsVacio() {
        RegistrarVentaRequestDTO request = new RegistrarVentaRequestDTO(
            sucursalId, usuarioId, Collections.emptyList()
        );

        assertThrows(IllegalArgumentException.class, () -> useCase.ejecutar(request));
    }

}
