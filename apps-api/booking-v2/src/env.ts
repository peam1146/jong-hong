import * as v from 'valibot'

const Env = v.object({
  PORT: v.string(),
  DATABASE_URL: v.string(),
  KAFKA_BROKERS: v.string(),
})

export const env = v.parse(Env, process.env)
