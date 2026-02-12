import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { UserRoleDto } from "#types/dto/UserRoleDto.js";
import { findAllPaginated } from "#utils/findAllPaginated.js";
import { UserRole } from "#config/database.js";
import { ParsedPagination } from "#types/queryParams.js";


export class UserRoleController {
    
    static async create(sentRoleName: string, sentUserRole: UserRoleDto){
        
        sentUserRole.roleName = sentRoleName;

        // Save new UserRole
        return UserRole.build(sentUserRole).save(); //returns a Promise
    }

    static async findById(sentRoleName: string){

        // Find user role
        return UserRole.findByPk(sentRoleName); //returns a Promise
    }

    static async findAll(pagination: ParsedPagination){
        
        // Find user role
        return findAllPaginated(UserRole, pagination); //returns a Promise
    }

    static async update(sentRoleName: string, updatedUserRole: UserRoleDto){

        let existingUserRole = await this.findById(sentRoleName);

        if (existingUserRole === null) {
            throw new createError.NotFound('Role name not found.');

        } else {

            // Update using fields which were passed in request
            existingUserRole.set(updatedUserRole);
    
            return existingUserRole.save(); //returns a Promise
        }
    }

    static async delete(sentRoleName: string){

        let existingUserRole = await this.findById(sentRoleName);
        
        if (existingUserRole !== null)
            await existingUserRole.destroy();

        return existingUserRole; //returns a Promise
    }
}