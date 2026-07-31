package com.stockpulse.domain.repository;

import com.stockpulse.domain.model.Stock;
import java.util.Optional;
import java.util.UUID;

public interface StockRepository {

    Optional<Stock> findByProductoIdAndSucursalId(UUID productoId, UUID sucursalId);

    Stock save(Stock stock);

}
