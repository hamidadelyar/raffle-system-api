import { sql } from "drizzle-orm";
import {
	check,
	numeric,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

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
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [check("users_balance_non_negative", sql`${table.balance} >= 0`)],
);
