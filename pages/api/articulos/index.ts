export interface Articulo { 
    id : number;
    nombre : string;
    stock : number;
    precio : number;
    tasa_rotacion : number | null;
    stock_seguridad : number | null;
    punto_pedido : number | null;
    stock_ingreso_pendiente: number | null
    modelo_inventario : string | null;
    lote_optimo : number | null;
    proveedor_id : number | null;
    proveedor : string | null;
}