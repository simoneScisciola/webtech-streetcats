import { Request, Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import DOMPurify from "isomorphic-dompurify"; // DOMPurify library for sanitizing HTML (https://www.npmjs.com/package/isomorphic-dompurify)


/**
 * Sanitizes `req.body` throughout the entire object structure, stripping any HTML/script tags to prevent XSS attacks.
 */
export function sanitizeInput(req: Request, res: Response, next: NextFunction): void {
    if (req.body && typeof req.body === "object") {
        // Overwrite req.body with the sanitized version
        req.body = sanitizeValue(req.body);
    }
    next();
}

/**
 * Sanitizes a plain object, array or string primitive, stripping any HTML/script tags to prevent XSS attacks.
 * @param value The value to sanitize
 * @returns The sanitized value with the same structure
 */
function sanitizeValue(value: unknown): unknown {

    if (typeof value === "string") {
        // Strip HTML tags and dangerous attributes from the string
        return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    }

    if (Array.isArray(value)) {
        // Recurse into each array element
        return value.map(sanitizeValue);
    }

    if (value !== null && typeof value === "object") {
        // Recurse into each property of the object
        const sanitized: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
            sanitized[key] = sanitizeValue(val);
        }
        return sanitized;
    }

    return value;
}