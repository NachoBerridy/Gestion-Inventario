import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

const bulkCreatePrueba = [
    {"articulo_id": 1, "cantidad": 3, "fecha": "2024-04-12"},
    {"articulo_id": 2, "cantidad": 5, "fecha": "2024-04-28"},
    {"articulo_id": 3, "cantidad": 4, "fecha": "2024-05-15"},
    {"articulo_id": 4, "cantidad": 2, "fecha": "2024-05-20"},
    {"articulo_id": 5, "cantidad": 6, "fecha": "2024-06-01"},
    {"articulo_id": 6, "cantidad": 2, "fecha": "2024-04-05"},
    {"articulo_id": 7, "cantidad": 3, "fecha": "2024-04-18"},
    {"articulo_id": 8, "cantidad": 6, "fecha": "2024-05-09"},
    {"articulo_id": 9, "cantidad": 4, "fecha": "2024-06-05"},
    {"articulo_id": 10, "cantidad": 3, "fecha": "2024-06-18"},
    {"articulo_id": 1, "cantidad": 5, "fecha": "2024-05-25"},
    {"articulo_id": 2, "cantidad": 4, "fecha": "2024-06-07"},
    {"articulo_id": 3, "cantidad": 2, "fecha": "2024-04-22"},
    {"articulo_id": 4, "cantidad": 6, "fecha": "2024-06-12"},
    {"articulo_id": 5, "cantidad": 3, "fecha": "2024-04-30"},
    {"articulo_id": 6, "cantidad": 5, "fecha": "2024-05-02"},
    {"articulo_id": 7, "cantidad": 4, "fecha": "2024-05-17"},
    {"articulo_id": 8, "cantidad": 2, "fecha": "2024-06-09"},
    {"articulo_id": 9, "cantidad": 6, "fecha": "2024-04-14"},
    {"articulo_id": 10, "cantidad": 2, "fecha": "2024-05-29"},
    {"articulo_id": 1, "cantidad": 4, "fecha": "2024-06-22"},
    {"articulo_id": 2, "cantidad": 3, "fecha": "2024-04-10"},
    {"articulo_id": 3, "cantidad": 6, "fecha": "2024-05-06"},
    {"articulo_id": 4, "cantidad": 2, "fecha": "2024-04-25"},
    {"articulo_id": 5, "cantidad": 5, "fecha": "2024-06-15"},
    {"articulo_id": 6, "cantidad": 3, "fecha": "2024-06-24"},
    {"articulo_id": 7, "cantidad": 6, "fecha": "2024-05-11"},
    {"articulo_id": 8, "cantidad": 4, "fecha": "2024-04-20"},
    {"articulo_id": 9, "cantidad": 2, "fecha": "2024-05-04"},
    {"articulo_id": 10, "cantidad": 5, "fecha": "2024-06-27"},
    {"articulo_id": 1, "cantidad": 6, "fecha": "2024-05-13"},
    {"articulo_id": 2, "cantidad": 2, "fecha": "2024-06-19"},
    {"articulo_id": 3, "cantidad": 5, "fecha": "2024-06-11"},
    {"articulo_id": 4, "cantidad": 3, "fecha": "2024-04-07"},
    {"articulo_id": 5, "cantidad": 4, "fecha": "2024-06-02"},
    {"articulo_id": 6, "cantidad": 2, "fecha": "2024-05-21"},
    {"articulo_id": 7, "cantidad": 5, "fecha": "2024-05-27"},
    {"articulo_id": 8, "cantidad": 3, "fecha": "2024-04-15"},
    {"articulo_id": 9, "cantidad": 6, "fecha": "2024-06-04"},
    {"articulo_id": 10, "cantidad": 2, "fecha": "2024-04-23"}
]



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
        let ids = [];

        for (const venta of bulkCreatePrueba) {
            const { articulo_id, cantidad, fecha }: { articulo_id: number, cantidad: number, fecha: string } = venta;
            const date = new Date(fecha);
            const result = await db.run(
                `INSERT INTO Venta (articulo_id, cantidad,fecha) VALUES (?, ?, ?)`,
                [articulo_id, cantidad, date.toISOString()]
            );
            ids.push(result.lastID);
        }
        return res.status(200).json({ ids })
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}