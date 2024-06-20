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

        //Get url query parameters
        const url = new URL(req.url || "", `http://${req.headers.host}`);
        const params = url.searchParams;
        

        const articulos = await db.all(`
            SELECT Articulo.id, nombre, stock, precio, stock_seguridad, punto_pedido, lote_optimo, modelo_inventario, tasa_rotacion FROM Articulo
            join Articulo_Precio_Venta on Articulo.id = Articulo_Precio_Venta.articulo_id
            where 
                Articulo_Precio_Venta.fecha_fin is NULL
            `);
        //If params is empty, return all articles with their data if not return only the article name and id
        if (params.get("onlyName") === "true") {
            return res.status(200).json(articulos.map(articulo => ({ id: articulo.id, nombre: articulo.nombre })));
        }
        return res.status(200).json(articulos);
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}