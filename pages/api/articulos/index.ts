export interface Articulo {
  id: number;
  nombre: string;
  stock: number;
  precio: number;
  tasa_rotacion: number | null;
  stock_seguridad: number | null;
  punto_pedido: number | null;
  stock_ingreso_pendiente: number | null;
  modelo_inventario: string | null;
  lote_optimo: number | null;
  proveedor_id: number | null;
  proveedor: string | null;
}
export interface CalculosInventario {
  loteOptimo: number;
  puntoPedido: number | null;
  stockSeguridad: number;
}
export interface ArticuloMejorProveedor {
  id: number;
  stock: number;
  idProveedor: number;
  nombreProveedor: string;
  modelo_inventario: string | null;
  nombre: string;
  plazo_entrega: number;
  precio_unidad: number;
  tasa_rotacion: number | null;
  demandaAnual: number;
  costo_pedido: number;
  CGI: number;
  CalculosInventario: CalculosInventario;
}
