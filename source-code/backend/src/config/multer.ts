import { Request } from "express"; // Express framework (https://expressjs.com/)
import multer from "multer"; // Multer middleware (https://expressjs.com/en/resources/middleware/multer.html)
import path from "node:path"; // Node utility to manage paths cross-platform
import crypto from "node:crypto"; // Node utility to build unique file names


// Config constants
export const UPLOAD_SIGHTING_PHOTO_DIR = path.join(process.cwd(), 'uploads', 'sightings');
const ACCEPTED_SIGHTING_PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_SIGHTING_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Multer configs function for sighting photo upload middleware.
 * Expects a single file under the field name `photo`.
 */
export const uploadSightingPhoto = multer({

    // Files saving on disk
    storage: multer.diskStorage({

        // Defines where will files saved
        destination: (_req, _file, cb) => cb(null, UPLOAD_SIGHTING_PHOTO_DIR),

        // Builds file name
        filename: (_req, file, cb) => {

            // Parse incoming file extension
            const fileExtension = path.extname(file.originalname).toLowerCase();

            // Parse actual date
            const now = new Date();
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');

            // Unique identifier
            const unique = crypto.randomBytes(4).toString('hex');

            cb(null, `${yyyy}${mm}${dd}-sighting-${unique}${fileExtension}`);
        },

    }),

    // File constraints
    limits: {
        fileSize: MAX_SIGHTING_PHOTO_SIZE_BYTES
    },
    fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (ACCEPTED_SIGHTING_PHOTO_TYPES.has(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG and WEBP images are allowed.'));
        }
    },

}).single('photo');