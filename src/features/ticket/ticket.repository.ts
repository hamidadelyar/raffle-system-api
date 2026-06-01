import { eq } from "drizzle-orm";
import type { Database } from "../../db/create-db-client";
import { tickets } from "../../db/schema";
import type { ITicket } from "./ticket.types";

export class TicketRepository {
	constructor(private readonly db: Database) {}
	async findAll({ userId }: { userId: string }): Promise<ITicket[]> {
		const rows = await this.db
			.select()
			.from(tickets)
			.where(eq(tickets.userId, userId));
		return rows.map((tickets) => toTicketDomain(tickets));
	}
}

type TicketRow = typeof tickets.$inferSelect;

function toTicketDomain(row: TicketRow): ITicket {
	return {
		id: row.id,
		purchasedAt: row.purchasedAt,
		raffleId: row.raffleId,
		userId: row.userId,
	};
}
