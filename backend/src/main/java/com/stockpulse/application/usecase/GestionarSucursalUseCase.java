package com.stockpulse.application.usecase;

import com.stockpulse.application.dto.SucursalRequestDTO;
import com.stockpulse.domain.model.Sucursal;
import com.stockpulse.domain.repository.SucursalRepository;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GestionarSucursalUseCase {

    private final SucursalRepository sucursalRepository;

    public GestionarSucursalUseCase(SucursalRepository sucursalRepository) {
        this.sucursalRepository = sucursalRepository;
    }

    @Transactional
    public Sucursal crearSucursal(SucursalRequestDTO dto) {
        Sucursal sucursal = new Sucursal(UUID.randomUUID(), dto.nombre(), dto.direccion());
        return sucursalRepository.save(sucursal);
    }

    @Transactional
    public Sucursal actualizarSucursal(UUID id, SucursalRequestDTO dto) {
        Sucursal sucursal = sucursalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sucursal no encontrada"));
        
        sucursal.setNombre(dto.nombre());
        sucursal.setDireccion(dto.direccion());
        
        return sucursalRepository.save(sucursal);
    }
}
