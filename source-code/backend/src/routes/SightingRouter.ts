import express, { Request, Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { SightingController } from "#controllers/SightingController.js";
import { SightingDto } from "#types/dto/SightingDto.js";
import { validateSightingFields } from "#middleware/validateRequestFields.js";


export const sightingRouter = express.Router();

/**
 * Manages the new creation of a sighting
 */
sightingRouter.post("/sightings", [validateSightingFields], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sentSighting = res.locals.sighting as SightingDto;
        const result = await SightingController.create(sentSighting);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages the retrieve of all sightings
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
 * Manages the retrieve of a specified sighting
 */
sightingRouter.get("/sightings/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve sighting specified in the request
        const id = parseInt(req.params.id);

        const result = await SightingController.findById(id);

        if (!result) {
            throw new createError.NotFound("Sighting not found.");
        } 

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages the delete of a specified sighting
 */
sightingRouter.delete("/sightings/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve sighting specified in the request
        const id = parseInt(req.params.id);

        const result = await SightingController.delete(id);

        if (!result) {
            throw new createError.NotFound("Sighting not found.");
        } 

        res.status(204).send();
    } catch (err) {
        next(err);
    }
});