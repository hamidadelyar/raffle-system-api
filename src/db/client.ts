import { createProvider } from "difunkt";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { ConfigProvider } from "../config/config.providers";
import * as schema from "./schema/index";

export type Database = ReturnType<typeof createDatabase>;

export const DatabaseProvider = createProvider(({ inject }) => {
	const config = inject(ConfigProvider);
	return createDatabase(config);
});

function createDatabase(config: {
	DATABASE_URL: string;
	DATABASE_SSL_ENABLED: boolean;
}) {
	const pool = new Pool({
		connectionString: config.DATABASE_URL,
		ssl: config.DATABASE_SSL_ENABLED ? { rejectUnauthorized: false } : false,
	});

	return drizzle(pool, { schema });
}
