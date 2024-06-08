import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";

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
        if (req.method !== "GET") {
            return res.status(405).json({ message: "Method Not Allowed" });
        }

        const id = req.query.id;

        const sale = await db.all(`
            SELECT Venta.id, Articulo.nombre, Venta.cantidad, Venta.fecha FROM Venta
            join Articulo on Venta.articulo_id = Articulo.id
            where Venta.id = ?
            `,[id]);
        
        return res.status(200).json(sale);
        
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}