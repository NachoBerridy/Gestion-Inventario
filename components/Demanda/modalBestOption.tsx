import { SeparetedSales } from "@/pages/api/venta/demandaHistorica/[id]";
import axios from "axios";
import { useEffect, useState } from "react";
// import PesosPMP from "./pesosPMP";

interface parameterBestMetod{
  alfa?: number;
  initialValue?: number;
  periods?: number;
  ponderation?: number[];
  errorMetod?: string;
}


export default function ModalBestOption({setShow , setBestMetod, historicalDemand}: { setShow: Function,setBestMetod: Function, historicalDemand: SeparetedSales[]}) {
  const [parameterBestMetod, setParameterBestMetod] = useState<parameterBestMetod>({
    alfa: 0.2,
    initialValue: 0,
    periods: 3,
    ponderation: Array.from({length: 3}, (_, i) => i + 1),
    errorMetod: "MAD",
  });
  const [disabled, setDisabled] = useState<boolean>(false);
  // const [bestMetodData, setBestMetodData] = useState<string>(bestMetod);

  const validate = () => {
    console.log(parameterBestMetod);
    if (parameterBestMetod.alfa && parameterBestMetod.initialValue != undefined  && parameterBestMetod.initialValue != null && parameterBestMetod.periods && parameterBestMetod.ponderation?.length && parameterBestMetod.errorMetod && parameterBestMetod.ponderation?.length === parameterBestMetod.periods) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }

  const setOpenModal = (value: boolean) => {
    setShow(value);
  }

  const handleChange = (e: any) => {
    if (e.target.name === "ponderation") {
      const ponderation = e.target.value.split(",").map((value: string) => {
        if (value === "") {
          return 0;
        }
        return parseFloat(value);
      })
      setParameterBestMetod ({...parameterBestMetod, [e.target.name]: ponderation});
    } else {
    setParameterBestMetod({...parameterBestMetod, [e.target.name]: e.target.value});
    }
  }

  console.log(historicalDemand)

  
  
  const handleBestMetodChange = async (e: any) => {
    e.preventDefault();
    try {
      console.log(parameterBestMetod);
      const response = await axios.post("/api/demanda/bestMetod", {
        historicalDemand: historicalDemand,
        alfa: parameterBestMetod.alfa,
        initialValue: Number(parameterBestMetod.initialValue),
        errorMetod: parameterBestMetod.errorMetod,
        backPeriods: {
          periods: parameterBestMetod.periods,
          ponderation: parameterBestMetod.ponderation
        }
      });
      // console.log(response.data);

      setBestMetod(response.data);
      setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    validate();
  }, [parameterBestMetod]);


  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 z-20">
      <div 
        className="bg-gray-700 opacity-50 w-screen h-screen fixed top-0 left-0 z-10"
        onClick={() => setOpenModal(false)}
      ></div>
      <form className="flex flex-col items-center justify-center p-6 bg-gray-300 text-black rounded-lg shadow-lg z-20 relative">
        <label htmlFor="alfa" className="font-semibold mb-2">Alfa</label>
        <input
          type="number"
          id="alfa"
          name="alfa"
          value={parameterBestMetod.alfa}
          onChange={ handleChange}
          className="p-2 mb-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="initialValue" className="font-semibold mb-2">Valor Inicial</label>
        <input
          type="number"
          id="initialValue"
          name="initialValue"
          value={parameterBestMetod.initialValue}
          onChange={ handleChange}
          className="p-2 mb-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="periods" className="font-semibold mb-2">Periodos Atras</label>
        <input
          type="number"
          id="periods"
          name="periods"
          value={parameterBestMetod.periods}
          onChange={ handleChange}
          className="p-2 mb-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="ponderation" className="font-semibold mb-2">Ponderación</label>
        <input
          type="text"
          id="ponderation"
          name="ponderation"
          value={parameterBestMetod.ponderation? parameterBestMetod.ponderation.toString() : ""}
          onChange={ handleChange}
          className="p-2 mb-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="errorMetod" className="font-semibold mb-2">Error</label>
        <select
          id="errorMetod"
          name="errorMetod"
          value={parameterBestMetod.errorMetod}
          onChange={ handleChange}
          className="p-2 mb-4 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="MAD">MAD</option>
          <option value="MSE">MSE</option>
          <option value="MAPE">MAPE</option>
        </select>
        <button 
          onClick={handleBestMetodChange}
          className={`bg-blue-500 p-2 rounded-lg text-white ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          disabled= {disabled}
          >Guardar
        </button>
      </form>
      {/* {
        selectWeightsForBestMetod &&
        <PesosPMP setWeights={handleWeightsChangeForBestMetod} weights={parameterBestMetod.ponderation} setShow={setSelectWeightsForBestMetod} />
      } */}
    </div>
  )

}