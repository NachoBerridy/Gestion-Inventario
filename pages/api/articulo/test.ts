// route.js
// Import the necessary modules for SQLite
import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";

// Initialize a variable to hold the SQLite database connection

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

// Handler for GET requests to retrieve all todos
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    // Open a new connection if there is none
    if (!db) {
        db = await open({
            filename: "./db/test.db",
            driver: sqlite3.Database,
        });
    }

    // Query to get all todos from the "todo" table 
    const todos = await db.all("SELECT * FROM todo");

    // Return the todos as a JSON response with a 200 status code
    res.status(200).json(
        todos
    )
}