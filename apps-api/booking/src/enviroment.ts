import * as v from 'valibot';
import dotenv from 'dotenv';

dotenv.config();

export const EnvironmentSchema = v.object({
  PORT: v.string(),
});

export const environment = v.parse(EnvironmentSchema, process.env);
