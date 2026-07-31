package com.stockpulse.infrastructure.persistence.adapter;

import com.stockpulse.application.dto.StockResponseDTO;
import com.stockpulse.domain.model.Stock;
import com.stockpulse.domain.repository.StockRepository;
import com.stockpulse.infrastructure.persistence.entity.StockJpaEntity;
import com.stockpulse.infrastructure.persistence.mapper.StockPersistenceMapper;
import com.stockpulse.infrastructure.persistence.repository.SpringDataStockRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class StockPersistenceAdapter implements StockRepository {

    private final SpringDataStockRepository repository;
    private final StockPersistenceMapper mapper;

    public StockPersistenceAdapter(SpringDataStockRepository repository, StockPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Stock> findByProductoIdAndSucursalId(UUID productoId, UUID sucursalId) {
        return repository.findByProductoIdAndSucursalId(productoId, sucursalId)
            .map(mapper::toDomain);
    }

    @Override
    public Stock save(Stock stock) {
        StockJpaEntity entity = mapper.toEntity(stock);
        StockJpaEntity savedEntity = repository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public List<StockResponseDTO> findAllWithDetails() {
        return repository.findAllWithDetails();
    }

}
