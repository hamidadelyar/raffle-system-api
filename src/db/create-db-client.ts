import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index";

export type Database = ReturnType<typeof createDatabaseClient>;

export function createDatabaseClient(config: {
	DATABASE_URL: string;
	DATABASE_SSL_ENABLED: boolean;
}) {
	const pool = new Pool({
		connectionString: config.DATABASE_URL,
		ssl: config.DATABASE_SSL_ENABLED ? { rejectUnauthorized: false } : false,
	});

	return drizzle(pool, { schema });
}
