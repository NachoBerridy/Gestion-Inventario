export const calcInventario = ({
  demandaAnual, //prediccion anual
  tiempoEntrega, //articulo_prov
  costoP, //articulo_prov
  costoA, // precio_unidad * tasa_rota
  // desviacionEstandar, //demanda
  tipoInv,
}: {
  demandaAnual: any;
  tiempoEntrega: number;
  costoP: number;
  costoA: number;
  // desviacionEstandar: number;
  tipoInv: string;
}) => {
  const costo = costoP / costoA;
  const loteOptimo = Math.sqrt(2 * demandaAnual * costo);
  const factorSeguridadZ = 1.65;
  const demandaDiaria = demandaAnual / 245;
  const desviacionEstandar = demandaDiaria * 0.05;
  const stockSeguridad =
    factorSeguridadZ * desviacionEstandar * Math.sqrt(tiempoEntrega);
  const finalData = {
    loteOptimo: loteOptimo,
    puntoPedido: demandaDiaria * tiempoEntrega,
    stockSeguridad: stockSeguridad,
  };
  return finalData;
};
export const calcCGI = ({
  costoArticulo, //precio_unidad
  costoAlmacenar, //precio_unidad * rotacion
  loteOptimo, //Q
  demandaAnual, //D
  costoPedidoQ, //costo_pedido
}: {
  costoArticulo: number;
  costoAlmacenar: number;
  loteOptimo: number;
  demandaAnual: number;
  costoPedidoQ: number;
}) => {
  const costoCompra = costoArticulo * demandaAnual;
  const costoAlmacenamiento = costoAlmacenar * (loteOptimo / 2);
  const costoPedido =
    loteOptimo === 0 || demandaAnual == 0
      ? 0
      : costoPedidoQ * (demandaAnual / loteOptimo);

  const CGI = costoCompra + costoAlmacenamiento + costoPedido;

  return CGI;
};
