import CreateUpdateProveedor from "@/components/CreateUpdateProveedor";
import Proveedor from "@/components/Proveedor";
import { FormEvent, useState } from "react";
import useSWR from "swr";
import { IProveedor } from "../api/proveedores";

const fetcher = (...args) => fetch(...args).then((res) => res.json());
const PAGE_SIZE = 5;

export default function Proveedores() {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [dialogData, setDialogData] = useState<{
    open: boolean;
    currentProveedor: IProveedor | null;
  }>({
    open: false,
    currentProveedor: null,
  });

  const { data, error, isLoading } = useSWR<{
    rows: IProveedor[];
    totalRows: number;
  }>(
    `/api/proveedores?pageSize=${PAGE_SIZE}&offset=${
      PAGE_SIZE * (page - 1)
    }&query=${query}`,
    fetcher
  );

  if (error || undefined === data) {
    return <div>Error al cargar los proveedores</div>;
  }
  if (isLoading) return <div>Cargando...</div>;

  const totalPages = Math.ceil(data?.totalRows / PAGE_SIZE);

  function handlePageButton(action: "inc" | "dec") {
    if (page === 1 && action === "dec") return;
    if (page === totalPages && action === "inc") return;

    setPage((prev) => {
      if (action === "inc") return prev + 1;
      return prev - 1;
    });
  }

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const queryValue = formData.get("queryValue");
    if (queryValue !== null) {
      setQuery(queryValue.toString());
    }
  }

  function openDialogCreate() {
    setDialogData({
      open: true,
      currentProveedor: null,
    });
  }

  function openDialogUpdate(proveedor: IProveedor) {
    setDialogData({
      open: true,
      currentProveedor: proveedor,
    });
  }
  function closeDialog() {
    setDialogData({
      open: false,
      currentProveedor: null,
    });
  }

  return (
    <div className="p-10 w-full h-screen flex flex-col gap-3">
      <div className="text-center">PROVEEDORES</div>
      <div className="flex gap-3 flex-col p-1">
        <form
          className="flex gap-3"
          method="post"
          onSubmit={handleSearchSubmit}
        >
          <input
            name="queryValue"
            defaultValue={query}
            placeholder="Buscar..."
            className="w-full border-black border"
            autoFocus={true}
          />
          <button type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 hover:stroke-purple-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </form>
        <div>SELECTOR</div>
      </div>
      <div className="flex flex-col gap-10 overflow-auto">
        {data?.rows.map((p) => (
          <Proveedor
            key={p.id}
            proveedor={p}
            editAction={() => openDialogUpdate(p)}
          />
        ))}
      </div>
      <CreateUpdateProveedor
        open={dialogData.open}
        currentProveedor={dialogData.currentProveedor}
        close={closeDialog}
      />
      <div className="w-full flex justify-end gap-3 mt-auto pr-10">
        <button onClick={openDialogCreate}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 hover:stroke-purple-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </div>

      <div className="w-full flex justify-end gap-3 mt-auto">
        <button onClick={() => handlePageButton("dec")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 hover:stroke-purple-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
            />
          </svg>
        </button>
        <span>{totalPages > 0 ? `${page} / ${totalPages}` : "0 / 0"}</span>
        <button onClick={() => handlePageButton("inc")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 hover:stroke-purple-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
