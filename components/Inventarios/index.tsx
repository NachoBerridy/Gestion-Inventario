import { Articulo, ArticuloMejorProveedor } from "@/pages/api/articulos";
import formatPrice from "@/utils/formatPrice";
import axios from "axios";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";

export default function Inventarios() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const fetchDataArticulo = async () => {
    const response = await axios.get("/api/articulos/all");
    setArticulos(response.data);
  };
  const [articuloMejorProveedor, setArticuloMejorProveedor] = useState<
    ArticuloMejorProveedor[]
  >([]);
  const fetchDataArticuloProveedorBest = async (id: number) => {
    const response = await axios.post("/api/inventario/calcInventario", {
      idArticulo: id,
    });
    setArticuloMejorProveedor((prev) => prev.concat(response.data.articulo));
  };
  useEffect(() => {
    fetchDataArticulo();
  }, []);
  useEffect(() => {
    if (articulos.length > 0) {
      articulos.map((arti) => fetchDataArticuloProveedorBest(arti.id));
    }
  }, [articulos]);
  const [loteOptimo, setLoteOptimo] = useState(0);
  const [puntoPedido, setPuntoPedido] = useState<number | null>(0);
  const [stockSeguridad, setStockSeguridad] = useState(0);
  const [CGI, setCGI] = useState(0);
  const [demandaAnual, setDemandaAnual] = useState(0);
  const [plazoEntrega, setPlazoEntrega] = useState(0);
  const [stock, setStock] = useState(0);

  const handleSetData = (articulo: ArticuloMejorProveedor) => {
    setLoteOptimo(articulo.CalculosInventario.loteOptimo);
    setPuntoPedido(articulo.CalculosInventario.puntoPedido);
    setStockSeguridad(articulo.CalculosInventario.stockSeguridad);

    setCGI(articulo.CGI);
    setDemandaAnual(articulo.demandaAnual);
    setPlazoEntrega(articulo.plazo_entrega);
    setStock(articulo.stock);
  };
  const data = useMemo(
    () => _.orderBy(articuloMejorProveedor, "id", "asc"),
    [articuloMejorProveedor]
  );
  return (
    <div className="w-full h-[95%] grid grid-cols-[50%,50%]">
      <div className="w-full h-full overflow-auto p-[0px_20px_0px_0px]">
        {data.map((articulo) => (
          <div
            className="h-[130px] w-full mb-[10px] p-[10px_20px] flex items-center border border-black rounded-[8px] bg-white"
            onClick={() => handleSetData(articulo)}
          >
            <span className="text-[18px] w-[80%] h-[100%] grid grid-rows-[40%,40%,20%] items-center">
              <span>{`${articulo.id}- ${articulo.nombre}`}</span>
              <span>{`Proveedor: ${articulo.nombreProveedor}`}</span>

              <span className="text-[12px]">{articulo.modelo_inventario}</span>
            </span>
            <span className="ml-auto text-[14px] h-full w-[20%] grid grid-rows-[50%,50%] items-center">
              <span>Precio: ${articulo.precio_unidad}</span>
              <span>Costo de Ped: ${articulo.costo_pedido}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="w-full h-full bg-white p-[20px_0_0_20px] flex flex-col text-[20px]">
        <span className="mt-[10px] h-[50px]">
          Lote Optimo :{" "}
          {loteOptimo === 0 || isNaN(loteOptimo) ? "-" : loteOptimo}
        </span>
        <span className="mt-[10px] h-[50px]">
          Punto Pedido :{" "}
          {puntoPedido === 0 || puntoPedido === null
            ? "-"
            : Math.trunc(puntoPedido)}
        </span>
        <span className="mt-[10px] h-[50px]">
          Stock Seguridad :{" "}
          {stockSeguridad === 0 || isNaN(stockSeguridad)
            ? "-"
            : `${Math.trunc(stockSeguridad)} (${stockSeguridad
                .toString()
                .slice(0, 5)})`}
        </span>
        <span className="mt-[10px] h-[50px]">
          CGI : {CGI === 0 || isNaN(CGI) ? "-" : formatPrice(CGI)}
        </span>{" "}
        <span className="mt-[10px] h-[50px]">
          Demanda Anual :{" "}
          {demandaAnual === 0 || isNaN(demandaAnual)
            ? "-"
            : Math.trunc(demandaAnual)}
        </span>
        <span className="mt-[10px] h-[50px]">
          Demanda Diaria :{" "}
          {demandaAnual === 0 || isNaN(demandaAnual)
            ? "-"
            : Math.trunc(demandaAnual / 245)}
        </span>
        <span className="mt-[10px] h-[50px]">
          Stock : {stock === 0 || isNaN(stock) ? "-" : Math.trunc(stock)}
        </span>
        <span className="mt-[10px] h-[50px]">
          Plazo de entrega :{" "}
          {plazoEntrega === 0 || isNaN(plazoEntrega)
            ? "-"
            : Math.trunc(plazoEntrega)}
        </span>
      </div>
    </div>
  );
}
