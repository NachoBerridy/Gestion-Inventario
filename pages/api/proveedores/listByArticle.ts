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

        const { id } = req.body;

        //Get url query parameters
        const url = new URL(req.url || "", `http://${req.headers.host}`);
        const params = url.searchParams;
        

        const proveedores = await db.all(`
            SELECT Articulo_Proveedor.id, plazo_entrega as plazoEntrega, costo_pedido as costoPedido, nombre as proveedor, precio_unidad as precioUnitario FROM Articulo_Proveedor
            join Proveedor on Proveedor.id = Articulo_Proveedor.proveedor_id
            join Precio on articulo_proveedor_id = Articulo_Proveedor.id
            where 
                Articulo_Proveedor.articulo_id = ?
            `, [id]);
        return res.status(200).json(proveedores);
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}