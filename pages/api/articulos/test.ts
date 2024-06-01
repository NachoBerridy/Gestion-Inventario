// route.js
// Import the necessary modules for SQLite
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";

// Initialize a variable to hold the SQLite database connection
//@ts-ignore
let db = null;

// Handler for GET requests to retrieve all todos
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    // Open a new connection if there is none
    //@ts-ignore
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

    // return new Response(JSON.stringify(todos), {
    //     headers: { "content-type": "application/json" },
    //     status: 200,
    // });
}