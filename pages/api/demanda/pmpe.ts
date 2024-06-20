import averageAbsoluteDeviation from "@/utils/averageAbsoluteDeviation";
import meanAbsolutePercentageError from "@/utils/meanAbsolutePercentageError";
import meanSquareError from "@/utils/meanSquaredError";
import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";
import { SeparetedSales } from "../venta/demandaHistorica/[id]";
// salesInPeriod: salesData[];
// quantity: number;
// periodStart?: DateTime;
// periodEnd?: DateTime;
const demandaHistorica : SeparetedSales[] = [
    {
        salesInPeriod: [],
        quantity: 430,  
        periodStart: DateTime.fromISO('2021-01-01'),
        periodEnd: DateTime.fromISO('2021-01-31')
    },
    {
        salesInPeriod: [],
        quantity: 380,
        periodStart: DateTime.fromISO('2021-02-01'),
        periodEnd: DateTime.fromISO('2021-02-28')
    },
    {
        salesInPeriod: [],
        quantity: 420,
        periodStart: DateTime.fromISO('2021-03-01'),
        periodEnd: DateTime.fromISO('2021-03-31')
    },
    {
        salesInPeriod: [],
        quantity: 370,
        periodStart: DateTime.fromISO('2021-04-01'),
        periodEnd: DateTime.fromISO('2021-04-30')
    },
    {
        salesInPeriod: [],
        quantity: 410,
        periodStart: DateTime.fromISO('2021-05-01'),
        periodEnd: DateTime.fromISO('2021-05-31')
    },
    {
        salesInPeriod: [],
        quantity: 380,
        periodStart: DateTime.fromISO('2021-06-01'),
        periodEnd: DateTime.fromISO('2021-06-30')
    },
    {
        salesInPeriod: [],
        quantity: 440,
        periodStart: DateTime.fromISO('2021-07-01'),
        periodEnd: DateTime.fromISO('2021-07-31')
    },
    {
        salesInPeriod: [],
        quantity: 380,
        periodStart: DateTime.fromISO('2021-08-01'),
        periodEnd: DateTime.fromISO('2021-08-31')
    },
    {
        salesInPeriod: [],
        quantity: 420,
        periodStart: DateTime.fromISO('2021-09-01'),
        periodEnd: DateTime.fromISO('2021-09-30')

    },
    {
        salesInPeriod: [],
        quantity: 370,
        periodStart: DateTime.fromISO('2021-10-01'),
        periodEnd: DateTime.fromISO('2021-10-31')
    },
    {
        salesInPeriod: [],
        quantity: 410,
        periodStart: DateTime.fromISO('2021-11-01'),
        periodEnd: DateTime.fromISO('2021-11-30')
    },
    {
        salesInPeriod: [],
        quantity: 390,
        periodStart: DateTime.fromISO('2021-12-01'),
        periodEnd: DateTime.fromISO('2021-12-31')
    }


]
interface predictionDemand {
    prediction: number[];
    nexPeriod: number;
    error: number;
}
                

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Method Not Allowed" });
        }
       let {
        historicalDemand = demandaHistorica,
        alfa = 0.2,
        initialValue = historicalDemand[0].quantity,
        errorMetod = "MAD", // MAD, MSE, MAPE
        allowedError = 0.1,
       } = req.body;

        // let prediction = historicalDemand.map((period:SeparetedSales, index:number) => {
        //     const prediction = initialValue + alfa * (period.quantity - initialValue);

        //     //TODO: Implementar el calculo del error
        //     initialValue = prediction;
        //     return Math.round(prediction)
        // })
        // let error = null
        // const real = historicalDemand.map((period:SeparetedSales) => period.quantity).slice(1) // Eliminamos el primer periodo ya que no se puede calcular el error
        // const predictions = prediction.slice(0, prediction.length -1) // Eliminamos el ultimo periodo porque es el que se va a predecir
        
        // if (errorMetod === "MSE"){   
        //     error = meanSquareError(predictions, real)
        // }
        // if (errorMetod === "MAD"){
        //     error = averageAbsoluteDeviation(predictions, real)
        // }
        // if (errorMetod === "MAPE"){
        //     error = meanAbsolutePercentageError(predictions, real)
        // }
        // const nexPeriod = prediction[prediction.length -1]
        // prediction.pop()
        
        // //agrego el periodo a las predicciones
        // for (let i = 0; i < prediction.length; i++) {
        //     prediction[i] = {
        //         prediction: prediction[i],
        //         periodStart: historicalDemand[i+1].periodStart,
        //         periodEnd: historicalDemand[i+1].periodEnd
        //     }
            
        // }

        const {prediction, nexPeriod, error} = getPredictionPMPE(historicalDemand, alfa, initialValue, errorMetod)
        return res.status(200).json({prediction, nexPeriod, error})
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export function getPredictionPMPE(historicalDemand:SeparetedSales[], alfa:number, initialValue:number, errorMetod:string){
    let prediction = historicalDemand.map((period:SeparetedSales, index:number) => {
        const prediction = initialValue + alfa * (period.quantity - initialValue);

        //TODO: Implementar el calculo del error
        initialValue = prediction;
        return Math.round(prediction)
    })
    let error = 0
    const real = historicalDemand.map((period:SeparetedSales) => period.quantity).slice(1) // Eliminamos el primer periodo ya que no se puede calcular el error
    const predictions = prediction.slice(0, prediction.length -1) // Eliminamos el ultimo periodo porque es el que se va a predecir
    
    if (errorMetod === "MSE"){   
        error = meanSquareError(predictions, real)
    }
    if (errorMetod === "MAD"){
        error = averageAbsoluteDeviation(predictions, real)
    }
    if (errorMetod === "MAPE"){
        error = meanAbsolutePercentageError(predictions, real)
    }
    const nexPeriod = prediction[prediction.length -1]
    prediction.pop()
    
    //agrego el periodo a las predicciones
    for (let i = 0; i < prediction.length; i++) {
        //@ts-ignore
        prediction[i] = {
            prediction: prediction[i],
            periodStart: historicalDemand[i+1].periodStart,
            periodEnd: historicalDemand[i+1].periodEnd
        }
        
    }
    return {prediction, nexPeriod, error}
}