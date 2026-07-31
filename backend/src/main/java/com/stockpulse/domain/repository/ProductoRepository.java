package com.stockpulse.domain.repository;

import com.stockpulse.domain.model.Producto;
import java.util.Optional;
import java.util.UUID;

public interface ProductoRepository {

    Optional<Producto> findById(UUID id);

    Producto save(Producto producto);

}
