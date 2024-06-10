import getDbConnection from "@/utils/getDb";
import type { NextApiRequest, NextApiResponse } from "next";

// model
export interface IProveedor {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
}

// querys
async function getProveedores(
  limit: number = 10,
  offset: number = 0,
  queryName: string | undefined
): Promise<{
  rows: IProveedor[];
  totalRows: number;
}> {
  const db = await getDbConnection();

  const totalRows =
    (
      await db.get<{ "count(id)": number }>(
        `
      select count(id) 
      from proveedor
      where nombre like 
        case
          when ?1 is not null and length(?1) > 0 then concat('%',?1,'%')
          else '%'
        end      
      `,
        [queryName]
      )
    )?.["count(id)"] ?? 0;

  const rows = await db.all<IProveedor[]>(
    `
    select * 
    from proveedor 
    where nombre like 
      case
        when ?3 is not null and length(?3) > 0 then concat('%',?3,'%')
        else '%'
      end
    limit ?1 
    offset ?2
    `,
    [limit, offset, queryName]
  );

  return {
    rows,
    totalRows,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
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

    const proveedores = await getProveedores(
      Number.isNaN(parsedPageSize) ? undefined : parsedPageSize,
      Number.isNaN(parsedOffset) ? undefined : parsedOffset,
      parsedQuery
    );

    res.status(200).json(proveedores);
  }
}
