import { IOrdenCompra } from "@/pages/api/ordenes";
import { useEffect, useState } from "react";
import axios from "axios";

export default function NuevaOrdenCompra({orderId, show, setShow}:{orderId:number, show:boolean, setShow: (show:boolean) => void}) {


  const [order, setOrder] = useState<IOrdenCompra>({
    id: orderId,
    articulo: "",
    proveedor: "",
    precio: 0,
    estado: "",
    fecha: "",
    cantidad: 0,
    total: 0,
    plazo: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  useEffect(() => {
    const getOrder = async () => {
      const response = await axios.get(`/api/ordenes/${orderId}`);
      setOrder(response.data);
      console.log(response.data);
      console.log("order", order);
    }
    getOrder();
  }, [orderId]);

  return (
    <div className="fixed inset-0 items-center justify-center z-50" style={{display: show ? "flex" : "none"}}>
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={() => setShow(false)}>
      </div>
      <div className="relative z-20 w-1/2 min-h-fit h-1/2 bg-gray-200 p-5 rounded-lg shadow-lg flex flex-col justify-start items-center">
        <h2 className="text-xl font-bold mb-4">Orden de Compra de { order.articulo }</h2>
        <form className="w-full">
          <div className="flex w-full gap-2">
            <div className="flex flex-col w-1/2">
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="proveedor" className="mb-2">Proveedor</label>
                <select
                  name="proveedor"
                  id="proveedor"
                  className="p-2 rounded-md w-full"
                  value={order.proveedor}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar Proveedor</option>
                  {
                    providers.map((provider) => (
                      <option key={provider.id} value={provider.id}>{provider.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="cantidad" className="mb-2">Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  id="cantidad"
                  className="p-2 rounded-md w-full"
                  value={order.cantidad}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="fecha" className="mb-2">Fecha de Recepción</label>
                <input
                  type="date"
                  name="fecha"
                  id="fecha"
                  className="p-2 rounded-md w-full"
                  value={order.fecha}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col w-1/2 mb-4">
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="estado" className="mb-2">Estado</label>
                <select
                  name="estado"
                  id="estado"
                  className="p-2 rounded-md w-full"
                  value={order.estado}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar Estado</option>
                  {
                    //Si esta pendiente las opciones son Enviada, Cancelada y dejarla pendiente
                    //Si esta enviada las opciones son Recibida y dejarla enviada
                    //Si esta recibida no se puede cambiar
                    //Si esta cancelada no se puede cambiar

                    order.estado === "Pendiente" ? (
                      <>
                        <option value="Enviada">Enviada</option>
                        <option value="Cancelada">Cancelada</option>
                        <option value="Pendiente">Pendiente</option>
                      </>
                    ) : order.estado === "Enviada" ? (
                      <>
                        <option value="Recibida">Recibida</option>
                        <option value="Enviada">Enviada</option>
                      </>
                    ) : (
                      <option value={order.estado}>{order.estado}</option>
                    )

                  }
                </select>
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="total" className="mb-2">Total</label>
                <input
                  type="number"
                  name="total"
                  id="total"
                  className="p-2 rounded-md w-full"
                  value={order.total}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="plazo" className="mb-2">Plazo de Entrega</label>
                <input
                  type="number"
                  name="plazo"
                  id="plazo"
                  className="p-2 rounded-md w-full"
                  value={order.plazo}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full">
            <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}



