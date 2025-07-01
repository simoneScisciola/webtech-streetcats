// Required environment variables values validation

// List of all required environment variables
const requiredEnv = [
    'JWT_SECRET_TOKEN',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
];

// Required environment variables check
requiredEnv.forEach((key) => {
    console.log(`Checking environment variable "${key}"...`);
    if (!process.env[key]) {
        console.error(`The environment variable "${key}" is missing.`);
        process.exit(1);
    }
    console.log(`${key} found`);
});