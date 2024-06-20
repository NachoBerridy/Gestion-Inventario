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

        const { articulo_id, cantidad,fecha}:{articulo_id:String, cantidad:number,fecha:string} = req.body;
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
        const article = await db.get(`SELECT * FROM Articulo WHERE id = ?`, [articulo_id]);
        if (!article) {
            return res.status(404).json({ message: `Articulo ${articulo_id} not found` });
        }
        if (article.stock < cantidad) {
            return res.status(400).json({ message: `No hay suficiente stock para vender ${cantidad} de ${article.nombre}` });
        }

        const result = await db.run(
            `INSERT INTO Venta (articulo_id, cantidad,fecha) VALUES (?, ?, ?)`,
            [articulo_id, cantidad, date.toISOString()]
        );
        const result2 = await db.run(
            `UPDATE Articulo SET stock = ? WHERE id = ?`,
            [article.stock - cantidad, articulo_id]
        );
        
        return res.status(200).json({ id: result.lastID })
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}