/**
 * Interface representing a paginated API response.
 * Used for endpoints that return data in a paginated format.
 * @template T - The type of data being paginated (e.g., Planet[], User[], etc.).
 */
export interface PaginatedResponse<T> {
    data: T[]; // Array of items returned by the API
    pagination: {
        currentPage: number; // Current page number
        totalPages: number; // Total number of pages available
        hasMore: boolean; // Indicates if there are more pages to load
        totalItems: number; // Total number of items across all pages
        itemsPerPage: number; // Number of items displayed per page
    }; // Pagination metadata
}

/**
 * Interface representing an API error response.
 * Used for endpoints that return error messages.
 */
export interface ApiError {
    error: string;
}


// Updated interfaces to match your backend API
export interface Planet {
    id: string;
    name: string;
    nameES: string;
    size: number; // Diámetro en km
    distanceFromSun: number; // Distancia del Sol en UA
    distanceFromEarth?: number; // Distancia actual de la Tierra en km
    mass: number; // Masa relativa a la Tierra
    gravity: number; // Gravedad relativa a la Tierra
    temperature: number; // Temperatura promedio en Kelvin
    dayLength: number; // Duración del día en horas terrestres
    yearLength: number; // Duración del año en días terrestres
    moons: number; // Número de lunas
    imageUrl: string | null;
    imageWidth: number | null;
    imageHeight: number | null;
    description: string;
    discoveryDate?: string;
    atmosphere: string[];
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
        totalItems: number;
        itemsPerPage: number;
    };
}

export interface PlanetsState {
    planets: Planet[]
    searchTerm: string
    pagination: {
        currentPage: number
        totalPages: number
        hasMore: boolean
        totalItems: number
        itemsPerPage: number
    }
    isLoading: boolean
    error: string | null
    order: OrderList
    realtime: boolean

    // Setters
    setPlanets: (planets: Planet[]) => void
    setSearchTerm: (term: string) => void
    setPagination: (pagination: PlanetsState['pagination']) => void
    setIsLoading: (isLoading: boolean) => void
    setError: (error: string | null) => void
    setOrder: (order: OrderList) => void
    setRealtime: (realtime: boolean) => void

    // Actions
    fetchPlanets: (page: number, nameFilter: string, currentOrder: OrderList, realtime?: boolean) => Promise<void>
    handleNextPage: () => void
    handlePreviousPage: () => void
    switchOrderDesc: () => void
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
    toggleRealtime: () => void
    reset: () => void
}

export interface PlanetDetails {
    id: string;
    name: string;
    nameES: string;
    size: number;
    mass: number;
    density: number;
    gravity: number;
    escapeVelocity: number;
    distanceFromSun: number;
    distanceFromEarth?: number;
    orbitalPeriod: number;
    rotationPeriod: number;
    eccentricity: number;
    inclination: number;
    temperature: {
        min: number;
        max: number;
        average: number;
    };
    atmosphere: {
        composition: string[];
        pressure: number;
        hasAtmosphere: boolean;
    };
    moons: {
        count: number;
        majorMoons: string[];
        details?: Array<{
            name: string;
            diameter: number;
            distanceFromPlanet: number;
        }>;
    };
    images: {
        main: {
            url: string | null;
            width: number | null;
            height: number | null;
            caption: string;
        };
        gallery?: Array<{
            url: string;
            caption: string;
            width: number;
            height: number;
        }>;
    };
    description: string;
    interestingFacts: string[];
    discoveryInfo: {
        discoveredBy?: string;
        discoveryDate?: string;
        discoveryMethod?: string;
    };
    missions: Array<{
        name: string;
        agency: string;
        launchDate: string;
        status: 'completed' | 'active' | 'planned';
        type: 'flyby' | 'orbiter' | 'lander' | 'rover';
    }>;
    lastUpdated: string;
}

export interface PlanetDetailState {
    // Planet data state
    planet: PlanetDetails | null
    error: string | null
    loading: boolean
    favorites: string[]

    // Image-related state
    imagePlanet: string | null
    imageLoading: boolean
    imageError: string | null

    // Computed
    isLoading: boolean

    // Actions
    fetchPlanetData: (planetId: string) => Promise<void>
    fetchPlanetImage: (planetId: string) => Promise<void>
    toggleFavorites: (planetId: string) => void
    isFavorite: (planetId: string) => boolean
    reset: () => void
}

// Translation map for planet names
export const planetTranslations: Record<string, string> = {
    'mercure': 'Mercurio',
    'venus': 'Venus',
    'terre': 'Tierra',
    'mars': 'Marte',
    'jupiter': 'Jupiter',
    'saturne': 'Saturno',
    'uranus': 'Urano',
    'neptune': 'Neptuno',
    'pluto': 'Pluton',
};

// Update the initial state as well
export const initialDetailState = {
    planet: null,
    error: null,
    loading: false,
    isLoading: false,
    imagePlanet: null,
    imageLoading: false,
    imageError: null
}

export interface ApiError {
    error: string;
}

/**
 * Interface representing the API response structure.
 * Contains the fetched data and pagination details.
 */
export interface ApiResponse {
    data: Planet[];
    pagination: {
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
        totalItems: number;
        itemsPerPage: number;
    };
}

/**
 * Props for the SearchBar component.
 * Includes search term, search handler, sorting order, and toggle function.
 */
export interface SearchBarProps {
    searchTerm: string;
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    order: "asc" | "desc";
    onToggleOrder: () => void;
}

export interface PlanetImageResponse {
    title: string;
    imageUrl: string;
    width: number;
    height: number;
}

/**
 * Props for the PlanetCard component.
 * Represents a single planet's data to be displayed.
 */
export interface PlanetCardProps {
    planet: Planet; // Data of the planet to display in the card
}

/**
 * Props for the Pagination component.
 * Handles navigation between pages.
 */
export interface PaginationProps {
    currentPage: number; // Current page number
    totalPages: number; // Total number of pages
    onNext: () => void; // Function to navigate to the next page
    onPrevious: () => void; // Function to navigate to the previous page
}

/**
 * Type representing the possible sorting orders.
 */
export type OrderList = "asc" | "desc"; // Sorting order: ascending or descending