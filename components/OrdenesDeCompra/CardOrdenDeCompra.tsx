import { IOrdenCompra } from "@/pages/api/ordenes";
import { PencilSquareIcon, CheckIcon, XMarkIcon, TrashIcon, ClockIcon } from "@heroicons/react/24/outline";
import formatPrice from "@/utils/formatPrice";
import { useEffect, useState } from "react";

export default function CardOrdenDeCompra(
  {orden, selectOrder, deleteOrder, reciveOrder}:
  {orden:IOrdenCompra, selectOrder: (id:number) => void, deleteOrder: (id:number) => void , reciveOrder: (id:number, dateReceived?:string) => void}
){
  
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [markAsReceived, setMarkAsReceived] = useState<boolean>(false);
  const [dateReceived, setDateReceived]= useState<string>(new Date().toISOString().split("T")[0]);

  const markOrderAsReceived = async() => {
    setMarkAsReceived(false);
    reciveOrder(orden.id, dateReceived);
  }

  const calcularFecha = (fecha: string, plazo: string) => {
    const fechaEnviada = new Date(fecha);
    const dias = parseInt(plazo);
    fechaEnviada.setDate(fechaEnviada.getDate() + dias);
    return fechaEnviada.toISOString().split("T")[0];
  }

  return (
    
    <tr key={orden.id}>
      <td className="text-center p-2">{orden.id}</td>
      <td className="text-center p-2">{orden.articulo}</td>
      <td className="text-center p-2">{orden.proveedor}</td>
      <td className="text-center p-2">{orden.cantidad}</td>
      <td className="text-center p-2">{formatPrice(orden.total)}</td>
      <td className="text-center p-2">{orden.estado}</td>
      <td className="text-center p-2">
        {
          orden.estado === "Enviada" ? calcularFecha(orden.fecha, orden.plazo) :
          orden.estado === "Recibida" ? orden.fecha : "-"
        }
      </td>
      <td className="p-2">
        {
          orden.estado === "Recibida"  ? <CheckIcon className="h-6 w-6 text-lime-800 cursor-pointer" /> :
          orden.estado === "Cancelada" ? <XMarkIcon className="h-6 w-6 text-red-800 cursor-pointer" /> :
          orden.estado === "Enviada" ? <ClockIcon className="h-6 w-6 text-black cursor-pointer" onClick={() => setMarkAsReceived(true)} /> :
          <div className="flex gap-1">
            <PencilSquareIcon className="h-6 w-6 cursor-pointer" onClick={() => selectOrder(orden.id)} />
            <TrashIcon className="h-6 w-6 cursor-pointer" onClick={() => setShowDeleteModal(true)} />
          </div>
        }
        {
          showDeleteModal && 
          <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center" onClick={() => setShowDeleteModal(false)}>
            <div className="bg-white p-4 rounded-md flex flex-col gap-4 justify-center">
              <h2>¿Estás seguro de eliminar la orden de compra?</h2>
              <div className="flex justify-center gap-2">
                <button className="bg-red-500 text-white p-2 rounded-md" onClick={() => deleteOrder(orden.id)}>Eliminar</button>
                <button className="bg-gray-500 text-white p-2 rounded-md" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        }
        {
          markAsReceived && 
          <div className="flex gap-2 fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 items-center justify-center">

            <div className="bg-white p-4 rounded-md flex flex-col gap-4 justify-center">
              <h2>Fecha de recepción</h2>
              <input type="date" value={dateReceived} onChange={(e) => setDateReceived(e.target.value)} />
              <div className="flex justify-center gap-2">
                <button className="bg-green-500 text-white p-2 rounded-md" onClick={markOrderAsReceived}>Recibida</button>
                <button className="bg-gray-500 text-white p-2 rounded-md" onClick={() => setMarkAsReceived(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        }
      </td>
    </tr>
  
  );

}