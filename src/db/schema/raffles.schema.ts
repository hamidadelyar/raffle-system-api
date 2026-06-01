import {
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { prizes } from "./prizes.schema";
import { users } from "./users.schema";

export const raffleStatusEnum = pgEnum("raffle_status", [
	"draft",
	"active",
	"drawn",
	"cancelled",
]);

export const raffles = pgTable("raffles", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	prizeId: uuid("prize_id")
		.notNull()
		.references(() => prizes.id),
	ticketPrice: numeric("ticket_price", {
		precision: 10,
		scale: 2,
	}).notNull(),
	maxTickets: integer("max_tickets").notNull(),
	ticketsSold: integer("tickets_sold").notNull().default(0),
	drawDate: timestamp("draw_date", { withTimezone: true }).notNull(),
	status: raffleStatusEnum("status").notNull().default("draft"),
	winnerId: uuid("winner_id").references(() => users.id),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});
