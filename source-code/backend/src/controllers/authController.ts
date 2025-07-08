import { Request, Response } from "express"; // Express framework (https://expressjs.com/)
import Jwt from "jsonwebtoken"; // JWT middleware (https://www.npmjs.com/package/jsonwebtoken)
import bcrypt from "bcrypt"; // bcrypt hashing algorithm (https://www.npmjs.com/package/bcrypt)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

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
        let loggingUsername: string = req.body.usr;
        let loggingPassword: string = req.body.pwd;

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
        let registeringUsername: string = req.body.usr;
        let registeringEmail: string = req.body.email;
        let registeringPassword: string = req.body.pwd;

        registeringUsername = registeringUsername.trim();
        registeringEmail = registeringEmail.trim().toLowerCase();

        // Validate user credentials
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


        // Helper functions
        function isUsernameValid(username: any): boolean {
            const isString = typeof username === 'string';

            let isEmpty: boolean = true;
            if (isString) {
                isEmpty = username.length <= 0;
            }

            return isString && !isEmpty;
        }

        function isEmailValid(email: any): boolean {
            const isString = typeof email === 'string';

            let isEmpty: boolean = true;
            let isWellFormatted: boolean = false;
            if (isString) {
                isEmpty = email.length <= 0;
                if (!isEmpty) {
                    /* Email is of type A@B.C where:
                        - A is at least one character and can't contain space or @
                        - B is at least one character and can't contain space or @
                        - C is at least one character and can't contain space or @
                    */
                    isWellFormatted = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                }
            }

            return isString && !isEmpty && isWellFormatted;
        }

        function isPasswordValid(password: any): boolean {
            const isString = typeof password === 'string';

            let isEmpty: boolean = true;
            let hasUpperCase: boolean = false;
            let hasNumber: boolean = false;
            let hasSpecialChar: boolean = false;
            if (isString) {
                isEmpty = password.length <= 0;
                if (!isEmpty) {
                    hasUpperCase = /[A-Z]/.test(password); // Password must contain a uppercase character
                    hasNumber = /\d/.test(password); // Password must contain a number character
                    hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Password must contain a special character
                }
            }

            return isString && !isEmpty && hasUpperCase && hasNumber && hasSpecialChar;
        }
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