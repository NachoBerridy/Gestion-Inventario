import getDb from "@/utils/getDb";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const idSchema = z.coerce.number();

export interface IArticuloProveedor {
  articulo_id: number;
  plazo_entrega: number;
  costo_pedido: number;
  //precio
  precio_unidad: number;
  cantidad_min: number | null;
  cantidad_max: number | null;
}

const articuloProveedorSchema = z
  .object({
    articulo_id: z.coerce.number().min(1),
    plazo_entrega: z.coerce.number().min(0),
    costo_pedido: z.coerce.number().min(0),
    precio_unidad: z.coerce.number().min(1),
    cantidad_min: z.coerce
      .number()
      .nullable()
      .transform((value) => (value === 0 ? null : value)),
    cantidad_max: z.coerce
      .number()
      .nullable()
      .transform((value) => (value === 0 ? null : value)),
  })
  .refine(
    ({ cantidad_min, cantidad_max }) => {
      if (cantidad_max !== null && cantidad_min !== null) {
        return cantidad_max >= cantidad_min;
      }
      return true;
    },
    {
      message: "Cantidad max debe ser mayor a cantidad min",
    }
  ) satisfies z.ZodType<IArticuloProveedor>;

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // id proveedor
  const proveedorId = idSchema.safeParse(id);
  if (!proveedorId.success) {
    return res.status(422).json(proveedorId.error);
  }

  const articuloProveedor = articuloProveedorSchema.safeParse(req.body);

  if (!articuloProveedor.success) {
    return res.status(422).json(articuloProveedor.error);
  }
  const db = await getDb();

  // verificamos que exista el proveedor

  const existProveedor = await db.all(
    `
    select exists(
        select 1 from proveedor where id = ?1
    )
  `,
    [proveedorId.data]
  );

  if (existProveedor.length === 0) {
    return res.status(404).json("");
  }

  // verificamos que exista el articulo
  const existArticulo = await db.all(
    `
    select exists(
        select 1 from articulo where id = ?1
    )
  `,
    [articuloProveedor.data.articulo_id]
  );

  if (existArticulo.length === 0) {
    return res.status(404).json("articulo no encontrado");
  }

  // insertamos la relacion articulo proveedor

  const newArticuloProveedor = await db.run(
    `
    insert into articulo_proveedor 
        (articulo_id,proveedor_id,plazo_entrega,costo_pedido)  
    values 
        (:articulo_id,:proveedor_id,:plazo_entrega,:costo_pedido)
    `,
    {
      ":articulo_id": articuloProveedor.data.articulo_id,
      ":proveedor_id": proveedorId.data,
      ":plazo_entrega": articuloProveedor.data.plazo_entrega,
      ":costo_pedido": articuloProveedor.data.costo_pedido,
    }
  );

  //insertamos el precio
  await db.run(
    `
    insert into precio
        (articulo_proveedor_id,precio_unidad,cantidad_min,cantidad_max,fecha_inicio)
    values
        (:articulo_proveedor_id,:precio_unidad,:cantidad_min,:cantidad_max,:fecha_inicio)
    `,
    {
      ":articulo_proveedor_id": newArticuloProveedor.lastID,
      ":precio_unidad": articuloProveedor.data.precio_unidad,
      ":cantidad_min": articuloProveedor.data.cantidad_min,
      ":cantidad_max": articuloProveedor.data.cantidad_max,
      ":fecha_inicio": new Date().toISOString(),
    }
  );

  res.status(201).json("");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await postHandler(req, res);
  }
}
