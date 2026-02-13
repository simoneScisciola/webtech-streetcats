import createError from "http-errors"; // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { Comment } from "#config/database.js";
import { CommentDto } from "#types/dto/CommentDto.js";
import { ParsedPagination } from "#types/queryParams.js";
import { findAllPaginated } from "#utils/findAllPaginated.js";
import { UserController } from "#controllers/UserController.js";
import { SightingController } from "#controllers/SightingController.js";


export class CommentController {

    /**
     * Create a new comment
     */
    static async create(sentComment: CommentDto) {

        // Check foreign key existence
        if (sentComment.username) {
            const userFk = await UserController.findById(sentComment.username);
            if (userFk === null) {
                throw new createError.BadRequest("User not found.");
            }
        }
        if (sentComment.sightingId !== null) {
            const sightingFk = await SightingController.findById(sentComment.sightingId);
            if (sightingFk === null) {
                throw new createError.BadRequest("Sighting not found.");
            }
        }

        return Comment.create(sentComment); // returns a Promise
    }

    /**
     * Find comment by primary key (id)
     */
    static async findById(sentId: number | undefined) {

        return Comment.findByPk(sentId); // returns a Promise
    }

    /**
     * Find all comments with pagination
     */
    static async findAll(pagination: ParsedPagination) {

        return findAllPaginated(Comment, pagination); // returns a Promise
    }

    /**
     * Full update an existing comment
     */
    static async replace(sentCommentId: number, fullComment: CommentDto) {

        fullComment.id = sentCommentId;

        const existingComment = await this.findById(sentCommentId);
        if (existingComment === null) {
            throw new createError.NotFound("Comment not found.");
        }

        // Check foreign key existence
        if (fullComment.username !== null) {
            const userFk = await UserController.findById(fullComment.username);
            if (userFk === null) {
                throw new createError.BadRequest("User not found.");
            }
        }
        if (fullComment.sightingId !== null) {
            const sightingFk = await SightingController.findById(fullComment.sightingId);
            if (sightingFk === null) {
                throw new createError.BadRequest("Sighting not found.");
            }
        }

        // Update all fields
        return existingComment.update({
            id: sentCommentId,
            content: fullComment.content,
            username: fullComment.username,
            sightingId: fullComment.sightingId
        }); // returns a Promise
    }

    /**
     * Partial update an existing comment
     */
    static async update(sentCommentId: number, partialComment: Partial<CommentDto>) {

        partialComment.id = sentCommentId;

        const existingComment = await this.findById(sentCommentId);
        if (existingComment === null) {
            throw new createError.NotFound("Comment not found.");

        } 
        
        // Check foreign key existence
        if (partialComment.username) {
            const userFk = await UserController.findById(partialComment.username);
            if (userFk === null) {
                throw new createError.BadRequest("User not found.");
            }
        }
        if (partialComment.sightingId) {
            const sightingFk = await SightingController.findById(partialComment.sightingId);
            if (sightingFk === null) {
                throw new createError.BadRequest("Sighting not found.");
            }
        }

        // Update only provided fields
        return existingComment.update(partialComment); // returns a Promise
    }

    /**
     * Delete a comment
     */
    static async delete(sentId: number | undefined) {

        const existingComment = await this.findById(sentId);

        if (existingComment !== null)
            await existingComment.destroy();

        return existingComment; // returns a Promise
    }
}