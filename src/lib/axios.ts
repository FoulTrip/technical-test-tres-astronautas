import axios from "axios";

/**
 * Axios instance for interacting with the NASA API.
 * Provides a base URL for requests to the 'Le Système Solaire' API.
 */
export const nasaApi = axios.create({
    baseURL: 'https://api.le-systeme-solaire.net/rest', // Base URL for the NASA API
});

/**
 * Axios instance for interacting with the Wikipedia API.
 * Configured with default parameters for querying image data.
 */
export const wikiApi = axios.create({
    baseURL: 'https://es.wikipedia.org/w/api.php', // Base URL for the Wikipedia API
    params: {
        action: 'query', // Specifies the type of query
        format: 'json', // Response format (JSON)
        formatversion: '2', // Simplified JSON response structure
        origin: '*' // Allows cross-origin requests (CORS)
    }
});