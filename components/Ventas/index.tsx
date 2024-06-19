import Card from "./Cards";
import axios from "axios";
import { useEffect, useState } from "react";
import { Articulo } from "../../pages/api/articulos";
import SearchBar from "../Search";
import { toast } from "react-toastify";
import CreateNewArticle from "./CreateArticulo";
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

    const quantityPerPage = 10;

    const filterArticlebyStock = (articulos: Articulo[], filter: string) => {
        if (filter === "stock seguridad") {
            const filtered = articulos.filter((articulo) => articulo.stock <= articulo.stock_seguridad);
            return filtered;
        }
        if (filter === "punto pedido") {
            const filtered = articulos.filter((articulo) => articulo.stock <= articulo.punto_pedido);
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

    const totalPages = Math.ceil(filteredArticle.length / quantityPerPage);
    const displayedArticles = filteredArticle.slice(currentPage * quantityPerPage, (currentPage + 1) * quantityPerPage);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        searchArticle(search, filter);
    }, [search, filter]);

    useEffect(() => {
        fetchData();
    }, [create, update]);

    return (
        <div className="container bg-gray-100">
            <div className="flex flex-col items-center">
                <h1 className="text-center">Articulos</h1>
                <div className="flex items-center justify-end w-full">
                    <SearchBar setSearch={setSearch} />
                    <div className="w-1/4 flex justify-end box-border mr-2">
                        <select className="p-2 focus:outline-none" onChange={(e) => setFilter(e.target.value)}>
                            <option value="">Filtrar por...</option>
                            <option value="stock seguridad">Stock de Seguridad</option>
                            <option value="punto pedido">Punto de Pedido</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="row">
                <div>
                    {displayedArticles.map((articulo) => {
                        return <Card articulo={articulo} key={articulo.id} deleteArticle={deleteArticle} toggleUpdate={toggleUpdate} setId={setId} />
                    })}
                </div>
            </div>
            <div className="flex justify-center">
                <button className="bg-blue-500 text-white p-2 rounded-md" onClick={toggleCreate}>Crear Artículo</button>
            </div>
            {showCreate && <CreateNewArticle toggleCreate={toggleCreate} createArticle={createArticle} />}
            {showUpdate && <UpdateArticle toggleUpdate={toggleUpdate} updateArticle={updateArticle} id={id} />}
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`p-2 ${currentPage === index ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} rounded-md mx-1`}
                        onClick={() => handlePageChange(index)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
