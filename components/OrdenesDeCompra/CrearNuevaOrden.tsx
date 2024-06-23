import { Articulo } from "@/pages/api/articulos";
import { newOrder } from "@/pages/api/ordenes";
import formatPrice from "@/utils/formatPrice";
import { CheckIcon, PaperAirplaneIcon, PlusIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CrearNuevaOrden(
  {show, setShow, createOrder, selectOrder}:
  {show:boolean, setShow: (show:boolean) => void, createOrder: (order: newOrder, send: boolean) => void , selectOrder: (id:number) => void}
){
  interface articuloProveedor {
    id:number,
    proveedor:string,
    plazoEntrega:number,
    costoPedido:number,
    precioUnitario:number
  }

  const [order, setOrder] = useState<newOrder>({
    articuloProveedorId: 0,
    cantidad: 0,
    fechaOrden: new Date().toISOString().split("T")[0]
  });
  const [articles, setArticles] = useState<{id:number, nombre:string}[]>([]);
  const [providers, setProviders] = useState<articuloProveedor[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Articulo | null>(null);
  const [selectedProvider, setSelectedProvider] = useState< articuloProveedor | null | undefined>(null);
  const [existingOrder, setExistingOrder] = useState<number | null>(null);
  const [existingOrderState, setExistingOrderState] = useState<string | null>(null);

  const getArticles = async () => {
    const response = await axios.get("/api/articulos/all?onlyName=true");
    setArticles(response.data);
  }

  const getArticle = async (id: number) => {
    const response = await axios.get(`/api/articulos/${id}`);
    setSelectedArticle(response.data[0]);
  }

  const getArticleProviders = async (id: number) => {
    //send a POST request to get the providers of the selected article
    const response = await axios.post("/api/proveedores/listByArticle", {id});
    setProviders(response.data);
  }

  const handleSelectArticle = (id: number) => {
    getArticle(id);
  }

  const handleSelectProvider = (id: number) => {
    const provider = providers.find(provider => provider.id === id);
    setSelectedProvider(provider);
    setOrder((prevOrder) => ({
      ...prevOrder,
      articuloProveedorId: id
    }));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createOrder(order, false);
  }

  const handleCreateAndSend = async (e: any) =>{
    e.preventDefault();
    createOrder(order, true);
  }

  const checkExistingOrders = async (article: number) => {
    const response = await axios.post("/api/ordenes/checkExistingOrders", {article});
    if(response.data.message === "No hay ordenes pendientes") {
      setExistingOrder(null);
    } else {
      setExistingOrder(response.data.id);
      setExistingOrderState(response.data.estado);
    }
  }

  const editExistingOrder = async (id: number) => {
    setShow(false);
    selectOrder(id);
  }

  useEffect(() => {
    getArticles();
  }, []);

  useEffect(() => { 
    if(selectedArticle) {
      getArticleProviders(selectedArticle.id);
      checkExistingOrders(selectedArticle.id);
    }
  }, [selectedArticle]);

  useEffect(() => {
    //reset all when the modal is closed
    if(!show) {
      setOrder({
        articuloProveedorId: 0,
        cantidad: 0,
        fechaOrden: new Date().toISOString().split("T")[0]
      });
      setSelectedArticle(null);
      setSelectedProvider(null);
      setExistingOrder(null);
      setExistingOrderState(null);
      setProviders([]);
    }
  }, [show]);




  return (
    <>
    {
      show 
      ?
        <div className="fixed inset-0 items-center justify-center z-50" style={{display: show ? "flex" : "none"}}>
          <div 
            className="absolute inset-0 bg-black bg-opacity-70"
            onClick={() => setShow(false)}>
          </div>
          <div className="relative z-20 w-1/2  min-h-fit bg-gray-200 p-5 rounded-lg shadow-lg flex flex-col gap-2 justify-start items-center">
            <h2 className="text-xl font-bold">Nueva orden de compra</h2>
            <form className="w-full flex flex-col gap-6" onSubmit={handleCreate}>
              <div className="flex flex-col w-full gap-4">
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="articulo" className="mb-2">Artículo</label>
                  <div className="flex gap-1">
                    <select
                      name="articulo"
                      id="articulo"
                      className="p-2 rounded-md w-full"
                      value={selectedArticle?.id}
                      key={selectedArticle?.id}
                      onChange={(e) => {
                        handleSelectArticle(parseInt(e.target.value));
                      }}
                    >
                      <option className=" text-gray-500" value="" key="no">Seleccionar Artículo</option>
                      {
                        articles.map((article) => (
                          <option key={article.id} value={article.id}>{article.nombre}</option>
                        ))
                      }
                    </select>
                    {
                      selectedArticle && (
                        <p className="p-2 rounded-md font-medium bg-gray-100 min-w-fit">
                          Stock {selectedArticle.stock}
                        </p>
                      )
                    }
                  </div>
                  {
                    existingOrder !== null && 
                    <div className="flex gap-2 items-center mt-1">
                      <p className="font-semibold">Ya existe una orden de compra para este artículo</p>
                      {
                        existingOrderState === "Pendiente"  &&  
                        <button className="bg-contrast text-white p-1 rounded-md" onClick={() => editExistingOrder(existingOrder)}>Editar</button>
                      }
                    </div>
                  }
                </div>
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="proveedor" className="mb-2">Proveedor</label>
                  <select
                    name="proveedor"
                    id="proveedor"
                    className="p-2 rounded-md w-full"
                    value={selectedProvider?.id}
                    key={selectedProvider?.id}
                    onChange={(e) => {
                      handleSelectProvider(parseInt(e.target.value));
                    }}
                  >
                    <option className=" text-gray-500" value="" key="noOption">Seleccionar Proveedor</option>
                    {
                      providers.map((provider) => (
                        <option key={provider.id} value={provider.id}>{provider.proveedor}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col gap-1 text-gray-700 text-sm w-1/2">
                    <h3 className="font-semibold">
                      Detalles del proveedor: 
                    </h3>
                    {
                      selectedProvider 
                      ?
                      <ul className="text-xs flex flex-col gap-1">
                        <li>Plazo de entrega: {selectedProvider.plazoEntrega} días</li>
                        <li>Costo de pedido: {formatPrice(selectedProvider.costoPedido)}</li>
                        <li>Precio unitario: {formatPrice(selectedProvider.precioUnitario)}</li>
                      </ul>
                      :
                      <p className="font-semibold">Selecciona un proveedor</p>
                    }
                  </div> 
                  <div className="flex gap-4">
                    <div className="flex flex-col w-full">
                      <label htmlFor="cantidad" className="mb-2">Cantidad</label>
                      <input
                        type="number"
                        name="cantidad"
                        id="cantidad"
                        className="p-2 rounded-md w-full"
                        value={order.cantidad}
                        onChange={handleChange}
                        disabled={!selectedProvider}
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <label htmlFor="fechaOrden" className="mb-2">Total</label>
                      {
                        selectedProvider 
                        ?
                          <span className="p-2 rounded-md w-full bg-contrast text-xl font-semibold text-white">
                            {formatPrice(order.cantidad * selectedProvider.precioUnitario)}
                          </span>
                        :
                          <span className="p-2 rounded-md w-full">-</span>
                      }
                  </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center w-full pt-2 gap-2">
                <button
                  className="bg-green-500 text-white p-2 rounded-md flex w-1/3 justify-center gap-1 cursor-pointer disabled:bg-gray-400"
                  type="submit"
                  disabled = {!selectedArticle?.id || !order?.articuloProveedorId || order?.cantidad ===0}
                >
                  <CheckIcon className="h-6 w-6" />
                  Crear
                </button>
                <button
                  className="bg-blue-500 text-white p-2 rounded-md w-1/3 flex justify-center gap-1 cursor-pointer disabled:bg-gray-400"
                  onClick={handleCreateAndSend}
                  disabled = {!selectedArticle?.id || !order?.articuloProveedorId || order?.cantidad ===0}
                >
                  <PaperAirplaneIcon className="h-6 w-6" />
                  Crear y Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      : 
        <button className="cursor-pointer  fixed bottom-5 right-5 p-2 bg-black text-white rounded-full" onClick={() => setShow(true)}>
          <PlusIcon className="w-8 h-8 font-black"/>
        </button>
    }
    </>
  );
}