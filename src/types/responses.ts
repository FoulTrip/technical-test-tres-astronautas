// Types based on your API responses
export interface Planet {
    id: string;
    name: string;
    nameES: string;
    size: number;
    distanceFromSun: number;
    distanceFromEarth?: number;
    mass: number;
    gravity: number;
    temperature: number;
    dayLength: number;
    yearLength: number;
    moons: number;
    imageUrl: string | null;
    imageWidth: number | null;
    imageHeight: number | null;
    description: string;
    discoveryDate?: string;
    atmosphere: string[];
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

export interface PlanetListState {
    planets: Planet[];
    loading: boolean;
    error: string | null;
    pagination: PaginatedResponse<Planet>['pagination'] | null;
    filters: {
        name: string;
        order: 'asc' | 'desc';
        realtime: boolean;
    };
}

export interface PlanetDetailState {
    planetDetails: PlanetDetails | null;
    detailLoading: boolean;
    detailError: string | null;
    favorites: string[];
}

export interface PlanetStore extends PlanetListState, PlanetDetailState {
    // Planet List Actions
    fetchPlanets: (page?: number, filters?: Partial<PlanetListState['filters']>) => Promise<void>;
    updateFilters: (filters: Partial<PlanetListState['filters']>) => void;
    resetPlanetList: () => void;

    // Planet Detail Actions
    fetchPlanetDetails: (planetId: string) => Promise<void>;
    resetPlanetDetails: () => void;

    // Favorites Actions
    toggleFavorite: (planetId: string) => void;
    isFavorite: (planetId: string) => boolean;

    // Computed Properties
    getIsLoading: () => boolean;
}