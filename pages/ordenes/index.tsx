import CardOrdenDeCompra from "@/components/OrdenesDeCompra/CardOrdenDeCompra";
import EditarOrdenDeCompra from "@/components/OrdenesDeCompra/EditarOrdenDeCompra";
import { useState, useEffect } from "react";
import axios from "axios";
import { IOrdenCompra } from "@/pages/api/ordenes";
import React from "react";

export default function Orden(){


  const [ordenes, setOrdenes] = useState<IOrdenCompra[]>([]);

  useEffect(() => {

    const fetchOrdenes = async () => {
        try {
          const response = await axios.get("/api/ordenes");
          setOrdenes(response.data);
        } catch (error) {
          console.error(error);
        }
    }

    fetchOrdenes();
  }, []);



  return (
    <div className="w-screen h-screen bg-gray-600 flex justify-center items-center">
      <table className="w-3/4 bg-white text-black p-4 m-4 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-800 text-lg font-semibold uppercase" >
            <th className="text-center p-2">ID</th>
            <th className="text-center p-2">Artículo</th>
            <th className="text-center p-2">Proveedor</th>
            <th className="text-center p-2">Cantidad</th>
            <th className="text-center p-2">Total</th>
            <th className="text-center p-2">Estado</th>
            <th className="text-center p-2">Fecha Recepción</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => (
            <CardOrdenDeCompra orden={orden} key={orden.id} />
          ))}
        </tbody>
      </table>
    </div>
  )
}