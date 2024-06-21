import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface DataLinealChart {
    periodo: string;
    real: number | null;
    prediccion?: number | null;
} 


export default function LinealChart( {formatedData }: {formatedData: DataLinealChart[]}) {


  return (
    <div className="grafica bg-white p-4 rounded-lg  flex justify-center items-center w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={400}
          className="w-full h-full"
          data={formatedData}
          margin={{ top: 5, right:5, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="periodo" />
          <YAxis name="cantidad" />
          <CartesianGrid stroke="#000" className="bg-white" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="real" stroke="#BD2A2E" yAxisId={0} />
          <Line type="monotone" dataKey="prediccion" stroke="#2E86C1" yAxisId={0} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}