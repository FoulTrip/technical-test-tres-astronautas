import { SearchBarProps } from "@/types/planets";
import { TbPlanet, TbSortAscending, TbSortDescending, TbX } from "react-icons/tb";

export function SearchBar({ searchTerm, onSearch, order, onToggleOrder }: SearchBarProps) {
    const handleClearSearch = () => {
        onSearch({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleOrder();
        }
    };

    return (
        <div className="mb-16 sm:mb-20">
            <div className="max-w-8xl mx-auto">
                <form className="flex flex-row gap-2 sm:gap-4" onSubmit={(e) => e.preventDefault()}>
                    {/* Search Input Container */}
                    <div className="relative flex-1 group min-w-0">
                        {/* Planet Icon */}
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none z-10">
                            <TbPlanet
                                size={18}
                                className="text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors duration-200 sm:w-5 sm:h-5"
                            />
                        </div>

                        {/* Input Field */}
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={onSearch}
                            className="
                                w-full h-10 sm:h-12 md:h-14 
                                pl-10 sm:pl-12 pr-10 sm:pr-12 
                                bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                                border border-gray-200/50 dark:border-gray-600/50 
                                rounded-lg sm:rounded-xl
                                text-gray-900 dark:text-white 
                                placeholder-gray-500 dark:placeholder-gray-400
                                text-sm sm:text-base md:text-lg
                                transition-all duration-200
                                focus:outline-none 
                                focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
                                focus:border-blue-500 dark:focus:border-blue-400
                                hover:border-gray-300/70 dark:hover:border-gray-500/70
                                shadow-sm hover:shadow-md focus:shadow-lg
                            "
                            placeholder="Buscar planetas..."
                            aria-label="Buscar planetas"
                        />

                        {/* Clear Button */}
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="
                                    absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4
                                    text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                                    transition-colors duration-200
                                    focus:outline-none focus:text-gray-600 dark:focus:text-gray-300
                                "
                                aria-label="Limpiar búsqueda"
                            >
                                <TbX size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                        )}
                    </div>

                    {/* Sort Button */}
                    <div className="flex-shrink-0">
                        <button
                            type="button"
                            onClick={onToggleOrder}
                            onKeyDown={handleKeyDown}
                            className="
                                group relative flex items-center justify-center
                                w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                                bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                                border border-gray-200/50 dark:border-gray-600/50
                                rounded-lg sm:rounded-xl
                                text-gray-700 dark:text-white
                                transition-all duration-200
                                hover:bg-white/90 dark:hover:bg-gray-700/80
                                hover:border-gray-300/70 dark:hover:border-gray-500/70
                                hover:shadow-md hover:-translate-y-0.5
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
                                active:scale-95
                            "
                            aria-label={`Ordenar ${order === "asc" ? "descendente" : "ascendente"}`}
                        >
                            {order === "asc" ? (
                                <TbSortAscending size={18} className="transition-transform duration-200 group-hover:scale-110 sm:w-5 sm:h-5" />
                            ) : (
                                <TbSortDescending size={18} className="transition-transform duration-200 group-hover:scale-110 sm:w-5 sm:h-5" />
                            )}

                            {/* Tooltip - solo visible en pantallas medianas y grandes */}
                            <div className="
                                hidden sm:block
                                absolute -top-12 left-1/2 transform -translate-x-1/2
                                px-3 py-1.5 
                                bg-gray-900 dark:bg-gray-700 
                                text-white text-xs font-medium
                                rounded-lg
                                opacity-0 group-hover:opacity-100
                                transition-opacity duration-200
                                pointer-events-none
                                whitespace-nowrap
                                z-20
                            ">
                                {order === "asc" ? "Ordenar Z-A" : "Ordenar A-Z"}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                            </div>
                        </button>
                    </div>
                </form>

                {/* Search Results Counter */}
                {searchTerm && (
                    <div className="mt-3 sm:mt-4 text-center">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Buscando: <span className="font-medium text-gray-900 dark:text-gray-100">"{searchTerm}"</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}