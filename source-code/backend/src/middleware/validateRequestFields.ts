import { Request, Response, NextFunction } from "express" // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { UserRoleDto } from "#types/dto/UserRoleDto.js"
import { isRoleNameValid, isUndefined } from "#utils/validators.js";


export function validateUserRoleFields(req: Request, res: Response, next: NextFunction) {

    // Retrieve user role specified in the request
    const sentUserRoleName = req.params.roleName?.trim();
    const sentUserRole: UserRoleDto = {
        roleName: sentUserRoleName // Always update the sent id with the one specified as parameter
    }

    // Check required request fields
    if (isUndefined(sentUserRole.roleName)) {
        throw new createError.BadRequest('Role name must be provided.');
    }

    // Validate request fields
    if (!isRoleNameValid(sentUserRole.roleName)) {
        throw new createError.BadRequest('Role name not valid.');
    }

    next();
}