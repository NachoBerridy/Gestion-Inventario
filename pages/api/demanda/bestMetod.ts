import { NextApiRequest, NextApiResponse } from "next";
import { getPredictionPMPE } from "./pmpe";
import { getPredictionPM } from "./promediomovil";
import { getPredictionPMP } from "./promediomovilpond";
import { getPredictionRL } from "./regresionLineal";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    try{
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Method Not Allowed" });
        }
        let {
            historicalDemand,
            alfa = 0.2,
            initialValue = historicalDemand[0].quantity,
            errorMetod = "MAD",
            backPeriods = {
                periods : 3,
                ponderation : [1, 2, 3]
            },      
        } = req.body;

        const errorPM = await getPredictionPM(historicalDemand, backPeriods.periods, errorMetod)
        const errorRL = await getPredictionRL(historicalDemand, errorMetod)
        const errorPMPE = await getPredictionPMPE(historicalDemand, alfa, initialValue, errorMetod)
        const errorPMP = await getPredictionPMP(historicalDemand, backPeriods, errorMetod)

        const bestError= Math.min(errorPM.error, errorRL.error, errorPMPE.error, errorPMP.error)
        let bestMetod = ""
        if (bestError === errorPM.error){
            bestMetod = "Promedio Móvil"
        }
        if (bestError === errorRL.error){
            bestMetod = "Regresión Lineal"
        }
        if (bestError === errorPMPE.error){
            bestMetod = "Promedio Móvil Ponderado Exponencial"
        }
        if (bestError === errorPMP.error){
            bestMetod = "Promedio Móvil Ponderado"
        }
        return res.status(200).json(bestMetod);
    } catch (error:any) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}
    
