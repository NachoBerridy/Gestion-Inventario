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
  const { id }: { id: string } = req.body;

  if(method !== "DELETE") {
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const result = await db.run(
      "DELETE FROM Orden_Compra WHERE id = ?",id
    ); 
    await db.run("DELETE FROM Orden_Compra_Estado WHERE orden_compra_id = ?",id);

    return res.json(result);
  } catch (error : any) {
    return res.status(500).json({ message: error.message });
  }

}