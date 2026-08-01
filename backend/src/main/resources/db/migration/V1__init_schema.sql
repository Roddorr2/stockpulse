-- Migration V1: Schema Initialization for StockPulse

CREATE TABLE roles (
    id UUID PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    id UUID PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    rol_id UUID NOT NULL REFERENCES roles(id)
);

CREATE TABLE productos (
    id UUID PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    precio NUMERIC(12, 2) NOT NULL CHECK (precio >= 0),
    stock_minimo INT NOT NULL CHECK (stock_minimo >= 0)
);

CREATE TABLE sucursales (
    id UUID PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255)
);

CREATE TABLE stocks (
    id UUID PRIMARY KEY,
    producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    sucursal_id UUID NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    cantidad INT NOT NULL CHECK (cantidad >= 0),
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uk_stock_producto_sucursal UNIQUE (producto_id, sucursal_id)
);

CREATE TABLE transferencias_stock (
    id UUID PRIMARY KEY,
    producto_id UUID NOT NULL REFERENCES productos(id),
    sucursal_origen_id UUID NOT NULL REFERENCES sucursales(id),
    sucursal_destino_id UUID NOT NULL REFERENCES sucursales(id),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    fecha TIMESTAMP NOT NULL,
    usuario_id UUID NOT NULL REFERENCES usuarios(id)
);

CREATE TABLE ventas (
    id UUID PRIMARY KEY,
    sucursal_id UUID NOT NULL REFERENCES sucursales(id),
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    fecha TIMESTAMP NOT NULL,
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0)
);

CREATE TABLE detalle_ventas (
    id UUID PRIMARY KEY,
    venta_id UUID NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES productos(id),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12, 2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0)
);
