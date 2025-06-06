import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Tipos modernizados para detalles completos del planeta
interface PlanetDetails {
    id: string;
    name: string;
    nameES: string;

    // Propiedades físicas
    size: number; // Diámetro en km
    mass: number; // Masa relativa a la Tierra
    density: number; // Densidad en g/cm³
    gravity: number; // Gravedad relativa a la Tierra
    escapeVelocity: number; // Velocidad de escape en km/s

    // Propiedades orbitales
    distanceFromSun: number; // Distancia del Sol en UA
    distanceFromEarth?: number; // Distancia actual de la Tierra en km
    orbitalPeriod: number; // Periodo orbital en días terrestres
    rotationPeriod: number; // Periodo de rotación en horas
    eccentricity: number; // Excentricidad orbital
    inclination: number; // Inclinación orbital en grados

    // Propiedades atmosféricas y de superficie
    temperature: {
        min: number;
        max: number;
        average: number;
    }; // Temperaturas en Kelvin
    atmosphere: {
        composition: string[];
        pressure: number; // Presión en bar (relativa a la Tierra)
        hasAtmosphere: boolean;
    };

    // Satélites
    moons: {
        count: number;
        majorMoons: string[];
        details?: Array<{
            name: string;
            diameter: number;
            distanceFromPlanet: number;
        }>;
    };

    // Información visual
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

    // Información adicional
    description: string;
    interestingFacts: string[];
    discoveryInfo: {
        discoveredBy?: string;
        discoveryDate?: string;
        discoveryMethod?: string;
    };

    // Datos de exploración
    missions: Array<{
        name: string;
        agency: string;
        launchDate: string;
        status: 'completed' | 'active' | 'planned';
        type: 'flyby' | 'orbiter' | 'lander' | 'rover';
    }>;

    // Metadata
    lastUpdated: string;
}

interface ApiError {
    error: string;
}

