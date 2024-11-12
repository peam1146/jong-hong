import { drizzle } from 'drizzle-orm/node-postgres'

import { env } from './env'

import * as schema from '../drizzle/schema'

export const db = drizzle(env.DATABASE_URL, { schema })
export type Db = typeof db
