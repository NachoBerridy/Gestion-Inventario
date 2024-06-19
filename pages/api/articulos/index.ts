export interface Articulo { 
    id : number;
    nombre : string;
    stock : number;
    precio : number;
    stock_seguridad : number;
    punto_pedido : number;
    modelo_inventario : string;
    lote_optimo : number;
    tasa_rotacion : number;
}