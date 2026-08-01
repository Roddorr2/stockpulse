package com.stockpulse.domain.model;

import java.util.Objects;
import java.util.UUID;

public class Rol {

    private final UUID id;
    private final String nombre;

    public Rol(UUID id, String nombre) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre del rol no puede estar vacío");
        }
        this.id = id != null ? id : UUID.randomUUID();
        this.nombre = nombre.trim().toUpperCase();
    }

    public UUID getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Rol rol = (Rol) o;
        return Objects.equals(id, rol.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}
