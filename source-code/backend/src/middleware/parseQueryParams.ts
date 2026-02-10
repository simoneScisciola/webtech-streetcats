import { Request, Response, NextFunction, RequestHandler } from "express"; // Express framework (https://expressjs.com/)

import { QueryParams } from "#types/queryParams.js"


// Expected URL: /api/resource?page=0&size=20&filter1=value1&sort=field1,direction1&sort=field2,direction2

/**
 * Handles parsing of received query parameters. Attaches `pagination` and `filters` object to `req` object.
 * - It will ignore multiple page and size parameters (it will use only the first one).
 * - Accepts multiple sort parameters only in the form: `sort=field,direction` or `sort=field`. Ignores wrongly formatted parameters.
 *      - If no direction is specified, it will use `ASC` direction.
 *      - Accepted directions are: `ASC`, `DESC`, `ASC NULLS FIRST`, `DESC NULLS FIRST`, `ASC NULLS LAST`, `DESC NULLS LAST`.
 * @param req HTTP Request object
 * @param res HTTP Response object to send
 * @param next Callback function to call the next middleware in the chain
 */
export const parseQueryParams: RequestHandler = (req: Request, res: Response, next: NextFunction) => {

    const { 
        pagination,
        filters
    } = paginationParamsExtractor(req.query);

    // Attach to request object
    req.pagination = pagination;
    req.filters = filters;

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

    // If we actually have a page query parameter, parse it
    if (receivedPage !== undefined) {

        // If it is a string array, use the first value and ignore the others
        if (Array.isArray(receivedPage)) {
            receivedPage = receivedPage[0];
        }
        
        // If "page" is less then BASE_PAGE, sets BASE_PAGE
        // If "page" is not a valid value, sets BASE_PAGE
        page = Math.max(MIN_PAGE, parseInt(receivedPage, 10) || MIN_PAGE) 
    }

    return page;
}

function parseSize(receivedSize: receivedParameter, defaultSize: number = 20): number {

    // Sets limit for "size"
    const MIN_SIZE = 1;
    const MAX_SIZE = 100

    let size: number = defaultSize; // Default

    // If we actually have a size query parameter, parse it
    if (receivedSize !== undefined) {

        // If it is a string array, use the first value and ignore the others
        if (Array.isArray(receivedSize)) {
            receivedSize = receivedSize[0];
        }

        // If "size" is less then MIN_SIZE, sets MIN_SIZE
        // If "size" is not a valid value, sets defaultSize
        size = Math.max(MIN_SIZE, parseInt(receivedSize, 10) || defaultSize);

        // If "size" is more then MAX_SIZE, sets MAX_SIZE
        size = Math.min(MAX_SIZE, size);
    }

    return size;
}

function parseSort(receivedSort: receivedParameter, delimiter: string = ","): Array<[string, string]> {

    // Allowed directions for Sequelize
    const ALLOWED_DIRECTIONS = ["ASC", "DESC", "ASC NULLS FIRST", "DESC NULLS FIRST", "ASC NULLS LAST", "DESC NULLS LAST"];

    let sort: Array<[string, string]> = []; // Default

    // If we actually have one (or more) sort query parameter
    if (receivedSort !== undefined) {

        // Temp array
        let receivedItems: string[] = [];

        if (typeof receivedSort === "string") { // If it is a single string, put it inside the receivedItems array
            receivedItems.push(receivedSort);
        } else if (Array.isArray(receivedSort)) { // If it is already a string array, use it
            receivedItems = receivedSort;
        }

        for (let rawItem of receivedItems) { 
            let parsedItem = rawItem // Every rawItem should be a string like this: "field,direction" or "field"
                                .split(delimiter) // Now it should be a string array like this: "["field", "direction"]" or "["field"]"
                                .map(item => item.trim()) // For every item in the array, remove all starting and trailing spaces
                                .filter(item => item !== ""); // For every item in the array, remove the empty ones

            // Retrieve received parsed values
            let parsedField: string | undefined = parsedItem[0];
            let parsedDirection: string | undefined = parsedItem[1]?.toUpperCase();

            // If parsedField is defined and it's not a "direction"
            if (parsedField != undefined && !ALLOWED_DIRECTIONS.includes(parsedField)) {

                // Every parsedItem should be a string array like this: "["field", "direction"]" or "["field"]"

                let direction: string = "ASC"; // Default
                if (ALLOWED_DIRECTIONS.includes(parsedDirection)) { // If parsedDirection is valid, use it instead of default one
                    direction = parsedDirection;
                }

                // Add parsed values to sort array (ignores parsedItem[2], parsedItem[3]...)
                sort.push([parsedField, direction]);
            }
        }
    }
    
    return sort;
}