// Mapeo completo de datos planetarios en español
const planetDetailsMap: Record<string, {
    nameES: string;
    wikiSlug: string;
    description: string;
    interestingFacts: string[];
    missions: PlanetDetails['missions'];
}> = {
    'Mercury': {
        nameES: 'Mercurio',
        wikiSlug: 'Mercurio_(planeta)',
        description: 'Mercurio es el planeta más pequeño y el más cercano al Sol en el Sistema Solar. Su superficie está llena de cráteres similares a los de la Luna.',
        interestingFacts: [
            'Un año en Mercurio dura solo 88 días terrestres',
            'Las temperaturas pueden variar desde -173°C hasta 427°C',
            'No tiene atmósfera ni satélites naturales',
            'Es el segundo planeta más denso después de la Tierra'
        ],
        missions: [
            {
                name: 'MESSENGER',
                agency: 'NASA',
                launchDate: '2004-08-03',
                status: 'completed',
                type: 'orbiter'
            },
            {
                name: 'BepiColombo',
                agency: 'ESA/JAXA',
                launchDate: '2018-10-20',
                status: 'active',
                type: 'orbiter'
            }
        ]
    },
    'Venus': {
        nameES: 'Venus',
        wikiSlug: 'Venus_(planeta)',
        description: 'Venus es el segundo planeta desde el Sol y el más caliente del Sistema Solar debido a su densa atmósfera de dióxido de carbono.',
        interestingFacts: [
            'Es el planeta más caliente del Sistema Solar',
            'Rota en dirección contraria a la mayoría de planetas',
            'Un día en Venus dura más que un año venusiano',
            'Su presión atmosférica es 90 veces mayor que la de la Tierra'
        ],
        missions: [
            {
                name: 'Venera Program',
                agency: 'Roscosmos',
                launchDate: '1961-1984',
                status: 'completed',
                type: 'lander'
            },
            {
                name: 'Parker Solar Probe',
                agency: 'NASA',
                launchDate: '2018-08-12',
                status: 'active',
                type: 'flyby'
            }
        ]
    },
    'Earth': {
        nameES: 'Tierra',
        wikiSlug: 'Tierra',
        description: 'La Tierra es el tercer planeta desde el Sol y el único conocido que alberga vida. Tiene una atmósfera rica en oxígeno y agua líquida en su superficie.',
        interestingFacts: [
            'Es el único planeta conocido con vida',
            '71% de su superficie está cubierta por agua',
            'Tiene un núcleo de hierro líquido que genera un campo magnético',
            'Su atmósfera protege de la radiación solar dañina'
        ],
        missions: [
            {
                name: 'ISS',
                agency: 'NASA/Roscosmos/ESA',
                launchDate: '1998-11-20',
                status: 'active',
                type: 'orbiter'
            }
        ]
    },
    'Mars': {
        nameES: 'Marte',
        wikiSlug: 'Marte_(planeta)',
        description: 'Marte, conocido como el planeta rojo, es el cuarto planeta desde el Sol. Es el objetivo principal para futuras misiones tripuladas.',
        interestingFacts: [
            'Tiene el volcán más grande del Sistema Solar: Olympus Mons',
            'Sus días duran aproximadamente 24 horas y 37 minutos',
            'Tiene estaciones similares a la Tierra debido a su inclinación axial',
            'Evidencia sugiere que tuvo agua líquida en el pasado'
        ],
        missions: [
            {
                name: 'Perseverance',
                agency: 'NASA',
                launchDate: '2020-07-30',
                status: 'active',
                type: 'rover'
            },
            {
                name: 'Ingenuity',
                agency: 'NASA',
                launchDate: '2020-07-30',
                status: 'active',
                type: 'rover'
            }
        ]
    },
    'Jupiter': {
        nameES: 'Júpiter',
        wikiSlug: 'Júpiter_(planeta)',
        description: 'Júpiter es el planeta más grande del Sistema Solar, un gigante gaseoso con más de 80 lunas conocidas.',
        interestingFacts: [
            'Es más masivo que todos los otros planetas combinados',
            'Su Gran Mancha Roja es una tormenta que dura siglos',
            'Tiene un sistema de anillos débiles',
            'Actúa como un "aspirador cósmico" protegiendo planetas interiores'
        ],
        missions: [
            {
                name: 'Juno',
                agency: 'NASA',
                launchDate: '2011-08-05',
                status: 'active',
                type: 'orbiter'
            },
            {
                name: 'Europa Clipper',
                agency: 'NASA',
                launchDate: '2024-10-14',
                status: 'active',
                type: 'orbiter'
            }
        ]
    },
    'Saturn': {
        nameES: 'Saturno',
        wikiSlug: 'Saturno_(planeta)',
        description: 'Saturno es famoso por su espectacular sistema de anillos y es el segundo planeta más grande del Sistema Solar.',
        interestingFacts: [
            'Tiene el sistema de anillos más prominente',
            'Es menos denso que el agua',
            'Su luna Titán tiene una atmósfera densa y lagos de metano',
            'Tiene más de 140 lunas confirmadas'
        ],
        missions: [
            {
                name: 'Cassini-Huygens',
                agency: 'NASA/ESA',
                launchDate: '1997-10-15',
                status: 'completed',
                type: 'orbiter'
            }
        ]
    },
    'Uranus': {
        nameES: 'Urano',
        wikiSlug: 'Urano_(planeta)',
        description: 'Urano es un gigante de hielo que rota de lado, con un eje de rotación inclinado casi 90 grados.',
        interestingFacts: [
            'Rota de lado con una inclinación de 98 grados',
            'Tiene anillos verticales en lugar de horizontales',
            'Es el planeta más frío del Sistema Solar',
            'Fue el primer planeta descubierto con telescopio'
        ],
        missions: [
            {
                name: 'Voyager 2',
                agency: 'NASA',
                launchDate: '1977-08-20',
                status: 'completed',
                type: 'flyby'
            },
            {
                name: 'Uranus Orbiter',
                agency: 'NASA',
                launchDate: '2030-2035',
                status: 'planned',
                type: 'orbiter'
            }
        ]
    },
    'Neptune': {
        nameES: 'Neptuno',
        wikiSlug: 'Neptuno_(planeta)',
        description: 'Neptuno es el planeta más lejano del Sol y tiene los vientos más rápidos del Sistema Solar.',
        interestingFacts: [
            'Tiene los vientos más rápidos: hasta 2,100 km/h',
            'Un año neptuniano dura 165 años terrestres',
            'Su color azul se debe al metano en su atmósfera',
            'Fue el primer planeta descubierto mediante predicciones matemáticas'
        ],
        missions: [
            {
                name: 'Voyager 2',
                agency: 'NASA',
                launchDate: '1977-08-20',
                status: 'completed',
                type: 'flyby'
            }
        ]
    }
};

