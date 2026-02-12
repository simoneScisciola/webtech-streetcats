import express, { Request, Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { CommentController } from "#controllers/CommentController.js";
import { CommentDto } from "#types/dto/CommentDto.js";
import { validateCommentFields } from "#middleware/validateRequestFields.js";


export const commentRouter = express.Router();

/**
 * Manages the new creation of a comment
 */
commentRouter.post("/comments", [validateCommentFields], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sentComment = res.locals.comment as CommentDto;
        const result = await CommentController.create(sentComment);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages the retrieve of all comments
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
 * Manages the retrieve of a specified comment
 */
commentRouter.get("/comments/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve comment specified in the request
        const id = parseInt(req.params.id);

        const result = await CommentController.findById(id);

        if (!result) {
            throw new createError.NotFound("Comment not found.");
        }

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * Manages the delete of a specified comment
 */
commentRouter.delete("/comments/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve comment specified in the request
        const id = parseInt(req.params.id);

        const result = await CommentController.delete(id);

        if (!result) {
            throw new createError.NotFound("Comment not found.");
        } 

        res.status(204).send();
    } catch (err) {
        next(err);
    }
});