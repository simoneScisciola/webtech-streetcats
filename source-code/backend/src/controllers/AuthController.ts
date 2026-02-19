import Jwt from "jsonwebtoken"; // JWT middleware (https://www.npmjs.com/package/jsonwebtoken)
import bcrypt from "bcrypt"; // bcrypt hashing algorithm (https://www.npmjs.com/package/bcrypt)
import createError from "http-errors"; // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { UserController } from "#controllers/UserController.js";

export class AuthController {

    /**
     * Checks that the given credentials are valid
     * @param loggingUsername The username to check
     * @param loggingPassword The password to check
     * @returns true if the credentials are valid, false otherwise
     */
    static async checkCredentials(loggingUsername: string, loggingPassword: string) {
        
        let isValid: boolean = false;

        // Retrieve the User with the requested username
        let foundUser = await UserController.findById(loggingUsername);

        // If the User exists, it checks if password is valid
        if (foundUser) {
            isValid = await bcrypt.compare(loggingPassword, foundUser.password);
        }

        return isValid;
    }

    /**
     * Generates a JWT for the User
     * @param username The User's username
     * @returns The generated JWT
     */
    static issueToken(username: string, rolename: string, expiresIn: number = 24*60*60) {
        return Jwt.sign(
            {
                user: username,
                role: rolename
            },
            process.env.JWT_SECRET_TOKEN,
            {
                expiresIn: `${expiresIn}s`
            }
        );
    }

    /**
     * Checks wheter the JWT is valid
     * @param token The JWT to check
     */
    static isTokenValid(token: string){
        return Jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    }

    /**
     * Build the JWT Response object.
     * @param loggedUsername Username of the logged user
     * @param expiresIn JWT Token expiration time. Default to 24 hours in seconds.
     */
    static async buildJwtResponse(loggedUsername: string, expiresIn: number = 24*60*60) {

        const loggedUser = await UserController.findById(loggedUsername);
        if (loggedUser === null) {
            throw new createError.InternalServerError("Could not retrieve user info.");
        }

        const jwtToken = AuthController.issueToken(loggedUser.username, loggedUser.rolename, expiresIn);

        // Send the JWT in the HTTP Response JSON body
        return {
            authToken: jwtToken,
            // refreshToken: null, // TODO: implement refresh token
            expiresIn: expiresIn,
            user: loggedUser
        };
    }
}