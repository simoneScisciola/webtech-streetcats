import express from "express"; // Express framework (https://expressjs.com/)
import cors from "cors"; // Cors middleware (https://expressjs.com/en/resources/middleware/cors.html)
import helmet from "helmet"; // Helmet middleware for security-related HTTP headers (https://helmetjs.github.io/)
import { rateLimit } from "express-rate-limit"; // Rate limiter to mitigate brute-force attacks (https://www.npmjs.com/package/express-rate-limit)
import fs from "node:fs"; // Node utility to manage file system

import "#config/env.js"
import { UPLOAD_SIGHTING_PHOTO_DIR } from "#config/multer.js";
import { logger } from "#logging/logger.js";
import { setupMorgan } from "#logging/httpLogger.js";

import { errorHandler } from "#middleware/errorHandler.js"
import { parseQueryParams } from "#middleware/parseQueryParams.js"
import { sanitizeInput } from "#middleware/sanitizeInput.js"

import { catchAllRouter } from "#routes/CatchAllRouter.js";
import { authRouter } from "#routes/AuthRouter.js";
import { userRoleRouter } from "#routes/UserRoleRouter.js";
import { userRouter } from "#routes/UserRouter.js";
import { sightingRouter } from "#routes/SightingRouter.js";
import { commentRouter } from "#routes/CommentRouter.js";


const app = express();
const PORT = 3000;


// Register the morgan logging middleware, use the 'dev' format
setupMorgan(app);


// Build directory for users' sightings photo uploads, if not exists
fs.mkdirSync(UPLOAD_SIGHTING_PHOTO_DIR, { recursive: true });


// Set a suite of HTTP response headers that improve security against well-known web vulnerabilities
app.use(helmet({
    strictTransportSecurity: false, // Disable HSTS, since we are not on HTTPS
}));


// Set the CORS middleware
const FRONTEND_ADDRESS = process.env.FRONTEND_ADDRESS;
const FRONTEND_PORT = process.env.FRONTEND_PORT;

app.use(cors({
    origin: `http://${FRONTEND_ADDRESS}:${FRONTEND_PORT}`,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Limit the JSON body size to 100 KB in order to prevents Denial-of-Service attacks via excessively large payloads
app.use(express.json({ limit: '100kb' }));


// Cap each IP to a certain requests number per time window in order to mitigates flooding attacks and brute-force attempts
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minute sliding window
    max: 100, // Maximum requests per window per IP
    standardHeaders: "draft-8", // Return `RateLimit-*` headers (RFC draft 8)
    legacyHeaders: false, // Disable the deprecated `X-RateLimit-*` headers
    message: {
        error: "Too many requests, please try again later."
    },
});

// Apply the rate limiter globally to all routes
app.use(limiter);


// Parse the query parameters of incoming requests
app.use(parseQueryParams);


// Sanitize all string fields in req.body using DOMPurify in order to prevent stored/reflected XSS
app.use(sanitizeInput);


// Define API routes
app.use(authRouter);
app.use(userRoleRouter);
app.use(userRouter);
app.use(sightingRouter);
app.use(commentRouter);
app.use(catchAllRouter); // Catch all, if we get here it's a 404


// Register the Error Handler
app.use(errorHandler);


// Listening for incoming requests
app.listen(PORT, () => {
    logger.info(`Server running on (container) port ${PORT}`);
});