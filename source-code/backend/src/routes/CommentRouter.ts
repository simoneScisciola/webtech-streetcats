import express, { Request, Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { logger } from "#logging/logger.js";
import { CommentController } from "#controllers/CommentController.js";
import { CommentDto } from "#types/dto/CommentDto.js";
import { validateCommentFields, validateId } from "#middleware/validateRequestFields.js";


export const commentRouter = express.Router();

/**
 * Manages new creation of a comment
 */
commentRouter.post("/comments", [validateCommentFields(false)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve comment specified in the request
        const sentComment = res.locals.comment as CommentDto;

        logger.debug(`Received comment data: ${JSON.stringify(sentComment)}`);

        const result = await CommentController.create(sentComment);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages retrieve of all comments
 */
commentRouter.get("/comments", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await CommentController.findAll(req.pagination);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages retrieve of a specified comment
 */
commentRouter.get("/comments/:id", [validateId], async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve comment specified in the request
        const sentCommentId = res.locals.id as number;

        const result = await CommentController.findById(sentCommentId);

        if (!result) {
            throw new createError.NotFound("Comment not found.");
        }

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages full update of a comment
 */
commentRouter.put("/comments/:id", [validateId, validateCommentFields(false)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve comment specified in the request
        const sentComment = res.locals.comment as CommentDto;
        sentComment.id = res.locals.id as number;

        logger.debug(`Received comment data: ${JSON.stringify(sentComment)}`);

        const result = await CommentController.replace(sentComment.id, sentComment);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages partial update of a comment
 */
commentRouter.patch("/comments/:id", [validateId, validateCommentFields(true)], async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve comment specified in the request
        const sentComment = res.locals.comment as CommentDto;
        sentComment.id = res.locals.id as number;

        logger.debug(`Received comment data: ${JSON.stringify(sentComment)}`);

        const result = await CommentController.update(sentComment.id, sentComment);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages delete of a specified comment
 */
commentRouter.delete("/comments/:id", [validateId], async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve comment specified in the request
        const sentCommentId = res.locals.id as number;

        const result = await CommentController.delete(sentCommentId);

        if (!result) {
            throw new createError.NotFound("Comment not found.");
        } 

        res.status(204).send();
    } catch (err) {
        next(err);
    }
});