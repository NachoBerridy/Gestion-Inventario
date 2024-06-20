import LinealChart, { DataLinealChart } from '@/components/Demanda/LinealChart';
const data: DataLinealChart[] = []
export default function DemandaPage() {
    const historicalDemand = []

    return (
        <div className="flex justify-center items-center w-screen h-screen">

            <LinealChart />
        </div>
    );
}