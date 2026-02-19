import express from "express"; // Express framework (https://expressjs.com/)
import cors from "cors"; // Cors middleware (https://expressjs.com/en/resources/middleware/cors.html)

import "#config/env.js"
import { logger } from "#logging/logger.js";
import { setupMorgan } from "#logging/httpLogger.js";

import { errorHandler } from '#middleware/errorHandler.js'
import { parseQueryParams } from '#middleware/parseQueryParams.js'

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

// Register the cors middleware
const FRONTEND_ADDRESS = process.env.FRONTEND_ADDRESS;
const FRONTEND_PORT = process.env.FRONTEND_PORT;

app.use(cors({
    origin: `http://${FRONTEND_ADDRESS}:${FRONTEND_PORT}`,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse the JSON payload of incoming requests
app.use(express.json());

// Parse the query parameters of incoming requests
app.use(parseQueryParams);

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