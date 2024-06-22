import { IOrdenCompra } from "@/pages/api/ordenes";
import { useEffect, useState } from "react";
import axios from "axios";
import formatPrice from "@/utils/formatPrice";
interface EditPayload {
  id: number, estado: string, fecha: string, cantidad: number, articuloProveedorId: number
}

export default function CrearNuevaOrden({orderId, show, setShow, updateOrder}:{orderId:number, show:boolean, setShow: (show:boolean) => void, updateOrder: (payload: EditPayload) => void}) {


  const [order, setOrder] = useState<IOrdenCompra>({
    id: orderId,
    articulo: "",
    articuloId: 0,
    proveedorId: 0,
    proveedor: "",
    precio: 0,
    estado: "",
    fecha: "",
    cantidad: 0,
    total: 0,
    plazo: "",
    articuloProveedorId: 0
  });


  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<any>({});
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
    if (name == "cantidad") {
      setOrder((prevOrder) => ({
        ...prevOrder,
        total: Number(value) * order.precio
      }));
    }
  };

  const handleSelectProvider = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedProvider(providers.find((provider) => provider.id === Number(value)));
    setOrder((prevOrder) => ({
      ...prevOrder,
      proveedorId: Number(value),
      articuloProveedorId: Number(value)
    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateOrder({
      id: orderId,
      estado: order.estado,
      fecha: order.fecha,
      cantidad: order.cantidad,
      articuloProveedorId: order.articuloProveedorId
    });
  }

  useEffect(() => {
    const getProviders = async (id: number) => {
      const response = await axios.post("/api/proveedores/listByArticle", {id});
      setProviders(response.data);
      setSelectedProvider(response.data.find((provider: { id: number }) => provider.id === order.articuloProveedorId));
    }

    const getOrder = async () => {
      const response = await axios.get(`/api/ordenes/${orderId}`);
      setOrder(response.data);
      getProviders(response.data.articuloId);
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
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex w-full gap-2">
            <div className="flex flex-col w-1/2">
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="proveedor" className="mb-2">Proveedor</label>
                <select
                  name="proveedor"
                  id="proveedor"
                  className="p-2 rounded-md w-full"
                  value={selectedProvider?.id ? selectedProvider.id : ""}
                  onChange={handleSelectProvider}
                >
                  <option value="">Seleccionar Proveedor</option>
                  {
                    providers.map((provider) => (
                      <option key={provider.id} value={provider.id}>{provider.proveedor}</option>
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
                <label htmlFor="fecha" className="mb-2">Fecha</label>
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
                <span className="p-2 rounded-md w-full bg-contrast text-white">{formatPrice(order.total)}</span>
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="plazo" className="mb-2">Plazo de Entrega</label>
                <span className="p-2 rounded-md w-full ">{order.plazo} días</span>
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



