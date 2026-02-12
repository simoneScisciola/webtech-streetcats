import express, { Request, Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { logger } from "#logging/logger.js";
import { SightingController } from "#controllers/SightingController.js";
import { SightingDto } from "#types/dto/SightingDto.js";
import { validateId, validateSightingFields } from "#middleware/validateRequestFields.js";


export const sightingRouter = express.Router();

/**
 * Manages new creation of a sighting
 */
sightingRouter.post("/sightings", [validateSightingFields], async (req: Request, res: Response, next: NextFunction) => {
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
sightingRouter.get("/sightings", async (req: Request, res: Response, next: NextFunction) => {
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
sightingRouter.get("/sightings/:id", [validateId], async (req: Request, res: Response, next: NextFunction) => {
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
sightingRouter.put("/sightings/:id", [validateId, validateSightingFields], async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve sighting specified in the request
        const sentSightingId = res.locals.id as number;
        const sentSighting = res.locals.sighting as SightingDto;

        logger.debug(`Received sighting data: id=${sentSightingId}, data=${JSON.stringify(sentSighting)}`);

        const result = await SightingController.update(sentSightingId, sentSighting);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages partial update of a sighting
 */
sightingRouter.patch("/sightings/:id", [validateId, validateSightingFields], async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve sighting specified in the request
        const sentSightingId = res.locals.id as number;
        const sentSighting = res.locals.sighting as SightingDto;

        logger.debug(`Received sighting data: id=${sentSightingId}, data=${JSON.stringify(sentSighting)}`);

        const result = await SightingController.update(sentSightingId, sentSighting);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages delete of a specified sighting
 */
sightingRouter.delete("/sightings/:id", [validateId], async (req: Request, res: Response, next: NextFunction) => {
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