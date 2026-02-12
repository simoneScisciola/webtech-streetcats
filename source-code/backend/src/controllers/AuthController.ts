import { Request, Response } from "express"; // Express framework (https://expressjs.com/)
import Jwt from "jsonwebtoken"; // JWT middleware (https://www.npmjs.com/package/jsonwebtoken)
import bcrypt from "bcrypt"; // bcrypt hashing algorithm (https://www.npmjs.com/package/bcrypt)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { isUsernameValid, isEmailValid, isPasswordValid } from "#utils/validators.js"
import { User } from "#config/database.js";


export class AuthController {
    /**
     * Handles post requests on /auth. Checks that the given credentials are valid
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     */
    static async checkCredentials(req: Request, res: Response){
        
        let isValid: boolean = false;

        // Retrieve user credentials specified in the request
        let loggingUsername: string = req.body.username;
        let loggingPassword: string = req.body.password;

        // Retrieve the User with the requested username
        let foundUser = await User.findOne({
            where: {
                username: loggingUsername
            }
        });

        // If the User exists, it checks if password is valid
        if (foundUser) {
            isValid = await bcrypt.compare(loggingPassword, foundUser.password);
        }

        return isValid;
    }

    /**
     * Attempts to create a new User
     */
    static async saveUser(req: Request, res: Response){
        
        // Retrieve user credentials specified in the request
        let registeringUsername: string = req.body.username;
        let registeringEmail: string = req.body.email;
        let registeringPassword: string = req.body.password;

        registeringUsername = registeringUsername?.trim();
        registeringEmail = registeringEmail?.trim()?.toLowerCase();

        // Validate request
        if (!isUsernameValid(registeringUsername)) {
            throw new createError.BadRequest('Username not valid.');
        }

        if (!isEmailValid(registeringPassword)) {
            throw new createError.BadRequest('Email not valid.');
        }

        if (!isPasswordValid(registeringPassword)) {
            throw new createError.BadRequest('Password not valid.');
        }

        // Save new User
        const registeringUser = User.build ({
            username: registeringUsername,
            email: registeringEmail,
            password: registeringPassword
        });

        return registeringUser.save(); //returns a Promise
    }

    /**
     * Generates a JWT for the User
     * @param username The User's username
     * @returns The generated JWT
     */
    static issueToken(username: string){
        return Jwt.sign({user:username}, process.env.JWT_SECRET_TOKEN, {expiresIn: `${24*60*60}s`});
    }

    /**
     * Checks wheter the JWT is valid
     * @param token The JWT to check
     * @param callback The callback function
     */
    static isTokenValid(token: string, callback: any){
        Jwt.verify(token, process.env.JWT_SECRET_TOKEN, callback);
    }

    /*
    static async canUserModifyTodo(user: any, todoId: any){
        const todo = await Todo.findByPk(todoId);
        //todo must exist and be associated with user
        return todo && todo.UserUserName === user;
        }
    */
}