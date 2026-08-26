package com.stockpulse.domain.repository;

import com.stockpulse.domain.model.Producto;
import java.util.Optional;
import java.util.UUID;

import java.util.List;

public interface ProductoRepository {

    Optional<Producto> findById(UUID id);

    Producto save(Producto producto);

    List<Producto> findAll();

    List<Producto> searchByKeyword(String keyword);

    List<Producto> findByActivoTrue();

    List<Producto> searchByKeywordAndActivoTrue(String keyword);

}
