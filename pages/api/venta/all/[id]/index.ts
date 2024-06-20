import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";
import { DateTime } from "luxon";
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
        const id = req.query.id;

        const { start_date, end_date } = req.body;

        if (!id || !start_date || !end_date) {
            return res.status(400).json({ message: "Missing fields" });
        }
        
        const sales = await db.all(`
            SELECT Venta.id as id, Articulo.nombre as name, Venta.cantidad as quantity, Venta.fecha as date FROM Venta
            join Articulo on Venta.articulo_id = Articulo.id
            where 
                Venta.articulo_id = ?
                and Venta.fecha >= ?
                and Venta.fecha <= ?
            order by Venta.fecha asc
            `,[id, start_date, end_date]);
            
        
        return res.status(200).json(sales);
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}
