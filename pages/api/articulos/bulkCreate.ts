import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;
const MODELOINVENTARIO = 'LOTE FIJO' // Sacar de tabla configs o del env
const bulkCreatePrueba = [
    {
        "nombre": "articulo 1",
        "precio": 234,
        "stock": 23,
        "modeloInventario": "LOTE FIJO"
    },
    {
        "nombre": "articulo 2",
        "precio": 415,
        "stock": 17,
        "modeloInventario": "INTERVALO FIJO"
    },
    {
        "nombre": "articulo 3",
        "precio": 267,
        "stock": 30,
        "modeloInventario": "INTERVALO FIJO"
    },
    {
        "nombre": "articulo 4",
        "precio": 498,
        "stock": 28
    },
    {
        "nombre": "articulo 5",
        "precio": 302,
        "stock": 21
    },
    {
        "nombre": "articulo 6",
        "precio": 359,
        "stock": 19
    },
    {
        "nombre": "articulo 7",
        "precio": 276,
        "stock": 22
    },
    {
        "nombre": "articulo 8",
        "precio": 482,
        "stock": 18
    },
    {
        "nombre": "articulo 9",
        "precio": 312,
        "stock": 27
    },
    {
        "nombre": "articulo 10",
        "precio": 421,
        "stock": 24
    }
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

        for (const articulo of bulkCreatePrueba) {
            let { nombre, stock, precio, modeloInventario } = articulo;
            if (!modeloInventario) modeloInventario = MODELOINVENTARIO;
            const result = await db.run(
                `INSERT INTO Articulo (nombre, stock,modelo_inventario) VALUES (?, ?, ?)`,
                [nombre, stock,modeloInventario]
            );
            const date = new Date();
            const result2 = await db.run(
                `INSERT INTO Articulo_Precio_Venta (precio, articulo_id, fecha_inicio) VALUES (?, ?, ?)`,
                [precio, result.lastID, date.toISOString()]
            );
            ids.push(result.lastID)
        }
        return res.status(200).json({ ids })
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}