import { useState, useEffect } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import LinealChart from "./linealChart";
import { SeparetedSales } from "@/pages/api/venta/demandaHistorica/[id]";
export default function Ventas() {

    const [articulos, setArticulos] = useState([]);
    const [date, setDate] = useState((new Date()).toISOString().split("T")[0]);
    const [quantity, setQuantity] = useState(0);
    const [enable, setEnable] = useState(false);
    const [selectedArticulo, setSelectedArticulo] = useState(0);
    const [historial, setHistorial] = useState<SeparetedSales[]>([]);
    const [start_date, setStart_date] = useState(DateTime.now().minus({ days: 7 }).toString());
    const [end_date, setEnd_date] = useState(DateTime.now().toString());
    const [period, setPeriod] = useState("1-d");
    const [name, setName] = useState("");

    const validPeriod = [
        "1-d",
        "1-w",
        "1-m",
        "3-m",
        "6-m",
        "1-y",
        "2-y",
        "3-y"
    ]

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const articulo = formData.get("articulo");
        const date = formData.get("date");
        const quantity = formData.get("quantity");

        try {
            const response = await axios.post("/api/venta/create", {
                articulo_id : articulo,
                fecha:date,
                cantidad:quantity
            });
            console.log(response.data.message);
        } catch (error: any) {
            console.error(error.response.data.message);
        }
    };

    const handleEnable = () => {
        setEnable(!enable);
    }

    const handleQuantity = (e: any) => {
        setQuantity(e.target.value);
        if (e.target.value > 0) {
            setEnable(true);
        
        }
    }

    const handleSelect = (e: any) => {
        setSelectedArticulo(e.target.value);
        
    }
    
    const fetchData = async () => { 
        try {
            const response = await axios.get("/api/articulos/all?onlyName=true");
            setArticulos(response.data);
            setSelectedArticulo(response.data[0].id);
            setName(response.data[0].nombre);
        } catch (error: any) {
            console.error(error.response.data.message);
        }
    }
    
    useEffect(() => {    
        fetchData()
        
    }, []);

    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                // console.log(start_date, end_date, period, selectedArticulo)
                const response = await axios.post(`/api/venta/demandaHistorica/${selectedArticulo}`, {
                    start_date: start_date.split("T")[0],
                    end_date: end_date.split("T")[0],
                    period: period
                });
                setHistorial(response.data);
                console.log(response.data);
            } catch (error: any) {
                console.error(error.response.data.message);
            }
        }
        fetchHistoricalData();
        
    }
    , [selectedArticulo, start_date, end_date, period, name]);    


    return (
        <div className="flex flex-col gap-4 w-full">
            <h1 className="text-center">Ventas</h1>
            <div className="flex justify-between">
                <div className="flex flex-col gap-4 items-start">
                    <h2 className="text-center">Historial de Ventas</h2>
                    <div>
                        <h4>
                            Articulos
                        </h4>
                        <select name="articulo" id="articulo" onChange={handleSelect}>
                            {articulos.map((articulo: any) => (
                                <option key={articulo.id} value={articulo.id}>{articulo.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="start_date">Fecha Inicial</label>
                            <input type="date" name="start_date" id="start_date" value={start_date.toString().split("T")[0]} onChange={(e) => setStart_date(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="end_date">Fecha Final</label>
                            <input type="date" name="end_date" id="end_date" value={end_date.toString().split("T")[0]} onChange={(e) => setEnd_date(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="period">Periodo</label>
                            <select name="period" id="period" value={period} onChange={(e) => setPeriod(e.target.value)}>
                                {validPeriod.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        

                    </div>
                    <LinealChart historial={historial} />
                </div>
                <div>
                    <h2 className="text-center">Nueva Venta</h2>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <select name="articulo" id="articulo">
                            {articulos.map((articulo: any) => (
                                <option key={articulo.id} value={articulo.id}>{articulo.nombre}</option>
                            ))}
                        </select>
                        <label htmlFor="date">Fecha</label>
                        <input type="date" name="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        <label htmlFor="quantity">Cantidad</label>
                        <input type="number" name="quantity" id="quantity" value={quantity} onChange={handleQuantity} />
                        <button type="submit" disabled={!enable} className="bg-blue-500 text-white p-2 rounded-md">Vender</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

