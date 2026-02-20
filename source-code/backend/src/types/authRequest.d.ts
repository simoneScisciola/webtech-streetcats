import { Request } from "express"; // Express framework (https://expressjs.com/)


// Add authorization info to the Request type
export interface AuthRequest extends Request {
    user?: string;
    role?: string;
}