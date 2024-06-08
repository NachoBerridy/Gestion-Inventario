import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
if (!db) {
  db = await open({
    filename: "./db/test.db",
    driver: sqlite3.Database,
  });
}
  const { method } = req;
  const { id } = req.query;
  if(method !== "GET") {
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
  try {
    const result = await db.get(
      `SELECT 
        Articulo.nombre as article,
        Proveedor.nombre as provider,
        Articulo_Proveedor.id as articleProviderId,
        cantidad as amount, 
        Orden_Compra_Estado.fecha as date, 
        plazo_entrega as deliveryTerm, 
        precio_unidad as price,
        estado as state, 
        total 
      FROM Orden_Compra 
      join Articulo_Proveedor on Orden_Compra.articulo_proveedor_id = articulo_proveedor.id
      join Articulo on Articulo_Proveedor.articulo_id = articulo.id
      join Proveedor on Articulo_Proveedor.proveedor_id = proveedor.id
      join Precio on Articulo_Proveedor.id = Precio.articulo_proveedor_id
      join Orden_Compra_Estado on Orden_Compra.id = Orden_Compra_Estado.orden_compra_id
      WHERE Orden_Compra.id = ?`, id
    );
    return res.json(result);
  } catch (error : any) {
    return res.status(500).json({ message: error.message });
  }
}