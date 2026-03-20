import { APIRequestContext, APIResponse } from '@playwright/test';

/** Default timeout in milliseconds for every request. */
const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Resolves the backend base URL from environment variables.
 * @returns The base URL, e.g. "http://localhost:3000".
 */
function getBaseUrl() {
    const host = process.env.BACKEND_ADDRESS ?? 'localhost';
    const port = process.env.BACKEND_PORT ?? '3000';

    return `http://${host}:${port}`;
}

/**
 * Sends an HTTP request to the backend using the provided Playwright `APIRequestContext`. *
 * @param request Playwright request context.
 * @param method HTTP verb (case-insensitive).
 * @param relativePath Path relative to the backend root, e.g. "/auth".
 * @param options Optional Playwright fetch options (headers, data, params, ...).
 * @returns The raw Playwright response.
 * @throws If an unsupported HTTP method is provided.
 */
export async function sendRequest(request: APIRequestContext, method: string, relativePath: string, options: Record<string, unknown> = {}): Promise<APIResponse> {

    // Build the absolute URL by joining base URL and the relative path
    const url = `${getBaseUrl()}${relativePath}`;

    // Merge caller-supplied options with the default timeout
    const fetchOptions = {
        timeout: DEFAULT_TIMEOUT_MS,
        ...options,
    };

    // Dispatch to the correct Playwright method based on the HTTP verb
    switch (method.toUpperCase()) {
        case 'GET': return request.get(url, fetchOptions);
        case 'POST': return request.post(url, fetchOptions);
        case 'PUT': return request.put(url, fetchOptions);
        case 'PATCH': return request.patch(url, fetchOptions);
        case 'DELETE': return request.delete(url, fetchOptions);
        default: throw new Error(`Unsupported HTTP method: "${method}"`);
    }
}