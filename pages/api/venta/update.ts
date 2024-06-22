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
        if (req.method !== "PUT") {
            return res.status(405).json({ message: "Method Not Allowed" });
        }

        const { articulo_id, cantidad,id}:{articulo_id:String, cantidad:Number,id:Number} = req.body;
        !id && res.status(400).json({ message: "id is required" });

        const sale = await db.get(
            `SELECT id FROM Venta where id = ?`,
            [id]
        );
        if (!sale) {
            return res.status(404).json({ message: `Articulo ${id} not found` });
        }

        const result = await db.run(
            "UPDATE Venta SET articulo_id = ?, cantidad = ? WHERE id = ?",
            [articulo_id, cantidad, id]
        );
        return res.status(200).json({ message: `Venta ${id} updated` });
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}