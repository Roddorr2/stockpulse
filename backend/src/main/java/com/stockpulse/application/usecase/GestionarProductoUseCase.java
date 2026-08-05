package com.stockpulse.application.usecase;

import com.stockpulse.application.dto.ProductoRequestDTO;
import com.stockpulse.domain.model.Producto;
import com.stockpulse.domain.repository.ProductoRepository;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GestionarProductoUseCase {

    private final ProductoRepository productoRepository;

    public GestionarProductoUseCase(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Transactional
    public Producto crearProducto(ProductoRequestDTO dto) {
        Producto producto = new Producto(UUID.randomUUID(), dto.sku(), dto.nombre(), dto.precio(), dto.stockMinimo(), dto.activo());
        return productoRepository.save(producto);
    }

    @Transactional
    public Producto actualizarProducto(UUID id, ProductoRequestDTO dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
        
        producto.setSku(dto.sku());
        producto.setNombre(dto.nombre());
        producto.setPrecio(dto.precio());
        producto.setStockMinimo(dto.stockMinimo());
        producto.setActivo(dto.activo());
        
        return productoRepository.save(producto);
    }

    @Transactional
    public void desactivarProducto(UUID id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
        producto.setActivo(false);
        productoRepository.save(producto);
    }
}
