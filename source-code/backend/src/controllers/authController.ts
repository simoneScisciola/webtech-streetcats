import { Request, Response } from "express"; // Express framework (https://expressjs.com/)
import Jwt from "jsonwebtoken"; // JWT middleware (https://www.npmjs.com/package/jsonwebtoken)
import bcrypt from "bcrypt"; // bcrypt hashing algorithm (https://www.npmjs.com/package/bcrypt)

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
        let loggingUsername = req.body.usr;
        let loggingPassword = req.body.pwd;

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
        
        // Save new User
        const registeringUser = User.build ({
            username: req.body.usr, 
            password: req.body.pwd
        });

        return registeringUser.save(); //returns a Promise
    }

    static issueToken(username: string){
        console.log();
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