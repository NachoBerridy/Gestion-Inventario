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

  if(method !== "POST") {
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
  try {
    const { articuloProveedorId, cantidad, fechaOrden}: { articuloProveedorId: number, cantidad: number, fechaOrden: string } = req.body;
    console.log(articuloProveedorId, cantidad, fechaOrden);
    const p = await db.get(
      "SELECT precio_unidad as precioUnitario FROM Precio WHERE articulo_proveedor_id = ? AND fecha_fin IS NULL",
      [articuloProveedorId]
    );
    console.log(p);
    const precioUnitario = p.precioUnitario;
    const result = await db.run(
      "INSERT INTO Orden_Compra (articulo_proveedor_id, cantidad, total) VALUES (?, ?, ?)",
      [articuloProveedorId, cantidad, precioUnitario*cantidad]
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