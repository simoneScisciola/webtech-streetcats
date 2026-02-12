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

        return User.build(sentUser).save(); // returns a Promise
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
     * Update an existing user
     */
    static async update(sentUsername: string, updatedUser: Partial<UserDto>) {

        const existingUser = await this.findById(sentUsername);

        if (existingUser === null) {
            throw new createError.NotFound("User not found.");

        } else {

            // Update only provided fields
            // Password hashing is handled by the model hook
            return existingUser.update(updatedUser); // returns a Promise
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