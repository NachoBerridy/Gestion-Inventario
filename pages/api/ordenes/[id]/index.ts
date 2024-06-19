import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

const getOrden = async (id: string, db: Database<sqlite3.Database, sqlite3.Statement>) => {
  try {
    return await db.get(
      `SELECT 
        Articulo.nombre as articulo,
        Articulo.id as articuloId,
        Proveedor.id as proveedorId,
        Proveedor.nombre as proveedor,
        Articulo_Proveedor.id as articuloProveedorId,
        cantidad as cantidad,
        Orden_Compra_Estado.fecha as fecha, 
        plazo_entrega as plazo,
        precio_unidad as precio,
        estado,
        total 
      FROM Orden_Compra 
      join Articulo_Proveedor on Orden_Compra.articulo_proveedor_id = articulo_proveedor.id
      join Articulo on Articulo_Proveedor.articulo_id = articulo.id
      join Proveedor on Articulo_Proveedor.proveedor_id = proveedor.id
      join Precio on Articulo_Proveedor.id = Precio.articulo_proveedor_id
      join Orden_Compra_Estado on Orden_Compra.id = Orden_Compra_Estado.orden_compra_id
      WHERE Orden_Compra.id = ?`, id
    );
  } catch (error : any) {
    throw error;
  }
}

const deleteOrden = async (id: string, db: Database<sqlite3.Database, sqlite3.Statement>) => {
  try {
    await db.run(
      "DELETE FROM Orden_Compra WHERE id = ?", id
    ); 
    await db.run("DELETE FROM Orden_Compra_Estado WHERE orden_compra_id = ?", id);
  } catch (error : any) {
    throw error;
  }
}

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

  switch (method) {
    case "GET":
      try {
        const result = await getOrden(id as string, db);
        return res.json(result);
      } catch (error : any) {
        return res.status(500).json({ message: error.message });
      }
    case "DELETE":
      try {
        await deleteOrden(id as string, db);
        return res.status(200).end();
      } catch (error : any) {
        return res.status(500).json({ message: error.message });
      }
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
