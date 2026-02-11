import { Request, Response, NextFunction, RequestHandler } from "express"; // Express framework (https://expressjs.com/)

import { logger } from "#logging/logger.js";
import { QueryParams } from "#types/queryParams.js";


// Expected URL: /api/resource?page=0&size=20&filter1=value1&sort=field1,direction1&sort=field2,direction2

/**
 * Handles parsing of received query parameters. Attaches `pagination` and `filters` object to `req` object.
 * - Accepts multiple sort parameters only in the form: `sort=field,direction` or `sort=field`. Ignores wrongly formatted parameters.
 *      - If no direction is specified, it will use `ASC` direction.
 *      - Accepted directions are: `ASC`, `DESC`, `ASC NULLS FIRST`, `DESC NULLS FIRST`, `ASC NULLS LAST`, `DESC NULLS LAST`.
 * - It will ignore multiple page and size parameters (it will use only the last one).
 * - It will ignore duplicated fileds in sort parameters (it will use only the last one).
 * @param req HTTP Request object
 * @param res HTTP Response object to send
 * @param next Callback function to call the next middleware in the chain
 */
export const parseQueryParams: RequestHandler = (req: Request, res: Response, next: NextFunction) => {

    logger.verbose("Middleware: parseQueryParams");

    const { 
        pagination,
        filters
    } = paginationParamsExtractor(req.query);

    // Attach to request object
    req.pagination = pagination;
    req.filters = filters;

    logger.verbose(`parseQueryParams output: ${JSON.stringify({ pagination, filters })}`);

    next();
}

/**
 * Extracts pagination parameters and filters from a query string.
 * @param receivedQuery Object representing the received query parameters, such as Express req.query
 * @returns Object containing the extracted pagination parameters and filters: `{ pagination: {...}, filters: {...} }`
 */
function paginationParamsExtractor(receivedQuery: Record<string, any>): QueryParams {

    const OPTIONS_DEFAULT_SIZE = 20;
    const OPTIONS_DEFAULT_DELIMITER = ",";

    // Extracts "page", "size", "orderBy", "orderDirection" and all other filters as string
    let {
        page,
        size,
        sort,
        ...filters
    } = receivedQuery;

    // Parsing extracted values
    const parsedPage = parsePage(page);
    const parsedSize = parseSize(size, OPTIONS_DEFAULT_SIZE);
    const parsedSort = parseSort(sort, OPTIONS_DEFAULT_DELIMITER);

    // Returns the parsed object with correct typing and compute the correct `limit` and `offset` values
    // NOTE! We are assuming that minimum page size is 1 and minimum page index is 0
    return {
        pagination: {
            page: parsedPage,
            size: parsedSize,

            limit: parsedSize,
            offset: parsedPage * parsedSize,
            sort: parsedSort
        },
        filters // If there are no further filters, it'll be "{}"
    };
}

type receivedParameter = string | string[] | undefined;

function parsePage(receivedPage: receivedParameter): number {
    
    // Sets limit for "page"
    const MIN_PAGE = 0;

    let page: number = MIN_PAGE; // Default
    let pageStr: string | undefined = undefined;

    // If we actually have a page query parameter, parse it
    if (receivedPage !== undefined) {

        // If it is a string array, use the last value and ignore the others
        if (Array.isArray(receivedPage)) {
            pageStr = receivedPage.at(-1);
        } else {
            pageStr = receivedPage;
        }

        // Parse "size" and, if it's not a valid number, sets MIN_PAGE
        const parsedPage = parseInt(pageStr ?? MIN_PAGE.toString(), 10);

        // If "page" is not a valid value, sets MIN_PAGE
        // If "page" is less then MIN_PAGE, sets MIN_PAGE
        page = isNaN(parsedPage) ? MIN_PAGE : Math.max(MIN_PAGE, parsedPage); 
    }

    logger.debug(`Parsed page: ${page}`);

    return page;
}

function parseSize(receivedSize: receivedParameter, defaultSize: number = 20): number {

    // Sets limit for "size"
    const MIN_SIZE = 1;
    const MAX_SIZE = 100;

    let size: number = defaultSize; // Default
    let sizeStr: string | undefined = undefined;

    // If we actually have a size query parameter, parse it
    if (receivedSize !== undefined) {

        // If it is a string array, use the last value and ignore the others
        if (Array.isArray(receivedSize)) {
            sizeStr = receivedSize.at(-1);
        } else {
            sizeStr = receivedSize;
        }

        // Parse "size" and, if it's not a valid number, sets defaultSize
        const parsedSize = parseInt(sizeStr ?? defaultSize.toString(), 10);
        
        // If "size" is not a valid value, sets defaultSize.
        // If "size" is less then MIN_SIZE, sets MIN_SIZE
        size = isNaN(parsedSize) ? defaultSize : Math.max(MIN_SIZE, parsedSize);

        // If "size" is more then MAX_SIZE, sets MAX_SIZE
        size = Math.min(MAX_SIZE, size);
    }

    logger.debug(`Parsed size: ${size}`);

    return size;
}

function parseSort(receivedSort: receivedParameter, delimiter: string = ","): Array<[string, string]> {

    // Allowed directions for Sequelize
    const ALLOWED_DIRECTIONS = ["ASC", "DESC", "ASC NULLS FIRST", "DESC NULLS FIRST", "ASC NULLS LAST", "DESC NULLS LAST"];

    let sortArray: Array<[string, string]> = []; // Default

    // Always convert receivedSort into string array array di stringhe
    let items: string[] = [];
    if (receivedSort === undefined)
        items = [];
    else if (Array.isArray(receivedSort))
        items = receivedSort;
    else
        items = [receivedSort];

    const includedSortFields = new Set<string>(); // Contains all the fileds we already have in sortArray, to check for duplicates

    for (const rawItem of items) {
        const [field, direction] = rawItem // Every rawItem should be a string like this: "field,direction" or "field"
            .split(delimiter) // Now it should be a string array like this: "["field", "direction"]" or "["field"]"
            .map(item => item.trim()) // For every item in the array, remove all starting and trailing spaces
            .filter(item => item !== ""); // For every item in the array, remove the empty ones

        // If parsing result is an empty array, ignore it and continue with the next one
        if (!field) continue;

        // Now it should be a array like this: "["field", "direction"]" or "["field"]"
        // If parsedField is defined and it's not a "direction"
        if (!ALLOWED_DIRECTIONS.includes(field.toUpperCase())) {
            const filteredDirection = ALLOWED_DIRECTIONS.includes(direction?.toUpperCase()) // If parsedDirection is valid, use it. Otherwise, use "ASC".
                ? direction!.toUpperCase() 
                : "ASC";
            
            // If "parsedField" is already present, remove the old one and insert the newer one
            if (includedSortFields.has(field)) {
                const index = sortArray.findIndex(([f]) => f === field);
                if (index !== -1) sortArray.splice(index, 1);
            }

            // Add last value to the end
            sortArray.push([field, filteredDirection]);
            includedSortFields.add(field);
        }
    }

    logger.debug(`Parsed sort: ${JSON.stringify(sortArray)}`);
    
    return sortArray;
}