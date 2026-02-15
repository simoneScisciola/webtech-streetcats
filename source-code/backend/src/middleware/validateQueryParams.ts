import { Request, Response, NextFunction } from "express" // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { AuthRequest } from "#types/authRequest.js";


export function validateCommentQueryParams(req: AuthRequest, res: Response, next: NextFunction) {

    // Retrieve comment query parameters
    const sightingId = req.filters?.sightingId;
    
    // Check required query params
    if (req?.role !== "ADMIN") { // If not Admin
        if (!sightingId) {
            throw new createError.BadRequest('sightingId query parameter is required');
        }
    }

    next();
}