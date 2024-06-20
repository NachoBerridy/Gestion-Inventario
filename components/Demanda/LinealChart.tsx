import { SeparetedSales } from "@/pages/api/venta/demandaHistorica/[id]";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ModalPesos from "./pesosPMP";

export interface DataLinealChart {
    periodo: string;
    real: number | null;
    prediccion?: number | null;
} 

interface articles{
    nombre: string;
    id: number;
}

enum periodNames{
  días = 'd',
  semanas = 'w',
  meses = 'm',
  años = 'y',
}

interface predictionParamsPMPE{
  historicalDemand: SeparetedSales[];
  alfa: number;
  initialValue: number;
  errorMetod: string;
}

interface predictionParamsPMP{
  historicalDemand: SeparetedSales[];
  backPeriods: {
    periods: number;
    ponderation: number[];
  };
  errorMetod: string;
}

interface predictionParamsRL{
  historicalDemand: SeparetedSales[];
  errorMetod: string;

}


interface predictionParamsPM{
  historicalDemand: SeparetedSales[];
  backPeriods: number;
  errorMetod: string;
}

enum colorsToError{
  DENTRO = 'bg-lime-700',
  ENCIMA = 'bg-contrast',
}


export default function LinealChart() {

  const [data , setData] = useState<SeparetedSales[]>([]);
  const [periodName , setPeriodName] = useState<string>("meses");
  const [amounOfPeriods, setAmountOfPeriods] = useState<number>(1);
  const [period, setPeriod] = useState<string>(`${amounOfPeriods}-${periodNames[periodName as keyof typeof periodNames]}`); // 1-m
  const [startDate, setStartDate] = useState<string>("2021-01-01");
  const [endDate, setEndDate] = useState<string>(`${new Date().getFullYear()}-12-31`); // `2021-12-31
  const [id, setId] = useState<number>(1);
  const [selectedArticle, setSelectedArticle] = useState<articles>();
  const [articulos, setArticulos] = useState<articles[]>([]);
  const [formatedData, setFormatedData] = useState<DataLinealChart[]>([]);
  const [typeOfPrediction, setTypeOfPrediction] = useState<string>("Promedio Movil Suavizado Exponencialmente");
  const [typeOfError, setTypeOfError] = useState<string>("MAD");
  const [allowedError, setAllowedError] = useState<number>(0.1);
  const [error, setError] = useState<number>(0);
  const [nextPeriod, setNextPeriod] = useState<number>(0);
  const [initialValue, setInitialValue] = useState<number>(0);
  const [alfa, setAlfa] = useState<number>(0.2);
  const [backPeriods, setBackPeriods] = useState<number>(3);
  const [weights, setWeights] = useState<number[]>(Array.from({length: backPeriods}, (_, i) => i + 1));
  const [selectWeights, setSelectWeights] = useState<boolean>(false);

  const getArticulos = async () => {
    //Get Articulos
    const articles = await axios.get("/api/articulos/all?onlyName=true");
    setArticulos(articles.data);
    setId(articles.data[0].id);
    setSelectedArticle(articles.data[0]);
  }

  const fetchData = async () => {
    //Fetch data
    //Endpoint to get the data: /api/venta/demandaHistorica/[id]
    //Body: {start_date: string, end_date: string, period: string}
    //Example: {start_date: "2021-01-01", end_date: "2021-12-31", period: "1-m"}
    const response = await axios.post(`/api/venta/demandaHistorica/${id}`, {
      start_date: startDate,
      end_date: endDate,
      period: period,
    });
    setData(response.data);
    const newformatedData = response.data.map((item: any) => {
      return {
        periodo: `${new Date(item.periodStart).toLocaleDateString()} - ${new Date(item.periodEnd).toLocaleDateString()}`,
        real: item.quantity,
        prediccion: null,
      }
    });

    //set parameters for prediction
    let params: predictionParamsPMPE | predictionParamsPMP | predictionParamsPM | predictionParamsRL = {} as any;
    if (typeOfPrediction === "Promedio Movil Suavizado Exponencialmente") {
      params = {
        historicalDemand: response.data,
        alfa: alfa,
        initialValue: initialValue,
        errorMetod: typeOfError,
      }
    } else if (typeOfPrediction === "Promedio Movil Ponderado") {
      params = {
        historicalDemand: response.data,
        backPeriods: {
          periods: backPeriods,
          ponderation: weights,
        },
        errorMetod: typeOfError,
      }
    } else if (typeOfPrediction === "Promedio Movil") {
      params = {
        historicalDemand: response.data,
        backPeriods: backPeriods,
        errorMetod: typeOfError,
      }
    } else if (typeOfPrediction === "Regresión Lineal") {
      params = {
        historicalDemand: response.data,
        errorMetod: typeOfError,
      }
    } 

    const predictions = await getPrediction(params);
    setError(predictions.error);
    setNextPeriod(predictions.nexPeriod);
    //@ts-ignore
    const predictionArray = predictions.prediction.map ((item) => {
      return item.prediction;
    });

    //@ts-ignore
    const newData = newformatedData.map((item, index) => {
      if (index === 0 && typeOfPrediction === "Promedio Movil Suavizado Exponencialmente") {
        return {
          ...item
        }
      }
      if (index < backPeriods && (typeOfPrediction === "Promedio Movil Ponderado" || typeOfPrediction === "Promedio Movil")) {
        return {
          ...item
        }
      }
      return {
          ...item,
          prediccion: predictionArray[index-1],
      }
    });

    setFormatedData(newData);
  }

  const getPrediction = async (params: predictionParamsPMPE | predictionParamsPMP | predictionParamsPM | predictionParamsRL) => {
    if (typeOfPrediction === "Promedio Movil Suavizado Exponencialmente") {
      const response = await axios.post(`/api/demanda/pmpe`, params);
      return response.data;
    } else if (typeOfPrediction === "Promedio Movil Ponderado") {
      const response = await axios.post(`/api/demanda/promediomovilpond`, params);
      return response.data;
    } else if (typeOfPrediction === "Promedio Movil") {
      const response = await axios.post(`/api/demanda/promediomovil`, params);
      return response.data;
    } else if (typeOfPrediction === "Regresión Lineal") {
      const response = await axios.post(`/api/demanda/regresionLineal`, params);
      return response.data;
    }
  }

  const handleWeightsChange = (weights: number[]) => {
    setWeights(weights);
    setSelectWeights(false);
    fetchData();
  }
  
  useEffect(() => {
    getArticulos();
  }, []);

  useEffect(() => {
    setSelectedArticle(articulos.find((articulo) => articulo.id === id));
  }, [id]);

  useEffect(() => {
    setPeriod(`${amounOfPeriods}-${periodNames[periodName as keyof typeof periodNames]}`);
  }, [amounOfPeriods, periodName]);

  useEffect(() => {
    setWeights(Array.from({length: backPeriods}, (_, i) => i + 1));
  }, [backPeriods]);

  useEffect(() => {
    fetchData();
  }, [id, startDate, endDate, period, typeOfPrediction, typeOfError , allowedError, alfa, initialValue, backPeriods]);

  return (
    <div className="flex  items-start gap-4 rounded-lg p-4 bg-gray-700 shadow-lg w-fit text-white">
      <div className="flex flex-col items-start  justify-between h-full">
        <h2 className="text-lg ">
          Historial de Ventas de
          { selectedArticle && <span className="text-lg font-semibold"> {selectedArticle.nombre}</span>}
        </h2>
        <div className="flex flex-col items-start gap-4 controles  p-4 rounded-lg">
          <span className="flex gap-2 items-center font-semibold"> 
            <AdjustmentsVerticalIcon className="h-6 w-6" />
            Controles
          </span>
          <select name="articulo" id="articulo" onChange={(e) => setId(Number(e.target.value))} 
            className="text-black focus:outline-none focus:ring-none focus:border-transparent rounded-full py-1 px-2">
            {articulos.map((articulo) => (
              <option key={articulo.id} value={articulo.id}>
                {articulo.nombre}
              </option>
            ))}
          </select>
          <div className="flex flex-col justify-start items-start w-full gap-2">
            <div className="flex gap-2 items-center w-full justify-between">
              <label htmlFor="start">Fecha de inicio</label>
              <input 
                type="date" id="start" 
                name="start" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="text-black rounded-lg py-1 px-2 focus:outline-none focus:ring-none focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 items-center w-full justify-between">
              <label htmlFor="end">Fecha de fin </label>
              <input 
                className="text-black rounded-lg py-1 px-2 focus:outline-none focus:ring-none focus:border-transparent"
                type="date" 
                id="end" 
                name="end" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
              />
            </div>
            <div className="flex gap-2 items-center w-full justify-between">
              <label htmlFor="period">Periodo</label>
              <div className="flex gap-1">

                <input 
                  type="number" 
                  id="period" 
                  name="period" 
                  value={amounOfPeriods} 
                  onChange={(e) => setAmountOfPeriods(Number(e.target.value))} 
                  className="w-16 rounded-lg py-1 px-2 focus:outline-none focus:ring-none focus:border-transparent text-black"
                />
                <select 
                  name="periodName" 
                  id="periodName" 
                  onChange={(e) => setPeriodName(e.target.value)} 
                  value={periodName}
                  className="text-black w-20 rounded-lg py-1 px-2 focus:outline-none focus:ring-none focus:border-transparent"
                >
                  {Object.keys(periodNames).map((key) => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 items-center w-full justify-between">
              <label htmlFor="typeOfPrediction">Tipo de Predicción</label>
              <select 
                name="typeOfPrediction" 
                id="typeOfPrediction" 
                onChange={(e) => setTypeOfPrediction(e.target.value)} 
                className="text-black w-60 rounded-lg py-1 px-2 focus:outline-none focus:ring-none focus:border-transparent"
              >
                <option value="Promedio Movil Suavizado Exponencialmente">Promedio Movil Suavizado Exponencialmente</option>
                <option value="Promedio Movil Ponderado">Promedio Movil Ponderado</option>
                <option value="Promedio Movil">Promedio Movil</option>
                <option value="Regresión Lineal">Regresión Lineal</option>
              </select>
            </div>
            <div className="flex gap-2 items-center w-full justify-between">
              {
                typeOfPrediction === "Promedio Movil Suavizado Exponencialmente" &&
                <div className="flex gap-2 items-center w-full justify-between">
                  <label htmlFor="alfa">Alfa</label>
                  <input 
                    type="number" 
                    id="alfa" 
                    name="alfa" 
                    value={alfa} 
                    onChange={(e) => setAlfa(Number(e.target.value))} 
                    className="w-16 rounded-lg py-1 px-2 focus:outline-none focus:ring-none focus:border-transparent text-black"
                  />
                </div>
              }
              {
                typeOfPrediction === "Promedio Movil Suavizado Exponencialmente" &&
                <div className="flex gap-2 items-center w-full justify-between">
                  <label htmlFor="initialValue">Valor Inicial</label>
                  <input 
                    type="number" 
                    id="initialValue" 
                    name="initialValue" 
                    value={initialValue} 
                    onChange={(e) => setInitialValue(Number(e.target.value))} 
                    className="w-16 rounded-lg py-1 px-2 focus:outline-none focus:ring-none focus:border-transparent text-black"
                  />
                </div>
              }
              {
                (typeOfPrediction === "Promedio Movil Ponderado" || typeOfPrediction === "Promedio Movil") &&
                <div className="flex gap-2 items-center w-full justify-between">
                  <label htmlFor="backPeriods">Periodos Atras</label>
                  <input 
                    type="number" 
                    id="backPeriods" 
                    name="backPeriods" 
                    value={backPeriods} 
                    min={1}
                    onChange={(e) => setBackPeriods(Number(e.target.value))} 
                    className="w-16 rounded-lg py-1 px-2 focus:outline-none focus:ring-none focus:border-transparent text-black"
                  />
                  {
                    typeOfPrediction === "Promedio Movil Ponderado" &&
                    < button onClick={() => setSelectWeights(true)} className="bg-contrast p-2 rounded-lg">Cambiar Pesos</button>
                  }
                </div>
              }
            </div>
            <div className="flex gap-2 items-center w-full justify-between">
              <label htmlFor="typeOfError">Tipo de Error</label>
              <select 
                name="typeOfError" 
                id="typeOfError" 
                onChange={(e) => setTypeOfError(e.target.value)} 
                className="text-black w-60 rounded-lg py-1 px-2 focus:outline-none focus:ring-none focus:border-transparent"
              >
                <option value="MAD">MAD</option>
                <option value="MSE">MSE</option>
                <option value="MAPE">MAPE</option>
              </select>
            </div>
            <div className="flex gap-2 items-center w-full justify-between">
              <label htmlFor="allowedError">Error Permitido</label>
              <input 
                type="number" 
                id="allowedError" 
                name="allowedError" 
                value={allowedError} 
                onChange={(e) => setAllowedError(Number(e.target.value))} 
                className="w-16 rounded-lg py-1 px-2 focus:outline-none focus:ring-none focus:border-transparent text-black"
              />
            </div>
            <div className="flex gap-2 items-center w-full justify-between">
                  <span className={`font-semibold p-2 rounded-lg ${colorsToError[error < allowedError ? 'DENTRO' : 'ENCIMA']}`} >
                    {typeOfError}: {Math.round(error*100)/100 } { typeOfError == 'MAPE' ? "%" : null }
                    </span>
                  <span className="font-semibold p-2 bg-blue-500 rounded-lg">Predicción siguiente periodo: {nextPeriod}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grafica bg-slate-200 p-4 rounded-lg  flex justify-center items-center">
        <LineChart
          width={600}
          height={400}
          // className="bg-white"
          data={formatedData}
          margin={{ top: 5, right:5, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="periodo" />
          <YAxis name="cantidad" />
          <CartesianGrid stroke="#000" className="bg-white" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="real" stroke="#BD2A2E" yAxisId={0} />
          <Line type="monotone" dataKey="prediccion" stroke="#2E86C1" yAxisId={0} />
        </LineChart>
      </div>
      {
        selectWeights &&
        <ModalPesos setWeights={handleWeightsChange} weights={weights} setShow={setSelectWeights} />
      }
    </div>
  );
}