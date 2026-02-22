import express, { Request, Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import createError from "http-errors"; // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { logger } from "#logging/logger.js";
import { SightingController } from "#controllers/SightingController.js";
import { SightingDto } from "#types/dto/SightingDto.js";
import { validateId, validateSightingFields } from "#middleware/validateRequestFields.js";
import { optionalAuthJWT, requireAuthJWT } from "#middleware/authenticate.js";
import { allowedRoles } from "#middleware/authorize.js";
import { canModifySighting } from "#middleware/canModify.js";
import { parseSightingPhotoUpload } from "#middleware/parseUpload.js";


export const sightingRouter = express.Router();

/**
 * Manages new creation of a sighting
 */
sightingRouter.post("/sightings", [requireAuthJWT, allowedRoles("USER", "ADMIN"), parseSightingPhotoUpload, validateSightingFields(false)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve sighting specified in the request
        const sentSighting = res.locals.sighting as SightingDto;

        logger.debug(`Received sighting data: ${JSON.stringify(sentSighting)}`);

        const result = await SightingController.create(sentSighting);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages retrieve of all sightings
 */
sightingRouter.get("/sightings", [optionalAuthJWT], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await SightingController.findAll(req.pagination);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages retrieve of a specified sighting
 */
sightingRouter.get("/sightings/:id", [optionalAuthJWT, validateId], async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve sighting specified in the request
        const sentSightingId = res.locals.id as number;

        const result = await SightingController.findById(sentSightingId);

        if (!result) {
            throw new createError.NotFound("Sighting not found.");
        } 

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages full update of a sighting
 */
sightingRouter.put("/sightings/:id", [requireAuthJWT, allowedRoles("ADMIN"), validateId, parseSightingPhotoUpload, validateSightingFields(false)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve sighting specified in the request
        const sentSighting = res.locals.sighting as SightingDto;
        sentSighting.id = res.locals.id as number;

        logger.debug(`Received sighting data: ${JSON.stringify(sentSighting)}`);

        const result = await SightingController.replace(sentSighting.id, sentSighting);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages partial update of a sighting
 */
sightingRouter.patch("/sightings/:id", [requireAuthJWT, allowedRoles("USER", "ADMIN"), canModifySighting, validateId, parseSightingPhotoUpload, validateSightingFields(true)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve sighting specified in the request
        const sentSighting = res.locals.sighting as SightingDto;
        sentSighting.id = res.locals.id as number;

        logger.debug(`Received sighting data: ${JSON.stringify(sentSighting)}`);

        const result = await SightingController.update(sentSighting.id, sentSighting);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages delete of a specified sighting
 */
sightingRouter.delete("/sightings/:id", [requireAuthJWT, allowedRoles("USER", "ADMIN"), canModifySighting, validateId], async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve sighting specified in the request
        const sentSightingId = res.locals.id as number;

        const result = await SightingController.delete(sentSightingId);

        if (!result) {
            throw new createError.NotFound("Sighting not found.");
        } 

        res.status(204).send();
    } catch (err) {
        next(err);
    }
});