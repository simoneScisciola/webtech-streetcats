import { Request, Response, NextFunction } from "express" // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { isAddressValid, isContentValid, isDescriptionValid, isEmailValid, isIdValid, isLatitudeValid, isLongitudeValid, isPasswordValid, isPhotoUrlValid, isRoleNameValid, isTitleValid, isUndefined, isUsernameValid } from "#utils/validators.js";
import { UserRoleDto } from "#types/dto/UserRoleDto.js"
import { UserDto } from "#types/dto/UserDto.js";
import { SightingDto } from "#types/dto/SightingDto.js";
import { CommentDto } from "#types/dto/CommentDto.js";


export function validateUserRoleFields(req: Request, res: Response, next: NextFunction) {

    // Retrieve user role specified in the request
    const sentUserRoleName = req.params.roleName?.trim();
    const sentUserRole: UserRoleDto = {
        roleName: sentUserRoleName // Always update the sent id with the one specified as parameter
    }

    // Check required request fields
    if (isUndefined(sentUserRole.roleName)) {
        throw new createError.BadRequest("Role name must be provided.");
    }

    // Validate request fields
    if (!isRoleNameValid(sentUserRole.roleName)) {
        throw new createError.BadRequest("Role name not valid.");
    }

    res.locals.userRole = sentUserRole;

    next();
}

export function validateUserFields(req: Request, res: Response, next: NextFunction) {

    // Retrieve user specified in the request
    const sentUsername = req.params.username?.trim();
    const sentUser: UserDto = {
        username: sentUsername, // Always update the sent id with the one specified as parameter
        email: req.body.email,
        password: req.body.password
    };

    // Check required request fields
    if (isUndefined(sentUser.username)) {
        throw new createError.BadRequest("Username must be provided.");
    }
    if (isUndefined(sentUser.email)) {
        throw new createError.BadRequest("Email must be provided.");
    }
    if (isUndefined(sentUser.password)) {
        throw new createError.BadRequest("Password must be provided.");
    }

    // Validate request fields
    if (!isUsernameValid(sentUser.username)) {
        throw new createError.BadRequest("Username is not valid.");
    }
    if (!isEmailValid(sentUser.email)) {
        throw new createError.BadRequest("Email is not valid.");
    }
    if (!isPasswordValid(sentUser.password)) {
        throw new createError.BadRequest("Password is not valid.");
    }

    res.locals.user = sentUser;

    next();
}

export function validateSightingFields(req: Request, res: Response, next: NextFunction) {

    // Retrieve sighting specified in the request
    const sentId = req.params.id;
    const sentSighting: SightingDto = {
        id: sentId ? parseInt(sentId) : undefined, // Always update the sent id with the one specified as parameter
        photoUrl: req.body.photoUrl,
        title: req.body.title,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address
    };

    // Check required request fields
    if (isUndefined(sentSighting.photoUrl)) {
        throw new createError.BadRequest("Photo URL must be provided.");
    }
    if (isUndefined(sentSighting.title)) {
        throw new createError.BadRequest("Title must be provided.");
    }
    if (isUndefined(sentSighting.latitude)) {
        throw new createError.BadRequest("Latitude must be provided.");
    }
    if (isUndefined(sentSighting.longitude)) {
        throw new createError.BadRequest("Longitude must be provided.");
    }

    sentSighting.latitude = parseFloat(req.body.latitude);
    sentSighting.longitude = parseFloat(req.body.longitude);

    // Validate request fields
    if (!isUndefined(sentSighting.id) && !isIdValid(sentSighting.id)) {
        throw new createError.BadRequest("ID is not valid.");
    }
    if (!isPhotoUrlValid(sentSighting.photoUrl)) {
        throw new createError.BadRequest("Photo URL is not valid.");
    }
    if (!isTitleValid(sentSighting.title)) {
        throw new createError.BadRequest("Title is not valid.");
    }
    if (!isUndefined(sentSighting.description) && !isDescriptionValid(sentSighting.description)) {
        throw new createError.BadRequest("Description is not valid.");
    }
    if (!isLatitudeValid(sentSighting.latitude)) {
        throw new createError.BadRequest("Latitude is not valid.");
    }
    if (!isLongitudeValid(sentSighting.longitude)) {
        throw new createError.BadRequest("Longitude is not valid.");
    }
    if (!isUndefined(sentSighting.address) && !isAddressValid(sentSighting.address)) {
        throw new createError.BadRequest("Address is not valid.");
    }

    res.locals.sighting = sentSighting;

    next();
}

export function validateCommentFields(req: Request, res: Response, next: NextFunction) {

    // Retrieve comment specified in the request
    const sentId = req.params.id;
    const sentComment: CommentDto = {
        id: sentId ? parseInt(sentId) : undefined, // Always update the sent id with the one specified as parameter
        content: req.body.content
    };

    // Check required request fields
    if (isUndefined(sentComment.content)) {
        throw new createError.BadRequest("Comment content must be provided.");
    }

    // Validate request fields
    if (!isUndefined(sentComment.id) && !isIdValid(sentComment.id)) {
        throw new createError.BadRequest("ID is not valid.");
    }
    if (!isContentValid(sentComment.content)) {
        throw new createError.BadRequest("Content is not valid.");
    }

    res.locals.comment = sentComment;

    next();
}