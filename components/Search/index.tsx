import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBar({setSearch}:{setSearch:any}){

    return(
        <div className="flex items-center shadow-xl w-1/2 justify-start px-4 bg-white">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
            <input type="text" className="w-full p-2 focus:outline-none" placeholder="Buscar..." onChange={(e) => setSearch(e.target.value)} />
        </div>
    )
}