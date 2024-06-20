import { salesData } from "@/pages/api/venta/demandaHistorica/[id]";
import calculoIndiceEstacionalidad from "@/utils/calculoEstacionalidad";
import { NextApiRequest, NextApiResponse } from "next";
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";


let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
      if (!db) {
          db = await open({
              filename: "./db/test.db",
              driver: sqlite3.Database,
          });
      }
      if (req.method !== "POST") {
          return res.status(405).json({ message: "Method Not Allowed" });
      }

      const { id, start_date, end_date, period, cycle, estimatedSales } = req.body;

      const sales: salesData[] = await db.all(
        `
              SELECT Venta.id as id, Articulo.nombre as name, Venta.cantidad as quantity, Venta.fecha as date FROM Venta
              join Articulo on Venta.articulo_id = Articulo.id
              where 
                  Venta.articulo_id = ?
                  and Venta.fecha >= ?
                  and Venta.fecha <= ?
              order by Venta.fecha asc
              `,
        [id, start_date, end_date]
      );

      const quantityPeriod = Number(period.split("-")[0]);
      const typeOfPeriod = period.split("-")[1];

      const quantityCycle = Number(cycle.split("-")[0]);
      const typeOfCycle = cycle.split("-")[1];

      const seasonalIndex = calculoIndiceEstacionalidad(sales, typeOfPeriod, quantityPeriod, start_date, end_date, typeOfCycle, quantityCycle, estimatedSales);
      res.status(200).json({ seasonalIndex });

  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
}