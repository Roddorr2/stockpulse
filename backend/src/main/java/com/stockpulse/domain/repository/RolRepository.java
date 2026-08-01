package com.stockpulse.domain.repository;

import com.stockpulse.domain.model.Rol;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RolRepository {

    Optional<Rol> findById(UUID id);

    Optional<Rol> findByNombre(String nombre);

    Rol save(Rol rol);

    List<Rol> findAll();

}
