package com.stockpulse.application.usecase;

import com.stockpulse.application.dto.FiltroVentasDTO;
import com.stockpulse.application.dto.VentaResponseDTO;
import com.stockpulse.domain.model.DetalleVenta;
import com.stockpulse.domain.model.Producto;
import com.stockpulse.domain.model.Venta;
import com.stockpulse.domain.repository.ProductoRepository;
import com.stockpulse.domain.repository.VentaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ConsultarHistorialVentasUseCaseTest {

    private VentaRepository ventaRepository;
    private ProductoRepository productoRepository;
    private ConsultarHistorialVentasUseCase useCase;

    @BeforeEach
    void setUp() {
        ventaRepository = mock(VentaRepository.class);
        productoRepository = mock(ProductoRepository.class);
        useCase = new ConsultarHistorialVentasUseCase(ventaRepository, productoRepository);
    }

    @Test
    void debeRetornarHistorialVentasFiltrado() {
        UUID sucursalId = UUID.randomUUID();
        FiltroVentasDTO filtro = new FiltroVentasDTO(sucursalId, null, null, null);
        UUID productoId = UUID.randomUUID();
        DetalleVenta detalle = new DetalleVenta(
                UUID.randomUUID(), productoId, 2, BigDecimal.TEN);
        
        Venta venta = new Venta(UUID.randomUUID(), sucursalId, UUID.randomUUID(), LocalDateTime.now(), List.of(detalle));
        
        when(ventaRepository.findByFiltros(sucursalId, null, null, null))
                .thenReturn(List.of(venta));

        Producto productoMock = mock(Producto.class);
        when(productoMock.getSku()).thenReturn("SKU-123");
        when(productoMock.getNombre()).thenReturn("Producto Test");
        when(productoRepository.findById(productoId)).thenReturn(Optional.of(productoMock));

        List<VentaResponseDTO> resultado = useCase.ejecutar(filtro);

        assertEquals(1, resultado.size());
        assertEquals(venta.getId(), resultado.get(0).id());
        verify(ventaRepository, times(1)).findByFiltros(sucursalId, null, null, null);
    }
}
