import { FormEvent } from "react";

export default function CreateProveedor({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) {
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
      className={
        open
          ? "p-10 w-96 flex gap-3 flex-col border-black border backdrop:bg-black/50 backdrop:backdrop-blur-md"
          : undefined
      }
      open={open}
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
        <button onClick={() => close()} className="rounded border-black border">
          Cancelar
        </button>
      </form>
    </dialog>
  );
}
