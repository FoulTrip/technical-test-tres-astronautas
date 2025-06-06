"use client"

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ApiError, OrderList, PaginatedResponse, Planet, PlanetsState } from '@/types/planets'

/**
 * Custom hook for debouncing values
 */
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Zustand store for managing planets list, search, and pagination state.
 * Updated to work with NextJS 15 planets API endpoints.
 */
export const usePlanetsStore = create<PlanetsState>()(
    persist(
        (set, get) => ({
            // Initial state
            planets: [],
            searchTerm: "",
            pagination: {
                currentPage: 1,
                totalPages: 1,
                hasMore: false,
                totalItems: 0,
                itemsPerPage: 5
            },
            isLoading: false,
            error: null,
            order: "asc",
            realtime: false,

            // Setters
            setPlanets: (planets) => set({ planets }),
            setSearchTerm: (searchTerm) => set({ searchTerm }),
            setPagination: (pagination) => set({ pagination }),
            setIsLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            setOrder: (order) => set({ order }),
            setRealtime: (realtime) => set({ realtime }),

            /**
             * Fetches planets from the NextJS 15 API with enhanced parameters
             */
            fetchPlanets: async (page, nameFilter, currentOrder, realtime) => {
                set({ isLoading: true, error: null });

                try {
                    const params = new URLSearchParams({
                        page: page.toString(),
                        order: currentOrder,
                        ...(nameFilter && { name: nameFilter }),
                        ...(realtime !== undefined && { realtime: realtime.toString() })
                    });

                    const response = await fetch(`/api/planets?${params}`);

                    if (!response.ok) {
                        const errorData: ApiError = await response.json();
                        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                    }

                    const data: PaginatedResponse<Planet> = await response.json();

                    set({
                        planets: data.data,
                        pagination: data.pagination,
                        error: null
                    });

                } catch (error) {
                    console.error("Error fetching planets:", error);
                    set({
                        error: error instanceof Error ? error.message : 'Unknown error occurred',
                        planets: [],
                        pagination: {
                            currentPage: 1,
                            totalPages: 1,
                            hasMore: false,
                            totalItems: 0,
                            itemsPerPage: 5
                        }
                    });
                } finally {
                    set({ isLoading: false });
                }
            },

            /**
             * Navigate to next page
             */
            handleNextPage: () => {
                const { pagination, searchTerm, order, realtime, fetchPlanets } = get();
                if (pagination.hasMore && pagination.currentPage < pagination.totalPages) {
                    fetchPlanets(pagination.currentPage + 1, searchTerm, order, realtime);
                }
            },

            /**
             * Navigate to previous page
             */
            handlePreviousPage: () => {
                const { pagination, searchTerm, order, realtime, fetchPlanets } = get();
                if (pagination.currentPage > 1) {
                    fetchPlanets(pagination.currentPage - 1, searchTerm, order, realtime);
                }
            },

            /**
             * Toggle sorting order
             */
            switchOrderDesc: () => {
                const { searchTerm, order, realtime, fetchPlanets } = get();
                const newOrder: OrderList = order === "asc" ? "desc" : "asc";
                set({ order: newOrder });
                fetchPlanets(1, searchTerm, newOrder, realtime);
            },

            /**
             * Handle search input changes
             */
            handleSearch: (e) => {
                const value = e.target.value;
                set({ searchTerm: value });
            },

            /**
             * Toggle realtime distance data
             */
            toggleRealtime: () => {
                const { searchTerm, order, realtime, fetchPlanets } = get();
                const newRealtime = !realtime;
                set({ realtime: newRealtime });
                fetchPlanets(1, searchTerm, order, newRealtime);
            },

            /**
             * Reset store to initial state
             */
            reset: () => {
                set({
                    planets: [],
                    searchTerm: "",
                    pagination: {
                        currentPage: 1,
                        totalPages: 1,
                        hasMore: false,
                        totalItems: 0,
                        itemsPerPage: 5
                    },
                    isLoading: false,
                    error: null,
                    order: "asc",
                    realtime: false
                });
            }
        }),
        {
            name: 'planets-navigation-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                pagination: {
                    currentPage: state.pagination.currentPage,
                    totalPages: state.pagination.totalPages,
                    itemsPerPage: state.pagination.itemsPerPage
                },
                searchTerm: state.searchTerm,
                order: state.order,
                realtime: state.realtime
            })
        }
    )
);

