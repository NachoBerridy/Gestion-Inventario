import axios from "axios";
import { useEffect, useState } from "react";

interface SalePayload{
    date: string;
    quantity: number;
    article: number;
}

export default function CreateSales({setShowModal, createSale, article}: {article:number, setShowModal: (value: boolean) => void, createSale: (sale: SalePayload) => void}) {
    const [date, setDate] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(0);
    const [articleId, setArticle] = useState<number>(article);
    const [nameArticle, setNameArticle] = useState<string>("");


    const handleCreate = () => {
        createSale({date, quantity, article});
        setShowModal(false);
    }
    const fetchData = async () => { 
        try {
            const response = await axios.get(`/api/articulos/${articleId}`)
            const articulo = response.data[0];
            setNameArticle(articulo.nombre);
        }
        catch (error: any) {
            console.error("Error al obtener el nombre del articulo")
        }
    }
    
    useEffect(() => {    
        fetchData()
    }, []);

    return (
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
            <div className="fixed top-0 left-0 z-10 w-full h-full bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setShowModal(false)}>
            </div>
            <div className="flex flex-col items-center z-50 bg-white">
                <h1 className="text-2xl font-bold mb-4">Crear Venta</h1>
                <h2 className="text-lg font-semibold mb-4">{nameArticle}</h2>
                <div className="flex flex-col w-80">
                    <label className="text-sm font-semibold">Fecha</label>
                    <input type="date" className="border border-gray-300 rounded-md p-2 mb-4" onChange={(e) => setDate(e.target.value)} />
                    <label className="text-sm font-semibold">Cantidad</label>
                    <input type="number" className="border border-gray-300 rounded-md p-2 mb-4" onChange={(e) => setQuantity(parseInt(e.target.value))} />
                    <label className="text-sm font-semibold">Articulo</label>
                    {/* <input type="number" className="border border-gray-300 rounded-md p-2 mb-4" onChange={(e) => setArticle(parseInt(e.target.value))} /> */}
                    {/* <span>
                        {articleId}
                    </span> */}
                </div>
                <button className="bg-blue-500 text-white p-2 rounded-md mt-4" onClick={handleCreate}>Crear Venta</button>
            </div>
        </div>
    )
}
    