import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { proveedrSchema } from ".";

const idSchema = z.number();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  res.status(200).json("");
}
