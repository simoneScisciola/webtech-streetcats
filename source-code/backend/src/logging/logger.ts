import winston from 'winston'; // Color-based logging (https://www.npmjs.com/package/winston)


const { combine, timestamp, printf, colorize, errors } = winston.format;

// Personalized color-level mapping
winston.addColors({
    error: 'red bold',
    warn: 'yellow',
    info: 'green',
    http: 'white',
    verbose: 'magenta',
    debug: 'cyan',
    silly: 'blue',
});

const logFormat = printf(({ level, message, timestamp, label, stack }) => {
    const msg = stack ?? message;
    return `${timestamp} [${label ?? 'APP'}] ${level} — ${msg}`;
});

export const logger = winston.createLogger({
    levels: winston.config.npm.levels, // error, warn, info, http, verbose, debug, silly
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        errors({ stack: true }),
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [new winston.transports.Console()],
});