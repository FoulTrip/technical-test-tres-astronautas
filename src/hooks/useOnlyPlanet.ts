"use client"

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect } from 'react';
import {
    ApiError,
    initialDetailState,
    PlanetDetails,
    PlanetDetailState,
    PlanetImageResponse,
} from '@/types/planets';
import { useRouter } from 'next/navigation';

/**
 * Zustand store for managing planet detail data
 * Updated to work with the new NextJS 15 planet details API
 */
export const usePlanetDetailStore = create<PlanetDetailState>()(
    persist(
        (set, get) => ({
            ...initialDetailState,
            favorites: [],
            // Image-related state
            imagePlanet: null,
            imageLoading: false,
            imageError: null,

            /**
             * Fetch detailed planet data from the API
             */
            fetchPlanetData: async (planetId: string) => {
                set({ loading: true, error: null, isLoading: true });

                try {
                    const response = await fetch(`/api/planets/${planetId}`);

                    if (!response.ok) {
                        const errorData: ApiError = await response.json();
                        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                    }

                    const data: PlanetDetails = await response.json();
                    set({ planet: data, error: null });

                } catch (err) {
                    console.error("Error fetching planet details:", err);
                    set({
                        error: err instanceof Error ? err.message : 'An error occurred',
                        planet: null
                    });
                } finally {
                    set({ loading: false, isLoading: false });
                }
            },

            /**
             * Fetch planet image from the API
             */
            fetchPlanetImage: async (planetId: string) => {
                set({ imageLoading: true, imageError: null });

                try {
                    const response = await fetch(`/api/planets/${planetId}/image`);

                    if (!response.ok) {
                        const errorData: ApiError = await response.json();
                        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                    }

                    const data: PlanetImageResponse = await response.json();
                    set({ imagePlanet: data.imageUrl, imageError: null });

                } catch (err) {
                    console.error("Error fetching planet image:", err);
                    set({
                        imageError: err instanceof Error ? err.message : 'An error occurred loading image',
                        imagePlanet: null
                    });
                } finally {
                    set({ imageLoading: false });
                }
            },

            /**
             * Toggle favorite status for a planet
             */
            toggleFavorites: (planetId: string) => {
                set((state) => ({
                    favorites: state.favorites.includes(planetId)
                        ? state.favorites.filter(id => id !== planetId)
                        : [...state.favorites, planetId]
                }));
            },

            /**
             * Check if a planet is favorited
             */
            isFavorite: (planetId: string) => {
                return get().favorites.includes(planetId);
            },

            /**
             * Reset state while preserving favorites
             */
            reset: () => {
                const currentFavorites = get().favorites;
                set({
                    ...initialDetailState,
                    favorites: currentFavorites,
                    imagePlanet: null,
                    imageLoading: false,
                    imageError: null
                });
            }
        }),
        {
            name: 'planet-detail-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                favorites: state.favorites
            })
        }
    )
)

/**
 * Custom hook to simplify access to the planet detail store.
 * Handles fetching planet data and image when the `planetId` changes.
 * Provides access to both transient and persisted state.
 * @param planetId - The ID of the planet to fetch data and image for.
 */
export function usePlanetData(planetId: string) {
    const {
        planet,
        error,
        loading,
        imagePlanet,
        imageLoading,
        imageError,
        isLoading,
        favorites,
        fetchPlanetData,
        fetchPlanetImage,
        toggleFavorites,
        isFavorite,
    } = usePlanetDetailStore();

    // Effect for fetching planet data when `planetId` changes
    useEffect(() => {
        if (planetId) {
            fetchPlanetData(planetId); // Fetch planet data
        }
    }, [planetId, fetchPlanetData]);

    // Effect for fetching planet image when `planetId` changes
    useEffect(() => {
        if (planetId) {
            fetchPlanetImage(planetId); // Fetch planet image
        }
    }, [planetId, fetchPlanetImage]);

    // Helper functions
    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toLocaleString()
    }

    const formatDate = (dateString: string): string => {
        if (!dateString) return ''
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        } catch {
            return dateString
        }
    }

    const hasValue = (value: any): boolean => {
        return value !== null && value !== undefined && value !== 0 && value !== ''
    }

    const router = useRouter();

    return {
        planet, // Fetched planet data
        error, // Error message for planet data fetch
        loading, // Loading state for planet data
        imagePlanet, // URL of the planet's image
        imageLoading, // Loading state for the planet image
        imageError, // Error message for image fetch
        isLoading, // Combined loading state
        favorites, // Persisted favorites list
        toggleFavorites, // Function to toggle favorite status
        isFavorite, // Function to check favorite status
        formatNumber, // Function to format numbers
        formatDate, // Function to format dates
        hasValue, // Function to check if a value is present
        router
    };
}