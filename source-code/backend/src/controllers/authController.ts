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
        
        let isValid = false;

        // Retrieve user credentials specified in the request
        let loggingUsername: string = req.body.usr;
        let loggingPassword: string = req.body.pwd;

        // Retrieve the User with the requested username
        let foundUser = await User.findOne({
            where: { username: loggingUsername }
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
        let registeringPassword: string = req.body.pwd;

        // Validate user credentials
        if (!isUsernameValid(registeringUsername)) {
            throw new createError.BadRequest('Username non valido');
        }

        if (!isPasswordValid(registeringPassword)) {
            throw new createError.BadRequest('Password non valida');
        }

        // Save new User
        const registeringUser = User.build ({
            username: registeringUsername, 
            password: registeringPassword
        });

        return registeringUser.save(); //returns a Promise

        // Helper functions
        function isUsernameValid(username: any): boolean {
            const isString = typeof username === 'string';
            let isEmpty: boolean = true;
            if (isString) {
                isEmpty = username.trim().length <= 0;
            }

            return isString && !isEmpty;
        }

        function isPasswordValid(password: any): boolean {
            const isString = typeof password === 'string';

            let isEmpty: boolean = true;
            let hasUpperCase: boolean = false;
            let hasNumber: boolean = false;
            let hasSpecialChar: boolean = false;
            if (isString) {
                isEmpty = password.trim().length <= 0;
                if (!isEmpty) {
                    hasUpperCase = /[A-Z]/.test(password);
                    hasNumber = /[0-9]/.test(password);
                    hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
                }
            }

            return isString && !isEmpty && hasUpperCase && hasNumber && hasSpecialChar;
        }
    }

    static issueToken(username: string){
        return Jwt.sign({user:username}, process.env.JWT_SECRET_TOKEN, {expiresIn: `${24*60*60}s`});
    }

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