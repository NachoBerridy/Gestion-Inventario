import Card from "./Cards";
import axios from "axios";
import { useEffect, useState } from "react";
import { Articulo } from "../../pages/api/articulos";
import SearchBar from "../Search";
export default function Articulos() {

    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [search, setSearch] = useState<string>("");
    // const [filteredArticleByName, setFilteredArticleByName] = useState<Articulo[]>([]);
    const [filteredArticle, setFilteredArticle] = useState<Articulo[]>([]);
    // const [filteredArticleByStock, setFilteredArticleByStock] = useState<Articulo[]>([]);
    const [filter, setFilter] = useState<string>("");
    // const [show, setShow] = useState<boolean>(false);

    // const searchArticle = async (search: string) => {
    //     const filtered = articulos.filter((articulo) => articulo.nombre.toLowerCase().includes(search.toLowerCase()));
    //     if (search === "") {
    //         setFilteredArticleByName(articulos)
    //     }
    //     setFilteredArticleByName(filtered);
    // }
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
    
    // const searchArticleByStock = async (filter: string) => {
    //     if (filter === "stock seguridad") { 
    //         const filtered = articulos.filter((articulo) => articulo.stock <= articulo.stock_seguridad);
    //         setFilteredArticleByStock(filtered);
    //     }
    //     if (filter === "punto pedido") {
    //         const filtered = articulos.filter((articulo) => articulo.stock <= articulo.punto_pedido);
    //         setFilteredArticleByStock(filtered);
    //     }
    // }

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("/api/articulos/all");
            setArticulos(response.data);
            setFilteredArticle(response.data)
            // setFilteredArticleByName(response.data)
            // setFilteredArticleByStock(response.data)
        }
        fetchData();
    }, []);
    useEffect(() => {
        searchArticle(search,filter);
    }, [search,filter]);

    // useEffect(()=>{
    //     console.log(search)
    //     searchArticle(search);
    // },[search])

    // useEffect(()=>{
    //     console.log(filter)
    //     searchArticleByStock(filter);
    // },[filter])

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
                        return <Card articulo={articulo} key={articulo.id} />
                    })}
                </div>
            </div>
            
        </div>
    );
}