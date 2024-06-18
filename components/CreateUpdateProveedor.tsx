import { IProveedor } from "@/pages/api/proveedores";
import { FormEvent, useEffect, useRef } from "react";

export default function CreateUpdateProveedor({
  currentProveedor,
  open,
  close,
}: {
  currentProveedor: IProveedor | null;
  open: boolean;
  close: () => void;
}) {
  const dialog = useRef(null);

  useEffect(() => {
    if (open) {
      dialog?.current?.showModal();
    } else {
      dialog?.current?.close();
    }
  }, [open]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    console.log(form);
    console.log(form.enctype);

    const formData = new FormData(form);

    if (currentProveedor === null) {
      fetch("/api/proveedores", {
        method: form.method,
        body: new URLSearchParams(formData as any).toString(),
        headers: {
          "Content-Type": form.enctype,
        },
      }).then(() => close());
    } else {
      fetch(`/api/proveedores/${currentProveedor.id}`, {
        method: "PUT",
        body: new URLSearchParams(formData as any).toString(),
        headers: {
          "Content-Type": form.enctype,
        },
      }).then(() => {
        // close();
      });
    }
  }

  function fillValue(key: keyof IProveedor) {
    if (currentProveedor === null) {
      return "";
    }

    return currentProveedor[key];
  }

  return (
    <dialog
      ref={dialog}
      className={
        open
          ? "p-10 w-96 flex gap-3 flex-col border-black border backdrop:backdrop-blur-sm"
          : undefined
      }
    >
      <h1 className="text-lg">
        {currentProveedor === null ? "Nuevo Proveedor" : "Editar Proveedor"}
      </h1>

      <form
        method="post"
        encType="application/x-www-form-urlencoded"
        className="flex gap-3 flex-col"
        onSubmit={handleSubmit}
      >
        <input
          name="nombre"
          required
          placeholder="Nombre"
          minLength={3}
          defaultValue={fillValue("nombre")}
          className="w-full p-1 border-black border"
        />
        <input
          name="direccion"
          required
          placeholder="Dirección"
          minLength={3}
          defaultValue={fillValue("direccion")}
          className="w-full p-1 border-black border"
        />
        <input
          name="correo"
          required
          placeholder="Correo"
          type="email"
          defaultValue={fillValue("correo")}
          className="w-full p-1 border-black border"
        />
        <input
          name="telefono"
          placeholder="Telefono"
          type="tel"
          defaultValue={fillValue("telefono")}
          className="w-full p-1 border-black border"
        />

        <button type="submit" className="rounded border-black border">
          Guardar
        </button>
        <button
          type="button"
          onClick={() => close()}
          className="rounded border-black border"
        >
          Cancelar
        </button>
      </form>
    </dialog>
  );
}