// Cliente HTTP optimizado
const solarSystemApi = axios.create({
    baseURL: 'https://api.le-systeme-solaire.net/rest',
    timeout: 15000,
    headers: {
        'Accept': 'application/json',
        'User-Agent': 'PlanetsApp/2025'
    }
});

const wikiApi = axios.create({
    baseURL: 'https://es.wikipedia.org/api/rest_v1',
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'User-Agent': 'PlanetsApp/2025'
    }
});

/**
 * Obtiene distancia actual del planeta a la Tierra
 */
async function getCurrentDistanceToEarth(planetName: string): Promise<number | null> {
    try {
        const planetCodes: Record<string, string> = {
            'Mercury': '199', 'Venus': '299', 'Earth': '399', 'Mars': '499',
            'Jupiter': '599', 'Saturn': '699', 'Uranus': '799', 'Neptune': '899'
        };

        if (planetName === 'Earth') return 0;

        const response = await axios.get('https://ssd-api.jpl.nasa.gov/horizons.api', {
            params: {
                format: 'json',
                COMMAND: planetCodes[planetName],
                OBJ_DATA: 'YES',
                MAKE_EPHEM: 'YES',
                EPHEM_TYPE: 'OBSERVER',
                CENTER: '399@399', // Geocentric
                START_TIME: new Date().toISOString().split('T')[0],
                STOP_TIME: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                STEP_SIZE: '1d',
                QUANTITIES: '20,23', // Distance and light-time
            },
            timeout: 8000
        });

        if (response.data?.result) {
            const ephemerisData = response.data.result;
            const match = ephemerisData.match(/(\d+\.?\d*)\s+(\d+\.?\d*)/);
            if (match) {
                return parseFloat(match[1]) * 149597870.7; // AU to km
            }
        }
        return null;
    } catch (error) {
        console.warn(`Error getting current distance for ${planetName}:`, error);
        return null;
    }
}

/**
 * Obtiene galería de imágenes del planeta
 */
async function fetchPlanetImages(planetName: string): Promise<PlanetDetails['images']> {
    try {
        const planetInfo = planetDetailsMap[planetName];
        if (!planetInfo) {
            return {
                main: { url: null, width: null, height: null, caption: `Imagen de ${planetName}` }
            };
        }

        // Obtener imagen principal desde Wikipedia
        const response = await wikiApi.get(`/page/summary/${encodeURIComponent(planetInfo.wikiSlug)}`);

        const mainImage = {
            url: response.data?.originalimage?.source || response.data?.thumbnail?.source || null,
            width: response.data?.originalimage?.width || response.data?.thumbnail?.width || null,
            height: response.data?.originalimage?.height || response.data?.thumbnail?.height || null,
            caption: `Imagen de ${planetInfo.nameES}`
        };

        // Intentar obtener más imágenes desde Wikimedia Commons
        const gallery: PlanetDetails['images']['gallery'] = [];

        try {
            const commonsResponse = await axios.get('https://commons.wikimedia.org/w/api.php', {
                params: {
                    action: 'query',
                    format: 'json',
                    generator: 'categorymembers',
                    gcmtitle: `Category:${planetName}`,
                    gcmtype: 'file',
                    gcmlimit: 5,
                    prop: 'imageinfo',
                    iiprop: 'url|size',
                    iiurlwidth: 600
                },
                timeout: 5000
            });

            const pages = commonsResponse.data?.query?.pages;
            if (pages) {
                Object.values(pages).forEach((page: any) => {
                    const imageInfo = page.imageinfo?.[0];
                    if (imageInfo && imageInfo.url) {
                        gallery.push({
                            url: imageInfo.url,
                            caption: page.title.replace('File:', '').replace(/\.[^/.]+$/, ''),
                            width: imageInfo.width,
                            height: imageInfo.height
                        });
                    }
                });
            }
        } catch (galleryError) {
            console.warn(`Could not fetch gallery for ${planetName}:`, galleryError);
        }

        return {
            main: mainImage,
            gallery: gallery.length > 0 ? gallery : undefined
        };
    } catch (error) {
        console.warn(`Error fetching images for ${planetName}:`, error);
        return {
            main: { url: null, width: null, height: null, caption: `Imagen de ${planetName}` }
        };
    }
}

