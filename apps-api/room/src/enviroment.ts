import dotenv from 'dotenv';
import * as v from 'valibot';

dotenv.config();

export const EnvironmentSchema = v.object({
  GRPC_PORT: v.string(),
  DATABASE_URL: v.string(),
  KAFKA_URL: v.string(),
});

export const environment = v.parse(EnvironmentSchema, process.env);
