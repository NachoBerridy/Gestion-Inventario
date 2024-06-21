
interface SeparetedSales {
  salesInPeriod: any[];
  quantity: number;
  periodStart: string;
  periodEnd: string;
}

interface cyclesWithPeriods {
  startDate: string;
  endDate: string;
  periods: SeparetedSales[];
}

interface preditionInterface {
  startDate: string | null;
  endDate: string | null;
  sales: number;
}

export default function Table({
  cycles,
  averageSalesByPeriod,
  seasonalIndex,
  predictions
}: {
  cycles: cyclesWithPeriods[];
  averageSalesByPeriod: number[];
  seasonalIndex: number[];
  predictions: preditionInterface[];
}) {
  // Determina el número máximo de periodos en los ciclos
  const maxPeriods = Math.max(...cycles.map(cycle => cycle.periods.length));

  return (
    <div className="overflow-y-auto h-full">
      <table className="table-auto h-full w-full bg-white text-black">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Periodo</th>
            {cycles.map((_, cycleIndex) => (
              <th key={`cycle-${cycleIndex}`} className="px-4 py-2">
                Ciclo {cycleIndex + 1}
              </th>
            ))}
            <th className="px-4 py-2">Promedio</th>
            <th className="px-4 py-2">Índice</th>
            <th className="px-4 py-2">Predicción</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxPeriods }).map((_, periodIndex) => (
            <tr key={`period-${periodIndex}`} className="text-center">
              <td className="border px-4 py-2">{periodIndex + 1}</td>
              {cycles.map((cycle, cycleIndex) => (
                <td key={`cycle-${cycleIndex}-period-${periodIndex}`} className="border px-4 py-2">
                  {cycle.periods[periodIndex] ? cycle.periods[periodIndex].quantity : '-'}
                </td>
              ))}
              <td className="border px-4 py-2">
                {averageSalesByPeriod[periodIndex] !== undefined ? averageSalesByPeriod[periodIndex].toFixed(2) : '-'}
              </td>
              <td className="border px-4 py-2">
                {seasonalIndex[periodIndex] !== undefined ? seasonalIndex[periodIndex].toFixed(2) : '-'}
              </td>
              <td className="border px-4 py-2">
                {predictions[periodIndex] ? predictions[periodIndex].sales.toFixed(2) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
