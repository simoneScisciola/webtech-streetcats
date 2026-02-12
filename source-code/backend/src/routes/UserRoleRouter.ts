import express, { Request, Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { logger } from "#logging/logger.js";
import { UserRoleController } from "#controllers/UserRoleController.js";
import { UserRoleDto } from "#types/dto/UserRoleDto.js";
import { validateUserRoleFields } from "#middleware/validateRequestFields.js";

export const userRoleRouter = express.Router();

/**
 * Manages the full replace (or new creation) of a user role
 */
userRoleRouter.put("/user-roles/:roleName", [validateUserRoleFields], async (req: Request, res: Response, next: NextFunction) => {

    try {
        // Retrieve user role specified in the request
        const sentUserRoleName = req.params.roleName?.trim();
        const sentUserRole: UserRoleDto = {
            roleName: sentUserRoleName // Always update the sent id with the one specified as parameter
        }

        const result = await UserRoleController.create(sentUserRoleName, sentUserRole);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }

});

/**
 * Manages the retrieve of all user roles
 */
userRoleRouter.get("/user-roles", async (req, res, next) => {
    
    try {
        const result = await UserRoleController.findAll(req.pagination);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }

});

/**
 * Manages the retrieve of a specified user role
 */
userRoleRouter.get("/user-roles/:roleName", async (req, res, next) => {

    try {
        // Retrieve user role specified in the request
        const sentUserRoleName = req.params.roleName?.trim();
    
        logger.debug(sentUserRoleName);

        const result = await UserRoleController.findById(sentUserRoleName);

        if (!result) {
            throw new createError.NotFound('User role not found.');
        }

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }

});

/**
 * Manages the delete of a specified user role
 */
userRoleRouter.delete("/user-roles/:roleName", async (req, res, next) => {

    try {
        // Retrieve user role specified in the request
        const sentUserRoleName = req.params.roleName?.trim();
    
        const result = await UserRoleController.delete(sentUserRoleName);

        if (!result) {
            throw new createError.NotFound('User role not found.');
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }

});