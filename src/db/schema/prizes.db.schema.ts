import { numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestampColumns } from "./columns";

export const prizes = pgTable("prizes", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	value: numeric("value", {
		precision: 10,
		scale: 2,
	}).notNull(),
	imageUrl: text("image_url"),
	...timestampColumns,
});
