import { createProvider } from "difunkt";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env";
import * as schema from "./schema/index";

const pool = new Pool({
	connectionString: env.DATABASE_URL,
	ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;

export const DatabaseProvider = createProvider(() => {
	return db;
});
