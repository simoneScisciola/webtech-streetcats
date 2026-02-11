import { Application } from 'express'; // Express framework (https://expressjs.com/)
import morgan from "morgan"; // HTTP logging middleware (http://expressjs.com/en/resources/middleware/morgan.html)

import { logger } from "#logging/logger.js";

/**
 * Registers the Morgan HTTP logger and redirects output to Winston
 */
export function setupMorgan(app: Application): void {
    const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

    app.use(
        morgan(format, {
            stream: {
                write: (message: string) => {
                    // Morgan adds a newline at the end, so we trim it before logging
                    logger.http(message.trim());
                },
            },
        })
    );
}