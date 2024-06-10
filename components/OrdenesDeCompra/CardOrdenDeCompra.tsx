import { IOrdenCompra } from "@/pages/api/ordenes";
import { PencilSquareIcon, CheckIcon, XMarkIcon, PaperAirplaneIcon, TrashIcon } from "@heroicons/react/24/outline";
import formatPrice from "@/utils/formatPrice";

export default function CardOrdenDeCompra({orden, selectOrder, deleteOrder}:{orden:IOrdenCompra, selectOrder: (id:number) => void, deleteOrder: (id:number) => void}) {

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
          orden.estado === "Enviada ?" ? calcularFecha(orden.fecha, orden.plazo) :
          orden.estado === "Recibida" ? orden.fecha : "-"
        }
      </td>
      <td className="p-2">
        {
          orden.estado === "Recibida"  ? <CheckIcon className="h-6 w-6 text-lime-800 cursor-pointer" /> :
          orden.estado === "Cancelada" ? <XMarkIcon className="h-6 w-6 text-red-800 cursor-pointer" /> :
          orden.estado === "Enviada" ? <PaperAirplaneIcon className="h-6 w-6 text-blue-800 cursor-pointer" /> :
          <div className="flex gap-1">
            <PencilSquareIcon className="h-6 w-6 cursor-pointer" onClick={() => selectOrder(orden.id)} />
            <TrashIcon className="h-6 w-6 cursor-pointer" onClick={() => deleteOrder(orden.id)} />
          </div>
        }
      </td>
    </tr>
  
  );

}