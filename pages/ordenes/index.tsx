import CardOrdenDeCompra from "@/components/OrdenesDeCompra/CardOrdenDeCompra";
import EditarOrdenDeCompra from "@/components/OrdenesDeCompra/EditarOrdenDeCompra";
import { useState, useEffect } from "react";
import axios from "axios";
import { IOrdenCompra } from "@/pages/api/ordenes";
import React from "react";

export default function Orden(){


  const [orders, setOrders] = useState<IOrdenCompra[]>([]);
  const [orderId, setOrderId] = useState<number>(0);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  
  const selectOrder = (id: number) => {
    setOrderId(id);
    setShowEdit(true);
  }

  const fetchOrdenes = async () => {
    try {
      const response = await axios.get("/api/ordenes");
      setOrders(response.data);
      setOrderId(response.data[0]?.id);
    } catch (error) {
      console.error(error);
    }
  }

  const deleteOrder = async (id: number) => {
    try {
      const response = await axios.delete(`/api/ordenes/${id}`);
      fetchOrdenes();
    } catch (error) {
      console.error(error);
    }
  }



  useEffect(() => {

    fetchOrdenes();
  }, []);





  return (
    <div className="w-screen h-screen flex justify-center items-center text-blackcon">
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
          {orders.map((orden) => (
            <CardOrdenDeCompra 
              key={orden.id} 
              orden={orden} 
              selectOrder={selectOrder}
              deleteOrder={deleteOrder}
            />
          ))}
        </tbody>
      </table>
      {
        (orderId!==0) && <EditarOrdenDeCompra orderId={orderId} show={showEdit} setShow={setShowEdit} />
      }
    </div>
  )
}