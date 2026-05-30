import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const prizes = pgTable("prizes", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	value: numeric("value", {
		precision: 10,
		scale: 2,
	}).notNull(),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});
