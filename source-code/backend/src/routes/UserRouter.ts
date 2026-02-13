import express, { Request, Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { logger } from "#logging/logger.js";
import { UserController } from "#controllers/UserController.js";
import { UserDto } from "#types/dto/UserDto.js";
import { validateUserFields } from "#middleware/validateRequestFields.js";


export const userRouter = express.Router();

/**
 * Manages full update of a user
 */
userRouter.put("/users/:username", [validateUserFields(false)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve user specified in the request
        const sentUser = res.locals.user as UserDto;

        logger.debug(`Received user data: ${JSON.stringify(sentUser)}`);

        const result = await UserController.replace(sentUser.username, sentUser);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages retrieve of all users
 */
userRouter.get("/users", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserController.findAll(req.pagination);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages retrieve of a specified user
 */
userRouter.get("/users/:username", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve user specified in the request
        const username = req.params.username?.trim();

        const result = await UserController.findById(username);

        if (!result) {
            throw new createError.NotFound("User not found.");
        }

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages partial update of a user role
 */
userRouter.patch("/users/:username", [validateUserFields(true)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve user specified in the request
        const sentUser = res.locals.user as UserDto;

        logger.debug(`Received user data: ${JSON.stringify(sentUser)}`);

        const result = await UserController.update(sentUser.username, sentUser);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages delete of a specified user
 */
userRouter.delete("/users/:username", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve user role specified in the request
        const username = req.params.username?.trim();

        const result = await UserController.delete(username);

        if (!result) {
            throw new createError.NotFound("User not found.");
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
});