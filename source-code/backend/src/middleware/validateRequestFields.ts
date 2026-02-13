import { Request, Response, NextFunction } from "express" // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { isAddressValid, isContentValid, isDescriptionValid, isEmailValid, isIdValid, isLatitudeValid, isLongitudeValid, isPasswordValid, isPhotoUrlValid, isRolenameValid, isTitleValid, isUndefined, isUsernameValid } from "#utils/validators.js";
import { UserRoleDto } from "#types/dto/UserRoleDto.js"
import { UserDto } from "#types/dto/UserDto.js";
import { SightingDto } from "#types/dto/SightingDto.js";
import { CommentDto } from "#types/dto/CommentDto.js";


export function validateId(req: Request, res: Response, next: NextFunction) {

    // Retrieve id specified in the request
    const sentId = req.params.id; // Always update the sent id with the one specified as parameter

    // Check required request fields
    if (isUndefined(sentId)) {
        throw new createError.BadRequest("ID must be provided.");
    }

    const parsedSentId = parseInt(sentId);

    // Validate request fields
    if (!isIdValid(parsedSentId)) {
        throw new createError.BadRequest("ID is not valid.");
    }

    res.locals.id = parsedSentId;

    next();
}

export function validateUserRoleFields(enablePartialDto: boolean = false) {
    return (req: Request, res: Response, next: NextFunction) => {

        // Retrieve user role specified in the request
        const sentUserRolename = req.params.rolename?.trim();
        const sentUserRole: UserRoleDto = {
            rolename: sentUserRolename // Always update the sent id with the one specified as parameter
        }

        // Check required request fields
        if (isUndefined(sentUserRole.rolename)) {
            throw new createError.BadRequest("Role name must be provided.");
        }

        // Validate request fields
        if (!isRolenameValid(sentUserRole.rolename)) {
            throw new createError.BadRequest("Role name not valid.");
        }

        res.locals.userRole = sentUserRole;

        next();
    }
}

export function validateUserFields(enablePartialDto: boolean = false) {
    return (req: Request, res: Response, next: NextFunction) => {

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

        if (!enablePartialDto) {
            if (isUndefined(sentUser.email)) {
                throw new createError.BadRequest("Email must be provided.");
            }
            if (isUndefined(sentUser.password)) {
                throw new createError.BadRequest("Password must be provided.");
            }
        }

        // Validate request fields
        if (!isUsernameValid(sentUser.username)) {
            throw new createError.BadRequest("Username is not valid.");
        }

        if (!isUndefined(sentUser.email)) {
            sentUser.email = sentUser.email.trim().toLowerCase(); // Normalize email
            if (!isEmailValid(sentUser.email)) {
                throw new createError.BadRequest("Email is not valid.");
            }
        }
        if (!isUndefined(sentUser.password) && !isPasswordValid(sentUser.password)) {
            throw new createError.BadRequest("Password is not valid.");
        }

        res.locals.user = sentUser;

        next();
    }
}

export function validateSignupFields(req: Request, res: Response, next: NextFunction) {

    // Retrieve signup specified in the request
    const sentSignup: UserDto = {
        username: req.body.username?.trim(),
        email: req.body.email,
        password: req.body.password
    };

    // Check required request fields
    if (isUndefined(sentSignup.username)) {
        throw new createError.BadRequest("Username must be provided.");
    }
    if (isUndefined(sentSignup.email)) {
        throw new createError.BadRequest("Email must be provided.");
    }
    if (isUndefined(sentSignup.password)) {
        throw new createError.BadRequest("Password must be provided.");
    }

    sentSignup.email = sentSignup.email.trim().toLowerCase(); // Normalize email

    // Validate request fields
    if (!isUsernameValid(sentSignup.username)) {
        throw new createError.BadRequest("Username is not valid.");
    }
    if (!isEmailValid(sentSignup.email)) {
        throw new createError.BadRequest("Email is not valid.");
    }
    if (!isPasswordValid(sentSignup.password)) {
        throw new createError.BadRequest("Password is not valid.");
    }

    res.locals.signup = sentSignup;

    next();
}

export function validateSightingFields(enablePartialDto: boolean = false) {
    return (req: Request, res: Response, next: NextFunction) => {

        // Retrieve sighting specified in the request
        const sentSighting: SightingDto = {
            id: undefined, // ID is generated by the system, so it is not retrieved from the request
            photoUrl: req.body.photoUrl,
            title: req.body.title,
            description: req.body.description,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            address: req.body.address
        };

        // Check required request fields
        if (!enablePartialDto) {
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
        }

        // Validate request fields
        // ID is validated only during update operations, since it is not required during creation and should be generated by the system
        if (!isUndefined(sentSighting.photoUrl) && !isPhotoUrlValid(sentSighting.photoUrl)) {
            throw new createError.BadRequest("Photo URL is not valid.");
        }
        if (!isUndefined(sentSighting.title) && !isTitleValid(sentSighting.title)) {
            throw new createError.BadRequest("Title is not valid.");
        }
        if (!isUndefined(sentSighting.description) && !isDescriptionValid(sentSighting.description)) {
            throw new createError.BadRequest("Description is not valid.");
        }
        if (!isUndefined(sentSighting.latitude)) {
            sentSighting.latitude = parseFloat(req.body.latitude); // Convert to float
            if (!isLatitudeValid(sentSighting.latitude)) {
                throw new createError.BadRequest("Latitude is not valid.");
            }
        }
        if (!isUndefined(sentSighting.longitude)) {
            sentSighting.longitude = parseFloat(req.body.longitude); // Convert to float
            if (!isLongitudeValid(sentSighting.longitude)) {
                throw new createError.BadRequest("Longitude is not valid.");
            }
        }
        if (!isUndefined(sentSighting.address) && !isAddressValid(sentSighting.address)) {
            throw new createError.BadRequest("Address is not valid.");
        }

        res.locals.sighting = sentSighting;

        next();
    }
}

export function validateCommentFields(enablePartialDto: boolean = false) {
    return (req: Request, res: Response, next: NextFunction) => {

        // Retrieve comment specified in the request
        const sentComment: CommentDto = {
            id: undefined, // ID is generated by the system, so it is not retrieved from the request
            content: req.body.content
        };

        // Check required request fields
        if (!enablePartialDto) {
            if (isUndefined(sentComment.content)) {
                throw new createError.BadRequest("Comment content must be provided.");
            }
        }

        // Validate request fields
        // ID is validated only during update operations, since it is not required during creation and should be generated by the system
        if (!isUndefined(sentComment.content) && !isContentValid(sentComment.content)) {
            throw new createError.BadRequest("Content is not valid.");
        }

        res.locals.comment = sentComment;

        next();
    }
}