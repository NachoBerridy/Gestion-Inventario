import { useState } from "react";


export default function PesosPMP( {setWeights, weights, setShow}: {setWeights: Function , weights: number[], setShow: Function}) {
  const [localWeights, setLocalWeights] = useState(weights);

  const sendWeights = () => {
    setWeights(localWeights);
    setShow(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen fixed text-black">
      <div 
        className="bg-gray-700 opacity-50 w-screen h-screen fixed top-0 left-0 z-50"
        onClick={() => setShow(false)}
      >

        </div>
      <div className="bg-white w-fit p-4 h-3/4 gap-4 z-100 rounded-lg shadow-lg min-w-fit overflow-auto">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl mb-4">Seleccionar Pesos</h1>
          <table className="table-auto border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2">Periodo</th>
                <th className="border border-gray-400 px-4 py-2">Peso</th>
              </tr>
            </thead>
            <tbody>
              {localWeights.map((weight, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-400 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-400 px-4 py-2">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => {
                        const newWeights = [...localWeights];
                        newWeights[index] = parseFloat(e.target.value);
                        setLocalWeights(newWeights);
                      }}
                      className="text-center w-full focus:outline-none focus:ring-none"
                      step={0.1}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center mt-4">
            <button className="p-2 bg-blue-500 rounded-lg text-white" onClick={sendWeights}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );



}