"use client"

import { useMemo } from "react";

/**
 * Custom hook to provide utility functions for planet card components.
 * Currently supports formatting numerical values for display.
 */
export function useCardPlanet() {
    /**
     * Formats numerical values for display based on the type (distance or size).
     * @param value - The numerical value to format (nullable).
     * @param type - The type of value ("distance" or "size").
     * @returns A formatted string representation of the value.
     */
    const formatValue = useMemo(() => (value: number | null, type: "distance" | "size"): string => {
        if (value === null || value === undefined) return "N/A"; // Handle null or undefined values

        if (type === "distance") {
            if (value >= 1_000_000) {
                const millions = (value / 1_000_000).toFixed(1); // Convert to millions for large distances
                return `${millions} million km`;
            }
            return `${value.toLocaleString()} km`; // Format as kilometers
        }

        return `${value.toLocaleString()} km`; // Format size as kilometers
    }, []);

    return { formatValue };
}