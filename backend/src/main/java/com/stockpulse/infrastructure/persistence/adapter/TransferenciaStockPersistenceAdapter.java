package com.stockpulse.infrastructure.persistence.adapter;

import com.stockpulse.domain.model.TransferenciaStock;
import com.stockpulse.domain.repository.TransferenciaStockRepository;
import com.stockpulse.infrastructure.persistence.entity.TransferenciaStockJpaEntity;
import com.stockpulse.infrastructure.persistence.mapper.TransferenciaStockPersistenceMapper;
import com.stockpulse.infrastructure.persistence.repository.SpringDataTransferenciaStockRepository;
import org.springframework.stereotype.Component;

@Component
public class TransferenciaStockPersistenceAdapter implements TransferenciaStockRepository {

    private final SpringDataTransferenciaStockRepository repository;
    private final TransferenciaStockPersistenceMapper mapper;

    public TransferenciaStockPersistenceAdapter(SpringDataTransferenciaStockRepository repository,
                                                TransferenciaStockPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public TransferenciaStock save(TransferenciaStock transferenciaStock) {
        TransferenciaStockJpaEntity entity = mapper.toEntity(transferenciaStock);
        TransferenciaStockJpaEntity savedEntity = repository.save(entity);
        return mapper.toDomain(savedEntity);
    }

}
