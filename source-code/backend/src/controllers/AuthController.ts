import Jwt from "jsonwebtoken"; // JWT middleware (https://www.npmjs.com/package/jsonwebtoken)
import bcrypt from "bcrypt"; // bcrypt hashing algorithm (https://www.npmjs.com/package/bcrypt)

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

    /*
    static async canUserModifyTodo(user: any, todoId: any){
        const todo = await Todo.findByPk(todoId);
        //todo must exist and be associated with user
        return todo && todo.UserUsername === user;
        }
    */
}