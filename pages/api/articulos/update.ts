import { NextApiRequest, NextApiResponse } from "next";
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

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

        let { nombre, stock ,precio, id,modeloInventario,tasaRotacion,proveedor_id}:{nombre:String, stock:Number,precio:Number, id:Number,modeloInventario:string,tasaRotacion:number,proveedor_id:number} = req.body;
        !id && res.status(400).json({ message: "id is required" });
    
        // const articulo = await db.all(`
        //     SELECT Articulo.id, nombre, stock, precio FROM Articulo
        //     join Articulo_Precio_Venta on Articulo.id = Articulo_Precio_Venta.articulo_id
        //     where 
        //         Articulo.id = ?
        //         and Articulo_Precio_Venta.fecha_inicio = (select max(fecha_inicio) from Articulo_Precio_Venta where articulo_id = ?)
        //     `,[id]);
        const articulo = await db.all(`SELECT * FROM Articulo 
        join Articulo_Precio_Venta on Articulo.id = Articulo_Precio_Venta.articulo_id
        where Articulo.id = ? and Articulo_Precio_Venta.fecha_fin is NULL`,[id]);
        nombre? nombre = nombre : nombre = articulo[0].nombre;
        stock? stock = stock : stock = articulo[0].stock;
        precio? precio = precio : precio = articulo[0].precio;
        modeloInventario? modeloInventario = modeloInventario : modeloInventario = articulo[0].modelo_inventario;
        tasaRotacion? tasaRotacion = tasaRotacion : tasaRotacion = articulo[0].tasa_rotacion;
        proveedor_id? proveedor_id = proveedor_id : proveedor_id = articulo[0].proveedor_id;
        

        if (articulo.length === 0) {
            return res.status(404).json({ message: `Articulo ${id} not found` });
        }

        const existing = await db.get(`SELECT * FROM Articulo WHERE nombre = ? and id != ?`, [nombre, id]);
        if (existing) {
            return res.status(409).json({ message: "No puede crear un articulo con el mismo nombre que uno existente" });
        }

        const result = await db.run(
            "UPDATE Articulo SET nombre = ?, stock = ? ,modelo_inventario = ?, tasa_rotacion = ?, proveedor_id = ? WHERE id = ?",
            [nombre, stock, modeloInventario, tasaRotacion, proveedor_id, id]
        );

        //si cambio el precio, se inserta un nuevo precio y se cierra el anterior
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