import getDbConnection from "@/utils/getDb";
import type { NextApiRequest, NextApiResponse } from "next";
import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";

// model
export interface Proveedor {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
}

// querys

async function getProveedores(
  lastId: number | null = null,
  offset: number = 10
): Promise<Proveedor[]> {
  const db = await getDbConnection();

  const result = await db.all<Proveedor[]>("select * from Proveedor");

  return result;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const proveedores = await getProveedores();

    res.status(200).json(proveedores);
  }
}
