/**
 * Interface representing the response structure for a Wikipedia API image query.
 * Used to extract image details such as the source URL, dimensions, and metadata.
 */
export interface WikiImageResponse {
    query: {
        /**
         * Object containing pages returned by the Wikipedia API.
         * Each page is keyed by a unique identifier (e.g., page ID).
         */
        pages: {
            [key: string]: {
                pageid: number; // Unique identifier for the Wikipedia page
                title: string; // Title of the Wikipedia page
                original?: {
                    source: string; // URL of the original image
                    width: number; // Width of the original image in pixels
                    height: number; // Height of the original image in pixels
                }; // Optional property containing image details if available
            };
        }; // Pages object with dynamic keys
    }; // Query object containing the response data
}