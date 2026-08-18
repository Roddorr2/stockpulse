package com.stockpulse.unit;

import com.stockpulse.application.dto.FiltroVentasDTO;
import com.stockpulse.application.dto.ItemVentaResponseDTO;
import com.stockpulse.application.dto.VentaResponseDTO;
import com.stockpulse.application.usecase.ConsultarHistorialVentasUseCase;
import com.stockpulse.application.usecase.ExportarHistorialVentasCsvUseCase;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExportarHistorialVentasCsvUseCaseTest {

    @Mock
    private ConsultarHistorialVentasUseCase consultarHistorialVentasUseCase;

    private ExportarHistorialVentasCsvUseCase useCase;

    @BeforeEach
    void setUp() {
        useCase = new ExportarHistorialVentasCsvUseCase(consultarHistorialVentasUseCase);
    }

    @Test
    void ejecutar_generaCsvCorrectamente() {
        FiltroVentasDTO filtro = new FiltroVentasDTO(null, null, null, null);
        
        ItemVentaResponseDTO item = new ItemVentaResponseDTO(
            UUID.randomUUID(), "SKU-1", "Laptop \"Pro\"", 2, new BigDecimal("1000.00"), new BigDecimal("2000.00")
        );
        VentaResponseDTO venta = new VentaResponseDTO(
            UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), new BigDecimal("2000.00"), LocalDateTime.now(), List.of(item)
        );

        when(consultarHistorialVentasUseCase.ejecutar(any(FiltroVentasDTO.class))).thenReturn(List.of(venta));

        byte[] result = useCase.ejecutar(filtro);

        assertNotNull(result);
        String csvString = new String(result, StandardCharsets.UTF_8);
        assertTrue(csvString.contains("ID Venta,Fecha,Sucursal ID,Producto ID,SKU,Nombre Producto,Cantidad,Precio Unitario,Subtotal,Total Venta"));
        assertTrue(csvString.contains("Laptop \"\"Pro\"\"")); // Escaped quotes
        assertTrue(csvString.contains("SKU-1"));
    }

    @Test
    void ejecutar_generaCsvVacio_cuandoNoHayVentas() {
        FiltroVentasDTO filtro = new FiltroVentasDTO(null, null, null, null);
        when(consultarHistorialVentasUseCase.ejecutar(any(FiltroVentasDTO.class))).thenReturn(Collections.emptyList());

        byte[] result = useCase.ejecutar(filtro);

        assertNotNull(result);
        String csvString = new String(result, StandardCharsets.UTF_8);
        assertTrue(csvString.contains("ID Venta,Fecha"));
        assertTrue(csvString.split("\n").length == 1); // Only header row
    }
}
