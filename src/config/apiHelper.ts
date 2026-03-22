import API_URL from "./api";
import type { FetchOptions } from "../types";

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
