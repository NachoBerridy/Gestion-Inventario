import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Articulo } from "../../pages/api/articulos";

export default function UpdateArticle ({toggleUpdate,updateArticle,id}:{ toggleUpdate: () => void, updateArticle: (nombre: string, stock: number, precio: number, modelo_inventario: string, tasaRotacion: number, id:number) => void, id: number}) {
    const [articulo, setArticulo] = useState<Articulo | null>(null);
    const [nombre, setNombre] = useState<string>("");
    const [stock, setStock] = useState<number>(0);
    const [precio, setPrecio] = useState<number>(0);
    const [modelo_inventario, setModeloInventario] = useState<string>("");
    const [tasaRotacion, setTasaRotacion] = useState<number>(0);
    const inventaryOptions = [
        "LOTE FIJO",
        "INTERVALO FIJO"
    ]

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/articulos/${id}`);
            const articulo = response.data[0];
            setArticulo(articulo);
            setNombre(articulo.nombre);
            setStock(articulo.stock);
            setPrecio(articulo.precio);
            setModeloInventario(articulo.modelo_inventario);
            setTasaRotacion(articulo.tasa_rotacion);
        } catch (error:any) {
            toast.error(error.response.data.message);
        }
    }

    useEffect (() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        
        fetchData();
    }, []);

    useEffect(() => {
        console.log(nombre);
    }, [nombre]);

    const update = async () => {
        try {
            await updateArticle(nombre, stock, precio, modelo_inventario, tasaRotacion, id);
        } catch (error:any) {

        }
    }
    

    // return (
    //     <div className="flex justify-center items-center h-screen w-screen fixed top-0 bottom-0 right-0 left-0 m-auto">
    //         <div className="modal fixed w-screen h-screen bg-gray-900 bg-opacity-50 top-0 left-0 z-40" onClick={toggleUpdate}>
    //         </div>
    //         <div className="w-1/2 bg-white p-4 rounded-lg shadow-lg z-50">
    //             <h2 className="text-2xl font-bold text-center">Actualizar Artículo</h2>
    //             <form className="flex flex-col gap-4">
    //                 <label htmlFor="nombre">Nombre</label>
    //                 <input type="text" name="nombre" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
    //                 <label htmlFor="stock">Stock</label>
    //                 <input type="number"  name="stock" id="stock" value={stock} onChange={(e) => setStock(parseInt(e.target.value))} />
    //                 <label htmlFor="precio">Precio</label>
    //                 <input type="number" step={0.01} min={0.01} name="precio" id="precio" value={precio} onChange={(e) => setPrecio(parseFloat(e.target.value))} />
    //                 <label htmlFor="modelo_inventario">Modelo de Inventario</label>
    //                 <select name="modelo_inventario" id="modelo_inventario" value={modelo_inventario} onChange={(e) => setModeloInventario(e.target.value)}>
    //                     {inventaryOptions.map((option) => (
    //                         <option key={option} value={option}>{option}</option>
    //                     ))}
    //                 </select>
    //                 <label htmlFor="tasaRotacion">Tasa de Rotación</label>
    //                 <input type="number" step={0.01} min={0.01} name="tasaRotacion" id="tasaRotacion" value={tasaRotacion} onChange={(e) => setTasaRotacion(parseFloat(e.target.value))} />
    //                 <button className="bg-blue-500 text-white p-2 rounded-md" type="button" onClick={update}>Actualizar Artículo</button>
    //             </form>
    //         </div>
    //     </div>
    // )

    return( 
        <div className="flex justify-center items-center h-screen w-screen fixed top-0 left-0 z-50">
            <div className="modal fixed w-full h-full bg-gray-900 bg-opacity-50 top-0 left-0 z-40" onClick={toggleUpdate}></div>
            <div className="w-11/12 md:w-1/2 lg:w-1/3 bg-white p-6 rounded-lg shadow-lg z-50">
                <h2 className="text-2xl font-bold text-center mb-6">Actualizar Artículo</h2>
                <form className="flex flex-col gap-4">
                    <label htmlFor="nombre" className="font-semibold">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="stock" className="font-semibold">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        id="stock"
                        value={stock}
                        onChange={(e) => setStock(parseInt(e.target.value))}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="precio" className="font-semibold">Precio</label>
                    <input
                        type="number"
                        step={0.01}
                        min={0.01}
                        name="precio"
                        id="precio"
                        value={precio}
                        onChange={(e) => setPrecio(parseFloat(e.target.value))}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="modelo_inventario" className="font-semibold">Modelo de Inventario</label>
                    <select
                        name="modelo_inventario"
                        id="modelo_inventario"
                        value={modelo_inventario}
                        onChange={(e) => setModeloInventario(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {inventaryOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <label htmlFor="tasaRotacion" className="font-semibold">Tasa de Rotación</label>
                    <input
                        type="number"
                        step={0.01}
                        min={0.01}
                        name="tasaRotacion"
                        id="tasaRotacion"
                        value={tasaRotacion}
                        onChange={(e) => setTasaRotacion(parseFloat(e.target.value))}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        className="bg-blue-600 text-white p-3 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
                        type="button"
                        onClick={update}
                    >
                        Actualizar Artículo
                    </button>
                </form>
            </div>
        </div>

    )
}
