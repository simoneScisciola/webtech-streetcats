import winston from 'winston'; // Color-based logging (https://www.npmjs.com/package/winston)

declare module 'winston' {
    interface Logger {
        http(message: string): Logger;
    }
}