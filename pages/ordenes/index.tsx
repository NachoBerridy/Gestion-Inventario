import CardOrdenDeCompra from "@/components/OrdenesDeCompra/CardOrdenDeCompra";
import EditarOrdenDeCompra from "@/components/OrdenesDeCompra/EditarOrdenDeCompra";
import { useState, useEffect } from "react";
import axios from "axios";
import { IOrdenCompra } from "@/pages/api/ordenes";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import CrearNuevaOrden from "@/components/OrdenesDeCompra/CrearNuevaOrden";
import { newOrder } from "@/pages/api/ordenes";
import { toast } from "react-toastify";
interface EditPayload {
  id: number, estado: string, fecha: string, cantidad: number, articuloProveedorId: number
}
export default function OrdenesDeCompra() {
  const [orders, setOrders] = useState<IOrdenCompra[]>([]);
  const [orderId, setOrderId] = useState<number>(0);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [searchArticle, setSearchArticle] = useState<string>("");
  const [searchProvider, setSearchProvider] = useState<string>("");
  const [filteredOrders, setFilteredOrders] = useState<IOrdenCompra[]>([]);
  const [page, setPage] = useState<number>(1);
  const amount = 5;
  const [ displayOrders, setDisplayOrders ] = useState<IOrdenCompra[]>([]);

  const handlePageChange = (page: number) => {
    setPage(page);
    setDisplayOrders(filteredOrders.slice((page - 1) * amount, page * amount));
  }

  const selectOrder = (id: number) => {
    setOrderId(id);
    setShowEdit(true);
  }

  const fetchOrdenes = async () => {
    try {
      const response = await axios.get("/api/ordenes");
      setOrders(response.data);
      setOrderId(response.data[0]?.id);
      setFilteredOrders(response.data);
      setDisplayOrders(response.data.slice((page - 1) * amount, page * amount));
    } catch (error) {
      console.error(error);
    }
  }

  const deleteOrder = async (id: number) => {
    try {
      const response = await axios.delete(`/api/ordenes/${id}`);
      toast.success("Orden de compra eliminada exitosamente");
      fetchOrdenes();
    } catch (error) {
      toast.error("Error al eliminar la orden de compra");
      console.error(error);
    }
  }

  const createOrder = async (order: newOrder, send: boolean) => {
    try {
      const orderId = await axios.post("/api/ordenes/create", order);
      send && await axios.put("/api/ordenes/update", { ...order, id: orderId.data.id, estado: "Enviado", fecha: new Date().toISOString().split("T")[0]});
      setShowNew(false);
      fetchOrdenes();
      toast.success("Orden de compra creada exitosamente");
    } catch (error) {
      toast.error("Error al crear la orden de compra");
    }
  }

  const reciveOrder = async (id: number, date = new Date().toISOString().split("T")[0]) => {
    try {
      await axios.put("/api/ordenes/update", {id, estado: "Recibida", fecha: date});
      fetchOrdenes();
      toast.success("Orden de compra recibida exitosamente");
    } catch (error) {
      toast.error("Error al recibir la orden de compra");
    }
  }

  const updateOrder = async (payload: EditPayload) => {
    try {
      await axios.put("/api/ordenes/update", { ...payload });
      toast.success("Orden de compra actualizada exitosamente");
      showEdit && setShowEdit(false);
      fetchOrdenes();
    } catch (error) {
      toast.error("Error al actualizar la orden de compra");
    }
  }

  const handleFilter = () => {
    let tempOrders = orders;
    if (searchArticle) {
      tempOrders = tempOrders.filter(order => order.articulo.toLowerCase().includes(searchArticle.toLowerCase()));
    }
    if (searchProvider) {
      tempOrders = tempOrders.filter(order => order.proveedor.toLowerCase().includes(searchProvider.toLowerCase()));
    }
    setFilteredOrders(tempOrders);
    setPage(1); // Reset to the first page on new filter
  }


  useEffect(() => {

    fetchOrdenes();
  }, []);





  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center text-blackcon">
      <div className="w-11/12 bg-white p-4 m-4 rounded-lg shadow-lg">
        <div className="flex justify-start gap-2 mb-4">
          <input
            type="text"
            placeholder="Buscar por artículo"
            value={searchArticle}
            onChange={(e) => setSearchArticle(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Buscar por proveedor"
            value={searchProvider}
            onChange={(e) => setSearchProvider(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        {
          displayOrders.length === 0 
          ? 
          <p className="text-center font-semibold text-xl">
            No hay órdenes de compra con esos criterios de búsqueda
          </p>
          :
          <table className="w-full bg-white text-black">
            <thead>
              <tr className="bg-gray-200 text-gray-800 text-lg font-semibold uppercase">
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
              {displayOrders.map((orden) => (
                <CardOrdenDeCompra
                  key={orden.id}
                  orden={orden}
                  selectOrder={selectOrder}
                  deleteOrder={deleteOrder}
                  reciveOrder={reciveOrder}
                />
              ))}
            </tbody>
          </table>
        }
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="focus:outline-none px-2 mx-2 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <div className="flex">
            {
              Array.from({ length: Math.ceil(filteredOrders.length / amount) }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`px-2 py-1 focus:outline-none ${num === page ? "bg-contrast text-white cursor-not-allowed" : "bg-secondary-bg hover:scale-125  cursor-pointer"}`}
                >
                  {num}
                </button>
              ))
            }
          </div>
          <button
            onClick={() => handlePageChange(page + 1)}
            className="focus:outline-none px-2 mx-2 disabled:cursor-not-allowed"
            disabled={page === Math.ceil(filteredOrders.length / amount)}
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      {
        (orderId !== 0) && <EditarOrdenDeCompra orderId={orderId} show={showEdit} setShow={setShowEdit} updateOrder={updateOrder} />
      }
      <CrearNuevaOrden show={showNew} setShow={setShowNew} createOrder={createOrder} selectOrder={selectOrder} />
    </div>
  )
}