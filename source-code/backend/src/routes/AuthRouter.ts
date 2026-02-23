import express, { Request, Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { logger } from "#logging/logger.js";
import { AuthController } from "#controllers/AuthController.js";
import { validateSignupFields } from "#middleware/validateRequestFields.js";
import { UserDto } from "#types/dto/UserDto.js";
import { UserController } from "#controllers/UserController.js";


export const authRouter = express.Router();

/**
 * Manages the login
 */
authRouter.post("/auth", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve user specified in the request
        const loggingUsername: string = req.body.username;
        const loggingPassword: string = req.body.password;

        // Check if the credentials are correct
        let success = await AuthController.checkCredentials(loggingUsername, loggingPassword);

        if (!success) {
            return next(new createError.Unauthorized("Invalid credentials.")); // Raise error
        }

        // Send the JWT in the HTTP Response JSON body
        res.status(200).json(
            await AuthController.buildJwtResponse(loggingUsername)
        );
    } catch (err) {
        logger.warn(`Could not log in: ${(err as Error).message}`);
        next(err); // Raise error
    }
});

/**
 * Manages the singup (new creation of a user)
 */
authRouter.post("/signup", [validateSignupFields], async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve signup specified in the request
        const sentSignup = res.locals.signup as UserDto;
    
        logger.debug(`Received signup data: ${JSON.stringify(sentSignup)}`);
    
        const result = await UserController.create(sentSignup.username, sentSignup);

        // Send the JWT in the HTTP Response JSON body
        res.status(201).json(
            await AuthController.buildJwtResponse(result.username)
        );
    } catch (err) {
        logger.warn(`Could not sign up: ${(err as Error).message}`);
        next(err); // Raise error
    }
});