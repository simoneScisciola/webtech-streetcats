import express, { Request, Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)


export const healthRouter = express.Router();

/**
 * Health status
 */
healthRouter.get("/health", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ status: 'ok' });
});