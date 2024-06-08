import { IOrdenCompra } from "@/pages/api/ordenes";
import { useState } from "react";

export default function NuevaOrdenCompra({orderId}:{orderId:number}){


  const [orden, setOrden] = useState<IOrdenCompra>({
    id: orderId,
    articulo_proveedor_id: 0,
    cantidad: 0,
    estado: "",
    fecha: "",
  });

  //TODO Hacer un useEffect que traiga la orden de compra con el id que se recibe por props y complete informcación de article
  //La Anto va a hacer una interface de artículo, importarla y usarla en el tipado de article
  const [article, setArticle] = useState<{name:string} | null>({
    name: "Artículo 1"
  });

  const [providers, setProviders] = useState<any[]>([]); //TODO Cambiar any por una interface de proveedores
  
  /* TODO Implementar función que traiga la lista de proveedores para este artícul
    Esta función debe traer la lista de proveedores para el artículo seleccionado, 
    el precio unitario y la cantidad máxima y mínima que se puede solicitar en cada proveedor
  */

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div className="relative z-20 w-1/2 h-1/2 bg-gray-200 p-5 rounded-lg shadow-lg flex justify-center items-start">
        <h2 className="text-xl font-bold mb-4">Orden de Compra de {article?.name}</h2>
        <form className="w-full">
        </form>
      </div>
    </div>
  );
}



