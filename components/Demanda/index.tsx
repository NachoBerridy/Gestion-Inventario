import { SeparetedSales } from "@/pages/api/venta/demandaHistorica/[id]";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import LinealChart from "./LinealChart";
import Table from "./Table";
// import {
//   CartesianGrid,
//   Legend,
//   Line,
//   LineChart,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
import ModalPesos from "./pesosPMP";
import TableEST from "./TableEstacionalidad";

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

interface predictionsEST{
  id: number; 
  start_date: string;
  end_date: string;
  period: string;
  cycle: string;
  estimatedSales: number;
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


export default function Demanda() {

  const [data , setData] = useState<SeparetedSales[]>([]);
  const [periodName , setPeriodName] = useState<string>("meses");
  const [amounOfPeriods, setAmountOfPeriods] = useState<number>(1);
  const [period, setPeriod] = useState<string>(`${amounOfPeriods}-${periodNames[periodName as keyof typeof periodNames]}`); // 1-m
  const [amontOfCycles, setAmountOfCycles] = useState<number>(1);
  const [cycleName, setCycleName] = useState<string>("meses");
  const [cycle, setCycle] = useState<string>(`${amontOfCycles}-${periodNames[cycleName as keyof typeof periodNames]}`); // 1-m
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
  const [view, setView] = useState<string>("chart");
  const [cycles, setCycles] = useState<{startDate: string | null, endDate: string | null, periods: SeparetedSales[]}[]>([]);
  const [averageSalesByPeriod, setAverageSalesByPeriod] = useState<number[]>([]);
  const [seasonalIndex, setSeasonalIndex] = useState<number[]>([]);
  const [predictions, setPredictions] = useState<{startDate: string | null, endDate: string | null, sales: number}[]>([]);

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
    let params: predictionParamsPMPE | predictionParamsPMP | predictionParamsPM | predictionParamsRL | predictionsEST = {} as any;
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
    }   else if (typeOfPrediction === "Estacionalidad") {
      params = {
        id: id,
        start_date: startDate,
        end_date: endDate,
        period: period,
        cycle: cycle,
        estimatedSales: 200,
      }
    }

    if (typeOfPrediction === "Estacionalidad") {
      const response = await axios.post(`/api/demanda/estacionalidad`, params);
      setCycles(response.data.cyclesWithPeriods);
      setAverageSalesByPeriod(response.data.averageSalesByPeriod);
      setSeasonalIndex(response.data.seasonalIndex);
      setPredictions(response.data.predictions);
      
      // setFormatedData(newData);
      return;
    }

    const predictions = await getPrediction(params);
    setError(predictions.error);
    setNextPeriod(predictions.nextPeriod);
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

  const getPrediction = async (params: predictionParamsPMPE | predictionParamsPMP | predictionParamsPM | predictionParamsRL |predictionsEST) => {
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
    } else if (typeOfPrediction === "Estacionalidad") {
      const response = await axios.post(`/api/demanda/estacionalidad`, params);
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

  useEffect (() => {
    setCycle(`${amontOfCycles}-${periodNames[cycleName as keyof typeof periodNames]}`);
  }, [amontOfCycles, cycleName]);

  useEffect(() => {
    setWeights(Array.from({length: backPeriods}, (_, i) => i + 1));
  }, [backPeriods]);

  useEffect(() => {
    fetchData();
  }, [id, startDate, endDate, period, typeOfPrediction, typeOfError , allowedError, alfa, initialValue, backPeriods]);

  useEffect(() => {
    //if the type of prediction is estacionalidad, then we need to change the view
    if (typeOfPrediction === "Estacionalidad") {
      setView("tableEst");
    }
  }, [typeOfPrediction]);

  return (
    <div className="flex  items-start justify-between p-4 bg-gray-700 shadow-lg w-full h-full text-white">
      <div className="flex flex-col items-start  justify-between h-full w-1/2">
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
            {
              typeOfPrediction === "Estacionalidad" &&
              <div className="flex gap-2 items-center w-full justify-between">
                <label htmlFor="period">Ciclo</label>
                <div className="flex gap-1">

                  <input 
                    type="number" 
                    id="period" 
                    name="period" 
                    value={amontOfCycles} 
                    onChange={(e) => setAmountOfCycles(Number(e.target.value))} 
                    className="w-16 rounded-lg py-1 px-2 focus:outline-none focus:ring-none focus:border-transparent text-black"
                  />
                  <select 
                    name="periodName" 
                    id="periodName" 
                    onChange={(e) => setCycleName(e.target.value)} 
                    value={cycleName}
                    className="text-black w-20 rounded-lg py-1 px-2 focus:outline-none focus:ring-none focus:border-transparent"
                  >
                    {Object.keys(periodNames).map((key) => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
              </div>
            }
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
                <option value="Estacionalidad">Estacionalidad</option>
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
            {
              typeOfPrediction !== "Estacionalidad" &&
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
            }
            {
              typeOfPrediction !== "Estacionalidad" &&
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
            }
            {
              typeOfPrediction !== "Estacionalidad" &&
              <div className="flex gap-2 items-center w-full justify-between">
                    <span className={`font-semibold p-2 rounded-lg ${colorsToError[error < allowedError ? 'DENTRO' : 'ENCIMA']}`} >
                      {typeOfError}: {Math.round(error*100)/100 } { typeOfError == 'MAPE' ? "%" : null }
                      </span>
                    <span className="font-semibold p-2 bg-blue-500 rounded-lg">Predicción siguiente periodo: {nextPeriod}</span>
              </div>
            }
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-between h-full gap-4 w-1/2">
        <div className="  p-4 rounded-lg  flex justify-center items-start h-5/6 w-full">
          {
            view === "chart" 
            ?
              <LinealChart formatedData={formatedData} />
            : 
              view === "table"
            ?
              <div className=" h-full w-full bg-white text-black p-4 rounded-lg overflow-auto">
                <Table data={formatedData} />
              </div>
            :
              <div className=" h-full w-full bg-white text-black p-4 rounded-lg overflow-auto">
                <TableEST cycles={cycles} averageSalesByPeriod={averageSalesByPeriod} seasonalIndex={seasonalIndex} predictions={predictions} />
              </div>
          }
        </div>
        {/*Buton to switch to table view*/}
        <div className="flex items-center">
          <div className="bg-gray-200 rounded-lg p-2 flex relative w-40">
            <div
              className={`absolute top-1 bottom-1 rounded-lg bg-stone-500 transition-transform duration-300 ease-in-out ${
                view === "chart" ? "translate-x-0" : "translate-x-full"
              }`}
              style={{ width: '46%' }}
            ></div>
            <button
              onClick={() => setView("chart")}
              className={`px-4 py-2 rounded-lg z-10 focus:outline-none w-1/2 ${view === "chart" ? "text-white" : "text-black"}`}
            >
              Grafica
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-4 py-2 rounded-lg z-10 focus:outline-none w-1/2 ${view === "table" ? "text-white" : "text-black"}`}
            >
              Tabla
            </button>
          </div>
        </div>
      </div>
      {
        selectWeights &&
        <ModalPesos setWeights={handleWeightsChange} weights={weights} setShow={setSelectWeights} />
      }
    </div>
  );
}