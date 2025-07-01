import { Request, Response, NextFunction, ErrorRequestHandler } from "express" // Express framework (https://expressjs.com/)
import { HttpError } from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)


/**
 * Handles errors raised within the application
 * @param err Error catched
 * @param req HTTP Request object that raised the error
 * @param res HTTP Response object to send
 * @param next Callback function to call the next middleware in the chain
 */
export const errorHandler: ErrorRequestHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {

    // Prints full stack on console
    console.log(err.stack);

    // Sets Error properties
    let status = err.status ?? 500
    
    let expose: boolean;   
    if (typeof err.expose === 'boolean') { // If err.expose exists and is a boolean
        expose = err.expose; // Get err.expose
    } else { 
        expose = status < 500; // Mimics the default behavior of "http-errors"
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