-- Migration V4: Add activo to productos

ALTER TABLE productos ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;
