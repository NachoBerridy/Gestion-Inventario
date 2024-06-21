export const calcModeloLoteFijo = ({
  demandaAnual,
  demandaDiaria,
  tiempoEntrega,
  costoP,
  costoA,
}: {
  demandaAnual: number;
  demandaDiaria: number;
  tiempoEntrega: number;
  costoP: number;
  costoA: number;
}) => {
  const costo = costoP / costoA;
  const loteOptimo = Math.sqrt(2 * demandaAnual * costo);
  const factorSeguridadZ = 1.65;
  const desviacionEstandar = 2;
  const stockSeguridad =
    factorSeguridadZ * desviacionEstandar * Math.sqrt(tiempoEntrega);
  const puntoPedido = demandaDiaria * tiempoEntrega + stockSeguridad;

  const finalData = {
    loteOptimo: loteOptimo,
    puntoPedido: puntoPedido,
    stockSeguridad: stockSeguridad,
  };
  return finalData;
};

export const calcModeloIntervaloFijo = ({
  tiempoRevision,
  tiempoEntrega,
  demanda,
  inventarioDisp,
}: {
  tiempoRevision: number;
  tiempoEntrega: number;
  demanda: number;
  inventarioDisp: number;
}) => {
  const factorSeguridadZ = 1.65;
  const desviacionEstandar = 2;
  const tiempo = tiempoRevision + tiempoEntrega;
  const stockSeguridad =
    factorSeguridadZ * desviacionEstandar * Math.sqrt(tiempoEntrega);
  const loteOptimo = demanda * tiempo - inventarioDisp + stockSeguridad;
  const puntoPedido = demanda * tiempoEntrega + stockSeguridad;
  const finalData = {
    loteOptimo: loteOptimo,
    puntoPedido: puntoPedido,
    stockSeguridad: stockSeguridad,
  };
  return finalData;
};
export const calcCGI = ({
  costoArticulo,
  costoAlmacenar,
  numeroUnidadesPeriodo, //Q
  demanda, //D
  costoPedidoU,
}: {
  costoArticulo: number;
  costoAlmacenar: number;
  numeroUnidadesPeriodo: number;
  demanda: number;
  costoPedidoU: number;
}) => {
  const costoCompra = costoArticulo * demanda;
  const costoAlmacenamiento = costoAlmacenar * (numeroUnidadesPeriodo / 2);
  const costoPedido = costoPedidoU * (demanda / numeroUnidadesPeriodo);
  const CGI = costoCompra + costoAlmacenamiento + costoPedido;
  const finalData = { CGI: CGI };
  return finalData;
};
