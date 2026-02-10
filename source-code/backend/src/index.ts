import express, { Request, Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import morgan from "morgan"; // Logging middleware (http://expressjs.com/en/resources/middleware/morgan.html)
import cors from "cors"; // Cors middleware (https://expressjs.com/en/resources/middleware/cors.html)

import "#config/env.js"
import { errorHandler } from '#middleware/errorHandler.js'
import { parseQueryParams } from '#middleware/parseQueryParams.js'
import { authRouter } from "#routes/AuthRouter.js";
import { catchAllRouter } from "#routes/CatchAllRouter.js";
//import { enforceAuthentication } from "./middleware/authorization.js";
//import { todoRouter } from "./routes/todoRouter.js";


const app = express();
const PORT = 3000;

// Register the morgan logging middleware, use the 'dev' format
app.use(morgan('dev'));

// Register the cors middleware
app.use(cors());

// Parse the JSON payload of incoming requests
app.use(express.json());

// Parse the query parameters of incoming requests
app.use(parseQueryParams);

// Define API routes
app.use(authRouter);
//app.use(enforceAuthentication);
//app.use(todoRouter);
app.use(catchAllRouter); // Catch all, if we get here it's a 404

// Register the Error Handler
app.use(errorHandler);

// Listening for incoming requests
app.listen(PORT, () => {
    console.log(`Server running on (container) port ${PORT}`);
});