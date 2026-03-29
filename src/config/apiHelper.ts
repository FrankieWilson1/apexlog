/**
 * @file apiHelper.ts
 * @description Centralised fetch wrapper for all ApexLog API calls.
 * 
 * Handles token attachment, JSON parsing, and error normalisation
 * in one place so no component needs to repeat fetch boilerplate.
 * 
 * @module config/apiHelper
 */

import API_URL from "./api";
import type { FetchOptions } from "../types";

/**
 * apiFetch
 * 
 * Wrapper around the native fetch API that:
 * - Prepends the base API URL automatically
 * - Attaches the JWT token to every request
 * - Always sets Content-Type to application/json
 * - Throws a nomalised error if the response is not ok
 * 
 * @param endpoint {string} endpoint - The API path e.g. "/workouts" or "/workouts/123"
 * @param token {string | null} token - JWT token from AuthContext
 * @param options {FetchOptions} options - Optional method and body
 * @returns {Promise<any>} Parsed JSON response
 */

const apiFetch = async (
    endpoint: string,
    token: string | null,
    options: FetchOptions = {}
): Promise<any> => {
    const { method = "GET", body } = options;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    // Attach token if available
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body,
    });

    const data = await response.json();

    // A readable error
    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

export default apiFetch;
