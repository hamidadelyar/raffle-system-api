import { and, eq, isNull, lte, sql } from "drizzle-orm";
import type { Database } from "../../db/create-db-client";
import { prizes, raffles, tickets } from "../../db/schema";
import type { IPrize, IRaffle } from "./raffle.types";

export class RaffleRepository {
	constructor(private readonly db: Database) {}

	async findAll(): Promise<IRaffle[]> {
		const rows = await this.db
			.select({
				raffle: raffles,
				prize: prizes,
			})
			.from(raffles)
			.innerJoin(prizes, eq(raffles.prizeId, prizes.id));

		return rows.map(({ raffle, prize }) => toRaffleDomain(raffle, prize));
	}

	async findById(id: string): Promise<IRaffle | null> {
		const [row] = await this.db
			.select({
				raffle: raffles,
				prize: prizes,
			})
			.from(raffles)
			.innerJoin(prizes, eq(raffles.prizeId, prizes.id))
			.where(eq(raffles.id, id))
			.limit(1);

		if (!row) {
			return null;
		}
		return toRaffleDomain(row.raffle, row.prize);
	}

	async withLockedDueRaffles<T>(
		handler: (tx: RaffleTransaction, dueRaffles: DueRaffle[]) => Promise<T>,
	): Promise<T> {
		return this.db.transaction(async (tx) => {
			const dueRaffles = await this.findDueForDraw(tx);
			return handler(tx, dueRaffles);
		});
	}

	async findRandomWinner(
		tx: RaffleTransaction,
		raffleId: string,
	): Promise<RaffleWinner | null> {
		const [winner] = await tx
			.select({ userId: tickets.userId })
			.from(tickets)
			.where(eq(tickets.raffleId, raffleId))
			.orderBy(sql`random()`)
			.limit(1);

		return winner ?? null;
	}

	async markDrawn(
		tx: RaffleTransaction,
		raffleId: string,
		winnerId: string,
	): Promise<void> {
		await tx
			.update(raffles)
			.set({
				status: "drawn",
				updatedAt: sql`now()`,
				winnerId,
			})
			.where(
				and(
					eq(raffles.id, raffleId),
					eq(raffles.status, "active"),
					isNull(raffles.winnerId),
				),
			);
	}

	async markCancelled(tx: RaffleTransaction, raffleId: string): Promise<void> {
		await tx
			.update(raffles)
			.set({
				status: "cancelled",
				updatedAt: sql`now()`,
			})
			.where(
				and(
					eq(raffles.id, raffleId),
					eq(raffles.status, "active"),
					isNull(raffles.winnerId),
					eq(raffles.ticketsSold, 0),
				),
			);
	}

	private async findDueForDraw(tx: RaffleTransaction): Promise<DueRaffle[]> {
		return tx
			.select({ id: raffles.id })
			.from(raffles)
			.where(
				and(
					eq(raffles.status, "active"),
					isNull(raffles.winnerId),
					lte(raffles.drawDate, sql`now()`),
				),
			)
			.for("update", { skipLocked: true });
	}
}

type RaffleTransaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

type DueRaffle = Pick<typeof raffles.$inferSelect, "id">;

type RaffleWinner = Pick<typeof tickets.$inferSelect, "userId">;

type RaffleRow = typeof raffles.$inferSelect;

type PrizeRow = typeof prizes.$inferSelect;

function toPrizeDomain(row: PrizeRow): IPrize {
	return {
		id: row.id,
		name: row.name,
		description: row.description,
		value: row.value,
		imageUrl: row.imageUrl,
	};
}

function toRaffleDomain(row: RaffleRow, prize: PrizeRow): IRaffle {
	return {
		id: row.id,
		name: row.name,
		description: row.description,
		prize: toPrizeDomain(prize),
		ticketPrice: row.ticketPrice,
		maxTickets: row.maxTickets,
		ticketsSold: row.ticketsSold,
		drawDate: row.drawDate,
		status: row.status,
		winnerId: row.winnerId,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
}
