import 'dotenv/config';

interface EnvVariables {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URI: string;
  INNGEST_EVENT_KEY: string;
  INNGEST_SIGNING_KEY: string;
  STREAM_API_KEY: string;
  STREAM_API_SECRET: string;
  CLIENT_URL: string;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is missing`);
  }
  return value;
}

export const ENV: EnvVariables = {
  PORT: Number(requireEnv('PORT')),
  NODE_ENV: requireEnv('NODE_ENV'),
  DATABASE_URI: requireEnv('DATABASE_URI'),
  INNGEST_EVENT_KEY: requireEnv('INNGEST_EVENT_KEY'),
  INNGEST_SIGNING_KEY: requireEnv('INNGEST_SIGNING_KEY'),
  STREAM_API_KEY: requireEnv('STREAM_API_KEY'),
  STREAM_API_SECRET: requireEnv('STREAM_API_SECRET'),
  CLIENT_URL: requireEnv('CLIENT_URL'),
};