import { NextApiRequest, NextApiResponse } from "next";
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

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
    const { id } = req.body;
    const order = await db.get( 
      `SELECT * FROM Orden_Compra
      join Orden_Compra_Estado on Orden_Compra.id = Orden_Compra_Estado.orden_compra_id
      WHERE Orden_Compra.id = ?`,
      [id]
    );

    const previousState = order.estado

    req.body.articuloProveedorId? order.articulo_proveedor_id = req.body.articuloProveedorId : order.articulo_proveedor_id;
    req.body.cantidad? order.cantidad = req.body.cantidad : order.cantidad;
    req.body.fecha? order.fecha = req.body.fecha : order.fecha;
    req.body.estado? order.estado = req.body.estado : order.estado;
    const { precioUnitario } = await db.get(
      "SELECT precio_unidad as precioUnitario FROM Precio WHERE articulo_proveedor_id = ? AND fecha_fin IS NULL",
      [order.articulo_proveedor_id]
    );
    const result = await db.run(
      "UPDATE Orden_Compra SET articulo_proveedor_id = ?, cantidad = ?, total = ? WHERE id = ?",
      [order.articulo_proveedor_id, order.cantidad, precioUnitario * order.cantidad, id]
    );
    await db.run(
      "UPDATE Orden_Compra_Estado SET estado = ?, fecha = ? WHERE orden_compra_id = ?",
      [order.estado, order.fecha, id]
    );

    if (previousState !== "Recibida" && req.body.estado === "Recibida"){
      const { articulo_id } = await db.get(
        "SELECT articulo_id FROM Articulo_Proveedor WHERE id = ?",
        [order.articulo_proveedor_id]
      )
      const { stock } = await db.get(
        "SELECT stock FROM Articulo WHERE id = ?",
        [articulo_id]
      )
      await db.run(
        "UPDATE Articulo SET stock = ? WHERE id = ?",
        [stock + order.cantidad,  articulo_id]
      );
    }

    return res.json(result);
  } catch (error : any) {
    return res.status(500).json({ message: error.message });
  }
}