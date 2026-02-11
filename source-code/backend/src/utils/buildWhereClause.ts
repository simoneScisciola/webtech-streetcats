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
    allowInOp?: boolean; // Whether to allow the use of Op.in operator for multiple values (e.g. citizenship=Italy,USA,Canada)
}

/**
 * Builds the `where` clause for a Sequelize query
 * @param receivedFilters Object representing a map of filters received as query parameters (e.g. { name: "John", age: "30", citizenship="Italy,USA,Canada" })
 * @param desiredFilters Object representing a map of filters that we actually want to expose (e.g. { name: { type: "string", column: "name" }, ageGreaterThen: { type: "number", column: "age", op: Op.gte } })
 * @returns The ready-to-use Sequelize `where` query option
 */
export function buildWhereClause(receivedFilters: ParsedFilters, desiredFilters: Record<string, FilterMapping>): WhereOptions {

    // Initialize the where query option as empty
    const where: WhereOptions = {};

    // For each filter received
    for (const filter in receivedFilters) {

        // If receivedFilers[filter] is not empty and desiredMapping[filter] exists
        if (receivedFilters[filter] !== "" && desiredFilters[filter]) {
            addWhereFilters(where, desiredFilters[filter], receivedFilters[filter]);
        }
    }

    return where;
}

function addWhereFilters(where: Record<string, any>, desiredFilter: FilterMapping, filterValue: string) {

    // Retrieve desired filter settings
    const { column, type, op, allowInOp } = desiredFilter;

    // If filter value is a list of values separated by ","
    const filterValuesList = allowInOp && filterValue.includes(',')
        ? filterValue.split(',').map(filterValue => filterValue.trim()) // Split by separator and delete starting and trailing whitespaces
        : [filterValue]; // Filter value is a single value

    // Attempt to parse each filter value, based on expected type
    const parsedFilterValues = filterValuesList.map(filterValue => parseFilterValueByType(type, filterValue, column));

    
    // Every filter is combined through the "AND" logical operator

    // Use Op.in if filter value is a list of values (e.g. citizenship=Italy,USA,Canada)
    if (parsedFilterValues.length > 1) {
        where[column] = {
            [Op.in]: parsedFilterValues
        };
    } else { // Use custom Op (or Op.eq by default) for exact match on value (e.g. name=John)
        where[column] = {
            [op ?? Op.eq]: parsedFilterValues[0] 
        };
    }
}

function parseFilterValueByType(type: FilterMapping['type'], filterValue: string, column: string): any {
    switch (type) {
        case 'string':
            return filterValue;

        case 'number': {
            const numberValue = Number(filterValue); // Converts to number

            if (Number.isNaN(numberValue))
                throw new createError.BadRequest(`"${column}" query parameter must be a number.`);
            return numberValue;
        }

        case 'boolean': {
            const booleanValue = filterValue.toLowerCase();

            if (booleanValue !== 'true' && booleanValue !== 'false')
                throw new createError.BadRequest(`"${column}" query parameter must be boolean.`);
            return booleanValue === 'true';
        }

        case 'date': {
            const dateValue = new Date(filterValue);

            if (Number.isNaN(dateValue.getTime()))
                throw new createError.BadRequest(`"${column}" query parameter must be a date.`);
            return dateValue;
        }
    }
}