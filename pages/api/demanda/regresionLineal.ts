import averageAbsoluteDeviation from "@/utils/averageAbsoluteDeviation";
import meanAbsolutePercentageError from "@/utils/meanAbsolutePercentageError";
import meanSquareError from "@/utils/meanSquaredError";
import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";
import { SeparetedSales } from "../venta/demandaHistorica/[id]";

const demandaHistorica : SeparetedSales[] = [
    {
        salesInPeriod: [],
        quantity: 74,  
        periodStart: DateTime.fromISO('2021-01-01'),
        periodEnd: DateTime.fromISO('2021-01-31')
    },
    {
        salesInPeriod: [],
        quantity: 79,
        periodStart: DateTime.fromISO('2021-02-01'),
        periodEnd: DateTime.fromISO('2021-02-28')
    },
    {
        salesInPeriod: [],
        quantity: 80,
        periodStart: DateTime.fromISO('2021-03-01'),
        periodEnd: DateTime.fromISO('2021-03-31')
    },
    {
        salesInPeriod: [],
        quantity: 90,
        periodStart: DateTime.fromISO('2021-04-01'),
        periodEnd: DateTime.fromISO('2021-04-30')
    },
    {
        salesInPeriod: [],
        quantity: 105,
        periodStart: DateTime.fromISO('2021-05-01'),
        periodEnd: DateTime.fromISO('2021-05-31')
    },
    {
        salesInPeriod: [],
        quantity: 142,
        periodStart: DateTime.fromISO('2021-06-01'),
        periodEnd: DateTime.fromISO('2021-06-30')
    },
    {
        salesInPeriod: [],
        quantity: 122,
        periodStart: DateTime.fromISO('2021-07-01'),
        periodEnd: DateTime.fromISO('2021-07-31')
    }
]

export default function handler(
    req: NextApiRequest, 
    res: NextApiResponse
) {


    try{
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Method Not Allowed" });
        }
        let {
            historicalDemand =  demandaHistorica,
            errorMetod = "MAD", // MAD, MSE, MAPE
        } = req.body;
        // const xy = historicalDemand.map((item:SeparetedSales, index:number) => {
        //     return ((index + 1)*item.quantity)
        // });
        // const x2 = historicalDemand.map((item:SeparetedSales, index:number) => {
        //     return Math.pow(index + 1, 2);
        // });
        // const n = historicalDemand.length;
        // const promx = historicalDemand.reduce((acc:number, item:SeparetedSales, index:number) => acc + index + 1, 0) / n;
        // const promy = historicalDemand.reduce((acc:number, item:SeparetedSales, index:number) => acc + item.quantity, 0) / n;
        // const sumX = x2.reduce((acc:number, item:number) => acc + item, 0);
        // const sumxy = xy.reduce((acc:number, item:number) => acc + item, 0);
        // const b = (sumxy - n * promx * promy) / (sumX - n * Math.pow(promx, 2));
        // const a = promy - b * promx;

        // const prediction = historicalDemand.map((item:SeparetedSales, index:number) => {
        //     return Math.round(a + b * (index + 1));
        // });

        // const nextPeriod = a + b * (n + 1);
        // let error = 0;
        // const real = historicalDemand.map((item:SeparetedSales) => item.quantity);
        // const predictions = prediction;
        // if (errorMetod === "MSE"){   
        //     error = meanSquareError(predictions, real)
        // }
        // if (errorMetod === "MAD"){
        //     error = averageAbsoluteDeviation(predictions, real)
        // }
        // if (errorMetod === "MAPE"){
        //     error = meanAbsolutePercentageError(predictions, real)
        // }

        // for (let i = 0; i < prediction.length; i++) {
        //     prediction[i] = {
        //         prediction: prediction[i],
        //         periodStart: historicalDemand[i].periodStart,
        //         periodEnd: historicalDemand[i].periodEnd
        //     }
            
        // }
        const {prediction, nextPeriod, error} = getPredictionRL(historicalDemand, errorMetod);
        res.status(200).json({prediction, nextPeriod, error});
    }catch(error:any){
        res.status(500).json({message: error.message});
    }
}

export function getPredictionRL(historicalDemand:SeparetedSales[], errorMetod:string){
    const xy = historicalDemand.map((item:SeparetedSales, index:number) => {
        return ((index + 1)*item.quantity)
    });
    const x2 = historicalDemand.map((item:SeparetedSales, index:number) => {
        return Math.pow(index + 1, 2);
    });
    const n = historicalDemand.length;
    const promx = historicalDemand.reduce((acc:number, item:SeparetedSales, index:number) => acc + index + 1, 0) / n;
    const promy = historicalDemand.reduce((acc:number, item:SeparetedSales, index:number) => acc + item.quantity, 0) / n;
    const sumX = x2.reduce((acc:number, item:number) => acc + item, 0);
    const sumxy = xy.reduce((acc:number, item:number) => acc + item, 0);
    const b = (sumxy - n * promx * promy) / (sumX - n * Math.pow(promx, 2));
    const a = promy - b * promx;

    const prediction = historicalDemand.map((item:SeparetedSales, index:number) => {
        return Math.round(a + b * (index + 1));
    });

    const nextPeriod = a + b * (n + 1);
    let error = 0;
    const real = historicalDemand.map((item:SeparetedSales) => item.quantity);
    const predictions = prediction;
    if (errorMetod === "MSE"){   
        error = meanSquareError(predictions, real)
    }
    if (errorMetod === "MAD"){
        error = averageAbsoluteDeviation(predictions, real)
    }
    if (errorMetod === "MAPE"){
        error = meanAbsolutePercentageError(predictions, real)
    }

    for (let i = 0; i < prediction.length; i++) {
        //@ts-ignore
        prediction[i] = {
            prediction: prediction[i],
            periodStart: historicalDemand[i].periodStart,
            periodEnd: historicalDemand[i].periodEnd
        }
        
    }
    return {prediction,nextPeriod:  Math.round(nextPeriod), error}
}