interface DataInterface {
    periodo: string;
    real: number | null;
    prediccion?: number | null;
}

export default function Table({ data } : { data: DataInterface[] }) {
    return (
        <div className="overflow-y-hidden h-1/2 ">
            <table className="table-auto h-full w-full bg-white text-black">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2">Periodo</th>
                        <th className="px-4 py-2">Real</th>
                        <th className="px-4 py-2">Predicción</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{index}</td>
                            <td className="border px-4 py-2">{row.real}</td>
                            <td className="border px-4 py-2">{row.prediccion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
