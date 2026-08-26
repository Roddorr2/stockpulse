package com.stockpulse.application.usecase;

import com.stockpulse.domain.model.Producto;
import com.stockpulse.domain.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsultarProductosUseCase {

    private final ProductoRepository productoRepository;

    public ConsultarProductosUseCase(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<Producto> ejecutar(String keyword, boolean soloActivos) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            if (soloActivos) {
                return productoRepository.searchByKeywordAndActivoTrue(keyword);
            }
            return productoRepository.searchByKeyword(keyword);
        }

        if (soloActivos) {
            return productoRepository.findByActivoTrue();
        }
        return productoRepository.findAll();
    }
}
