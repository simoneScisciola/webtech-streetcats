import createError from "http-errors"; // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { Sighting } from "#config/database.js";
import { SightingDto } from "#types/dto/SightingDto.js";
import { ParsedPagination } from "#types/queryParams.js";
import { findAllPaginated } from "#utils/findAllPaginated.js";
import { UserController } from "#controllers/UserController.js";
import { deleteUploadedFile } from '#utils/fileUtils.js';


export class SightingController {

    /**
     * Create a new sighting
     */
    static async create(sentSighting: SightingDto) {

        // Check foreign key existence
        if (sentSighting.username) {
            const userFk = await UserController.findById(sentSighting.username);
            if (userFk === null) {
                throw new createError.BadRequest("User not found.");
            }
        }

        // Cast is safe: `validateSightingFields(false)` already guarantees photoUrl is present for POST
        return Sighting.create(sentSighting as Required<Pick<SightingDto, "photoUrl">> & SightingDto); // returns a Promise
    }

    /**
     * Find sighting by primary key (id)
     */
    static async findById(sentId: number | undefined) {

        return Sighting.findByPk(sentId); // returns a Promise
    }

    /**
     * Find all sightings with pagination
     */
    static async findAll(pagination: ParsedPagination) {

        return findAllPaginated(Sighting, pagination); // returns a Promise
    }

    /**
     * Full update an existing sighting
     */
    static async replace(sentSightingId: number, fullSighting: SightingDto) {

        fullSighting.id = sentSightingId;

        const existingSighting = await this.findById(sentSightingId);
        if (existingSighting === null) {
            throw new createError.NotFound("Sighting not found.");
        } 
        
        // Check foreign key existence
        if (fullSighting.username !== null) {
            const userFk = await UserController.findById(fullSighting.username);
            if (userFk === null) {
                throw new createError.BadRequest("User not found.");
            }
        }

        // Delete the old uploaded photo if it is being replaced with a new one.
        // `"photoUrl" in partialSighting` guards against treating a missing key (field not sent) as an intentional removal.
        if (
            existingSighting.photoUrl &&
            "photoUrl" in fullSighting &&                       // field was explicitly provided
            fullSighting.photoUrl !== existingSighting.photoUrl // value actually changed
        ) {
            try {
                await deleteUploadedFile(existingSighting.photoUrl);
            } catch (err) {
                // Old file could not be deleted, so clean up the newly uploaded file to avoid orphans
                if (fullSighting.photoUrl) {
                    await deleteUploadedFile(fullSighting.photoUrl);
                }
                throw err; // Propagate the original error
            }
        }

        // Update all fields
        return existingSighting.update({
            id: sentSightingId,
            photoUrl: fullSighting.photoUrl,
            title: fullSighting.title,
            description: fullSighting.description ?? null,
            latitude: fullSighting.latitude,
            longitude: fullSighting.longitude,
            address: fullSighting.address ?? null
        }); // returns a Promise
    }

    /**
     * Partial update an existing sighting
     */
    static async update(sentSightingId: number, partialSighting: Partial<SightingDto>) {

        partialSighting.id = sentSightingId;

        const existingSighting = await this.findById(sentSightingId);
        if (existingSighting === null) {
            throw new createError.NotFound("Sighting not found.");
        }

        // Check foreign key existence
        if (partialSighting.username) {
            const userFk = await UserController.findById(partialSighting.username);
            if (userFk === null) {
                throw new createError.BadRequest("User not found.");
            }
        }

        // Delete the old uploaded photo if it is being replaced with a new one.
        // `"photoUrl" in partialSighting` guards against treating a missing key (field not sent) as an intentional removal.
        if (
            existingSighting.photoUrl &&
            "photoUrl" in partialSighting &&                        // field was explicitly provided
            partialSighting.photoUrl !== existingSighting.photoUrl  // value actually changed
        ) {
            try {
                await deleteUploadedFile(existingSighting.photoUrl);
            } catch (err) {
                // Old file could not be deleted, so clean up the newly uploaded file to avoid orphans
                if (partialSighting.photoUrl) {
                    await deleteUploadedFile(partialSighting.photoUrl);
                }
                throw err; // Propagate the original error
            }
        }

        // Update only provided fields
        return existingSighting.update(partialSighting); // returns a Promise
    }

    /**
     * Delete a sighting
     */
    static async delete(sentId: number | undefined) {

        const existingSighting = await this.findById(sentId);

        if (existingSighting !== null) {
            // Remove the associated photo before deleting the DB record
            if (existingSighting.photoUrl) {
                await deleteUploadedFile(existingSighting.photoUrl);
            }

            await existingSighting.destroy();            
        }

        return existingSighting; // returns a Promise
    }
}