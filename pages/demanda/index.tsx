import  LinealChart,{DataLinealChart} from './linealChart';
const data: DataLinealChart[] = []
export default function DemandaPage() {
    const historicalDemand = []

    return (
        <div className="flex justify-center items-center">

            <LinealChart data={data}/>
        </div>
    );
}