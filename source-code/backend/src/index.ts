import express, { Request, Response, NextFunction } from "express"; // Express framework (https://expressjs.com/)
import morgan from "morgan"; // Logging middleware (http://expressjs.com/en/resources/middleware/morgan.html)
import cors from "cors"; // Cors middleware (https://expressjs.com/en/resources/middleware/cors.html)
import createError from "http-errors" // HTTP errors middleware (https://www.npmjs.com/package/http-errors)

import "#config/env.js"
import { errorHandler } from '#middleware/errorHandler.js'
import { authRouter } from "#routes/authRouter.js";
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

// Define API routes
app.use(authRouter);
//app.use(enforceAuthentication);
//app.use(todoRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
    console.log("Response sent");
});

// Catch all, if we get here it's a 404
app.get('/*splat', (req: Request, res: Response, next: NextFunction) => {
    next(new createError.NotFound); // Raise error
});

// Register the Error Handler
app.use(errorHandler);

// Listening for incoming requests
app.listen(PORT, () => {
    console.log(`Server running on (container) port ${PORT}`);
});