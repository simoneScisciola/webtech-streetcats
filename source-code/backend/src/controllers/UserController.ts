import createError from "http-errors"; // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { User } from "#config/database.js";
import { UserDto } from "#types/dto/UserDto.js";
import { ParsedPagination } from "#types/queryParams.js";
import { findAllPaginated } from "#utils/findAllPaginated.js";


export class UserController {

    /**
     * Create a new user
     */
    static async create(sentUsername: string, sentUser: UserDto) {

        sentUser.username = sentUsername;

        const existingUser = await this.findById(sentUsername);
        if (existingUser !== null) {
            throw new createError.Conflict("User already exists.");

        } else {
            // Password hashing is handled by the model hook
            return User.create(sentUser); // returns a Promise
        }
    }

    /**
     * Find user by primary key (username)
     */
    static async findById(sentUsername: string) {

        return User.findByPk(sentUsername); // returns a Promise
    }

    /**
     * Find all users with pagination
     */
    static async findAll(pagination: ParsedPagination) {

        return findAllPaginated(User, pagination); // returns a Promise
    }

    /**
     * Full update an existing user
     */
    static async replace(sentUsername: string, fullUser: UserDto) {

        fullUser.username = sentUsername;

        const existingUser = await this.findById(sentUsername);
        if (existingUser === null) {
            throw new createError.NotFound("User not found. Use /signup to create a new user.");

        } else {
            // Update all fields
            // Password hashing is handled by the model hook
            return existingUser.update({
                username: sentUsername,
                email: fullUser.email,
                password: fullUser.password
            });
        }
    }

    /**
     * Partial update an existing user
     */
    static async update(sentUsername: string, partialUser: Partial<UserDto>) {

        partialUser.username = sentUsername;

        const existingUser = await this.findById(sentUsername);
        if (existingUser === null) {
            throw new createError.NotFound("User not found.");

        } else {
            // Update only provided fields
            // Password hashing is handled by the model hook
            return existingUser.update(partialUser); // returns a Promise
        }
    }

    /**
     * Delete a user
     */
    static async delete(sentUsername: string) {

        const existingUser = await this.findById(sentUsername);

        if (existingUser !== null)
            await existingUser.destroy();

        return existingUser; // returns a Promise
    }
}