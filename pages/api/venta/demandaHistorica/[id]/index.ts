import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import { NextApiRequest, NextApiResponse } from "next";
import { DateTime } from "luxon";
let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

interface salesData {
    id: number;
    name: string;
    quantity: number;
    date: string;
}

interface SeparetedSales {
    salesInPeriod: salesData[];
    quantity: number;
}

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
        if (req.method !== "GET") {
            return res.status(405).json({ message: "Method Not Allowed" });
        }
        // const { id, start_date, end_date, period }: query = req.query;
        
        const id = req.query.id;
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const start_date = url.searchParams.get('start_date');
        const end_date = url.searchParams.get('end_date');
        const period = url.searchParams.get('period'); // formato 1-d, 2-w, 3-m, 4-y, donde 1 es la cantidad por periodo y d es el tipo de periodo (d-dia, w-semana, m-mes, y-año)

        if (!id || !start_date || !end_date|| !period) {
            return res.status(400).json({ message: "Missing fields" });
        }
        
        const quantityPeriod = Number(period.split('-')[0]);
        const typePeriod = period.split('-')[1];

        const sales:salesData[] = await db.all(`
            SELECT Venta.id as id, Articulo.nombre as name, Venta.cantidad as quantity, Venta.fecha as date FROM Venta
            join Articulo on Venta.articulo_id = Articulo.id
            where 
                Venta.articulo_id = ?
                and Venta.fecha >= ?
                and Venta.fecha <= ?
            order by Venta.fecha asc
            `,[id, start_date, end_date]);

        let separetedSales:SeparetedSales[];
        switch (typePeriod) {
            case 'd':
                separetedSales = separeteByDays(start_date, end_date, quantityPeriod, sales);
                break;
            case 'w':
                separetedSales = separeteByWeeks(start_date, end_date, quantityPeriod, sales);
                break;
            case 'm':   
                separetedSales = separeteByMonths(start_date, end_date, quantityPeriod, sales);             
                break;
            case 'y':
                separetedSales = separeteByYears(start_date, end_date, quantityPeriod, sales);
                break;
            default:
                separetedSales = [];
                break;
        }
        return res.status(200).json(separetedSales);
        // return res.status(200).json({sales, quantity});
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

const separeteByDays = (start_date: string, end_date: string, quantity: number, sales:salesData[]) => {
    const start = DateTime.fromISO(start_date);
    const end = DateTime.fromISO(end_date);
    const quantityOfPeriod = end.diff(start, 'days').days / quantity;
    let separetedSales:SeparetedSales[] = [];
    for (let i = 0; i < quantity; i++) {
        const periodStart = start.plus({ days: i * quantityOfPeriod });
        const periodEnd = periodStart.plus({ days: quantityOfPeriod });
        const salesInPeriod = sales.filter(sale => {
            const date = DateTime.fromISO(sale.date);
            return date >= periodStart && date <= periodEnd;
        });
        const quantity = salesInPeriod.reduce((acc, sale) => acc + sale.quantity, 0);
        separetedSales.push({salesInPeriod, quantity});
    }
    return separetedSales;
};
const separeteByWeeks = (start_date: string, end_date: string, quantity: number,sales:salesData[]) => {
    const start = DateTime.fromISO(start_date);
    const end = DateTime.fromISO(end_date);
    const quantityOfPeriod = end.diff(start, 'weeks').weeks / quantity;
    let separetedSales:SeparetedSales[] = [];
    for (let i = 0; i < quantity; i++) {
        const periodStart = start.plus({ weeks: i * quantityOfPeriod });
        const periodEnd = periodStart.plus({ weeks: quantityOfPeriod });
        const salesInPeriod = sales.filter(sale => {
            const date = DateTime.fromISO(sale.date);
            return date >= periodStart && date <= periodEnd;
        });
        const quantity = salesInPeriod.reduce((acc, sale) => acc + sale.quantity, 0);
        separetedSales.push({salesInPeriod, quantity});
    }
    return separetedSales;
};
const separeteByMonths = (start_date: string, end_date: string, quantity: number,sales:salesData[]) => {
    const start = DateTime.fromISO(start_date);
    const end = DateTime.fromISO(end_date);
    const quantityOfPeriod = end.diff(start, 'months').months / quantity;
    let separetedSales:SeparetedSales[] = [];
    for (let i = 0; i < quantity; i++) {
        const periodStart = start.plus({ months: i * quantityOfPeriod });
        const periodEnd = periodStart.plus({ months: quantityOfPeriod });
        const salesInPeriod = sales.filter(sale => {
            const date = DateTime.fromISO(sale.date);
            return date >= periodStart && date <= periodEnd;
        });
        const quantity = salesInPeriod.reduce((acc, sale) => acc + sale.quantity, 0);
        separetedSales.push({salesInPeriod, quantity});
    }
    return separetedSales;
};
const separeteByYears = (start_date: string, end_date: string, quantity: number,sales:salesData[]) => {
    const start = DateTime.fromISO(start_date);
    const end = DateTime.fromISO(end_date);
    const quantityOfPeriod = end.diff(start, 'years').years / quantity;
    let separetedSales:SeparetedSales[] = [];
    for (let i = 0; i < quantity; i++) {
        const periodStart = start.plus({ years: i * quantityOfPeriod });
        const periodEnd = periodStart.plus({ years: quantityOfPeriod });
        const salesInPeriod = sales.filter(sale => {
            const date = DateTime.fromISO(sale.date);
            return date >= periodStart && date <= periodEnd;
        });
        const quantity = salesInPeriod.reduce((acc, sale) => acc + sale.quantity, 0);
        separetedSales.push({salesInPeriod, quantity});
    }
    return separetedSales;
};
