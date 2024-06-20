import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";
let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export interface salesData {
    id: number;
    name: string;
    quantity: number;
    date: string;
}

export interface SeparetedSales {
    salesInPeriod: salesData[];
    quantity: number;
    periodStart: DateTime;
    periodEnd: DateTime;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
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
    // const { id, start_date, end_date, period }: query = req.query;

    const id = req.query.id;
    // const url = new URL(req.url || '', `http://${req.headers.host}`);
    // const start_date = url.searchParams.get('start_date');
    // const end_date = url.searchParams.get('end_date');
    // const period = url.searchParams.get('period'); // formato 1-d, 2-w, 3-m, 4-y, donde 1 es la cantidad por periodo y d es el tipo de periodo (d-dia, w-semana, m-mes, y-año)

    const { start_date, end_date, period } = req.body;

    if (!id || !start_date || !end_date || !period) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const quantityPeriod = Number(period.split("-")[0]);
    const typePeriod = period.split("-")[1];

    const sales: salesData[] = await db.all(
      `
            SELECT Venta.id as id, Articulo.nombre as name, Venta.cantidad as quantity, Venta.fecha as date FROM Venta
            join Articulo on Venta.articulo_id = Articulo.id
            where 
                Venta.articulo_id = ?
                and Venta.fecha >= ?
                and Venta.fecha <= ?
            order by Venta.fecha asc
            `,
      [id, start_date, end_date]
    );
    let separetedSales: SeparetedSales[];
    switch (typePeriod) {
      case "d":
        separetedSales = separeteByDays(
          start_date,
          end_date,
          quantityPeriod,
          sales
        );
        break;
      case "w":
        separetedSales = separeteByWeeks(
          start_date,
          end_date,
          quantityPeriod,
          sales
        );
        break;
      case "m":
        separetedSales = separeteByMonths(
          start_date,
          end_date,
          quantityPeriod,
          sales
        );
        break;
      case "y":
        separetedSales = separeteByYears(
          start_date,
          end_date,
          quantityPeriod,
          sales
        );
        break;
      default:
        separetedSales = [];
        break;
    }
    return res.status(200).json(separetedSales);
    // return res.status(200).json({sales, quantity});
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

const separeteByDays = (
  start_date: string,
  end_date: string,
  quantityNumber: number,
  sales: salesData[]
) => {
  const start = DateTime.fromISO(start_date);
  const end = DateTime.fromISO(end_date);
  const quantityOfPeriod = Math.round(
    end.diff(start, "days").days / quantityNumber
  );
  let separetedSales: SeparetedSales[] = [];
  let periodStart = start;
  for (let i = 0; i < quantityOfPeriod; i++) {
    const periodEnd = periodStart
      .plus({ days: quantityNumber - 1 })
      .endOf("day");
    const salesInPeriod = sales.filter((sale) => {
      const date = DateTime.fromISO(sale.date);
      return date >= periodStart && date <= periodEnd;
    });
    const quantity = salesInPeriod.reduce(
      (acc, sale) => acc + sale.quantity,
      0
    );
    separetedSales.push({ salesInPeriod, quantity, periodStart, periodEnd });
    periodStart = periodStart.plus({ days: i }).startOf("day");
  }
  return separetedSales; // formato de respuesta [{salesInPeriod: salesData[], quantity: number, periodStart: DateTime, periodEnd: DateTime}]
};

const separeteByWeeks = (
  start_date: string,
  end_date: string,
  quantityNumber: number,
  sales: salesData[]
) => {
  const start = DateTime.fromISO(start_date);
  const end = DateTime.fromISO(end_date);
  const quantityOfPeriod = Math.round(
    end.diff(start, "weeks").weeks / quantityNumber
  );
  let separetedSales: SeparetedSales[] = [];
  let periodStart = start;
  for (let i = 0; i < quantityOfPeriod; i++) {
    const periodEnd = periodStart
      .plus({ weeks: quantityNumber - 1 })
      .endOf("week");
    const salesInPeriod = sales.filter((sale) => {
      const date = DateTime.fromISO(sale.date);
      return date >= periodStart && date <= periodEnd;
    });
    const quantity = salesInPeriod.reduce(
      (acc, sale) => acc + sale.quantity,
      0
    );
    separetedSales.push({ salesInPeriod, quantity, periodStart, periodEnd });
    periodStart = periodStart.plus({ weeks: quantityNumber }).startOf("week");
  }
  return separetedSales;
};

const separeteByMonths = (
  start_date: string,
  end_date: string,
  quantityNumber: number,
  sales: salesData[]
) => {
  const start = DateTime.fromISO(start_date);
  const end = DateTime.fromISO(end_date);
  const quantityOfPeriod = Math.round(
    end.diff(start, "months").months / quantityNumber
  );
  let separetedSales: SeparetedSales[] = [];
  let periodStart = start;
  for (let i = 0; i < quantityOfPeriod; i++) {
    const periodEnd = periodStart
      .plus({ months: quantityNumber - 1 })
      .endOf("month");
    console.log(periodStart.toISO(), periodEnd.toISO());
    const salesInPeriod = sales.filter((sale) => {
      const date = DateTime.fromISO(sale.date);
      return date >= periodStart && date <= periodEnd;
    });
    const quantity = salesInPeriod.reduce(
      (acc, sale) => acc + sale.quantity,
      0
    );
    separetedSales.push({ salesInPeriod, quantity, periodStart, periodEnd });
    periodStart = periodStart.plus({ months: quantityNumber }).startOf("month");
  }
  return separetedSales;
};
const separeteByYears = (
  start_date: string,
  end_date: string,
  quantityNumber: number,
  sales: salesData[]
) => {
  const start = DateTime.fromISO(start_date);
  const end = DateTime.fromISO(end_date);
  const quantityOfPeriod = Math.round(
    end.diff(start, "years").years / quantityNumber
  );
  let separetedSales: SeparetedSales[] = [];
  let periodStart = start;
  for (let i = 0; i < quantityOfPeriod; i++) {
    const periodEnd = periodStart
      .plus({ years: quantityNumber - 1 })
      .endOf("year");
    const salesInPeriod = sales.filter((sale) => {
      const date = DateTime.fromISO(sale.date);
      return date >= periodStart && date <= periodEnd;
    });
    const quantity = salesInPeriod.reduce(
      (acc, sale) => acc + sale.quantity,
      0
    );
    separetedSales.push({ salesInPeriod, quantity, periodStart, periodEnd });
    periodStart = periodStart.plus({ years: quantityNumber }).startOf("year");
  }
  return separetedSales;
};
