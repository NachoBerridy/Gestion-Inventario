import { salesData, SeparetedSales } from "@/pages/api/venta/demandaHistorica/[id]";
import { DateTime } from "luxon";
import separateByPeriods from "./separeteByPeriods";

function calculateTheAmountOfCycles( startDate: string, endDate: string, typeOfCycle: string, quantityCycle: number): number {
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);
  
  let amountOfCycles = 0;

  switch (typeOfCycle) {
    case "d":
      amountOfCycles = Math.round(end.diff(start, "days").days / quantityCycle);
      break;
    case "w":
      amountOfCycles = Math.round(end.diff(start, "weeks").weeks / quantityCycle);
      break;
    case "m":
      amountOfCycles = Math.round(end.diff(start, "months").months / quantityCycle);
      break;
    case "y":
      amountOfCycles = Math.round(end.diff(start, "years").years / quantityCycle);
      break;
    default:
      amountOfCycles = 0;
      break;
  }
  return amountOfCycles;
}

function determinateCycleDates(startDate: string, endDate: string, typeOfCycle: string, quantityCycle: number): {startDate: string | null, endDate: string | null}[] {

  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);

  const cycles = []

  enum typeOfCycleEnum{
    d = "days",
    w = "weeks",
    m = "months",
    y = "years"
  }
  
  const typeCycle =  typeOfCycleEnum[typeOfCycle as keyof typeof typeOfCycleEnum];
  const amountOfCycles = calculateTheAmountOfCycles(startDate, endDate, typeOfCycle, quantityCycle);

  for (let i = 0; i < amountOfCycles; i++) {
    const startDateCycle = start.plus({ [typeCycle]: i * quantityCycle });
    const endDateCycle = startDateCycle.plus({ [typeCycle]: quantityCycle }).minus({ days: 1 });
    cycles.push({startDate: startDateCycle.toISODate(), endDate: endDateCycle.toISODate()});
  }

  //@ts-ignore
  if(cycles[cycles.length - 1].endDate && end.toISODate() && cycles[cycles.length - 1].endDate < end.toISODate()){
    //@ts-ignore
    const lastCycleEnd = DateTime.fromISO(cycles[cycles.length - 1].endDate);
    const startDateCycle = lastCycleEnd.plus({ days: 1 });
    cycles.push({startDate: startDateCycle.toISODate(), endDate: end.toISODate()});
  }


  return cycles;

}

function addPeriodsToCycles(cycles: {startDate: string | null, endDate: string | null}[], sales: SeparetedSales[]): {startDate: string | null, endDate: string | null, periods: SeparetedSales[]}[] {
  return cycles.map((cycle) => {
    const periods = sales.filter((period) => {
      //@ts-ignore
      const periodStart = DateTime.fromISO(period.periodStart);
      //@ts-ignore
      return periodStart >= DateTime.fromISO(cycle.startDate) && periodStart <= DateTime.fromISO(cycle.endDate);
    });
    return {
      ...cycle,
      periods
    }
  });
}

function calculateAverage(periods: SeparetedSales[]): number {
  const sum = periods.reduce((acc, period) => acc + period.quantity, 0) || 0;
  const average = sum / periods.length;
  return average
}

function calculateAverageSalesByPeriod(cycles: { startDate: string | null, endDate: string | null, periods: SeparetedSales[] }[]): number[] {
  const maxPeriods = Math.max(...cycles.map(cycle => cycle.periods.length));
  const averageSalesByPeriod: number[] = [];

  for (let i = 0; i < maxPeriods; i++) {
    let total = 0;
    let count = 0;

    cycles.forEach(cycle => {
      if (i < cycle.periods.length) {
        total += cycle.periods[i].quantity;
        count++;
      }
    });
    if (count < 3) {
      averageSalesByPeriod.push(-1);
    } else {
      averageSalesByPeriod.push(total / count);
    }
  }

  return averageSalesByPeriod;
}

function predictSalesByPeriod(seasonalIndex: number[], estimatedSales: number, cycle:{startDate: string | null, endDate: string | null, periods: SeparetedSales[]}): { startDate: string | null, endDate: string | null, sales: number }[] {
  
  const sales = cycle.periods.map((period, index) => {
    if (seasonalIndex[index] === -1) {
      return {
        startDate: period.periodStart,
        endDate: period.periodEnd,
        sales: -1
      }
    }
    return {
      startDate: period.periodStart,
      endDate: period.periodEnd,
      sales: seasonalIndex[index] * estimatedSales / cycle.periods.length
    }
  });
  //@ts-ignore
  return sales;

}

const estimateSeasonalityIndex = (
  sales : salesData[], 
  typePeriod: string, 
  quantityPeriod:number, 
  startDate: string, 
  endDate: string, 
  typeOfCycle: string, 
  quantityCycle: number,
  estimatedSales: number
) => {
  const periods = separateByPeriods(typePeriod, startDate, endDate, quantityPeriod, sales);
  const cycles = determinateCycleDates(startDate, endDate, typeOfCycle, quantityCycle);
  const cyclesWithPeriods = addPeriodsToCycles(cycles, periods);
  const averageSalesByPeriod = calculateAverageSalesByPeriod(cyclesWithPeriods);
  const averageSales = calculateAverage(periods);
  const seasonalIndex = averageSalesByPeriod.map((average) => average !== -1 ? average / averageSales : -1);
  const predictions = predictSalesByPeriod(seasonalIndex, estimatedSales , cyclesWithPeriods[0]);
  return {
    averageSalesByPeriod,
    averageSales,
    seasonalIndex,
    predictions
  }
}

export default estimateSeasonalityIndex;
