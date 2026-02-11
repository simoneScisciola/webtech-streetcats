import { Model, FindAndCountOptions, ModelStatic } from 'sequelize'; // Sequelize ORM (https://sequelize.org/)

import { ParsedPagination } from '#types/queryParams.js';


/**
 * Performs pagination on a generic Sequelize Model
 * @param model The model you want to do the query on
 * @param paginationOptions The pagination settings
 * @param queryOptions The findAll options
 * @returns A object containing the query results
 */
export async function findAllPaginated<T extends Model> (model: ModelStatic<T>, paginationOptions: ParsedPagination, queryOptions: FindAndCountOptions = {}) {

    // Add pagination options if they have not been already provided
    queryOptions.offset ??= paginationOptions.offset;
    queryOptions.order ??= paginationOptions.sort;
    queryOptions.limit ??= paginationOptions.limit;

    // Query
    let {count, rows} = await model.findAndCountAll(queryOptions);

    // Force offset and limit to be defined (either from queryOptions or paginationOptions) to do some calculations
    const offset = queryOptions.offset ?? 0;
    const limit = queryOptions.limit ?? paginationOptions.limit;

    // Calculate page informations
    const currentPage = getCurrentPage(offset, limit);
    const totalPages = getTotalPages(count, limit);
    const nextPage = getNextPage(currentPage, totalPages);

    // Build returned object
    return {
        currentPage: currentPage,
        nextPage: nextPage,
        size: limit,
        totalPages: totalPages,
        totalItems: count,
        data: rows
    };
}

function getCurrentPage (offset: number, limit: number) {
    return Math.floor(offset / limit); // It should always be an integer
}

function getNextPage (currentPage: number, totalPages: number) {

    let nextPage = null; // Default

    // There are more pages to show
    if (currentPage + 1 < totalPages)
        nextPage = currentPage + 1;

    return nextPage;
}

function getTotalPages (count: number, limit: number) {
    return Math.ceil(count / limit);
}