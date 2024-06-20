import getDb from "@/utils/getDb";
import { NextApiRequest, NextApiResponse } from "next";

export interface IArticulo {
  id: number;
  nombre: string;
  stock: number;
  stock_seguridad: number;
  punto_pedido: number;
  lote_optimo: number;
  tasa_rotacion: number;
  modelo_inventario: string;
}

// querys
async function queryArticulos(
  limit: number = 10,
  offset: number = 0,
  queryName: string | undefined
): Promise<{
  rows: IArticulo[];
  totalRows: number;
}> {
  const db = await getDb();

  const totalRows =
    (
      await db.get<{ "count(id)": number }>(
        `
        select count(id) 
        from articulo        
        `,
        [queryName]
      )
    )?.["count(id)"] ?? 0;

  const rows = await db.all<IArticulo[]>(
    `
      select * 
      from articulo
      where nombre like 
        case
          when ?3 is not null and length(?3) > 0 then concat('%',?3,'%')
          else '%'
        end
      order by nombre asc
      limit ?1 
      offset ?2
      `,
    [limit, offset, queryName]
  );

  console.log({
    rows,
    totalRows,
  });

  return {
    rows,
    totalRows,
  };
}

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const { pageSize, offset, query } = req.query;
  const parsedOffset = Number(offset);
  const parsedPageSize = Number(pageSize);
  const parsedQuery = Array.isArray(query) ? query[0] : query;

  const LIMIT_PAGESIZE = 10;

  if (parsedPageSize > LIMIT_PAGESIZE) {
    res
      .status(400)
      .json(
        `El parametro page size supera el límite permitido ${LIMIT_PAGESIZE}`
      );
  }

  const articulos = await queryArticulos(
    Number.isNaN(parsedPageSize) ? undefined : parsedPageSize,
    Number.isNaN(parsedOffset) ? undefined : parsedOffset,
    parsedQuery
  );

  res.status(200).json(articulos);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  getHandler(req, res);
}
