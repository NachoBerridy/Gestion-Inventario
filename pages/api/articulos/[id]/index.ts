import { NextApiRequest, NextApiResponse } from "next";
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

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

        const articulos = await db.get(`
            SELECT Articulo.id, nombre, stock, precio, stock_seguridad, punto_pedido, lote_optimo, modelo_inventario,tasa_rotacion, proveedor_id 
            FROM Articulo
            join Articulo_Precio_Venta on Articulo.id = Articulo_Precio_Venta.articulo_id
            where 
                Articulo.id = ?
                and Articulo_Precio_Venta.fecha_fin is NULL 
            
            `,[id]);
        if (articulos.proveedor_id) {
            const proveedor = await db.get(`
                SELECT nombre
                FROM Proveedor
                where id = ?
            `,[articulos.proveedor_id]);
            articulos.proveedor = proveedor.nombre;
        }
        return res.status(200).json(articulos);
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}