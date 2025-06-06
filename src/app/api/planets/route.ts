import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Tipos modernizados para 2025
interface Planet {
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

interface ApiError {
    error: string;
}

interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
        totalItems: number;
        itemsPerPage: number;
    };
}

// Mapeo de nombres en inglés a español con información adicional
const planetData: Record<string, {
    nameES: string;
    wikiSlug: string;
    description: string;
}> = {
    'Mercury': {
        nameES: 'Mercurio',
        wikiSlug: 'Mercurio_(planeta)',
        description: 'El planeta más cercano al Sol y el más pequeño del sistema solar.'
    },
    'Venus': {
        nameES: 'Venus',
        wikiSlug: 'Venus_(planeta)',
        description: 'El segundo planeta desde el Sol, conocido por su atmósfera tóxica.'
    },
    'Earth': {
        nameES: 'Tierra',
        wikiSlug: 'Tierra',
        description: 'Nuestro hogar, el único planeta conocido con vida.'
    },
    'Mars': {
        nameES: 'Marte',
        wikiSlug: 'Marte_(planeta)',
        description: 'El planeta rojo, objetivo de futuras misiones tripuladas.'
    },
    'Jupiter': {
        nameES: 'Júpiter',
        wikiSlug: 'Júpiter_(planeta)',
        description: 'El gigante gaseoso más grande del sistema solar.'
    },
    'Saturn': {
        nameES: 'Saturno',
        wikiSlug: 'Saturno_(planeta)',
        description: 'Famoso por sus espectaculares anillos.'
    },
    'Uranus': {
        nameES: 'Urano',
        wikiSlug: 'Urano_(planeta)',
        description: 'Un gigante de hielo que rota de lado.'
    },
    'Neptune': {
        nameES: 'Neptuno',
        wikiSlug: 'Neptuno_(planeta)',
        description: 'El planeta más lejano y ventoso del sistema solar.'
    }
};

// Cliente HTTP optimizado para 2025
const solarSystemApi = axios.create({
    baseURL: 'https://api.le-systeme-solaire.net/rest',
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'User-Agent': 'PlanetsApp/2025'
    }
});

const wikiApi = axios.create({
    baseURL: 'https://es.wikipedia.org/api/rest_v1',
    timeout: 8000,
    headers: {
        'Accept': 'application/json',
        'User-Agent': 'PlanetsApp/2025'
    }
});

/**
 * Obtiene la distancia actual de un planeta a la Tierra usando ephemeris
 */
async function getCurrentDistanceToEarth(planetName: string): Promise<number | null> {
    try {
        // Usamos la API de JPL Horizons para obtener datos ephemeris actuales
        const response = await axios.get('https://ssd-api.jpl.nasa.gov/horizons.api', {
            params: {
                format: 'json',
                COMMAND: planetName === 'Earth' ? '399' : getPlanetCode(planetName),
                OBJ_DATA: 'YES',
                MAKE_EPHEM: 'YES',
                EPHEM_TYPE: 'OBSERVER',
                CENTER: '399', // Geocentric
                START_TIME: new Date().toISOString().split('T')[0],
                STOP_TIME: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                STEP_SIZE: '1d',
                QUANTITIES: '20' // Distance
            },
            timeout: 5000
        });

        // Parsear la respuesta para extraer la distancia
        if (response.data && response.data.result) {
            const lines = response.data.result.split('\n');
            for (const line of lines) {
                if (line.includes('$$SOE')) break;
                if (line.includes('$$EOE')) break;
                // Buscar línea con datos de distancia
                const match = line.match(/(\d+\.?\d*)/);
                if (match) {
                    return parseFloat(match[1]) * 149597870.7; // Convertir UA a km
                }
            }
        }
        return null;
    } catch (error) {
        console.warn(`No se pudo obtener distancia actual para ${planetName}:`, error);
        return null;
    }
}

/**
 * Obtiene el código JPL para un planeta
 */
function getPlanetCode(planetName: string): string {
    const codes: Record<string, string> = {
        'Mercury': '199',
        'Venus': '299',
        'Earth': '399',
        'Mars': '499',
        'Jupiter': '599',
        'Saturn': '699',
        'Uranus': '799',
        'Neptune': '899'
    };
    return codes[planetName] || '399';
}

/**
 * Obtiene imagen de alta calidad desde Wikimedia Commons
 */
