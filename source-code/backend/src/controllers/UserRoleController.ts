import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { UserRoleDto } from "#types/dto/UserRoleDto.js";
import { findAllPaginated } from "#utils/findAllPaginated.js";
import { UserRole } from "#config/database.js";
import { ParsedPagination } from "#types/queryParams.js";


export class UserRoleController {
    
    /**
     * Create a new user role
     */
    static async create(sentRoleName: string, sentUserRole: UserRoleDto){
        
        sentUserRole.roleName = sentRoleName;

        return UserRole.build(sentUserRole).save(); //returns a Promise
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
     * Update an existing user role
     */
    static async update(sentRoleName: string, updatedUserRole: UserRoleDto){

        const existingUserRole = await this.findById(sentRoleName);

        if (existingUserRole === null) {
            throw new createError.NotFound("Role name not found.");

        } else {

            // Update only provided fields
            existingUserRole.set(updatedUserRole);
    
            return existingUserRole.save(); //returns a Promise
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