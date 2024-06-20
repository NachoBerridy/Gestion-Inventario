import { DateTime } from "luxon";
import { SeparetedSales, salesData } from "@/pages/api/venta/demandaHistorica/[id]";

interface Period {
  startDate: DateTime;
  endDate: DateTime;
  data: salesData[];
  salesTotal: number;
}

interface Cycle {
  startDate: DateTime;
  endDate: DateTime;
  data: Period[];
}

function generatePeriods(cycle: Cycle, data: SeparetedSales[], unit: "days" | "weeks" | "months" | "years", endOfUnit: "day" | "week" | "month" | "year") {
  const periodsCount = cycle.startDate.diff(cycle.endDate, unit).as(unit);
  Array(Math.floor(periodsCount)).fill(0).forEach((_, index) => {
    const startDatePeriod = cycle.startDate.plus({ [unit]: index });
    const endDatePeriod = startDatePeriod.plus({ [unit]: 1 }).endOf(endOfUnit);
    const period: Period = {
      startDate: startDatePeriod,
      endDate: endDatePeriod,
      data: data.filter(period => {
        return period.periodStart >= startDatePeriod && period.periodEnd <= endDatePeriod;
      }).map(period => period.salesInPeriod).flat(),
      salesTotal: 0
    };
    cycle.data.push(period);
  });
}

export default function CalculoIndiceEstacionalidad(
  data: SeparetedSales[],
  amoutOfCycles: number,
  startDate: DateTime,
  endDate: DateTime,
  typePeriod: string // 'd', 'w', 'm', 'y'
) {
  // Calcular los días de cada ciclo y de cada periodo
  const cycleLength = Math.round(endDate.diff(startDate, 'days').days / amoutOfCycles);

  // Ordenar data por fecha
  data.sort((a, b) => {
    return a.periodStart.toMillis() - b.periodStart.toMillis();
  });

  // Crear los ciclos
  let cycles: Cycle[] = [];
  Array(amoutOfCycles).fill(0).forEach((_, index) => {
    const startDateCycle = startDate.plus({ days: index * cycleLength });
    const endDateCycle = startDateCycle.plus({ days: cycleLength - 1 });
    const cycle: Cycle = {
      startDate: startDateCycle,
      endDate: endDateCycle,
      data: []
    };
    cycles.push(cycle);
  });

  // Asignar los periodos a los ciclos
  cycles.forEach(cycle => {
    switch (typePeriod) {
      case 'd':
        generatePeriods(cycle, data, 'days', 'day');
        break;
      case 'w':
        generatePeriods(cycle, data, 'weeks', 'week');
        break;
      case 'm':
        generatePeriods(cycle, data, 'months', 'month');
        break;
      case 'y':
        generatePeriods(cycle, data, 'years', 'year');
        break;
      default:
        cycle.data = [];
        break;
    }
  });

  // Calcular el promedio y total de ventas de cada periodo
  cycles.forEach(cycle => {
    cycle.data.forEach(period => {
      period.salesTotal = period.data.reduce((acc, sale) => acc + sale.quantity, 0);
    });
  });
  // Calcular el promedio y total de ventas de todos los periodos
  const totalSales = cycles.reduce((acc, cycle) => {
    return acc + cycle.data.reduce((acc, period) => acc + period.salesTotal, 0);
  }, 0);
  const totalPeriods = cycles.reduce((acc, cycle) => {
    return acc + cycle.data.length;
  }, 0);
  const averageSales = totalSales / totalPeriods;

  const averageSalesByPeriod: number[] = [];
  Array(cycles[0].data.length).fill(0).forEach((_, index) => {
    const total = cycles.reduce((acc, cycle) => {
      return acc + cycle.data[index].salesTotal;
    }, 0);
    averageSalesByPeriod.push(total / cycles.length);
  });

  const indexEstacionalidad = averageSalesByPeriod.map((average, index) => {
    return average / averageSales;
  });
  
  const predictSales = averageSalesByPeriod.map((average, index) => {
    return average * indexEstacionalidad[index];
  });

  return {
    indexEstacionalidad,
    predictSales
  };

}
