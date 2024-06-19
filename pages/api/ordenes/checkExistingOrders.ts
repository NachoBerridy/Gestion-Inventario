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
  const { article } = req.body;

  if(method !== "POST") {
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
  try {
    const orders = await db.all(
      `SELECT * FROM Articulo 
      join Articulo_Proveedor on Articulo.id = Articulo_Proveedor.articulo_id
      join Orden_Compra on Articulo_Proveedor.id = Orden_Compra.articulo_proveedor_id
      join Orden_Compra_Estado on Orden_Compra.id = Orden_Compra_Estado.orden_compra_id
      where Articulo.id = ? and Orden_Compra_Estado.estado in (?,?)`,
      [article, PENDIENTE, ENVIADAS]
      );
    if (orders.length === 0) {
      return res.status(200).json({ message: "No hay ordenes pendientes" });
    } else {
      const pendingOrders = orders.filter((order) => order.estado === "Pendiente");
      if (pendingOrders.length > 0) {
        return res.status(200).json(pendingOrders[0]);
      } else {
        return res.status(200).json({ message: "Hay ordenes enviadas para este articulo" });
      }
    }
  } catch (error : any) {
    return res.status(500).json({ message: error.message });
  }
};