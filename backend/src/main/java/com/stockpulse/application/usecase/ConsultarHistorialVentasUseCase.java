package com.stockpulse.application.usecase;

import com.stockpulse.application.dto.FiltroVentasDTO;
import com.stockpulse.application.dto.ItemVentaResponseDTO;
import com.stockpulse.application.dto.VentaResponseDTO;
import com.stockpulse.domain.exception.ResourceNotFoundException;
import com.stockpulse.domain.model.Producto;
import com.stockpulse.domain.model.Venta;
import com.stockpulse.domain.repository.ProductoRepository;
import com.stockpulse.domain.repository.VentaRepository;
import java.util.List;

public class ConsultarHistorialVentasUseCase {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;

    public ConsultarHistorialVentasUseCase(VentaRepository ventaRepository, ProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
    }

    public List<VentaResponseDTO> ejecutar(FiltroVentasDTO filtro) {
        List<Venta> ventas = ventaRepository.findByFiltros(
            filtro.sucursalId(),
            filtro.productoId(),
            filtro.fechaInicio(),
            filtro.fechaFin()
        );

        return ventas.stream().map(venta -> {
            List<ItemVentaResponseDTO> itemsResponse = venta.getDetalles().stream().map(d -> {
                Producto producto = productoRepository.findById(d.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + d.getProductoId()));
                return new ItemVentaResponseDTO(
                    d.getProductoId(),
                    producto.getSku(),
                    producto.getNombre(),
                    d.getCantidad(),
                    d.getPrecioUnitario(),
                    d.getSubtotal()
                );
            }).toList();

            return new VentaResponseDTO(
                venta.getId(),
                venta.getSucursalId(),
                venta.getUsuarioId(),
                venta.getTotal(),
                venta.getFecha(),
                itemsResponse
            );
        }).toList();
    }

}
