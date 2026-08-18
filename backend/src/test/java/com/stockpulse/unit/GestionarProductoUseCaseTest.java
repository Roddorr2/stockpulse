package com.stockpulse.unit;

import com.stockpulse.application.dto.ProductoRequestDTO;
import com.stockpulse.application.usecase.GestionarProductoUseCase;
import com.stockpulse.domain.model.Producto;
import com.stockpulse.domain.repository.ProductoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GestionarProductoUseCaseTest {

    @Mock
    private ProductoRepository productoRepository;

    private GestionarProductoUseCase useCase;

    @BeforeEach
    void setUp() {
        useCase = new GestionarProductoUseCase(productoRepository);
    }

    @Test
    void crearProducto_exito() {
        ProductoRequestDTO request = new ProductoRequestDTO("SKU-1", "Prod 1", new BigDecimal("100.0"), 5, true);
        when(productoRepository.save(any(Producto.class))).thenAnswer(i -> i.getArguments()[0]);

        Producto producto = useCase.crearProducto(request);

        assertNotNull(producto);
        assertEquals("SKU-1", producto.getSku());
        assertEquals("Prod 1", producto.getNombre());
        verify(productoRepository).save(any(Producto.class));
    }

    @Test
    void actualizarProducto_exito() {
        UUID id = UUID.randomUUID();
        Producto existente = new Producto(id, "SKU-1", "Prod 1", new BigDecimal("100.0"), 5, true);
        ProductoRequestDTO request = new ProductoRequestDTO("SKU-NEW", "Prod New", new BigDecimal("200.0"), 10, false);
        
        when(productoRepository.findById(id)).thenReturn(Optional.of(existente));
        when(productoRepository.save(any(Producto.class))).thenAnswer(i -> i.getArguments()[0]);

        Producto actualizado = useCase.actualizarProducto(id, request);

        assertEquals("SKU-NEW", actualizado.getSku());
        assertEquals("Prod New", actualizado.getNombre());
        assertFalse(actualizado.isActivo());
        verify(productoRepository).save(existente);
    }

    @Test
    void actualizarProducto_lanzaExcepcion_cuandoNoExiste() {
        UUID id = UUID.randomUUID();
        ProductoRequestDTO request = new ProductoRequestDTO("SKU-NEW", "Prod New", new BigDecimal("200.0"), 10, false);
        
        when(productoRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> useCase.actualizarProducto(id, request));
        verify(productoRepository, never()).save(any());
    }

    @Test
    void desactivarProducto_exito() {
        UUID id = UUID.randomUUID();
        Producto existente = new Producto(id, "SKU-1", "Prod 1", new BigDecimal("100.0"), 5, true);
        
        when(productoRepository.findById(id)).thenReturn(Optional.of(existente));

        useCase.desactivarProducto(id);

        assertFalse(existente.isActivo());
        verify(productoRepository).save(existente);
    }

    @Test
    void desactivarProducto_lanzaExcepcion_cuandoNoExiste() {
        UUID id = UUID.randomUUID();
        when(productoRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> useCase.desactivarProducto(id));
        verify(productoRepository, never()).save(any());
    }
}
