import getDb from "@/utils/getDb";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { proveedrSchema } from ".";

const idSchema = z.coerce.number();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(404).json("");
  }

  const { id } = req.query;

  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    return res.status(422).json(parsedId.error);
  }

  const proveedor = proveedrSchema.safeParse(req.body);

  if (!proveedor.success) {
    res.status(422).json(proveedor.error);
    return;
  }

  const db = await getDb();

  // verificamos que exista el proveedor

  const existProveedor = await db.all(
    `
    select exists(
        select 1 from proveedor where id = ?1
    )
  `,
    [id]
  );

  if (existProveedor.length === 0) {
    res.status(404).json("");
  }

  await db.run(
    `
    update proveedor
      set nombre = :nombre,
          correo = :correo,
          telefono = :telefono,
          direccion = :direccion
    where id = :id
  `,
    {
      ":nombre": proveedor.data.nombre,
      ":correo": proveedor.data.correo,
      ":telefono": proveedor.data.telefono,
      ":direccion": proveedor.data.direccion,
      ":id": parsedId.data,
    }
  );

  res.status(200).json({ ...proveedor.data, id });
}
