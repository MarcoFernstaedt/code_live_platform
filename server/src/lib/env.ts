import 'dotenv/config';

export const ENV = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URI: process.env.DATABASE_URI,
};