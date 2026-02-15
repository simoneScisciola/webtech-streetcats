import { Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { AuthRequest } from "#types/authRequest.js";
import { AuthController } from "#controllers/AuthController.js";


/**
 * Middleware to authenticate requests using JWT
 * It checks the Authorization header for a valid JWT and extracts user info from it
 */
export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader.trim() === "") {
        throw new createError.Unauthorized("Missing token.");
    }
    if (!authHeader.startsWith("Bearer ")) {
        throw new createError.Unauthorized("Malformed token.");
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verify the token
        const payload = AuthController.isTokenValid(token) as { user: string, role: string };

        // Save user info from token in the request object
        req.user = payload.user;
        req.role = payload.role;

        next();
    } catch (err) {
        throw new createError.Unauthorized("Invalid or expired token");
    }
}