// This way TypeScript knows that these environment variables exist and have these types
// NOTE! They actually exist since we check it in "index.ts"
declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET_TOKEN: string;
        DB_NAME: string;
        DB_USER: string;
        DB_PASSWORD: string;
    }
}
