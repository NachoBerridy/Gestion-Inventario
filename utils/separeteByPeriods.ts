import { SeparetedSales, salesData } from "@/pages/api/venta/demandaHistorica/[id]";
import { DateTime } from "luxon";


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


const separateByPeriods = (
  typePeriod: string,  // 'd', 'w', 'm', 'y'
  start_date: string, // '2022-01-01'
  end_date: string, // '2022-12-31'
  quantityNumber: number, // 1
  sales: salesData[] // [{id: 1, date: '2022-01-01', quantity: 10, name: 'Product1}]
) : SeparetedSales[] => {
  switch (typePeriod) {
    case 'd':
      return separeteByDays(start_date, end_date, quantityNumber, sales)
    case 'w':
      return separeteByWeeks (start_date, end_date, quantityNumber, sales)
    case 'm':
      return separeteByMonths (start_date, end_date, quantityNumber, sales)
    case 'y':
      return separeteByYears (start_date, end_date, quantityNumber, sales)
    default:
      return separeteByDays (start_date, end_date, quantityNumber, sales)
  }
}

export default separateByPeriods;