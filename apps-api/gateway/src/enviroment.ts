import dotenv from 'dotenv';
import * as v from 'valibot';

dotenv.config();

export const EnvironmentSchema = v.object({
  PORT: v.string(),
  BOOKING_GRPC_URL: v.string(),
});

export const environment = v.parse(EnvironmentSchema, process.env);
