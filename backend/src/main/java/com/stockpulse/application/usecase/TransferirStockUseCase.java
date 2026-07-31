package com.stockpulse.application.usecase;

import com.stockpulse.application.dto.TransferenciaStockResponseDTO;
import com.stockpulse.application.dto.TransferirStockRequestDTO;
import com.stockpulse.domain.exception.ResourceNotFoundException;
import com.stockpulse.domain.exception.SameBranchTransferException;
import com.stockpulse.domain.model.Stock;
import com.stockpulse.domain.model.TransferenciaStock;
import com.stockpulse.domain.repository.ProductoRepository;
import com.stockpulse.domain.repository.StockRepository;
import com.stockpulse.domain.repository.TransferenciaStockRepository;
import java.time.LocalDateTime;
import java.util.UUID;

public class TransferirStockUseCase {

    private final StockRepository stockRepository;
    private final ProductoRepository productoRepository;
    private final TransferenciaStockRepository transferenciaStockRepository;

    public TransferirStockUseCase(StockRepository stockRepository,
                                  ProductoRepository productoRepository,
                                  TransferenciaStockRepository transferenciaStockRepository) {
        this.stockRepository = stockRepository;
        this.productoRepository = productoRepository;
        this.transferenciaStockRepository = transferenciaStockRepository;
    }

    public TransferenciaStockResponseDTO ejecutar(TransferirStockRequestDTO request) {
        if (request.getSucursalOrigenId().equals(request.getSucursalDestinoId())) {
            throw new SameBranchTransferException("La sucursal de origen y destino no pueden ser iguales");
        }

        productoRepository.findById(request.getProductoId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Producto no encontrado con ID: " + request.getProductoId()));

        Stock stockOrigen = stockRepository.findByProductoIdAndSucursalId(
            request.getProductoId(), request.getSucursalOrigenId())
            .orElseThrow(() -> new ResourceNotFoundException(
                String.format("No existe registro de stock para el producto %s en la sucursal origen %s",
                    request.getProductoId(), request.getSucursalOrigenId())));

        Stock stockDestino = stockRepository.findByProductoIdAndSucursalId(
            request.getProductoId(), request.getSucursalDestinoId())
            .orElseGet(() -> new Stock(
                UUID.randomUUID(),
                request.getProductoId(),
                request.getSucursalDestinoId(),
                0,
                null
            ));

        stockOrigen.disminuirStock(request.getCantidad());
        stockDestino.aumentarStock(request.getCantidad());

        Stock stockOrigenGuardado = stockRepository.save(stockOrigen);
        Stock stockDestinoGuardado = stockRepository.save(stockDestino);

        TransferenciaStock transferencia = new TransferenciaStock(
            UUID.randomUUID(),
            request.getProductoId(),
            request.getSucursalOrigenId(),
            request.getSucursalDestinoId(),
            request.getCantidad(),
            LocalDateTime.now(),
            request.getUsuarioId()
        );

        TransferenciaStock transferenciaGuardada = transferenciaStockRepository.save(transferencia);

        return new TransferenciaStockResponseDTO(
            transferenciaGuardada.getId(),
            transferenciaGuardada.getProductoId(),
            transferenciaGuardada.getSucursalOrigenId(),
            transferenciaGuardada.getSucursalDestinoId(),
            transferenciaGuardada.getCantidad(),
            stockOrigenGuardado.getCantidad(),
            stockDestinoGuardado.getCantidad(),
            transferenciaGuardada.getFecha(),
            transferenciaGuardada.getUsuarioId()
        );
    }

}
