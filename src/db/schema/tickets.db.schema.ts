import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { raffles } from "./raffles.db.schema";
import { users } from "./users.db.schema";

export const tickets = pgTable("tickets", {
	id: uuid("id").primaryKey().defaultRandom(),
	raffleId: uuid("raffle_id")
		.notNull()
		.references(() => raffles.id),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	purchasedAt: timestamp("purchased_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});
