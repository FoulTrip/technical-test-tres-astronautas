"use client";

import { useRouter } from "next/navigation";
import { PiArrowUpRightBold } from "react-icons/pi";
import { useCardPlanet } from "@/hooks/useCartPlanet";
import { PlanetCardProps } from "@/types/planets";
import { usePlanetData } from "@/hooks/useOnlyPlanet";
import { TbStarFilled } from "react-icons/tb";

/**
 * Component to display a card for a single planet.
 * Includes an image (if available), name, size, and distance from Earth.
 * Clicking the card navigates to the planet's detail page.
 */
export default function PlanetCard({ planet }: PlanetCardProps) {
    const router = useRouter();
    const { formatValue } = useCardPlanet();
    const { isFavorite } = usePlanetData(planet.id);

    const handleCardClick = () => {
        router.push(`/planet/${planet.id}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
        }
    };

    return (
        <div
            className="group relative border border-gray-200/50 dark:border-gray-800/50 hover:border-gray-300 hover:dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-gray-200/20 dark:hover:shadow-gray-900/20 hover:-translate-y-1 bg-white dark:bg-gray-950/50 backdrop-blur-sm"
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Ver detalles del planeta ${planet.name}`}
        >
            {/* Image Container */}
            <div className="relative overflow-hidden">
                {planet.imageUrl ? (
                    <>
                        <img
                            src={planet.imageUrl}
                            alt={`Imagen del planeta ${planet.name}`}
                            className="w-full h-44 sm:h-48 md:h-52 lg:h-56 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                        {/* Gradient overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                ) : (
                    <div className="w-full h-44 sm:h-48 md:h-52 lg:h-56 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            Imagen no disponible
                        </p>
                    </div>
                )}

                {/* Favorite star indicator - positioned over image */}
                {isFavorite(planet.id) && (
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
                        <TbStarFilled className="text-yellow-500 w-4 h-4 drop-shadow-sm" />
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        {/* Planet Name */}
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                            {planet.name}
                        </h2>

                        {/* Planet Info */}
                        <div className="space-y-1">
                            {(planet.size || planet.distanceFromEarth) && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {[
                                        planet.size ? formatValue(planet.size, "size") : null,
                                        planet.distanceFromEarth ? formatValue(planet.distanceFromEarth, "distance") : null
                                    ].filter(Boolean).join(" • ")}
                                </p>
                            )}

                            {/* Additional info - only show if available */}
                            {planet.temperature && (
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                    Temperatura: {planet.temperature}K
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-all duration-200 group-hover:scale-110">
                        <PiArrowUpRightBold className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                    </div>
                </div>
            </div>

            {/* Subtle hover indicator */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </div>
    );
}