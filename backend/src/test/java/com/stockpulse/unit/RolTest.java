package com.stockpulse.unit;

import com.stockpulse.domain.model.Rol;
import java.util.UUID;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

class RolTest {

    @Test
    void crearRol_exito_convierteNombreAMayusculas() {
        UUID id = UUID.randomUUID();
        Rol rol = new Rol(id, "admin");

        assertEquals(id, rol.getId());
        assertEquals("ADMIN", rol.getNombre());
    }

    @Test
    void crearRol_sinId_generaUUIDAleatorio() {
        Rol rol = new Rol(null, "CAJERO");

        assertNotNull(rol.getId());
        assertEquals("CAJERO", rol.getNombre());
    }

    @Test
    void crearRol_nombreVacio_lanzaExcepcion() {
        assertThrows(IllegalArgumentException.class, () -> new Rol(UUID.randomUUID(), ""));
        assertThrows(IllegalArgumentException.class, () -> new Rol(UUID.randomUUID(), null));
    }

}
