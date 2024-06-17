import { FormEvent, useEffect, useRef } from "react";

export default function CreateProveedor({
  open,
  close,
}: {
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

    fetch("/api/proveedores", {
      method: form.method,
      body: new URLSearchParams(formData as any).toString(),
      headers: {
        "Content-Type": form.enctype,
      },
    }).then(() => close());
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
      <h1 className="text-lg">Nuevo Proveedor</h1>

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
          className="w-full p-1 border-black border"
        />
        <input
          name="direccion"
          required
          placeholder="Dirección"
          minLength={3}
          className="w-full p-1 border-black border"
        />
        <input
          name="correo"
          required
          placeholder="Correo"
          type="email"
          className="w-full p-1 border-black border"
        />
        <input
          name="telefono"
          placeholder="Telefono"
          type="tel"
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
