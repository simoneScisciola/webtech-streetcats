import { Request, Response } from "express"; // Express framework (https://expressjs.com/)
import Jwt from "jsonwebtoken"; // JWT middleware (https://www.npmjs.com/package/jsonwebtoken)
import bcrypt from "bcrypt"; // bcrypt hashing algorithm (https://www.npmjs.com/package/bcrypt)

import { User } from "#config/database.js";


export class AuthController {
    /**
     * Handles post requests on /auth. Checks that the given credentials are valid
     * @param username
     * @param password
     */
    static async checkCredentials(loggingUsername: string, loggingPassword: string) {
        
        let isValid: boolean = false;

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
        return todo && todo.UserUsername === user;
        }
    */
}