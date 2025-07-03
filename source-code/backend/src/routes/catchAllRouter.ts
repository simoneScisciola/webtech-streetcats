import express from "express"; // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)


export const catchAllRouter = express.Router();

/**
 * Manages the all routes not catched before
 */
catchAllRouter.get('/*splat', (req, res, next) => {
    next(new createError.NotFound); // Raise error
});

/**
 * Manages the empty route
 */
catchAllRouter.get('/', (req, res, next) => {
    next(new createError.NotFound); // Raise error
});
