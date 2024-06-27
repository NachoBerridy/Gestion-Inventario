import { calcCGI, calcInventario } from "@/components/Inventarios/Inventarios";
import { NextApiRequest, NextApiResponse } from "next";
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";
import { getDemanda } from "../venta/demandaHistorica/[id]";


let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!db) {
      db = await open({
        filename: "./db/test.db",
        driver: sqlite3.Database,
      });
    }
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { idArticulo }: { idArticulo: number } = req.body;
    if (!idArticulo) {
      return res.status(400).json({ message: "Missing field: idArticulo" });
    }

    const articulos = await db.all(
      `SELECT 
            a.id, a.nombre,
            a.modelo_inventario,
            a.tasa_rotacion, 
            ap.plazo_entrega, 
            ap.costo_pedido, 
            p.precio_unidad 
        FROM Articulo a
        LEFT JOIN Articulo_Proveedor ap ON ap.articulo_id = a.id 
        LEFT JOIN Precio p ON p.articulo_proveedor_id = ap.id 
        WHERE a.id = ? 
	      AND p.fecha_fin IS NULL`,
      [idArticulo]
    );

    if (articulos.length === 0) {
      return res.status(404).json({ message: "Articulo not found" });
    }

    const calcDemanda = async (id: number): Promise<number> => {
      try {
        const data = await getDemanda(
          id,
          "y",
          `${2022}-01-01`,
          `${2022}-12-31`,
          1,
          db as Database
          // start_date: `${new Date().getFullYear()}-01-01`,
          // end_date: `${new Date().getFullYear()}-12-31`,
        );
        return data[0]?.quantity ?? 0;
      } catch (error) {
        throw new Error(`Failed to fetch demanda for id: ${id}`);
      }
    };

    const articulosWithLoteOptimo = await Promise.all(
      articulos.map(async (arti: any) => {
        const demandaAnual = await calcDemanda(arti.id);
        return {
          ...arti,
          demandaAnual: demandaAnual,
          CalculosInventario: calcInventario({
            demandaAnual,
            tiempoEntrega: arti.plazo_entrega,
            desviacionEstandar: 0,
            costoP: arti.costo_pedido,
            costoA: arti.precio_unidad * arti.tasa_rotacion,
            tipoInv: arti.modelo_inventario,
          }),
        };
      })
    );

    const articulosWithCGI = articulosWithLoteOptimo.map((arti: any) => ({
      ...arti,
      CGI: calcCGI({
        costoArticulo: arti.precio_unidad,
        costoAlmacenar: arti.precio_unidad * arti.tasa_rotacion,
        loteOptimo: arti.CalculosInventario.loteOptimo,
        demandaAnual: arti.demandaAnual,
        costoPedidoQ: arti.costo_pedido,
      }),
    }));
    
    const articuloFinal =(()=>{

      const sortedByCGI = articulosWithCGI.sort((a,b)=>a['CGI']-b['CGI'])
      return sortedByCGI[0]

    })()     

    return res.status(200).json({ articulo: articuloFinal });
  } catch (error: any) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
}