async function fetchPlanetImage(planetName: string): Promise<{
    url: string | null;
    width: number | null;
    height: number | null;
}> {
    try {
        const planetInfo = planetData[planetName];
        if (!planetInfo) return { url: null, width: null, height: null };

        // Usar la API moderna de Wikimedia
        const response = await wikiApi.get(`/page/summary/${encodeURIComponent(planetInfo.wikiSlug)}`);

        if (response.data?.thumbnail?.source) {
            // Obtener la imagen en resolución original
            const originalUrl = response.data.originalimage?.source || response.data.thumbnail.source;
            return {
                url: originalUrl,
                width: response.data.originalimage?.width || response.data.thumbnail.width || null,
                height: response.data.originalimage?.height || response.data.thumbnail.height || null
            };
        }

        // Fallback: buscar en Wikimedia Commons
        const commonsResponse = await axios.get('https://commons.wikimedia.org/w/api.php', {
            params: {
                action: 'query',
                format: 'json',
                titles: `File:${planetName}.jpg`,
                prop: 'imageinfo',
                iiprop: 'url|size',
                iiurlwidth: 800
            },
            timeout: 5000
        });

        const pages = commonsResponse.data?.query?.pages;
        if (pages) {
            const pageId = Object.keys(pages)[0];
            const imageInfo = pages[pageId]?.imageinfo?.[0];
            if (imageInfo) {
                return {
                    url: imageInfo.url,
                    width: imageInfo.width,
                    height: imageInfo.height
                };
            }
        }

        return { url: null, width: null, height: null };
    } catch (error) {
        console.warn(`Error obteniendo imagen para ${planetName}:`, error);
        return { url: null, width: null, height: null };
    }
}

/**
 * API Handler modernizado para 2025 - Datos planetarios precisos y actualizados
 */
export async function GET(
    request: NextRequest
): Promise<NextResponse<PaginatedResponse<Planet> | ApiError>> {
    try {
        // Parsear parámetros de consulta
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const nameFilter = searchParams.get('name') || '';
        const order = searchParams.get('order') || 'asc';
        const includeDistance = searchParams.get('realtime') === 'true';
        const limit = 5;
        const start = (page - 1) * limit;

        // Obtener datos actualizados del sistema solar
        const { data } = await solarSystemApi.get('/bodies', {
            params: {
                filter: 'isPlanet,eq,true'
            }
        });

        if (!data?.bodies) {
            throw new Error('No se pudieron obtener datos planetarios');
        }

        // Procesar y enriquecer datos planetarios
        let planets: Planet[] = await Promise.all(
            data.bodies.map(async (body: any) => {
                const englishName = body.englishName;
                const planetInfo = planetData[englishName];

                // Obtener distancia actual si se solicita
                const currentDistance = includeDistance
                    ? await getCurrentDistanceToEarth(englishName)
                    : null;

                return {
                    id: body.id,
                    name: englishName,
                    nameES: planetInfo?.nameES || englishName,
                    size: Math.round((body.meanRadius || 0) * 2), // Diámetro en km
                    distanceFromSun: Math.round((body.semimajorAxis || 0) / 149597870.7), // UA
                    distanceFromEarth: currentDistance,
                    mass: body.mass?.massValue ? parseFloat((body.mass.massValue / 5.972e24).toFixed(3)) : 1, // Relativo a la Tierra
                    gravity: body.gravity ? parseFloat((body.gravity / 9.81).toFixed(2)) : 1, // Relativo a la Tierra
                    temperature: Math.round(body.avgTemp || 0), // Kelvin
                    dayLength: parseFloat(((body.sideralRotation || 24) / 3600).toFixed(2)), // Horas
                    yearLength: Math.round((body.sideralOrbit || 365.25) / 86400), // Días
                    moons: body.moons?.length || 0,
                    imageUrl: null,
                    imageWidth: null,
                    imageHeight: null,
                    description: planetInfo?.description || `Información sobre ${englishName}`,
                    discoveryDate: body.discoveryDate || undefined,
                    atmosphere: body.atmosphere || []
                };
            })
        );

        // Filtrar por nombre si se especifica
        if (nameFilter) {
            planets = planets.filter((planet) =>
                planet.nameES.toLowerCase().includes(nameFilter.toLowerCase()) ||
                planet.name.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }

        // Ordenar planetas
        planets.sort((a, b) => {
            const comparison = a.nameES.localeCompare(b.nameES, 'es');
            return order === 'asc' ? comparison : -comparison;
        });

        // Paginar resultados
        const paginatedPlanets = planets.slice(start, start + limit);

        // Obtener imágenes para la página actual
        const planetsWithImages = await Promise.all(
            paginatedPlanets.map(async (planet) => {
                const image = await fetchPlanetImage(planet.name);
                return {
                    ...planet,
                    imageUrl: image.url,
                    imageWidth: image.width,
                    imageHeight: image.height
                };
            })
        );

        const totalPages = Math.ceil(planets.length / limit);

        return NextResponse.json({
            data: planetsWithImages,
            pagination: {
                currentPage: page,
                totalPages,
                hasMore: page < totalPages,
                totalItems: planets.length,
                itemsPerPage: limit
            }
        });

    } catch (error) {
        console.error("Error en API de planetas:", error);

        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.message || error.message;

            return NextResponse.json(
                { error: `Error de API: ${message}` },
                { status }
            );
        }

        return NextResponse.json(
            { error: 'Error interno del servidor - No se pudieron obtener datos planetarios' },
            { status: 500 }
        );
    }
}