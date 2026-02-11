import { Request, Response, NextFunction, ErrorRequestHandler } from "express" // Express framework (https://expressjs.com/)
import { HttpError } from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { logger } from "#logging/logger.js";


/**
 * Handles errors raised within the application
 * @param err Error catched
 * @param req HTTP Request object that raised the error
 * @param res HTTP Response object to send
 * @param next Callback function to call the next middleware in the chain
 */
export const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    // Prints full stack on console
    logger.error(err.stack);

    let status: number;
    let expose: boolean;

    if ((err as HttpError).status) { // In a HttpError we always have a status code

        const httpError = (err as HttpError);

        // Sets Error properties
        status = httpError.status;
        
        if (typeof httpError.expose === 'boolean') { // If httpError.expose exists and is a boolean
            expose = httpError.expose; // Get httpError.expose
        } else { 
            expose = status < 500; // Mimics the default behavior of "http-errors"
        }
  
    } else { // Regular Error
        
        // Sets Error properties
        status = 500;
        expose = false;
    }

    let message: string;   
    if (expose) {
        message = err.message;
    } else {
        message = 'Internal Server Error';
    }

    // Send HTTP Response
    res.status(status)
    res.json({
        code: status,
        description: message
    })
}