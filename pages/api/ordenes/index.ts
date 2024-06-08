import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export interface IOrdenCompra {
  id: number;
  articulo: string;
  proveedor: string;
  precio: number;
  estado: string;
  fecha: string;
  cantidad: number;
  total: number;
  plazo: string;
}

export interface IEstadoOrdenCompra {
  estado: string;
  fecha: string;
}

//Get all orders

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    db = await open({
      filename: "./db/test.db",
      driver: sqlite3.Database,
    });

    const ordenes = await db.all(`
      SELECT 
        Orden_Compra.id as id,
        Articulo.nombre as articulo,
        Proveedor.nombre as proveedor,
        Orden_Compra.cantidad as cantidad,
        Orden_Compra_Estado.estado as estado,
        Orden_Compra_Estado.fecha as fecha,
        Precio.precio_unidad as precio,
        Orden_Compra.total as total,
        plazo_entrega as plazo
      FROM Orden_Compra
        join Orden_Compra_Estado on Orden_Compra.id = Orden_Compra_Estado.orden_compra_id
        join Articulo_Proveedor on Orden_Compra.articulo_proveedor_id = Articulo_Proveedor.id
        join Articulo on Articulo_Proveedor.articulo_id = Articulo.id
        join Proveedor on Articulo_Proveedor.proveedor_id = Proveedor.id
        join Precio on Articulo_Proveedor.id = Precio.articulo_proveedor_id
      `);

    res.status(200).json(ordenes);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
}