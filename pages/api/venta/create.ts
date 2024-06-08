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
        if (req.method !== "POST") {
            return res.status(405).json({ message: "Method Not Allowed" });
        }

        const { articulo_id, cantidad,fecha}:{articulo_id:String, cantidad:Number,fecha:string} = req.body;
        if (!articulo_id || !cantidad ) {
            const missingFields = [];
            !articulo_id && missingFields.push("articulo_id");
            !cantidad && missingFields.push("cantidad");
            return res.status(400).json({ message: `Missing fields: ${missingFields.join(", ")}` });
        }

        let date = new Date();
        if (fecha) {
            date = new Date(fecha);
        }
        const result = await db.run(
            `INSERT INTO Venta (articulo_id, cantidad,fecha) VALUES (?, ?)`,
            [articulo_id, cantidad, date.toISOString()]
        );
        
        return res.status(200).json({ id: result.lastID })
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}