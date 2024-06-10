import {Articulo} from "../../../pages/api/articulos"
import { PlusIcon, PencilSquareIcon} from "@heroicons/react/24/outline";
import { useState,useEffect } from "react";


export default function Card({articulo}: {articulo: Articulo}) {
    
    const [color, setColor] = useState<string>("white")
    const [show, setShow] = useState<boolean>(false)

    //funcion para elegir color, si el stock esta por encima de punto de pedido verde, si está en el punto de pedido amarillo, si está por debajo pero por encima de stock de seguridad naranja, si está por debajo de stock de seguridad rojo
    const changeColor = () => {
        switch (true) {
            case articulo.punto_pedido && articulo.stock > articulo.punto_pedido:
                setColor("green")
                break;
            case articulo.punto_pedido && articulo.stock === articulo.punto_pedido:
                setColor("yellow")
                break;
            case  articulo.stock_seguridad && articulo.punto_pedido && articulo.stock < articulo.punto_pedido && articulo.stock > articulo.stock_seguridad:
                setColor("orange")
                break;
            case articulo.stock_seguridad && articulo.stock < articulo.stock_seguridad:
                setColor("red")
                break;
            default:
                setColor("white")
                break;
        }
    }
    useEffect(() => {
        console.log(articulo)
        changeColor()
    }, [articulo])
    
    return (
        <div className="card m-2">
            <div className=" border border-black p-2 m-2card-body flex gap-3 items-center justify-between" onClick={() => setShow(!show)}>
                <div className="flex gap-3 items-center justify-between">

                    <h5 className="card-title">{articulo.nombre}</h5>
                    <span className="circle w-2 h-2 rounded-full min-w-2 min-h-2 block" style={{background: color}}></span>
                </div>
                <div className="flex gap-3 items-center">

                    <PencilSquareIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
                    <PlusIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
                </div>
            </div>
            {show &&
            <div className="flex gap-3 items-center justify-between absolut bg-white rounded-b-md p-2">
                <p>Stock: {articulo.stock}</p>
                <p>Precio: {articulo.precio}</p>
                <p>Stock de seguridad: {articulo.stock_seguridad ? articulo.stock_seguridad: "Sin Dato"}</p>
                <p>Punto de Pedido: {articulo.punto_pedido? articulo.punto_pedido: "Sin Dato"}</p>
                <p>lote optimo: {articulo.lote_optimo ? articulo.lote_optimo : "Sin Dato"}</p>
                <p>Modelo: {articulo.modelo_inventario}</p>
            </div>
            }
        </div>
    );
}
