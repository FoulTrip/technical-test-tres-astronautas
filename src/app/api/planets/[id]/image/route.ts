import { wikiApi } from "@/lib/axios";
import { ApiError, PlanetImageResponse } from "@/types/planets";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { findPlanetInfo } from "@/lib/planetNames";

/**
 * API route handler to fetch the image of a planet based on its ID.
 * Accepts multiple name formats (English, Spanish, French) for flexibility.
 * Uses Wikipedia's API to retrieve the planet's image details.
 * @param req - The incoming request object.
 * @param params - The dynamic route parameters containing the planet ID.
 * @returns A JSON response with the planet's image details or an error message.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<PlanetImageResponse | ApiError>> {
    try {
        // Resolve the dynamic route parameters to extract the planet ID
        const resolvedParams = await params;
        const planetId = resolvedParams.id;

        // Validate that the planet ID is provided
        if (!planetId) {
            return NextResponse.json(
                { error: 'Missing planet ID' },
                { status: 400 }
            );
        }

        // Find the planet's information using the flexible lookup function
        const planetInfo = findPlanetInfo(planetId);

        // Validate that the planet name exists
        if (!planetInfo) {
            return NextResponse.json(
                { error: `Invalid planet name: ${planetId}. Supported names include: mercury, venus, earth, mars, jupiter, saturn, uranus, neptune (in English, Spanish, or French)` },
                { status: 400 }
            );
        }

        // Fetch the planet's image data from Wikipedia's API
        const { data } = await wikiApi.get('', {
            params: {
                titles: planetInfo.wikiSlug,
                prop: 'pageimages',
                piprop: 'original',
                pilicense: 'any'
            }
        });

        // Extract the pages object from the Wikipedia API response
        const pages = data.query.pages;
        const page = pages[Object.keys(pages)[0]];

        // Validate that the page and image details exist
        if (!page || !page.original) {
            return NextResponse.json(
                { error: 'No images found for this planet' },
                { status: 404 }
            );
        }

        // Return the planet's image details as a successful response
        return NextResponse.json({
            title: planetInfo.wikiSlug,
            imageUrl: page.original.source,
            width: page.original.width,
            height: page.original.height
        });
    } catch (error) {
        // Log and handle errors during the API request
        console.error("Error fetching planet image:", error);

        // Handle Axios-specific errors
        if (axios.isAxiosError(error)) {
            console.error("Response data:", error.response?.data);
            return NextResponse.json(
                { error: error.message },
                { status: error.response?.status || 500 }
            );
        }

        // Fallback for non-Axios errors
        return NextResponse.json(
            { error: 'Failed to fetch planet image' },
            { status: 500 }
        );
    }
}