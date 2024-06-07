import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    try {
        if (!db) {
            db = await open({
                filename: "./db/test.db",
                driver: sqlite3.Database,
            });
        }
        if (req.method !== "PUT") {
            return res.status(405).json({ message: "Method Not Allowed" });
        }

        const { nombre, stock ,precio, id}:{nombre:String, stock:Number,precio:Number, id:Number} = req.body;
        !id && res.status(400).json({ message: "id is required" });

        const articulo = await db.all(`
            SELECT Articulo.id, nombre, stock, precio FROM Articulo
            join Articulo_Precio_Venta on Articulo.id = Articulo_Precio_Venta.articulo_id
            where 
                Articulo.id = ${id} 
                and Articulo_Precio_Venta.fecha_inicio = (select max(fecha_inicio) from Articulo_Precio_Venta where articulo_id = ${id})
            `);
        if (!articulo) {
            return res.status(404).json({ message: `Articulo ${id} not found` });
        }

        const result = await db.run(
            "UPDATE Articulo SET nombre = ?, stock = ? WHERE id = ?",
            [nombre, stock, id]
        );
        console.log(articulo[0].precio);
        if (precio !== articulo[0].precio) {
            console.log("precio diferente");
            const date = new Date();
            const result3 = await db.run(
                `UPDATE Articulo_Precio_Venta SET fecha_fin = ? WHERE articulo_id = ? and fecha_fin is NULL`,
                [date.toISOString(), id]
            );
            const result2 = await db.run(
                `INSERT INTO Articulo_Precio_Venta (precio, articulo_id, fecha_inicio) VALUES (?, ?, ?)`,
                [precio, id, date.toISOString()]
            );
            
        }
        return res.status(200).json({ message: `Articulo ${id} updated` });
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}