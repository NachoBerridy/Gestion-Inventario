import Card from "./Cards";
import axios from "axios";
import { useEffect, useState } from "react";
import { Articulo } from "../../pages/api/articulos";
import SearchBar from "../Search";
import { toast } from "react-toastify";
export default function Articulos() {

    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [search, setSearch] = useState<string>("");
    const [filteredArticle, setFilteredArticle] = useState<Articulo[]>([]);
    const [filter, setFilter] = useState<string>("");

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

    const searchArticle = async (search: string,filter:string) => {
        const filtered = articulos.filter((articulo) => articulo.nombre.toLowerCase().includes(search.toLowerCase()));
        if (search === "") {
            setFilteredArticle(filterArticlebyStock(articulos,filter))

        }
        setFilteredArticle(filterArticlebyStock(filtered,filter));

    }
    
    const fetchData = async () => {
        const response = await axios.get("/api/articulos/all");
        setArticulos(response.data);
        setFilteredArticle(response.data)
    }

    const deleteArticle = async (id:number) => {
        try {
            const response = await axios.delete(`/api/articulos/delete`,
            {
                data: {
                    id: id
                }
            });
            toast.success(response.data.message);
            fetchData();
        } catch (error:any) {
            //if code 500
            if (error.response.status === 500) {
                toast.error("Error al eliminar el articulo");
            } else {
                toast.error(error.response.data.message);
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        searchArticle(search,filter);
    }, [search,filter]);

    return (
        <div className="container bg-gray-100">
            <div className="flex flex-col items-center">
                <h1 className="text-center">Articulos</h1>
                <div className="flex items-center justify-end w-full">
                    <SearchBar setSearch={setSearch} />
                    <div className="w-1/4 flex justify-end box-border mr-2" >
                        <select className="p-2 focus:outline-none" onChange={(e) => setFilter(e.target.value)}>
                            <option value="">Filtrar por...</option>
                            <option value="stock seguridad">Stock de Seguridad</option>
                            <option value="punto pedido">Punto de Pedido</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="">
                    {filteredArticle.map((articulo) => {
                        return <Card articulo={articulo} key={articulo.id} deleteArticle={deleteArticle}/>
                    })}
                </div>
            </div>
            
        </div>
    );
}