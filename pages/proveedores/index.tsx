import useSWR from "swr";
import { IProveedor } from "../api/proveedores";
import React from "react";
import styles from "./styles.module.css";

function Proveedor({ proveedor }: { proveedor: IProveedor }) {
  return (
    <div className="flex gap-3 border border-black p-3 border-wid">
      <span className="grow">{proveedor.nombre}</span>
      <span className="w-10 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </span>
      <span className="w-10 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </span>
    </div>
  );
}

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Proveedores() {
  const { data, error, isLoading } = useSWR<IProveedor[]>(
    "/api/proveedores?pageSize=5",
    fetcher
  );

  if (error) return <div>Error al cargar los proveedores</div>;
  if (isLoading) return <div>Cargando...</div>;

  // render data
  return (
    <div className="p-10 w-full h-screen flex flex-col gap-3">
      <div className="text-center">PROVEEDORES</div>
      <div className="flex gap-3 flex-col p-1">
        <input></input>
        <div>SELECTOR</div>
      </div>
      <div className="flex flex-col gap-10">
        {data?.map((p) => (
          <Proveedor key={p.id} proveedor={p} />
        ))}
      </div>
    </div>
  );
}
