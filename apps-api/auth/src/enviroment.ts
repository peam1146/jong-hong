import dotenv from 'dotenv';
import * as v from 'valibot';

dotenv.config();

export const EnvironmentSchema = v.object({
  PORT: v.string(),
  REDIS_PORT: v.string(),
  KAFKA_URL: v.string(),
  GOOGLE_CLIENT_ID: v.string(),
  GOOGLE_SECRET: v.string(),
  JWT_SECRET: v.string(),
  JWT_EXPIRE_IN: v.string(),
  SERVER_DOMAIN: v.string(),
  MONGO_URI: v.string(),
  MONGO_USER: v.string(),
  MONGO_PASS: v.string(),
  MONGO_DBNAME: v.string(),
});

export const environment = v.parse(EnvironmentSchema, process.env);
