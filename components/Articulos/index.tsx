import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Articulo } from "../../pages/api/articulos";
import SearchBar from "../Search";
import Card from "./Cards";
import CreateNewArticle from "./CreateArticulo";
import CreateSales from "./CreateSales";
import UpdateArticle from "./UpdateArticulo";

export default function Articulos() {
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [search, setSearch] = useState<string>("");
    const [filteredArticle, setFilteredArticle] = useState<Articulo[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [create, setCreate] = useState<boolean>(false);
    const [showCreate, setShowCreate] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const [showUpdate, setShowUpdate] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [showSales, setShowSales] = useState<boolean>(false);
    const [newSaleArticle, setNewSaleArticle] = useState<number>(0);

    const quantityPerPage = 8;

    interface SalePayload{
        date: string;
        quantity: number;
        article: number;
    }

    const filterArticlebyStock = (articulos: Articulo[], filter: string) => {
        if (filter === "stock seguridad") {
            const filtered = articulos.filter((articulo) => (articulo.stock + (articulo.stock_ingreso_pendiente ?? 0)) <= (articulo.stock_seguridad ?? 0 ));
            return filtered;
        }
        if (filter === "punto pedido") {
            const filtered = articulos.filter((articulo) => (articulo.stock + (articulo.stock_ingreso_pendiente ?? 0)) <= (articulo.punto_pedido ?? 0 ));
            return filtered;
        }
        return articulos;
    }

    const searchArticle = async (search: string, filter: string) => {
        const filtered = articulos.filter((articulo) => articulo.nombre.toLowerCase().includes(search.toLowerCase()));
        if (search === "") {
            setFilteredArticle(filterArticlebyStock(articulos, filter));
        }
        setFilteredArticle(filterArticlebyStock(filtered, filter));
    }

    const fetchData = async () => {
        const response = await axios.get("/api/articulos/all");
        setArticulos(response.data);
        setFilteredArticle(response.data);
    }

    const deleteArticle = async (id: number) => {
        try {
            const response = await axios.delete(`/api/articulos/delete`, {
                data: { id: id }
            });
            toast.success(response.data.message);
            fetchData();
        } catch (error: any) {
            if (error.response.status === 500) {
                toast.error("Error al eliminar el articulo");
            } else {
                toast.error(error.response.data.message);
            }
        }
    }

    const toggleCreate = () => {
        setShowCreate(!showCreate);
    }
    const createArticle = async (
        nombre: string,
        stock: number,
        precio: number,
        modeloInventario: string,
        tasaRotacion: number
    ) => {
        try {
            const response = await axios.post("/api/articulos/create", {
                nombre, stock, precio, modeloInventario, tasaRotacion
            });
            setCreate(!create);
            toast.success("Articulo creado correctamente");
            toggleCreate();
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const toggleUpdate = () => {
        setShowUpdate(!showUpdate);
    }
    const updateArticle = async (
        nombre: string,
        stock: number,
        precio: number,
        modeloInventario: string,
        tasaRotacion: number,
        id: number
    ) => {
        try {
            const response = await axios.put("/api/articulos/update", {
                nombre, stock, precio, id, modeloInventario, tasaRotacion
            });
            setUpdate(!update);
            toast.success("Articulo actualizado correctamente");
            toggleUpdate();
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    }

    const newSale =  async (
        payload : SalePayload
    ) => {
        try {
            const response = await  axios.post("/api/venta/create", {
                articulo_id: payload.article,
                cantidad: payload.quantity,
                fecha: payload.date
            });
            toast.success(response.data.message);
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const openNewSale = (id: number) => {
        setNewSaleArticle(id);
        setShowSales(true);
    }
    

    const totalPages = Math.ceil(filteredArticle.length / quantityPerPage);
    const displayedArticles = filteredArticle.slice(currentPage * quantityPerPage, (currentPage + 1) * quantityPerPage);


    const getPaginationButtons = () => {
        const buttons = [];
        let startPage = currentPage;
        
        if (currentPage + 4 > totalPages) {
          startPage = totalPages - 4;
        }
    
        startPage = Math.max(startPage, 0);
    
        for (let i = 0; i < 4; i++) {
          const pageNumber = startPage + i + 1;
          buttons.push(
            <button
              key={i}
              className={`p-2 rounded-md mx-1 shadow-sm transition duration-300 ${currentPage === pageNumber - 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
              onClick={() => handlePageChange(pageNumber - 1)}
            >
              {pageNumber}
            </button>
          );
        }
        return buttons;
      };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        searchArticle(search, filter);
    }, [search, filter]);

    useEffect(() => {
        fetchData();
    }, [create, update]);


    return(
        <div className="container p-4 rounded-lg">
        <div className="flex flex-col items-center">
            <h1 className="text-center text-2xl font-bold mb-4">Artículos</h1>
            <div className="flex items-center justify-between w-full mb-4">
                <SearchBar setSearch={setSearch} />
                <div className="w-1/4 flex justify-end box-border ml-2">
                    <select className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFilter(e.target.value)}>
                        <option value="">Filtrar por...</option>
                        <option value="stock seguridad">Stock de Seguridad</option>
                        <option value="punto pedido">Punto de Pedido</option>
                    </select>
                </div>
            </div>
        </div>
        <div className="row rounded-md p-2  h-5/6">
            {/* <div className="h-5/6 overflow-y-auto"> */}
                {displayedArticles.map((articulo) => (
                    <Card newSale={openNewSale} articulo={articulo} key={articulo.id} deleteArticle={deleteArticle} toggleUpdate={toggleUpdate} setId={setId} />
                ))}
            {/* </div> */}
        </div>
        <div className="flex justify-center fixed z-10 bottom-5 right-5">
            <button 
                className="bg-black text-white flex justify-center items-center p-3 rounded-full shadow-lg hover:scale-110 transition duration-300" 
                onClick={toggleCreate}>
                    <PlusIcon className="h-6 w-6 text-white" />
                </button>
        </div>
        {showCreate && <CreateNewArticle toggleCreate={toggleCreate} createArticle={createArticle} />}
        {showUpdate && <UpdateArticle toggleUpdate={toggleUpdate} updateArticle={updateArticle} id={id} />}
        <div className="flex justify-center mt-6">
            <ChevronLeftIcon className={`w-6 h-6 ${currentPage === 0 ? 'text-gray-300' : 'text-black cursor-pointer hover:text-black'}`} onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)} />
            {getPaginationButtons()}
            <ChevronRightIcon className={`w-6 h-6 ${currentPage === totalPages - 1 ? 'text-gray-300' : 'text-black cursor-pointer hover:text-black'}`} onClick={() => currentPage < totalPages -1 && handlePageChange(currentPage + 1)} />
        </div>
        {
            showSales && <CreateSales setShowModal={setShowSales} createSale={newSale} article={newSaleArticle} />
        }

    </div>
    
    )
}
