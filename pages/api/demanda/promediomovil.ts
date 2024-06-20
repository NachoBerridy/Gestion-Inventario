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
        quantity: 10,  
        periodStart: DateTime.fromISO('2021-01-01'),
        periodEnd: DateTime.fromISO('2021-01-31')
    },
    {
        salesInPeriod: [],
        quantity: 12,
        periodStart: DateTime.fromISO('2021-02-01'),
        periodEnd: DateTime.fromISO('2021-02-28')
    },
    {
        salesInPeriod: [],
        quantity: 13,
        periodStart: DateTime.fromISO('2021-03-01'),
        periodEnd: DateTime.fromISO('2021-03-31')
    },
    {
        salesInPeriod: [],
        quantity: 16,
        periodStart: DateTime.fromISO('2021-04-01'),
        periodEnd: DateTime.fromISO('2021-04-30')
    },
    {
        salesInPeriod: [],
        quantity: 19,
        periodStart: DateTime.fromISO('2021-05-01'),
        periodEnd: DateTime.fromISO('2021-05-31')
    },
    {
        salesInPeriod: [],
        quantity: 23,
        periodStart: DateTime.fromISO('2021-06-01'),
        periodEnd: DateTime.fromISO('2021-06-30')
    },
    {
        salesInPeriod: [],
        quantity: 26,
        periodStart: DateTime.fromISO('2021-07-01'),
        periodEnd: DateTime.fromISO('2021-07-31')
    },
    {
        salesInPeriod: [],
        quantity: 30,
        periodStart: DateTime.fromISO('2021-08-01'),
        periodEnd: DateTime.fromISO('2021-08-31')
    },
    {
        salesInPeriod: [],
        quantity: 28,
        periodStart: DateTime.fromISO('2021-09-01'),
        periodEnd: DateTime.fromISO('2021-09-30')

    },
    {
        salesInPeriod: [],
        quantity: 18,
        periodStart: DateTime.fromISO('2021-10-01'),
        periodEnd: DateTime.fromISO('2021-10-31')
    },
    {
        salesInPeriod: [],
        quantity: 16,
        periodStart: DateTime.fromISO('2021-11-01'),
        periodEnd: DateTime.fromISO('2021-11-30')
    },
    {
        salesInPeriod: [],
        quantity: 14,
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
        backPeriods = 3,
        errorMetod = "MAD", // MAD, MSE, MAPE
        allowedError = 0.1,
       } = req.body;
       
        //prediccion con promedio movil
        let prediction = historicalDemand.map(
            (period:SeparetedSales, index:number, array:SeparetedSales[]) => {
                if (index < backPeriods) { // Si no hay suficientes periodos para calcular el promedio movil
                    return Math.round(period.quantity)
                }
                const value = array.slice(index - backPeriods, index).reduce((acc, period) => acc + period.quantity, 0) / backPeriods
                return Math.round(value)
            }
        )
 
        let error = null
        const real = historicalDemand.map((period:SeparetedSales) => period.quantity).slice(backPeriods)

        const predictions = prediction.slice(backPeriods)

        if (errorMetod === "MSE"){   
            error = meanSquareError(predictions, real)
        }
        if (errorMetod === "MAD"){
            error = averageAbsoluteDeviation(predictions, real)
        }
        if (errorMetod === "MAPE"){
            error = meanAbsolutePercentageError(predictions, real)
        }
     

        // calcualar el proximo periodo con los ultimos backPeriods del historico
        let nexPeriod = historicalDemand.slice(-backPeriods).reduce((acc:number, period:SeparetedSales) => acc + period.quantity, 0) / backPeriods
        nexPeriod = Math.round(nexPeriod)
        //agrego el periodo a las predicciones
        for (let i = 0; i < prediction.length; i++) {
            prediction[i] = {
                prediction: prediction[i],
                periodStart: historicalDemand[i].periodStart,
                periodEnd: historicalDemand[i].periodEnd
            }
            
        }
        const predictionDemand = prediction.slice(backPeriods, prediction.length)
        return res.status(200).json({prediction: predictionDemand, nexPeriod, error})
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}