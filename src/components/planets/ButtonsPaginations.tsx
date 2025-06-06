"use client"

import { PaginationProps } from "@/types/planets";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";

function ButtonsPagination({ currentPage, totalPages, onNext, onPrevious }: PaginationProps) {
    const handleKeyDown = (e: React.KeyboardEvent, action: () => void, disabled: boolean) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            action();
        }
    };

    const isPrevDisabled = currentPage === 1;
    const isNextDisabled = currentPage >= totalPages;

    return (
        <div className="flex justify-center items-center gap-3 sm:gap-4 mt-8 mb-6">
            {/* Previous Button */}
            <button
                onClick={onPrevious}
                onKeyDown={(e) => handleKeyDown(e, onPrevious, isPrevDisabled)}
                disabled={isPrevDisabled}
                className={`
                    group relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 
                    rounded-xl border transition-all duration-200 
                    ${isPrevDisabled 
                        ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                        : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                `}
                aria-label="Página anterior"
            >
                <PiCaretLeftBold className="w-4 h-4 sm:w-5 sm:h-5" />
                
                {/* Tooltip */}
                {!isPrevDisabled && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        Anterior
                    </div>
                )}
            </button>

            {/* Page Indicator */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                    {currentPage}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    de
                </span>
                <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                    {totalPages}
                </span>
            </div>

            {/* Next Button */}
            <button
                onClick={onNext}
                onKeyDown={(e) => handleKeyDown(e, onNext, isNextDisabled)}
                disabled={isNextDisabled}
                className={`
                    group relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 
                    rounded-xl border transition-all duration-200 
                    ${isNextDisabled 
                        ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                        : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                `}
                aria-label="Página siguiente"
            >
                <PiCaretRightBold className="w-4 h-4 sm:w-5 sm:h-5" />
                
                {/* Tooltip */}
                {!isNextDisabled && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        Siguiente
                    </div>
                )}
            </button>
        </div>
    );
}

export default ButtonsPagination;