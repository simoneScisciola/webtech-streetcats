import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { UserRoleDto } from "#types/dto/UserRoleDto.js";
import { findAllPaginated } from "#utils/findAllPaginated.js";
import { UserRole } from "#config/database.js";
import { ParsedPagination } from "#types/queryParams.js";


export class UserRoleController {
    
    /**
     * Create a new user role or full update an existing one
     */
    static async createOrReplace(sentRolename: string, sentUserRole: UserRoleDto){
        
        sentUserRole.rolename = sentRolename;

        const existingUserRole = await this.findById(sentRolename);
        if (existingUserRole === null) {
            return UserRole.create(sentUserRole); //returns a Promise

        } else {
            // Update all fields
            return existingUserRole.update({
                rolename: sentRolename
            }); // returns a Promise
        }
    }

    /**
     * Find user role by primary key (rolename)
     */
    static async findById(sentRolename: string){

        return UserRole.findByPk(sentRolename); //returns a Promise
    }

    /**
     * Find all user roles with pagination
     */
    static async findAll(pagination: ParsedPagination){
        
        return findAllPaginated(UserRole, pagination); //returns a Promise
    }

    /**
     * Partial update an existing user role
     */
    static async update(sentRolename: string, partialUserRole: Partial<UserRoleDto>){

        partialUserRole.rolename = sentRolename;

        const existingUserRole = await this.findById(sentRolename);
        if (existingUserRole === null) {
            throw new createError.NotFound("User role not found.");
        }
    
        // Update only provided fields
        return existingUserRole.update(partialUserRole); //returns a Promise
    }

    /**
     * Delete a user role
     */
    static async delete(sentRolename: string){

        const existingUserRole = await this.findById(sentRolename);
        
        if (existingUserRole !== null)
            await existingUserRole.destroy();

        return existingUserRole; //returns a Promise
    }
}