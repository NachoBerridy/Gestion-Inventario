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

  try{
    const { method } = req;
    if(method !== "GET") {
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
    const { searchParams }  = new URL(req.url || "", `http://${req.headers.host}`);
  } catch (error : any) {
    return res.status(500).json({ message: error.message });
  }
  
}