/**
 * API Handler modernizado para obtener detalles completos de un planeta
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<PlanetDetails | ApiError>> {
    try {
        const resolvedParams = await params;
        const planetId = resolvedParams.id;

        // Obtener datos del planeta desde la API moderna
        const { data } = await solarSystemApi.get(`/bodies/${planetId}`);

        if (!data || !data.isPlanet) {
            return NextResponse.json(
                { error: 'Planeta no encontrado' },
                { status: 404 }
            );
        }

        const englishName = data.englishName;
        const planetInfo = planetDetailsMap[englishName];

        if (!planetInfo) {
            return NextResponse.json(
                { error: 'Información del planeta no disponible' },
                { status: 404 }
            );
        }

        // Obtener datos en tiempo real
        const [currentDistance, images] = await Promise.all([
            getCurrentDistanceToEarth(englishName),
            fetchPlanetImages(englishName)
        ]);

        // Procesar datos de lunas
        const moonsData = {
            count: data.moons?.length || 0,
            majorMoons: data.moons?.slice(0, 5).map((moon: any) => moon.moon) || [],
            details: data.moons?.slice(0, 3).map((moon: any) => ({
                name: moon.moon,
                diameter: moon.meanRadius ? moon.meanRadius * 2 : 0,
                distanceFromPlanet: moon.semimajorAxis || 0
            })) || undefined
        };

        // Construir respuesta completa
        const planetDetails: PlanetDetails = {
            id: data.id,
            name: englishName,
            nameES: planetInfo.nameES,

            // Propiedades físicas
            size: Math.round((data.meanRadius || 0) * 2),
            mass: data.mass?.massValue ? parseFloat((data.mass.massValue / 5.972e24).toFixed(3)) : 1,
            density: data.density || 0,
            gravity: data.gravity ? parseFloat((data.gravity / 9.81).toFixed(2)) : 1,
            escapeVelocity: data.escape ? parseFloat((data.escape / 1000).toFixed(2)) : 0,

            // Propiedades orbitales
            distanceFromSun: parseFloat(((data.semimajorAxis || 0) / 149597870.7).toFixed(3)),
            distanceFromEarth: currentDistance ?? undefined,
            orbitalPeriod: Math.round((data.sideralOrbit || 0) / 86400),
            rotationPeriod: parseFloat(((data.sideralRotation || 0) / 3600).toFixed(2)),
            eccentricity: data.eccentricity || 0,
            inclination: data.inclination || 0,

            // Temperatura
            temperature: {
                min: Math.round((data.avgTemp || 0) - 50),
                max: Math.round((data.avgTemp || 0) + 50),
                average: Math.round(data.avgTemp || 0)
            },

            // Atmósfera
            atmosphere: {
                composition: Array.isArray(data.atmosphere) ? data.atmosphere : [],
                pressure: data.atmosphericPressure || 0,
                hasAtmosphere: Array.isArray(data.atmosphere) && data.atmosphere.length > 0
            },

            // Lunas
            moons: moonsData,

            // Imágenes
            images,

            // Información adicional
            description: planetInfo.description,
            interestingFacts: planetInfo.interestingFacts,
            discoveryInfo: {
                discoveredBy: data.discoveredBy,
                discoveryDate: data.discoveryDate,
                discoveryMethod: 'Observación astronómica'
            },

            // Misiones
            missions: planetInfo.missions,

            // Metadata
            lastUpdated: new Date().toISOString()
        };

        return NextResponse.json(planetDetails);

    } catch (error) {
        console.error("Error obteniendo detalles del planeta:", error);

        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            let message = 'Error de conexión con la API';

            if (status === 404) {
                message = 'Planeta no encontrado';
            } else if (status >= 500) {
                message = 'Error del servidor externo';
            }

            return NextResponse.json(
                { error: message },
                { status }
            );
        }

        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}