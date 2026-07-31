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
        if (request.sucursalOrigenId().equals(request.sucursalDestinoId())) {
            throw new SameBranchTransferException("La sucursal de origen y destino no pueden ser iguales");
        }

        productoRepository.findById(request.productoId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Producto no encontrado con ID: " + request.productoId()));

        Stock stockOrigen = stockRepository.findByProductoIdAndSucursalId(
            request.productoId(), request.sucursalOrigenId())
            .orElseThrow(() -> new ResourceNotFoundException(
                String.format("No existe registro de stock para el producto %s en la sucursal origen %s",
                    request.productoId(), request.sucursalOrigenId())));

        Stock stockDestino = stockRepository.findByProductoIdAndSucursalId(
            request.productoId(), request.sucursalDestinoId())
            .orElseGet(() -> new Stock(
                UUID.randomUUID(),
                request.productoId(),
                request.sucursalDestinoId(),
                0,
                null
            ));

        stockOrigen.disminuirStock(request.cantidad());
        stockDestino.aumentarStock(request.cantidad());

        Stock stockOrigenGuardado = stockRepository.save(stockOrigen);
        Stock stockDestinoGuardado = stockRepository.save(stockDestino);

        TransferenciaStock transferencia = new TransferenciaStock(
            UUID.randomUUID(),
            request.productoId(),
            request.sucursalOrigenId(),
            request.sucursalDestinoId(),
            request.cantidad(),
            LocalDateTime.now(),
            request.usuarioId()
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
