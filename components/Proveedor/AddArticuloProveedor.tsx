import { IProveedor } from "@/pages/api/proveedores";
import { useEffect, useRef } from "react";

export default function AddArticuloProveedor({
  currentProveedor,
  open,
  close,
}: {
  currentProveedor: IProveedor | null;
  open: boolean;
  close: () => void;
}) {
  const dialog = useRef(null);

  // get articulos

  useEffect(() => {
    if (open) {
      dialog?.current?.showModal();
    } else {
      dialog?.current?.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className={
        open
          ? "p-10 w-96 flex gap-3 flex-col border-black border backdrop:backdrop-blur-sm"
          : undefined
      }
    >
      <h1 className="text-lg">Nuevo Articulo-Proveedor</h1>
      <form className="flex gap-3 flex-col">
        <input list="articulo" />
        <datalist id="articulo">
          <option value="Internet Explorer" />
          <option value="Firefox" />
          <option value="Chrome" />
          <option value="Opera" />
          <option value="Safari" />
        </datalist>
      </form>
    </dialog>
  );
}
