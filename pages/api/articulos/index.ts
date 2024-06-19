export interface Articulo { 
    id : number;
    nombre : string;
    stock : number;
    precio : number;
    stock_seguridad : number | null;
    punto_pedido : number | null;
    modelo_inventario : string | null;
    lote_optimo : number | null;
}