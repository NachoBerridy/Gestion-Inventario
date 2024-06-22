import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CreateNewArticle ({toggleCreate,createArticle}:{ toggleCreate: () => void, createArticle: (nombre: string, stock: number, precio: number, modelo_inventario: string, tasaRotacion: number) => void }) {
    const [nombre, setNombre] = useState<string>("");
    const [stock, setStock] = useState<number>(0);
    const [precio, setPrecio] = useState<number>(0);
    const [modelo_inventario, setModeloInventario] = useState<string>("");
    const [tasaRotacion, setTasaRotacion] = useState<number>(0);
    
    const create = async () => {
        try {
            await createArticle(nombre, stock, precio, modelo_inventario, tasaRotacion);
        } catch (error:any) {

        }
    }
    

    return (
        <div className="flex justify-center items-center h-screen w-screen fixed top-0 bottom-0 right-0 left-0 m-auto">
            <div className="modal fixed w-screen h-screen bg-gray-900 bg-opacity-50 top-0 left-0 z-40" onClick={toggleCreate}>
            </div>
            <div className="w-1/2 bg-white p-4 rounded-lg shadow-lg z-50">
                <h2 className="text-2xl font-bold text-center">Crear Artículo</h2>
                <form className="flex flex-col gap-4">
                    <label htmlFor="nombre">Nombre</label>
                    <input type="text" name="nombre" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    <label htmlFor="stock">Stock</label>
                    <input type="number" name="stock" id="stock" value={stock} onChange={(e) => setStock(parseInt(e.target.value))} />
                    <label htmlFor="precio">Precio</label>
                    <input type="number" name="precio" id="precio" value={precio} onChange={(e) => setPrecio(parseInt(e.target.value))} />
                    <label htmlFor="modelo_inventario">Modelo de Inventario</label>
                    <input type="text" name="modelo_inventario" id="modelo_inventario" value={modelo_inventario} onChange={(e) => setModeloInventario(e.target.value)} />
                    <label htmlFor="tasaRotacion">Tasa de Rotación</label>
                    <input type="number" name="tasaRotacion" id="tasaRotacion" value={tasaRotacion} onChange={(e) => setTasaRotacion(parseFloat(e.target.value))} />
                    <button className="bg-blue-500 text-white p-2 rounded-md" type="button" onClick={create}>Crear Artículo</button>
                </form>
            </div>
        </div>
    )
}