/**
 * Custom hook for planets list management with URL synchronization
 */
export function usePlanets() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const {
        planets,
        searchTerm,
        pagination,
        isLoading,
        error,
        order,
        realtime,
        setSearchTerm,
        setOrder,
        setPagination,
        fetchPlanets,
        reset
    } = usePlanetsStore();

    // Estado para controlar la inicialización
    const [isInitialized, setIsInitialized] = useState(false);

    // Función para actualizar la URL
    const updateURL = (newSearchTerm?: string, newOrder?: OrderList, newPage?: number) => {
        const params = new URLSearchParams(searchParams);
        
        // Actualizar parámetros
        if (newSearchTerm !== undefined) {
            if (newSearchTerm.trim()) {
                params.set('search', newSearchTerm);
            } else {
                params.delete('search');
            }
        }
        
        if (newOrder !== undefined) {
            params.set('order', newOrder);
        }
        
        if (newPage !== undefined && newPage > 1) {
            params.set('page', newPage.toString());
        } else {
            params.delete('page');
        }

        // Navegar a la nueva URL
        const newURL = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
        router.push(newURL, { scroll: false });
    };

    // Inicializar estado desde URL
    useEffect(() => {
        if (!isInitialized) {
            const urlSearchTerm = searchParams.get('search') || '';
            const urlOrder = (searchParams.get('order') as OrderList) || 'asc';
            const urlPage = parseInt(searchParams.get('page') || '1');

            // Actualizar store con valores de URL
            setSearchTerm(urlSearchTerm);
            setOrder(urlOrder);
            setPagination({
                ...pagination,
                currentPage: urlPage
            });

            // Fetch inicial con parámetros de URL
            fetchPlanets(urlPage, urlSearchTerm, urlOrder, realtime);
            setIsInitialized(true);
        }
    }, [isInitialized, searchParams, setSearchTerm, setOrder, setPagination, fetchPlanets, realtime, pagination]);

    // Debounce search term
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Auto-fetch cuando cambia el término de búsqueda debouncado
    useEffect(() => {
        if (isInitialized && debouncedSearchTerm !== searchParams.get('search')) {
            updateURL(debouncedSearchTerm, order, 1);
            fetchPlanets(1, debouncedSearchTerm, order, realtime);
        }
    }, [debouncedSearchTerm, isInitialized]);

    // Función para manejar cambios en la búsqueda
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    // Función para cambiar orden
    const switchOrderDesc = () => {
        const newOrder: OrderList = order === "asc" ? "desc" : "asc";
        setOrder(newOrder);
        updateURL(searchTerm, newOrder, 1);
        fetchPlanets(1, searchTerm, newOrder, realtime);
    };

    // Función para página siguiente
    const handleNextPage = () => {
        if (pagination.hasMore && pagination.currentPage < pagination.totalPages) {
            const nextPage = pagination.currentPage + 1;
            updateURL(searchTerm, order, nextPage);
            fetchPlanets(nextPage, searchTerm, order, realtime);
        }
    };

    // Función para página anterior
    const handlePreviousPage = () => {
        if (pagination.currentPage > 1) {
            const prevPage = pagination.currentPage - 1;
            updateURL(searchTerm, order, prevPage);
            fetchPlanets(prevPage, searchTerm, order, realtime);
        }
    };

    // Función para alternar realtime
    const toggleRealtime = () => {
        const newRealtime = !realtime;
        fetchPlanets(1, searchTerm, order, newRealtime);
    };

    return {
        planets,
        searchTerm,
        pagination,
        isLoading,
        error,
        order,
        realtime,
        handleNextPage,
        handlePreviousPage,
        switchOrderDesc,
        handleSearch,
        toggleRealtime,
        reset,
        isInitialized
    };
}