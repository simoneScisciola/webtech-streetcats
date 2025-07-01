import express from "express"; // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { AuthController } from "#controllers/authController.js";


export const authRouter = express.Router();

/**
 * Manages the login
 */
authRouter.post("/auth", async (req, res, next) => {

    // Check if the credentials are correct
    let isAuthenticated = await AuthController.checkCredentials(req, res);
    
    if(isAuthenticated) {
        res.json(AuthController.issueToken(req.body.usr)); // Returns the JWT in the HTTP Response JSON body
    } else {
        next(new createError.Unauthorized); // Raise error
    }
});

/**
 * Manages the singup
 */
authRouter.post("/signup", (req, res, next) => {

    // Saves new User    
    AuthController.saveUser(req, res)
        .then((user) => {
            res.json(user); // Sends the registered User
        })
        .catch((err: Error) => {
            console.error("Could not save user: " + err.message);
            next(err); // Raise error
        })
});