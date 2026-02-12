import createError from "http-errors"; // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { Comment } from "#config/database.js";
import { CommentDto } from "#types/dto/CommentDto.js";
import { ParsedPagination } from "#types/queryParams.js";
import { findAllPaginated } from "#utils/findAllPaginated.js";


export class CommentController {

    /**
     * Create a new comment
     */
    static async create(sentComment: CommentDto) {

        return Comment.build(sentComment).save(); // returns a Promise
    }

    /**
     * Find comment by primary key (id)
     */
    static async findById(sentId: number) {

        return Comment.findByPk(sentId); // returns a Promise
    }

    /**
     * Find all comments with pagination
     */
    static async findAll(pagination: ParsedPagination) {

        return findAllPaginated(Comment, pagination); // returns a Promise
    }

    /**
     * Update an existing comment
     */
    static async update(sentId: number, updatedComment: Partial<CommentDto>) {

        const existingComment = await this.findById(sentId);

        if (existingComment === null) {
            throw new createError.NotFound("Comment not found.");

        } else {

            // Update only provided fields
            existingComment.set(updatedComment);

            return existingComment.save(); // returns a Promise
        }
    }

    /**
     * Delete a comment
     */
    static async delete(sentId: number) {

        const existingComment = await this.findById(sentId);

        if (existingComment !== null)
            await existingComment.destroy();

        return existingComment; // returns a Promise
    }
}