import { IArticulo } from "@/pages/api/articulos/query";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function AddArticuloProveedor({
  currentProveedorId,
  open,
  close,
}: {
  currentProveedorId: number | null;
  open: boolean;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [selectedArticulo, setSelectedArticulo] = useState<number | null>(null);
  const [minRange, setMinRange] = useState<number | null>(null);

  // get articulos
  const { data } = useSWR<{
    rows: IArticulo[];
    totalRows: number;
  }>(`/api/articulos/query?pageSize=5&query=${query}`, fetcher);

  useEffect(() => {
    if (!open) {
      return;
    }

    dialog?.current?.showModal();

    return () => {
      dialog?.current?.close();
    };
  }, [open]);

  useEffect(() => {
    const updateQuery = setTimeout(() => {
      setSelectedArticulo(null);
      setQuery(search);
    }, 500);

    return () => {
      clearTimeout(updateQuery);
    };
  }, [search]);

  function handleSelectArticulo(idArticulo: number) {
    setSelectedArticulo((prev) => {
      if (prev === idArticulo) {
        return null;
      }
      return idArticulo;
    });
  }

  function closeAddArticulo() {
    setSearch("");
    setQuery("");
    setSelectedArticulo(null);
    setMinRange(null);
    close();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    if (!selectedArticulo || !currentProveedorId) return;
    e.preventDefault();

    const form = e.currentTarget;

    const formData = new FormData(form);
    formData.append("articulo_id", selectedArticulo.toString());

    fetch(`/api/proveedores/${currentProveedorId}/articulo`, {
      method: form.method,
      body: new URLSearchParams(formData as any).toString(),
      headers: {
        "Content-Type": form.enctype,
      },
    }).then((response) => {
      if (response.ok) {
        toast.success("Articulo agregado al proveedor!");
      } else {
        toast.error("Ocurrio un error...");
      }

      closeAddArticulo();
    });
  }

  return (
    <dialog
      ref={dialog}
      className={
        open
          ? "p-10 w-2/3 flex gap-3 flex-col border-black border backdrop:backdrop-blur-sm"
          : undefined
      }
    >
      <h1 className="text-lg">Nuevo Articulo-Proveedor</h1>
      <div className="flex gap-3 flex-col">
        <label className="flex w-full">
          Buscar:
          <input
            className="ml-16 p-1 border-black border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        {!selectedArticulo && (
          <div>
            <span className="rounded-full bg-blue-100 p-1 text-sm">
              Seleccione un articulo
            </span>
          </div>
        )}
        <table className="table-auto border-collapse">
          <thead>
            <tr>
              <th className="text-left">Código</th>
              <th className="text-left">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {data?.rows.map((a) => (
              <tr
                key={a.id}
                onClick={() => handleSelectArticulo(a.id)}
                className={
                  selectedArticulo === a.id
                    ? "bg-slate-400"
                    : "hover:bg-slate-400"
                }
              >
                <td>{a.id}</td>
                <td>{a.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {open && selectedArticulo && (
          <>
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">
                Configuración
              </span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>

            <form
              method="post"
              encType="application/x-www-form-urlencoded"
              onSubmit={handleSubmit}
              className="w-full grid grid-cols-2 gap-4"
            >
              <label>Plazo de entrega (días):</label>
              <input
                required
                className="p-1 border-black border"
                name="plazo_entrega"
                type="number"
                min={0}
              />
              <label>Costo de pedido ($):</label>
              <input
                required
                className="p-1 border-black border"
                name="costo_pedido"
                type="number"
                step="0.01"
                min={0}
              />
              <label>Precio por unidad ($):</label>
              <input
                required
                className="p-1 border-black border"
                name="precio_unidad"
                type="number"
                step="0.01"
                min={1}
              />
              <label>Cantidad minima de unidades:</label>
              <input
                placeholder="Opcional"
                className="p-1 border-black border"
                name="cantidad_min"
                type="number"
                min={1}
                onChange={(e) => setMinRange(parseInt(e.currentTarget.value))}
              />
              <label>Cantidad maxima de unidades:</label>
              <input
                placeholder="Opcional"
                className="p-1 border-black border"
                name="cantidad_max"
                type="number"
                min={minRange ?? 0}
              />
              <button className="rounded border-black border" type="submit">
                Guardar
              </button>
              <button
                className="rounded border-black border"
                onClick={closeAddArticulo}
                type="submit"
              >
                Cancel
              </button>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
