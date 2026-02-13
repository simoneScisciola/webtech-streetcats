import createError from "http-errors"; // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { Sighting } from "#config/database.js";
import { SightingDto } from "#types/dto/SightingDto.js";
import { ParsedPagination } from "#types/queryParams.js";
import { findAllPaginated } from "#utils/findAllPaginated.js";
import { UserController } from "#controllers/UserController.js";


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

        return Sighting.create(sentSighting); // returns a Promise
    }

    /**
     * Find sighting by primary key (id)
     */
    static async findById(sentId: number) {

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

        // Update only provided fields
        return existingSighting.update(partialSighting); // returns a Promise
    }

    /**
     * Delete a sighting
     */
    static async delete(sentId: number) {

        const existingSighting = await this.findById(sentId);

        if (existingSighting !== null)
            await existingSighting.destroy();

        return existingSighting; // returns a Promise
    }
}