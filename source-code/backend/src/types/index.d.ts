import { ParsedPagination, ParsedFilters } from "#types/queryParams.js";

// This way TypeScript knows that these custom request fields exist and have these types
// NOTE! They actually exist since defaults are generated in "index.ts"
declare global {
    namespace Express {
        interface Request {
            pagination: ParsedPagination;
            filters: ParsedFilters;
        }
    }
}