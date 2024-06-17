-- Insertar datos en la tabla Artículo
INSERT INTO Articulo (nombre, stock, stock_seguridad, punto_pedido, modelo_inventario, tasa_rotacion) VALUES
('Articulo A', 15, 10, 20, 'LOTE FIJO', 0.5),
('Articulo B', 30, 20, 40, 'LOTE FIJO', 0.6),
('Articulo C', 45, 30, 60, 'LOTE FIJO', 0.7),
('Articulo D', 60, 40, 80, 'LOTE FIJO', 0.8),
('Articulo E', 75, 50, 100, 'LOTE FIJO', 0.9),
('Articulo F', 90, 60, 120, 'LOTE FIJO', 1.0),
('Articulo G', 105, 70, 140, 'LOTE FIJO', 1.1),
('Articulo H', 120, 80, 160, 'LOTE FIJO', 1.2),
('Articulo I', 135, 90, 180, 'LOTE FIJO', 1.3),
('Articulo J', 150, 100, 200, 'LOTE FIJO', 1.4);

--Insertar datos en la tabla Articulo_Precio_Venta
INSERT INTO Articulo_Precio_Venta (articulo_id, precio, fecha_inicio, fecha_fin) VALUES
(1, 100, '2024-01-01', null),
(2, 200, '2024-02-01', null),
(3, 300, '2024-03-01', null),
(4, 400, '2024-04-01', null),
(5, 500, '2024-05-01', null),
(6, 600, '2024-06-01', null),
(7, 700, '2024-07-01', null),
(8, 800, '2024-08-01', null),
(9, 900, '2024-09-01', null),
(10, 1000, '2024-10-01', null);

-- Insertar datos en la tabla Proveedor
INSERT INTO Proveedor (nombre, correo, telefono, direccion) VALUES
('Proveedor 1', 'proveedor1@example.com', '1234567890', 'Direccion 1'),
('Proveedor 2', 'proveedor2@example.com', '1234567891', 'Direccion 2'),
('Proveedor 3', 'proveedor3@example.com', '1234567892', 'Direccion 3'),
('Proveedor 4', 'proveedor4@example.com', '1234567893', 'Direccion 4'),
('Proveedor 5', 'proveedor5@example.com', '1234567894', 'Direccion 5'),
('Proveedor 6', 'proveedor6@example.com', '1234567895', 'Direccion 6');

-- Insertar datos en la tabla Articulo_Proveedor
INSERT INTO Articulo_Proveedor (plazo_entrega, articulo_id, proveedor_id, costo_pedido) VALUES
(1, 1, 1, 10),
(2, 2, 2, 20),
(3, 3, 3, 30),
(4, 4, 4, 40),
(5, 5, 5, 50),
(6, 6, 6, 60),
(1, 7, 1, 70),
(2, 8, 2, 80),
(3, 9, 3, 90),
(4, 10, 4, 100),
(5, 1, 5, 110),
(6, 2, 6, 120),
(1, 3, 1, 130),
(2, 4, 2, 140),
(3, 5, 3, 150),
(4, 6, 4, 160),
(5, 7, 5, 170),
(6, 8, 6, 180),
(1, 9, 1, 190),
(2, 10, 2, 200);


-- Insertar datos en la tabla Precio
INSERT INTO Precio (articulo_proveedor_id, precio_unidad, cantidad_min, cantidad_max, fecha_inicio, fecha_fin) VALUES
(1, 50, 10, 100, '2024-01-01', '2024-06-30'),
(2, 75, 20, 200, '2024-02-01', '2024-07-31'),
(3, 100, 30, 300, '2024-03-01', '2024-08-31'),
(4, 125, 40, 400, '2024-04-01', '2024-09-30'),
(5, 150, 50, 500, '2024-05-01', '2024-10-31'),
(6, 175, 60, 600, '2024-06-01', '2024-11-30'),
(7, 200, 70, 700, '2024-07-01', '2024-12-31'),
(8, 225, 80, 800, '2024-08-01', '2025-01-31'),
(9, 250, 90, 900, '2024-09-01', '2025-02-28'),
(10, 275, 100, 1000, '2024-10-01', '2025-03-31');

-- Insertar datos en la tabla Orden_Compra
INSERT INTO Orden_Compra (articulo_proveedor_id, cantidad, total) VALUES
(1, 50, 2500),
(2, 100, 7500),
(3, 150, 15000),
(4, 200, 25000),
(5, 250, 37500);

-- Insertar datos en la tabla Orden_Compra_Estado
INSERT INTO Orden_Compra_Estado (orden_compra_id, estado, fecha) VALUES
(1, 'Pendiente', '2024-06-01'),
(2, 'Enviada', '2024-06-02'),
(3, 'Recibida', '2024-06-03'),
(4, 'Cancelada', '2024-06-04'),
(5, 'Pendiente', '2024-06-05');
