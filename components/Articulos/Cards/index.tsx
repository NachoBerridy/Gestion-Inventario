import {
	ArrowUturnDownIcon,
	CurrencyDollarIcon,
	PencilSquareIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Articulo } from "../../../pages/api/articulos";

export default function Card({
	articulo,
	deleteArticle,
	toggleUpdate,
	setId,
	createAutoOrder,
	newSale,
}: {
	newSale: Function;
	articulo: Articulo;
	createAutoOrder: (id: number) => void;
	deleteArticle: (id: number) => void;
	toggleUpdate: () => void;
	setId: (id: number) => void;
}) {
	const [color, setColor] = useState<string>("white");
	const [show, setShow] = useState<boolean>(false);
	const [deleteModal, setDeleteModal] = useState<boolean>(false);

	//funcion para elegir color, si el stock esta por encima de punto de pedido verde, si está en el punto de pedido amarillo, si está por debajo pero por encima de stock de seguridad naranja, si está por debajo de stock de seguridad rojo
	const changeColor = () => {
		const stockAContabilizar =
			articulo.stock + (articulo.stock_ingreso_pendiente ?? 0);
		switch (true) {
			case articulo.punto_pedido &&
				stockAContabilizar > articulo.punto_pedido:
				setColor("green");
				break;
			case articulo.punto_pedido &&
				stockAContabilizar === articulo.punto_pedido:
				setColor("yellow");
				break;
			case articulo.stock_seguridad &&
				articulo.punto_pedido &&
				stockAContabilizar < articulo.punto_pedido &&
				stockAContabilizar > articulo.stock_seguridad:
				setColor("orange");
				break;
			case articulo.stock_seguridad &&
				stockAContabilizar <= articulo.stock_seguridad:
				setColor("red");
				break;
			default:
				setColor("white");
				break;
		}
	};
	const update = () => {
		setId(articulo.id);
		toggleUpdate();
	};

	useEffect(() => {
		changeColor();
	}, [articulo]);

	// return (
	//     <div className="card m-2">
	//         <div className=" border border-black p-2 m-2card-body flex gap-3 items-center justify-between" onClick={() => setShow(!show)}>
	//             <div className="flex gap-3 items-center justify-between">

	//                 <h5 className="card-title">{articulo.nombre}</h5>
	//                 <span className="circle w-2 h-2 rounded-full min-w-2 min-h-2 block" style={{background: color}}></span>
	//             </div>
	//             <div className="flex gap-3 items-center">

	//                 <PencilSquareIcon className="h-6 w-6 text-gray-500 cursor-pointer" onClick={update}/>
	//                 {/* <PlusIcon className="h-6 w-6 text-gray-500 cursor-pointer" /> */}
	//                 <TrashIcon className="h-6 w-6 text-gray-500 cursor-pointer"  onClick={() => setDeleteModal(true)}/>
	//             </div>
	//         </div>
	//         {show &&
	//         <div className="flex gap-3 items-center justify-between absolut bg-white rounded-b-md p-2">
	//             <p>Stock: {articulo.stock}</p>
	//             <p>Precio: {articulo.precio}</p>
	//             <p>Stock de seguridad: {articulo.stock_seguridad ? articulo.stock_seguridad: "Sin Dato"}</p>
	//             <p>Punto de Pedido: {articulo.punto_pedido? articulo.punto_pedido: "Sin Dato"}</p>
	//             <p>lote optimo: {articulo.lote_optimo ? articulo.lote_optimo : "Sin Dato"}</p>
	//             <p>Modelo: {articulo.modelo_inventario}</p>
	//         </div>
	//         }
	//         {
	//             deleteModal &&
	//             <div className="modal flex check-delete fixed w-screen h-screen bg-gray-900 bg-opacity-50 top-0 left-0 z-50 justify-center items-center " onClick={() => setDeleteModal(false)}>
	//                 <div className="modal-content bg-white w-1/3 h-fit p-4 rounded-md flex flex-col justify-start gap-2 items-center">
	//                     <p>¿Estás seguro que deseas eliminar el articulo?</p>
	//                     <div className="flex gap-3 items-center justify-around">
	//                         <button className=" w-full p-2 bg-lime-800 text-white" onClick={() => deleteArticle(articulo.id)}>Si</button>
	//                         <button className="w-full p-2 bg-red-800 text-white" onClick={() => setDeleteModal(false)}>No</button>
	//                     </div>
	//                 </div>
	//             </div>
	//         }
	//     </div>
	// );
	return (
		<div className="card m-2 rounded-lg shadow-lg border border-gray-300">
			<div
				className="card-body flex gap-4 items-center justify-between p-3 bg-gray-100 rounded-t-lg cursor-pointer"
				onClick={() => setShow(!show)}
			>
				<div className="flex gap-4 items-center">
					<h5 className="card-title text-base font-semibold">
						{articulo.nombre}
					</h5>
					<span
						className="circle w-4 h-4 rounded-full block"
						style={{ background: color }}
					></span>
				</div>
				<div className="flex gap-4 items-center">
					<PencilSquareIcon
						className="h-6 w-6 text-blue-500 hover:text-blue-700 cursor-pointer"
						onClick={(e) => {
							e.stopPropagation()
							update()
						}}
					/>
					<TrashIcon
						className="h-6 w-6 text-red-500 hover:text-red-700 cursor-pointer"
						onClick={(e) => {
							e.stopPropagation()
							setDeleteModal(true)
						}}
					/>
					<CurrencyDollarIcon
						className="h-6 w-6 text-green-500 hover:text-green-700 cursor-pointer"
						onClick={(e) => {
							e.stopPropagation()
							newSale(articulo.id)
						}}
					/>
					<ArrowUturnDownIcon
						className="h-6 w-6 text-cyan-500 hover:text-cyan-700 cursor-pointer"
						onClick={(e) => {
							e.stopPropagation()
							createAutoOrder(articulo.id)
						}}
					/>
				</div>
			</div>
			{show && (
				<div className="flex p-2 bg-white rounded-b-lg border-t border-gray-200 justify-between">
					<p>Stock: {articulo.stock}</p>
					<p>
						Stock Ingreso Pendiente:{" "}
						{articulo.stock_ingreso_pendiente ?? 0}
					</p>
					<p>Precio: {articulo.precio}</p>
					<p>
						Stock de seguridad:{" "}
						{articulo.stock_seguridad
							? articulo.stock_seguridad
							: "Sin Dato"}
					</p>
					<p>
						Punto de Pedido:{" "}
						{articulo.punto_pedido
							? articulo.punto_pedido
							: "Sin Dato"}
					</p>
					<p>
						Lote óptimo:{" "}
						{articulo.lote_optimo
							? articulo.lote_optimo
							: "Sin Dato"}
					</p>
					<p>Modelo: {articulo.modelo_inventario}</p>
					{articulo.proveedor_id && (
						<p>Proveedor: {articulo.proveedor}</p>
					)}
				</div>
			)}
			{deleteModal && (
				<div
					className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
					onClick={() => setDeleteModal(false)}
				>
					<div className="modal-content bg-white w-1/3 p-6 rounded-lg shadow-lg flex flex-col gap-4 items-center">
						<p className="text-lg font-medium">
							¿Estás seguro que deseas eliminar el artículo?
						</p>
						<div className="flex gap-4 w-full">
							<button
								className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
								onClick={() => deleteArticle(articulo.id)}
							>
								Sí
							</button>
							<button
								className="w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
								onClick={() => setDeleteModal(false)}
							>
								No
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
