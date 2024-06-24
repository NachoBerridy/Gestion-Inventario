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
            SELECT a.id, 
            	a.nombre, 
            	a.stock,  
            	a.stock_seguridad,
            	a.punto_pedido, 
            	a.lote_optimo, 
            	a.modelo_inventario, 
            	a.tasa_rotacion, 
            	apv.precio,
            	(select sum(oc.cantidad)
            		from Articulo_Proveedor ap
            		join Orden_Compra oc on oc.articulo_proveedor_id = ap.id
            		join Orden_Compra_Estado oce on oce.orden_compra_id = oc.id
            		where ap.id = a.id 
            			and oce.estado = 'Enviada' 
            	) as 'stock_ingreso_pendiente'
            FROM Articulo a
            join Articulo_Precio_Venta apv  on a.id = apv.articulo_id
            where 
            	apv.fecha_fin is NULL

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