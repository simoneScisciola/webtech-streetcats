/**
 * Type of parsed pagination parameters and filters object
 */
export interface QueryParams {
    pagination: ParsedPagination;
    filters: ParsedFilters;
}

/**
 * Type of parsed pagination parameters object
 */
export interface ParsedPagination {
    page: number;
    size: number;
    limit: number;
    offset: number;
    sort: Array<[string, string]>;
}

/**
 * Type of parsed filters object
 */
export type ParsedFilters = Record<string, string>;