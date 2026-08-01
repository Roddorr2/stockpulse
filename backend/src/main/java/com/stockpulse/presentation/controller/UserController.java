package com.stockpulse.presentation.controller;

import com.stockpulse.application.dto.CrearUsuarioRequestDTO;
import com.stockpulse.application.dto.UsuarioResponseDTO;
import com.stockpulse.application.usecase.CrearUsuarioUseCase;
import com.stockpulse.application.usecase.ObtenerUsuariosUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Gestión de Usuarios", description = "Endpoints para consultar y registrar usuarios en el sistema")
public class UserController {

    private final ObtenerUsuariosUseCase obtenerUsuariosUseCase;
    private final CrearUsuarioUseCase crearUsuarioUseCase;

    public UserController(ObtenerUsuariosUseCase obtenerUsuariosUseCase,
                          CrearUsuarioUseCase crearUsuarioUseCase) {
        this.obtenerUsuariosUseCase = obtenerUsuariosUseCase;
        this.crearUsuarioUseCase = crearUsuarioUseCase;
    }

    @Operation(summary = "Obtener lista completa de usuarios registrados")
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerUsuarios() {
        return ResponseEntity.ok(obtenerUsuariosUseCase.ejecutar());
    }

    @Operation(summary = "Registrar un nuevo usuario u operador")
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> crearUsuario(@Valid @RequestBody CrearUsuarioRequestDTO request) {
        UsuarioResponseDTO response = crearUsuarioUseCase.ejecutar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
