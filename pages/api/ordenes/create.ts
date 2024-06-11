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
if (!db) {
  db = await open({
    filename: "./db/test.db",
    driver: sqlite3.Database,
  });
}
  const { method } = req;

  if(method !== "POST") {
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
  try {
    const { idProveedorArticulo, cantidad, fechaOrden}: { idProveedorArticulo: number, cantidad: number, fechaOrden: string } = req.body;
    const articleId = await db.get(
      "SELECT articulo_id FROM Articulo_Proveedor WHERE id = ?",
      [idProveedorArticulo]
    );
    const orders = await db.all(
      `SELECT * FROM Articulo 
      join Articulo_Proveedor on Articulo.id = Articulo_Proveedor.articulo_id
      join Orden_Compra on Articulo_Proveedor.id = Orden_Compra.articulo_proveedor_id
      join Orden_Compra_Estado on Orden_Compra.id = Orden_Compra_Estado.orden_compra_id
      where Articulo.id = ? and Orden_Compra_Estado.estado in (?,?)`,
      [articleId, PENDIENTE, ENVIADAS]
      );
    if (orders && orders.length > 0) {
        return res.status(400).json({ message: `El articulo tiene ordenes en curso` });
    }
    const { precioUnitario } = await db.get(
      "SELECT precio_unidad as precioUnitario FROM Precio WHERE articulo_proveedor_id = ? and fecha_fin = ?",
      [idProveedorArticulo, null]
    );
    const result = await db.run(
      "INSERT INTO Orden_Compra (articulo_proveedor_id, cantidad, total) VALUES (?, ?, ?)",
      [idProveedorArticulo, cantidad, precioUnitario*cantidad]
    );
    await db.run(
      "INSERT INTO Orden_Compra_Estado (orden_compra_id, estado, fecha) VALUES (?, ?, ?)",
      [result.lastID, 'Pendiente', fechaOrden]
    );
    return res.json(result);
  } catch (error : any) {
    return res.status(500).json({ message: error.message });
  }
}