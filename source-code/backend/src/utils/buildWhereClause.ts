/** 
 * https://www.helmerdavila.com/blog/en/sequelize-pagination-with-typescript/
 * https://www.bezkoder.com/node-js-sequelize-pagination-mysql/
 * https://medium.com/swlh/server-side-pagination-in-node-js-with-sequelize-orm-and-mysql-73b0190e91fa
 */

import { Op, WhereOptions } from "sequelize"; // Sequelize ORM (https://sequelize.org/)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { ParsedFilters } from "#types/queryParams.js";


/**
 * Object type used to map received parsed filter into desired Sequelize `where` clause
 */
export interface FilterMapping {
    type: 'string' | 'number' | 'boolean' | 'date';
    column: string; // Model column name
    op?: symbol; // Sequelize operator (Op.gte, Op.lte, ...)
}

/**
 * Builds the `where` clause for a Sequelize query
 * @param receivedFilters Object representing a map of filters received as query parameters (e.g. { name: "John", age: "30" })
 * @param desiredFilters Object representing a map of filters that we actually want to expose (e.g. { name: { type: "string", column: "name" }, ageGreaterThen: { type: "number", column: "age", op: Op.gte } })
 * @returns The Sequelize-friendly `where` query option
 */
export function buildWhereClause(receivedFilters: ParsedFilters, desiredFilters: Record<string, FilterMapping>): WhereOptions {

    // Initialize the where query option as empty
    const where: WhereOptions = {};

    // For each filter received
    for (const filter in receivedFilters) {

        // If receivedFilers[filter] is not empty and desiredMapping[filter] exists
        if (receivedFilters[filter] !== "" && desiredFilters[filter]) {

            // Retrieve received fiter value
            const filterValue = receivedFilters[filter];
            
            // Attempt to add where clause (based on expected type)
            switch (desiredFilters[filter].type) {
                case 'string':
                    buildStringWhereClause(where, desiredFilters[filter], filterValue);
                    break;
                case 'number':
                    buildNumberWhereClause(where, desiredFilters[filter], filterValue);
                    break;
                case 'boolean':
                    buildBooleanWhereClause(where, desiredFilters[filter], filterValue);
                    break;
                case 'date':
                    buildDateWhereClause(where, desiredFilters[filter], filterValue);
                    break;
            }
        }
    }

    return where;
}

function buildStringWhereClause(where: Record<string, any>, desiredFilter: FilterMapping, filterValue: string) {
    let column = desiredFilter.column;
    let op = desiredFilter.op;

    where[column] = { [op ?? Op.eq]: filterValue }; // Uses custom op (or Op.eq by default) for exact match on val
}

function buildNumberWhereClause(where: Record<string, any>, desiredFilter: FilterMapping, filterValue: string) {
    let column = desiredFilter.column;
    let op = desiredFilter.op;

    let number = Number(filterValue); // Converts to number

    if (!Number.isNaN(number))
        where[column] = { [op ?? Op.eq]: number }; // Uses custom op (or Op.eq by default) for exact match on val
    else
        throw new createError.BadRequest(`"${column}" query parameter must be a number.`);
}

function buildBooleanWhereClause(where: Record<string, any>, desiredFilter: FilterMapping, filterValue: string) {
    let column = desiredFilter.column;
    let op = desiredFilter.op;

    let bool = filterValue.toLowerCase();

    if (bool === 'true' || bool === 'false')
        where[column] = { [op ?? Op.eq]: (bool === 'true') }; // Uses custom op (or Op.eq by default) for exact match on val
    else
        throw new createError.BadRequest(`"${column}" query parameter must be boolean.`);
}

function buildDateWhereClause(where: Record<string, any>, desiredFilter: FilterMapping, filterValue: string) {
    let column = desiredFilter.column;
    let op = desiredFilter.op;

    let date = new Date(filterValue);

    if (!Number.isNaN(date.getTime()))
        where[column] = { [op ?? Op.eq]: date }; // Uses custom op (or Op.eq by default) for exact match on val
    else
        throw new createError.BadRequest(`"${column}" query parameter must be a date.`);
}