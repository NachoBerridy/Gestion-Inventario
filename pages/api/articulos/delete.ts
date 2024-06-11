import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;
const PENDIENTE = 'Pendiente'
const ENVIADAS = 'Enviada'

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
        if (req.method !== "DELETE") {
            return res.status(405).json({ message: "Method Not Allowed" });
        }

        const {id}:{id:Number} = req.body;

        !id && res.status(400).json({ message: "id is required" });

        const articulo = await db.get(
            `SELECT * FROM Articulo 
            join Articulo_Precio_Venta on Articulo.id = Articulo_Precio_Venta.articulo_id
            where Articulo.id = ?`,
            [id]
            );

        if (!articulo) {
            return res.status(404).json({ message: `Articulo ${id} not found` });
        }

        //verific aque no existan ordenens pendientes ni enviadas, tiene que estar canceladas o recibidas, las ordenes de compran están relacionadas con articulo_proveedor, que a su vez está relacionado con articulo
        const orders = await db.all(
            `SELECT * FROM Articulo 
            join Articulo_Proveedor on Articulo.id = Articulo_Proveedor.articulo_id
            join Orden_Compra on Articulo_Proveedor.id = Orden_Compra.articulo_proveedor_id
            join Orden_Compra_Estado on Orden_Compra.id = Orden_Compra_Estado.orden_compra_id
            where Articulo.id = ? and Orden_Compra_Estado.estado in (?,?)`,
            [id, PENDIENTE, ENVIADAS]
            );

        if (orders && orders.length > 0) {
            return res.status(400).json({ message: `Articulo ${id} has pending orders` });
        }

        const result = await db.run(
            "DELETE FROM Articulo WHERE id = ?",
            [id]
        );

        const result2 = await db.run(
            "DELETE FROM Articulo_Precio_Venta WHERE articulo_id = ?",
            [id]
        );

        return res.status(200).json({ message: `Articulo ${id} deleted` });
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}