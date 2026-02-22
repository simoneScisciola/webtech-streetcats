import { Request, Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import multer from "multer"; // Multer middleware (https://expressjs.com/en/resources/middleware/multer.html)
import createError from "http-errors"; // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import { uploadSightingPhoto } from '#config/multer.js';


/**
 * Runs Multer and populates res.locals.photoUrl from req.file. If there are any error, it converts them to proper HTTP errors
 * If no file is uploaded, the middleware is a no-op.
 */
export function parseSightingPhotoUpload(req: Request, res: Response, next: NextFunction): void {
    uploadSightingPhoto(req, res, (err) => {

        // If multer gave error in uploadSightingPhoto, convert to HTTP error
        if (err) {

            // File too big
            if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                return next(new createError.PayloadTooLarge('Photo exceeds the 5 MB size limit.'));
            }

            // File type not supported
            if (err instanceof Error && err.message.startsWith('Only')) {
                return next(new createError.UnsupportedMediaType(err.message));
            }

            // Forward other errors
            return next(err);
        }

        // File present and correctly parsed
        if (req.file) {

            // Save file relative URL
            res.locals.photoUrl = `/uploads/sightings/${req.file.filename}`;
        }

        next();
    });
}