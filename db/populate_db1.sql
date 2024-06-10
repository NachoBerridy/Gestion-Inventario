-- Insertar datos en la tabla Artículo
INSERT INTO Articulo (nombre, stock, stock_seguridad, punto_pedido, modelo_inventario) VALUES
('Articulo A', 15, 10, 20, 'LOTE FIJO'),
('Articulo B', 15, 20, 40, 'LOTE FIJO'),
('Articulo C', 300, 30, 60, 'INTERVALO FIJO'),
('Articulo D', 400, 40, 80, 'INTERVALO FIJO'),
('Articulo E', 50, 50, 100, 'LOTE FIJO'),
('Articulo F', 600, 60, 120, 'LOTE FIJO'),
('Articulo G', 700, 70, 140, 'INTERVALO FIJO'),
('Articulo H', 800, 80, 160, 'LOTE FIJO'),
('Articulo I', 900, 90, 180, 'LOTE FIJO'),
('Articulo J', 1000, 100, 200, 'LOTE FIJO'); 

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
INSERT INTO Articulo_Proveedor (plazo_entrega, articulo_id, proveedor_id) VALUES
(5, 1, 1),
(10, 2, 2),
(15, 3, 3),
(20, 4, 4),
(25, 5, 5),
(30, 6, 6),
(35, 7, 1),
(40, 8, 2),
(45, 9, 3),
(50, 10, 4),
(55, 1, 5),
(60, 2, 6),
(65, 3, 1),
(70, 4, 2),
(75, 5, 3),
(80, 6, 4),
(85, 7, 5),
(90, 8, 6),
(95, 9, 1),
(100, 10, 2);

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
