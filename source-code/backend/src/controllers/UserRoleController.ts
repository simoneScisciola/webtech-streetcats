import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { UserRoleDto } from "#types/dto/UserRoleDto.js";
import { findAllPaginated } from "#utils/findAllPaginated.js";
import { UserRole } from "#config/database.js";
import { ParsedPagination } from "#types/queryParams.js";


export class UserRoleController {
    
    /**
     * Create a new user role or full update an existing one
     */
    static async createOrReplace(sentRoleName: string, sentUserRole: UserRoleDto){
        
        sentUserRole.roleName = sentRoleName;

        const existingUserRole = await this.findById(sentRoleName);
        if (existingUserRole === null) {
            return UserRole.create(sentUserRole); //returns a Promise

        } else {
            // Update all fields
            return existingUserRole.update({
                roleName: sentRoleName
            }); // returns a Promise
        }
    }

    /**
     * Find user role by primary key (roleName)
     */
    static async findById(sentRoleName: string){

        return UserRole.findByPk(sentRoleName); //returns a Promise
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
    static async update(sentRoleName: string, partialUserRole: Partial<UserRoleDto>){

        partialUserRole.roleName = sentRoleName;

        const existingUserRole = await this.findById(sentRoleName);
        if (existingUserRole === null) {
            throw new createError.NotFound("User role not found.");

        } else {
            // Update only provided fields
            return existingUserRole.update(partialUserRole); //returns a Promise
        }
    }

    /**
     * Delete a user role
     */
    static async delete(sentRoleName: string){

        const existingUserRole = await this.findById(sentRoleName);
        
        if (existingUserRole !== null)
            await existingUserRole.destroy();

        return existingUserRole; //returns a Promise
    }
}