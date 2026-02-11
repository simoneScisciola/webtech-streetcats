// Required environment variables values validation

import { logger } from "#logging/logger.js";

// List of all required environment variables
const requiredEnv = [
    'JWT_SECRET_TOKEN',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
];

// Required environment variables check
requiredEnv.forEach((key) => {
    logger.debug(`Checking environment variable "${key}"...`);
    if (!process.env[key]) {
        logger.error(`The environment variable "${key}" is missing.`);
        process.exit(1);
    }
    logger.debug(`${key} found`);
});