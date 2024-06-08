import { IOrdenCompra } from "@/pages/api/ordenes";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import formatPrice from "@/utils/formatPrice";

export default function CardOrdenDeCompra({orden}:{orden:IOrdenCompra}){

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
        <PencilSquareIcon className="h-6 w-6 cursor-pointer" />
      </td>
    </tr>
  
  );

}