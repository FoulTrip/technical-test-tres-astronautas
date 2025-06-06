"use client"

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useEffect, useMemo, useState } from 'react'
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
 * Custom hook for planets list management
 */
export function usePlanets() {
    const {
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
        fetchPlanets,
        reset
    } = usePlanetsStore();

    // Debounce search term
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Auto-fetch when debounced search term changes
    useMemo(() => {
        if (debouncedSearchTerm !== undefined) {
            fetchPlanets(1, debouncedSearchTerm, order, realtime);
        }
    }, [debouncedSearchTerm, order, realtime]);

    // Initial fetch on mount
    useEffect(() => {
        fetchPlanets(pagination.currentPage, searchTerm, order, realtime);
    }, []);

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
        reset
    };
}