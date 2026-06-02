import { sql } from "drizzle-orm";
import { check, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestampColumns } from "./columns";

export const users = pgTable(
	"users",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		email: text("email").notNull().unique(),
		name: text("name").notNull(),
		balance: numeric("balance", {
			precision: 10,
			scale: 2,
		})
			.notNull()
			.default("0"),
		...timestampColumns,
	},
	(table) => [check("users_balance_non_negative", sql`${table.balance} >= 0`)],
);
