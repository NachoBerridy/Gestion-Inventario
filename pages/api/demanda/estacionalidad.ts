import CalculoIndiceEstacionalidad from "@/utils/calculoIndiceEstacionalidad";
import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";
import { SeparetedSales } from "@/pages/api/venta/demandaHistorica/[id]";

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

      const {
        data,
        amoutOfCycles,
        startDate,
        endDate,
        typePeriod
      } = req.body;


      if (!data || !amoutOfCycles || !startDate || !endDate || !typePeriod) {
          return res.status(400).json({ message: "Missing fields" });
      }

      const result = CalculoIndiceEstacionalidad(data, amoutOfCycles, startDate, endDate, typePeriod);

      res.status(200).json(result);

  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
}