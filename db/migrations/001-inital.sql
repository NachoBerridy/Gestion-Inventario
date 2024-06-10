-- https://www3.sqlite.org/foreignkeys.html
-- https://www.sqlite.org/draft/datatype3.html
-- Date en txt y iso format

--ARTICULO
create table if not exists Articulo (
    id integer primary key,
    nombre text,
    stock integer,
    stock_seguridad integer,
    punto_pedido integer,
    lote_optimo integer,
    modelo_inventario text
);

--VENTA
create table if not exists Venta (
    id integer primary key,
    articulo_id integer,
    fecha text,
    precio integer,
    cantidad integer,
    foreign key (articulo_id) references Articulo(id)
);

--PREDICCION DEMANDA
create table if not exists Prediccion_Demanda (
    id integer primary key,
    articulo_id integer,
    periodo text,
    cantidad integer,
    metodo text,
    foreign key (articulo_id) references Articulo(id)
);

--ARTICULO PRECIO VENTA
create table if not exists Articulo_Precio_Venta (
    id integer primary key,
    articulo_id integer,
    precio float,
    fecha_inicio text,
    fecha_fin text,
    foreign key (articulo_id) references Articulo(id)
);

--PROVEEDOR
create table if not exists Proveedor (
    id integer primary key,
    nombre text,
    correo text,
    telefono text,
    direccion text
);

--ARTICULO PROVEEDOR
create table if not exists Articulo_Proveedor (
    id integer primary key,
    plazo_entrega integer,
    articulo_id integer,
    proveedor_id integer,
    foreign key (articulo_id) references Articulo(id),
    foreign key (proveedor_id) references Proveedor(id)
);

--PRECIO
create table if not exists Precio (
    id integer primary key,
    articulo_proveedor_id integer,
    precio_unidad float,
    cantidad_min integer,
    cantidad_max integer,
    fecha_inicio text,
    fecha_fin text,
    foreign key (articulo_proveedor_id) references Articulo_Proveedor(id)
);

--HISTORIAL CALCULO
create table if not exists Historial_Calculo (
    id integer primary key,
    articulo_proveedor_id integer,
    tipo_inventario text,
    lote_optimo integer,
    punto_optimo integer,
    stock_seguridad integer,
    fecha text,
    demanda integer,
    foreign key (articulo_proveedor_id) references Articulo_Proveedor(id)
);

--ORDEN COMPRA
create table if not exists Orden_Compra (
    id integer primary key,
    articulo_proveedor_id integer,
    cantidad integer,
    total integer,
    foreign key (articulo_proveedor_id) references Articulo_Proveedor(id)
);

--ORDEN COMPRA ESTADO
create table if not exists Orden_Compra_Estado (
    id integer primary key,
    orden_compra_id integer,
    estado text,
    fecha text,
    foreign key (orden_compra_id) references Orden_Compra(id)
);

--CONFIGURACION
create table if not exists Configuracion (
    id integer primary key,
    valor text
);