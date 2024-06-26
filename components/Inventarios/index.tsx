import { Articulo } from "@/pages/api/articulos";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Inventarios() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const fetchDataArticulo = async () => {
    const response = await axios.get("/api/articulos/all");
    setArticulos(response.data);
  };
  const fetchDataArticuloProveedorBest = async (id: number) => {
    const response = await axios.post("/api/inventario/calcInventario", {
      idArticulo: id,
    });
    console.log(response);
  };
  useEffect(() => {
    fetchDataArticulo();
  }, []);
  const [loteOptimo, setLoteOptimo] = useState(0);
  const [puntoPedido, setPuntoPedido] = useState(0);
  const [stockSeguridad, setStockSeguridad] = useState(0);
  const [CGI, setCGI] = useState(0);

  // setLoteOptimo(loteOptimo);
  // setPuntoPedido(puntoPedido);
  // setStockSeguridad(stockSeguridad);

  // setCGI(CGI);

  return (
    <div className="w-full h-[95%] grid grid-cols-[50%,50%]">
      <div className="w-full h-full overflow-auto p-[0px_20px_0px_0px]">
        {articulos.map((articulo) => (
          <div
            className="h-[70px] w-full mb-[10px] p-[10px_20px] flex items-center border border-black rounded-[8px] bg-white"
            onClick={() => fetchDataArticuloProveedorBest(articulo.id)}
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
        <span className="mt-[10px] h-[50px]">
          Lote Optimo :{" "}
          {loteOptimo === 0 || isNaN(loteOptimo) ? "-" : loteOptimo}
        </span>
        <span className="mt-[10px] h-[50px]">
          Punto Pedido :{" "}
          {puntoPedido === 0 || isNaN(puntoPedido) ? "-" : puntoPedido}
        </span>
        <span className="mt-[10px] h-[50px]">
          Stock Seguridad :{" "}
          {stockSeguridad === 0 || isNaN(stockSeguridad) ? "-" : stockSeguridad}
        </span>
        <span className="mt-[10px] h-[50px]">
          CGI : {CGI === 0 || isNaN(CGI) ? "-" : CGI}
        </span>
      </div>
    </div>
  );
}
