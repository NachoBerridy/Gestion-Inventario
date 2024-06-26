// import { calcCGI, calcInventario } from "@/components/Inventarios/Inventarios";
// import axios from "axios";
// import _ from "lodash";
// import { NextApiRequest, NextApiResponse } from "next";
// import { Database, open } from "sqlite";
// import sqlite3 from "sqlite3";
// let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<any>
// ) {
//   try {
//     if (!db) {
//       db = await open({
//         filename: "./db/test.db",
//         driver: sqlite3.Database,
//       });
//     }
//     if (req.method !== "POST") {
//       return res.status(405).json({ message: "Method Not Allowed" });
//     }

//     let { idArticulo }: { idArticulo: Number } = req.body;
//     if (!idArticulo) {
//       const missingFields = [];
//       !idArticulo && missingFields.push("idArticulo");
//       return res
//         .status(400)
//         .json({ message: `Missing fields: ${missingFields.join(", ")}` });
//     }

//     const articulos = await db.get(
//       `SELECT
//             a.id,a.nombre,
//             a.modelo_inventario,
//             a.tasa_rotacion,
//             ap.plazo_entrega,
//             ap.costo_pedido,
//             p.precio_unidad
//         FROM Articulo a
//         LEFT JOIN Articulo_Proveedor ap ON ap.articulo_id = a.id
//         LEFT JOIN Precio p ON p.articulo_proveedor_id = ap.id
//         WHERE a.id = ?
// 	    AND p.fecha_fin IS NULL `,
//       [idArticulo]
//     );
//     const calcDemanda = async (id: number): Promise<number> => {
//       const demandaAnual: any = await axios.post(
//         `/api/venta/demandaHistorica/${id}`,
//         {
//           start_date: `${new Date().getFullYear()}-01-01`,
//           end_date: `${new Date().getFullYear()}-12-31`,
//           period: "1-y",
//         }
//       );
//       return demandaAnual[0].quantity;
//     };

//     const articulosWithLoteOptimo = await articulos.map((arti: any) => ({
//       ...arti,

//       LoteOptimo: calcInventario({
//         demandaAnual: calcDemanda(arti.id),
//         tiempoEntrega: arti.plazo_entrega,
//         desviacionEstandar: 0,
//         costoP: arti.costo_pedido,
//         costoA: arti.precio_unidad * arti.tasa_rotacion,
//         tipoInv: arti.modelo_inventario,
//       }),
//     }));

//     const articulosWithCGI = articulosWithLoteOptimo.map((arti: any) => ({
//       ...arti,
//       CGI: calcCGI({
//         costoArticulo: arti.precio_unidad,
//         costoAlmacenar: arti.precio_unidad * arti.tasaRotacion,
//         loteOptimo: arti.LoteOptimo,
//         demandaAnual: 0,
//         costoPedidoQ: arti.costo_pedido,
//       }),
//     }));
//     const articuloFinal = _.minBy(articulosWithCGI, "CGI");

//     return res.status(200).json({ articulo: articuloFinal });
//   } catch (error: any) {
//     return res.status(500).json({ message: error.message });
//   }
// }
import { calcCGI, calcInventario } from "@/components/Inventarios/Inventarios";
import axios from "axios";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";
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
    console.log(articulos);
    const calcDemanda = async (id: number): Promise<number> => {
      const { data } = await axios.post(`/api/venta/demandaHistorica/${id}`, {
        start_date: `${new Date().getFullYear()}-01-01`,
        end_date: `${new Date().getFullYear()}-12-31`,
        period: "1-y",
      });
      return data[0].quantity;
    };

    const articulosWithLoteOptimo = await Promise.all(
      articulos.map(async (arti: any) => ({
        ...arti,
        LoteOptimo: calcInventario({
          demandaAnual: await calcDemanda(arti.id),
          tiempoEntrega: arti.plazo_entrega,
          desviacionEstandar: 0,
          costoP: arti.costo_pedido,
          costoA: arti.precio_unidad * arti.tasa_rotacion,
          tipoInv: arti.modelo_inventario,
        }),
      }))
    );
    console.log(articulosWithLoteOptimo);

    const articulosWithCGI = articulosWithLoteOptimo.map((arti: any) => ({
      ...arti,
      CGI: calcCGI({
        costoArticulo: arti.precio_unidad,
        costoAlmacenar: arti.precio_unidad * arti.tasa_rotacion,
        loteOptimo: arti.LoteOptimo,
        demandaAnual: arti.demandaAnual,
        costoPedidoQ: arti.costo_pedido,
      }),
    }));
    console.log(articulosWithCGI);

    const articuloFinal = _.minBy(articulosWithCGI, "CGI");
    console.log(articuloFinal);

    return res.status(200).json({ articulo: articuloFinal });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
