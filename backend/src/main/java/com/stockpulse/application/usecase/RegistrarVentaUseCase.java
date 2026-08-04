package com.stockpulse.application.usecase;

import com.stockpulse.application.dto.ItemVentaRequestDTO;
import com.stockpulse.application.dto.ItemVentaResponseDTO;
import com.stockpulse.application.dto.RegistrarVentaRequestDTO;
import com.stockpulse.application.dto.VentaResponseDTO;
import com.stockpulse.domain.event.DomainEventPublisher;
import com.stockpulse.domain.event.LowStockEvent;
import com.stockpulse.domain.exception.ResourceNotFoundException;
import com.stockpulse.domain.model.DetalleVenta;
import com.stockpulse.domain.model.Producto;
import com.stockpulse.domain.model.Stock;
import com.stockpulse.domain.model.Sucursal;
import com.stockpulse.domain.model.Venta;
import com.stockpulse.domain.repository.ProductoRepository;
import com.stockpulse.domain.repository.StockRepository;
import com.stockpulse.domain.repository.SucursalRepository;
import com.stockpulse.domain.repository.VentaRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class RegistrarVentaUseCase {

    private final StockRepository stockRepository;
    private final ProductoRepository productoRepository;
    private final SucursalRepository sucursalRepository;
    private final VentaRepository ventaRepository;
    private final DomainEventPublisher eventPublisher;

    public RegistrarVentaUseCase(StockRepository stockRepository,
                                  ProductoRepository productoRepository,
                                  SucursalRepository sucursalRepository,
                                  VentaRepository ventaRepository,
                                  DomainEventPublisher eventPublisher) {
        this.stockRepository = stockRepository;
        this.productoRepository = productoRepository;
        this.sucursalRepository = sucursalRepository;
        this.ventaRepository = ventaRepository;
        this.eventPublisher = eventPublisher;
    }

    public VentaResponseDTO ejecutar(RegistrarVentaRequestDTO request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new IllegalArgumentException("La venta debe contener al menos un producto");
        }

        Sucursal sucursal = sucursalRepository.findById(request.sucursalId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Sucursal no encontrada con ID: " + request.sucursalId()));

        List<DetalleVenta> detalles = new ArrayList<>();
        List<ItemVentaResponseDTO> responseItems = new ArrayList<>();

        for (ItemVentaRequestDTO item : request.items()) {
            Producto producto = productoRepository.findById(item.productoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Producto no encontrado con ID: " + item.productoId()));

            Stock stock = stockRepository.findByProductoIdAndSucursalId(item.productoId(), request.sucursalId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "No se encontró registro de stock para el producto en la sucursal seleccionada"));

            // Disminuir stock
            stock.disminuirStock(item.cantidad(), sucursal.getNombre());
            stockRepository.save(stock);

            // Si el stock actual cae bajo el umbral mínimo, disparar evento de bajo stock
            if (stock.getCantidad() <= producto.getStockMinimo()) {
                eventPublisher.publish(new LowStockEvent(
                    producto.getId(),
                    producto.getSku(),
                    producto.getNombre(),
                    request.sucursalId(),
                    sucursal.getNombre(),
                    stock.getCantidad(),
                    producto.getStockMinimo(),
                    LocalDateTime.now()
                ));
            }

            DetalleVenta detalle = new DetalleVenta(
                UUID.randomUUID(),
                producto.getId(),
                item.cantidad(),
                producto.getPrecio()
            );
            detalles.add(detalle);

            responseItems.add(new ItemVentaResponseDTO(
                producto.getId(),
                producto.getSku(),
                producto.getNombre(),
                item.cantidad(),
                producto.getPrecio(),
                detalle.getSubtotal()
            ));
        }

        Venta venta = new Venta(
            UUID.randomUUID(),
            request.sucursalId(),
            request.usuarioId(),
            LocalDateTime.now(),
            detalles
        );

        Venta ventaGuardada = ventaRepository.save(venta);

        return new VentaResponseDTO(
            ventaGuardada.getId(),
            ventaGuardada.getSucursalId(),
            ventaGuardada.getUsuarioId(),
            ventaGuardada.getTotal(),
            ventaGuardada.getFecha(),
            responseItems
        );
    }

}
