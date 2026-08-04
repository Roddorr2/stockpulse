-- Migration V3: Additional Seed Data for StockPulse (Operadores y Encargados)

INSERT INTO usuarios (id, email, password_hash, nombre, rol_id) VALUES
('dddd4444-dddd-4444-dddd-444444444444', 'encargado.medellin@stockpulse.com', '$2a$10$eACCq7w9E/r18fN4LgVve.hQ0l2Jp3C5d6E7f8G9h0I1J2K3L4M5N6', 'Mariana Ospina', '22222222-2222-2222-2222-222222222222'),
('eeee5555-eeee-5555-eeee-555555555555', 'encargado.cali@stockpulse.com', '$2a$10$eACCq7w9E/r18fN4LgVve.hQ0l2Jp3C5d6E7f8G9h0I1J2K3L4M5N6', 'Javier Restrepo', '22222222-2222-2222-2222-222222222222'),
('ffff6666-ffff-6666-ffff-666666666666', 'logistica.central@stockpulse.com', '$2a$10$eACCq7w9E/r18fN4LgVve.hQ0l2Jp3C5d6E7f8G9h0I1J2K3L4M5N6', 'Sofía Benítez', '11111111-1111-1111-1111-111111111111');
