import { Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import createError from "http-errors"; // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { AuthRequest } from "#types/authRequest.js";
import { AuthController } from "#controllers/AuthController.js";
import { logger } from "#logging/logger.js";


/**
 * Middleware to strictly authenticate requests using JWT
 * It checks the Authorization header for a valid JWT and extracts user info from it
 */
export function requireAuthJWT(req: AuthRequest, res: Response, next: NextFunction) {

    logger.verbose("Middleware: requireAuthJWT");

    const authHeader = req.headers.authorization;

    logger.debug(`AuthHeader: "${authHeader}"`)

    const token = extractBearerToken(req.headers.authorization);

    // Missing or malformed Authentication header
    if (!token) {
        throw new createError.Unauthorized("Missing or malformed Authentication.");
    }

    try {
        // Verify token
        const payload = AuthController.isTokenValid(token) as { user: string, role: string };

        // Save user info from token in the request object
        req.user = payload.user;
        req.role = payload.role;

    } catch (err) {
        throw new createError.Unauthorized("Invalid or expired token.");
    }

    logger.verbose(`authenticateJWT output: req.user=${req.user} req.role=${req.role}`)

    next();
}

/**
 * Middleware to leniently authenticate requests using JWT
 * It checks the Authorization header for a valid JWT and extracts user info from it
 */
export function optionalAuthJWT(req: AuthRequest, res: Response, next: NextFunction) {

    logger.verbose("Middleware: optionalAuthJWT");

    const authHeader = req.headers.authorization;

    logger.debug(`AuthHeader: "${authHeader}"`)

    const token = extractBearerToken(req.headers.authorization);

    // Anonymous user
    if (!token) {
        return next();
    }

    try {
        // Verify token
        const payload = AuthController.isTokenValid(token) as { user: string, role: string };

        // Save user info from token in the request object
        req.user = payload.user;
        req.role = payload.role;

    } catch (err) {
        req.user = undefined;
        req.role = undefined;
    }

    logger.verbose(`authenticateJWT output: req.user=${req.user} req.role=${req.role}`);

    next();
}

/**
 * Extracts Bearer token from incoming HTTP Requests
 * @param authHeader Received Authorization header
 * @returns Parsed token, or null if missing or malformed
 */
function extractBearerToken(authHeader?: string): string | null {

    // Missing Authentication header
    if (!authHeader || authHeader.trim() === "") {
        return null;
    }
    
    const [scheme, token] = authHeader.split(" ");
    
    // Malformed Authentication header
    if (scheme != "Bearer" || !token) {
        return null;
    }

    return token;
}