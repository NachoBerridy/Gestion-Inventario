import Proveedor from "@/components/Proveedor";
import { useState } from "react";
import useSWR from "swr";
import { IProveedor } from "../api/proveedores";

const fetcher = (...args) => fetch(...args).then((res) => res.json());
const PAGE_SIZE = 5;

export default function Proveedores() {
  const [currentPage, setPage] = useState<number>(1);

  const { data, error, isLoading } = useSWR<{
    rows: IProveedor[];
    totalRows: number;
  }>(
    `/api/proveedores?pageSize=${PAGE_SIZE}&offset=${
      PAGE_SIZE * (currentPage - 1)
    }`,
    fetcher
  );

  if (error || undefined === data)
    return <div>Error al cargar los proveedores</div>;
  if (isLoading) return <div>Cargando...</div>;

  const totalPages = Math.ceil(data?.totalRows / PAGE_SIZE);

  function handlePageButton(action: "inc" | "dec") {
    if (currentPage === 1 && action === "dec") return;
    if (currentPage === totalPages && action === "inc") return;

    setPage((prev) => {
      if (action === "inc") return prev + 1;
      return prev - 1;
    });
  }

  return (
    <div className="p-10 w-full h-screen flex flex-col gap-3">
      <div className="text-center">PROVEEDORES {totalPages}</div>
      <div className="flex gap-3 flex-col p-1">
        <input></input>
        <div>SELECTOR</div>
      </div>
      <div className="flex flex-col gap-10">
        {data?.rows.map((p) => (
          <Proveedor key={p.id} proveedor={p} />
        ))}
      </div>

      <div className="w-full flex justify-end gap-3">
        <button onClick={() => handlePageButton("dec")}>Prev</button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button onClick={() => handlePageButton("inc")}>Next</button>
      </div>
    </div>
  );
}
