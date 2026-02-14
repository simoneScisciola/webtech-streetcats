import { Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { AuthRequest } from "#types/authRequest.js";


/**
 * Middleware to authorize requests based on user roles
 * It checks that the authenticated user has one of the allowed roles to access the resource
 * @param allowedRoles The roles that are allowed to access the resource
 * @returns A middleware function that checks the user's role and either allows access or returns an error
 */
export function requireRole(...allowedRoles: string[]) {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {

        if (!req.user || !req.role) {
            throw new createError.Unauthorized("Unauthenticated.");
        }

        if (!allowedRoles.includes(req.role)) {
            throw new createError.Forbidden("Access denied.");
        }

        next();
    };
}