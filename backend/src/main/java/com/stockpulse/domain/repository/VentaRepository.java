package com.stockpulse.domain.repository;

import com.stockpulse.domain.model.Venta;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VentaRepository {

    Venta save(Venta venta);

    Optional<Venta> findById(UUID id);

    List<Venta> findAllBySucursalId(UUID sucursalId);

}
