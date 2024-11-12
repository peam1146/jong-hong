import dotenv from 'dotenv';
import * as v from 'valibot';

dotenv.config();

export const EnvironmentSchema = v.object({
  PORT: v.string(),
  AUTH_SERVICE_URL: v.string(),
  ROOM_SERVICE_URL: v.string(),
  PENALTY_SERVICE_URL: v.string(),
});

export const environment = v.parse(EnvironmentSchema, process.env);
