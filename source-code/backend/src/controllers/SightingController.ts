import createError from "http-errors"; // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { Sighting } from "#config/database.js";
import { SightingDto } from "#types/dto/SightingDto.js";
import { ParsedPagination } from "#types/queryParams.js";
import { findAllPaginated } from "#utils/findAllPaginated.js";


export class SightingController {

    /**
     * Create a new sighting
     */
    static async create(sentSighting: SightingDto) {

        return Sighting.build(sentSighting).save(); // returns a Promise
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
     * Update an existing sighting
     */
    static async update(sentSightingId: number, updatedSighting: Partial<SightingDto>) {

        const existingSighting = await this.findById(sentSightingId);

        if (existingSighting === null) {
            throw new createError.NotFound("Sighting not found.");

        } else {

            // Update only provided fields
            existingSighting.set(updatedSighting);

            return existingSighting.save(); // returns a Promise
        }
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