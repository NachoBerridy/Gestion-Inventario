import useSWR from "swr";
import { Proveedor } from "../api/proveedores";
import React from "react";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Proveedores() {
  const { data, error, isLoading } = useSWR<Proveedor[]>(
    "/api/proveedores",
    fetcher
  );

  if (error) return <div>Error al cargar los proveedores</div>;
  if (isLoading) return <div>Cargando...</div>;

  // render data
  return (
    <div>
      {data?.map((p) => (
        <React.Fragment key={p.id}>
          <div>Id: {p.id}</div>
          <div>Correo: {p.correo}</div>
          <div>Direccion: {p.direccion}</div>
          <div>Nombre: {p.nombre}</div>
          <div>Telefono: {p.telefono}</div>
        </React.Fragment>
      ))}
    </div>
  );
}
