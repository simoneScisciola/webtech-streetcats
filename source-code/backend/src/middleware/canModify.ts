import { Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { AuthRequest } from "#types/authRequest.js";
import { SightingController } from "#controllers/SightingController.js";
import { isAdmin, isOwner } from "#utils/authorizationRules.js";
import { CommentController } from "#controllers/CommentController.js";


export async function canModifyUser(req: AuthRequest, res: Response, next: NextFunction) {

    if (!isOwner(req.params.username, req.user) && !isAdmin(req.role)) {
        throw new createError.Forbidden("Access denied.");
    }

    next();
}

export async function canModifySighting(req: AuthRequest, res: Response, next: NextFunction) {

    const sighting = await SightingController.findById(parseInt(req.params.id));
    if (!sighting) {
        throw new createError.NotFound("Sighting not found.");
    }

    if (!isOwner(sighting.username, req.user) && !isAdmin(req.role)) {
        throw new createError.Forbidden("Access denied.");
    }
    
    next();
}

export async function canModifyComment(req: AuthRequest, res: Response, next: NextFunction) {

    const comment = await CommentController.findById(parseInt(req.params.id));
    if (!comment) {
        throw new createError.NotFound("Comment not found.");
    }

    if (!isOwner(comment.username, req.user) && !isAdmin(req.role)) {
        throw new createError.Forbidden("Access denied.");
    }
    
    next();
}