import getDbConnection from "@/utils/getDb";
import type { NextApiRequest, NextApiResponse } from "next";
import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";

// model
export interface IProveedor {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
}

// querys

async function getProveedores(
  lastId: number = 0,
  offset: number = 10
): Promise<IProveedor[]> {
  const db = await getDbConnection();

  const result = await db.all<IProveedor[]>(
    "select * from Proveedor where id > ?1 order by id limit ?2",
    [lastId, offset]
  );

  return result;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { lastId, pageSize } = req.query;
    const parsedLastId = Number(lastId);
    const parsedPageSize = Number(pageSize);

    console.log(parsedLastId, parsedPageSize);

    const proveedores = await getProveedores(
      Number.isNaN(parsedLastId) ? undefined : parsedLastId,
      Number.isNaN(parsedPageSize) ? undefined : parsedPageSize
    );

    res.status(200).json(proveedores);
  }
}
