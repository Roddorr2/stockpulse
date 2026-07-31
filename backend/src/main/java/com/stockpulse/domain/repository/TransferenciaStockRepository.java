package com.stockpulse.domain.repository;

import com.stockpulse.domain.model.TransferenciaStock;
import java.util.UUID;

public interface TransferenciaStockRepository {

    TransferenciaStock save(TransferenciaStock transferenciaStock);

}
