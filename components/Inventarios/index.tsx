import { Articulo } from "@/pages/api/articulos";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  calcCGI,
  calcModeloIntervaloFijo,
  calcModeloLoteFijo,
} from "./Inventarios";

export default function Inventarios() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const fetchData = async () => {
    const response = await axios.get("/api/articulos/all");
    setArticulos(response.data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const [loteOptimo, setLoteOptimo] = useState(0);
  const [puntoPedido, setPuntoPedido] = useState(0);
  const [stockSeguridad, setStockSeguridad] = useState(0);
  const [CGI, setCGI] = useState(0);

  const calcInventario = (articulo: Articulo | null) => {
    if (articulo !== null) {
      if (articulo.modelo_inventario === "LOTE FIJO") {
        const { loteOptimo, puntoPedido, stockSeguridad } =
          calcModeloLoteFijo();

        setLoteOptimo(loteOptimo);
        setPuntoPedido(puntoPedido);
        setStockSeguridad(stockSeguridad);
      }

      if (articulo.modelo_inventario === "INTERVALO FIJO") {
        const { loteOptimo, puntoPedido, stockSeguridad } =
          calcModeloIntervaloFijo();

        setLoteOptimo(loteOptimo);
        setPuntoPedido(puntoPedido);
        setStockSeguridad(stockSeguridad);
      }
      const { CGI } = calcCGI();
      setCGI(CGI);
    }
  };
  return (
    <div className="w-full h-[95%] grid grid-cols-[35%,65%]">
      <div className="w-full h-full overflow-auto">
        {articulos.map((articulo) => (
          <div
            className="h-[70px] w-full mb-[10px] p-[10px_20px] flex items-center border border-black rounded-[8px] bg-white"
            onClick={() => calcInventario(articulo)}
          >
            <span className="text-[18px] w-[80%] grid grid-rows-[50%,50%] items-center">
              <span>{articulo.nombre}</span>
              <span className="text-[12px]">{articulo.modelo_inventario}</span>
            </span>
            <span className="ml-auto text-[14px] h-full w-[20%] grid grid-rows-[50%,50%] items-center">
              <span>Stock: {articulo.stock}</span>
              <span>Precio: {articulo.precio}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="w-full h-full bg-white p-[20px_0_0_20px] flex flex-col text-[20px]">
        <span className="mt-[10px] h-[50px]">Lote Optimo : {loteOptimo}</span>
        <span className="mt-[10px] h-[50px]">Punto Pedido : {puntoPedido}</span>
        <span className="mt-[10px] h-[50px]">
          Stock Seguridad : {stockSeguridad}
        </span>
        <span className="mt-[10px] h-[50px]">CGI : {CGI}</span>
      </div>
    </div>
  );
}
