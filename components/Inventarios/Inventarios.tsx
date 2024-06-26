export const calcInventario = ({
  demandaAnual, //prediccion anual
  tiempoEntrega, //articulo_prov
  costoP, //articulo_prov
  costoA, // precio_unidad * tasa_rota
  desviacionEstandar, //demanda
  tipoInv,
}: {
  demandaAnual: any;
  tiempoEntrega: number;
  costoP: number;
  costoA: number;
  desviacionEstandar: number;
  tipoInv: string;
}) => {
  const costo = costoP / costoA;
  const loteOptimo = Math.sqrt(2 * demandaAnual * costo);
  const factorSeguridadZ = 1.65;

  const stockSeguridad =
    factorSeguridadZ * desviacionEstandar * Math.sqrt(tiempoEntrega);
  const demandaDiaria = demandaAnual / 245;
  const finalData = {
    loteOptimo: loteOptimo,
    puntoPedido:
      tipoInv === "LOTE FIJO"
        ? demandaDiaria * tiempoEntrega + stockSeguridad
        : 0,
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
  const costoPedido = costoPedidoQ * (demandaAnual / loteOptimo);

  const CGI = costoCompra + costoAlmacenamiento + costoPedido;

  return CGI;
};
