import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

let currentDb: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export default async function getDb(): Promise<
  Database<sqlite3.Database, sqlite3.Statement>
> {
  if (currentDb !== null) {
    return currentDb;
  }

  const db = await open({
    filename: "./db/test.db",
    driver: sqlite3.Database,
  });

  currentDb = db;

  return db;
}
