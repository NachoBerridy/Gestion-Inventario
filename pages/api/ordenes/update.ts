import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";
import { IOrdenCompra } from "@/pages/api/ordenes";

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

  if(method !== "PUT") {
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
  try {
    const { idProveedorArticulo, cantidad, fechaOrden, estado ,id}: { idProveedorArticulo: number, cantidad: number, fechaOrden: string, estado:string, id:string } = req.body;
    const { precioUnitario } = await db.get(
      "SELECT precio_unidad as precioUnitario FROM Precio WHERE articulo_proveedor_id = ? and fecha_fin = ?",
      [idProveedorArticulo, null]
    );
    const result = await db.run(
      "UPDATE Orden_Compra SET articulo_proveedor_id = ?, cantidad = ?, total = ? WHERE id = ?",
      [idProveedorArticulo, cantidad, precioUnitario*cantidad, id]
    );
    await db.run(
      "UPDATE Orden_Compra_Estado SET estado = ?, fecha = ? WHERE orden_compra_id = ?",
      [estado, fechaOrden, id]
    );

    return res.json(result);
  } catch (error : any) {
    return res.status(500).json({ message: error.message });
  }
}