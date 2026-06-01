import { and, eq, sql } from "drizzle-orm";
import type { Database } from "../../db/create-db-client";
import { raffles, tickets, users } from "../../db/schema";
import { ApiError } from "../../errors/api-error";
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

	async findRaffleForPurchase(
		raffleId: string,
	): Promise<TicketPurchaseRaffle | null> {
		const [raffle] = await this.db
			.select({
				id: raffles.id,
				maxTickets: raffles.maxTickets,
				status: raffles.status,
				ticketPrice: raffles.ticketPrice,
				ticketsSold: raffles.ticketsSold,
			})
			.from(raffles)
			.where(eq(raffles.id, raffleId))
			.limit(1);

		return raffle ?? null;
	}

	async createPurchase({
		raffleId,
		ticketPrice,
		userId,
	}: {
		raffleId: string;
		ticketPrice: string;
		userId: string;
	}): Promise<ITicket> {
		return this.db.transaction(async (tx) => {
			const [updatedRaffle] = await tx
				.update(raffles)
				.set({
					ticketsSold: sql`${raffles.ticketsSold} + 1`,
					updatedAt: sql`now()`,
				})
				.where(
					and(
						eq(raffles.id, raffleId),
						eq(raffles.status, "active"),
						sql`${raffles.ticketsSold} < ${raffles.maxTickets}`,
					),
				)
				.returning({ id: raffles.id });

			if (!updatedRaffle) {
				throw ApiError.conflict("Raffle has no tickets available");
			}

			const [updatedUser] = await tx
				.update(users)
				.set({
					balance: sql`${users.balance} - ${ticketPrice}`,
					updatedAt: sql`now()`,
				})
				.where(
					and(eq(users.id, userId), sql`${users.balance} >= ${ticketPrice}`),
				)
				.returning({ id: users.id });

			if (!updatedUser) {
				throw ApiError.conflict("Insufficient balance");
			}

			const [ticket] = await tx
				.insert(tickets)
				.values({ raffleId, userId })
				.returning();

			return toTicketDomain(ticket);
		});
	}
}

type TicketRow = typeof tickets.$inferSelect;

export type TicketPurchaseRaffle = Pick<
	typeof raffles.$inferSelect,
	"id" | "maxTickets" | "status" | "ticketPrice" | "ticketsSold"
>;

function toTicketDomain(row: TicketRow): ITicket {
	return {
		id: row.id,
		purchasedAt: row.purchasedAt,
		raffleId: row.raffleId,
		userId: row.userId,
	};
}
