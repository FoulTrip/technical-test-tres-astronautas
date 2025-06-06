/**
 * Mapping of planet names from English to Spanish and their corresponding Wikipedia slugs.
 * Used for translating planet names and fetching images from Wikipedia.
 */
export const planetNamesMap = {
    'Mercury': {
        nameES: 'Mercurio', // Spanish name for Mercury
        wikiSlug: 'Mercurio_(planeta)' // Wikipedia slug for Mercury's page
    },
    'Venus': {
        nameES: 'Venus', // Spanish name for Venus
        wikiSlug: 'Venus_(planeta)' // Wikipedia slug for Venus's page
    },
    'Earth': {
        nameES: 'Tierra', // Spanish name for Earth
        wikiSlug: 'Tierra' // Wikipedia slug for Earth's page
    },
    'Mars': {
        nameES: 'Marte', // Spanish name for Mars
        wikiSlug: 'Marte_(planeta)' // Wikipedia slug for Mars's page
    },
    'Jupiter': {
        nameES: 'Júpiter', // Spanish name for Jupiter
        wikiSlug: 'Júpiter_(planeta)' // Wikipedia slug for Jupiter's page
    },
    'Saturn': {
        nameES: 'Saturno', // Spanish name for Saturn
        wikiSlug: 'Saturno_(planeta)' // Wikipedia slug for Saturn's page
    },
    'Uranus': {
        nameES: 'Urano', // Spanish name for Uranus
        wikiSlug: 'Urano_(planeta)' // Wikipedia slug for Uranus's page
    },
    'Neptune': {
        nameES: 'Neptuno', // Spanish name for Neptune
        wikiSlug: 'Neptuno_(planeta)' // Wikipedia slug for Neptune's page
    }
} as const;

/**
 * Reverse mapping of planet names from Spanish to English.
 */
export const reversePlanetNameMapping: Record<string, keyof typeof planetNamesMap> = {
    Mercurio: "Mercury",
    Venus: "Venus",
    Tierra: "Earth",
    Marte: "Mars",
    Júpiter: "Jupiter",
    Saturno: "Saturn",
    Urano: "Uranus",
    Neptuno: "Neptune"
};

/**
 * Alternative names mapping to handle different name formats
 * This allows the API to accept multiple name variations
 */
export const alternativeNamesMap: Record<string, keyof typeof planetNamesMap> = {
    // English names (lowercase)
    'mercury': 'Mercury',
    'venus': 'Venus',
    'earth': 'Earth',
    'mars': 'Mars',
    'jupiter': 'Jupiter',
    'saturn': 'Saturn',
    'uranus': 'Uranus',
    'neptune': 'Neptune',
    
    // Spanish names (lowercase)
    'mercurio': 'Mercury',
    'tierra': 'Earth',
    'marte': 'Mars',
    'júpiter': 'Jupiter',
    'saturno': 'Saturn',
    'urano': 'Uranus',
    'neptuno': 'Neptune',
    
    // French names (from your error logs)
    'mercure': 'Mercury',
    'terre': 'Earth',
    'saturne': 'Saturn',
    
    // Alternative spellings
    'jupitor': 'Jupiter',
    'neptunus': 'Neptune'
};

/**
 * Function to find planet info by any supported name format
 */
export function findPlanetInfo(planetId: string) {
    // First try direct lookup in planetNamesMap values
    let planetInfo = Object.values(planetNamesMap).find(
        planet => planet.nameES.toLowerCase() === planetId.toLowerCase()
    );
    
    if (planetInfo) {
        return planetInfo;
    }
    
    // Try alternative names mapping
    const normalizedName = alternativeNamesMap[planetId.toLowerCase()];
    if (normalizedName) {
        return planetNamesMap[normalizedName];
    }
    
    // Try direct English name lookup
    if (planetNamesMap[planetId as keyof typeof planetNamesMap]) {
        return planetNamesMap[planetId as keyof typeof planetNamesMap];
    }
    
    return null;
}