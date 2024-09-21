import dotenv from 'dotenv';
import * as v from 'valibot';

dotenv.config();

export const EnvironmentSchema = v.object({
  PORT: v.string(),
});

export const environment = v.parse(EnvironmentSchema, process.env);
