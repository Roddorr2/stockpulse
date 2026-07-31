package com.stockpulse.domain.repository;

import com.stockpulse.domain.model.Sucursal;
import java.util.Optional;
import java.util.UUID;

public interface SucursalRepository {

    Optional<Sucursal> findById(UUID id);

    Sucursal save(Sucursal sucursal);

}
