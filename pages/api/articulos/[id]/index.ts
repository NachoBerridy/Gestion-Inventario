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
        console.log(req.query);
        const id = req.query.id;
        //taer el ultio precio de venta segun la fecha_inicio y solo traer el id articulo,nombre, stock y precio
        // const articulos = await db.all(`
        //     SELECT nombre, stock, precio FROM Articulo
        //     join Articulo_Precio_Venta on Articulo.id = Articulo_Precio_Venta.articulo_id
        //     SELECT precio FROM Articulo_Precio_Venta
        //     where 
        //         Articulo.id = ${id} 
        //         and Articulo_Precio_Venta.fecha_inicio = (select max(fecha_inicio) from Articulo_Precio_Venta where articulo_id = ${id})
        //     `);

        const articulos = await db.all(`
            SELECT Articulo.id, nombre, stock, precio FROM Articulo
            join Articulo_Precio_Venta on Articulo.id = Articulo_Precio_Venta.articulo_id
            where 
                Articulo.id = ${id} 
                and Articulo_Precio_Venta.fecha_fin is NULL 
            `);
        return res.status(200).json(articulos);
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}