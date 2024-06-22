import getDbConnection from "@/utils/getDb";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

// model
export interface IProveedor {
  id: number;
  nombre: string;
  direccion: string;
  correo: string;
  telefono?: string;
}

// querys
async function queryProveedores(
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
    order by nombre asc
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

// handlers
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

  const proveedores = await queryProveedores(
    Number.isNaN(parsedPageSize) ? undefined : parsedPageSize,
    Number.isNaN(parsedOffset) ? undefined : parsedOffset,
    parsedQuery
  );

  res.status(200).json(proveedores);
}

export const proveedrSchema = z.object({
  nombre: z.string().min(3),
  correo: z.string().email(),
  telefono: z.string().optional(),
  direccion: z.string().min(3),
}) satisfies z.ZodType<Omit<IProveedor, "id">>;

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const proveedor = proveedrSchema.safeParse(req.body);

  if (!proveedor.success) {
    res.status(422).json(proveedor.error);
    return;
  }

  const db = await getDbConnection();

  const result = await db.run(
    "insert into Proveedor (nombre,correo,telefono,direccion)  values (:nombre,:correo,:telefono,:direccion)",
    {
      ":nombre": proveedor.data.nombre,
      ":correo": proveedor.data.correo,
      ":telefono": proveedor.data.telefono,
      ":direccion": proveedor.data.direccion,
    }
  );

  res.status(201).json({
    ...proveedor.data,
    id: result.lastID,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await getHandler(req, res);
  }

  if (req.method === "POST") {
    await postHandler(req, res);
  }
}
