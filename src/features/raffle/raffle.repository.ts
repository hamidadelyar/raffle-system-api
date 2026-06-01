import { eq } from "drizzle-orm";
import type { Database } from "../../db/create-db-client";
import { prizes, raffles } from "../../db/schema";
import type { IPrize } from "../../interfaces";
import type { IRaffle } from "./raffle.types";

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

	async findById(id: string) {
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
}

type RaffleRow = typeof raffles.$inferSelect;

type PrizeRow = typeof prizes.$inferSelect;

function toPrizeDomain(row: PrizeRow): IPrize {
	return {
		id: row.id,
		name: row.name,
		description: row.description,
		value: Number(row.value),
		imageUrl: row.imageUrl,
	};
}

function toRaffleDomain(row: RaffleRow, prize: PrizeRow): IRaffle {
	return {
		id: row.id,
		name: row.name,
		description: row.description,
		prize: toPrizeDomain(prize),
		ticketPrice: Number(row.ticketPrice),
		maxTickets: row.maxTickets,
		ticketsSold: row.ticketsSold,
		drawDate: row.drawDate,
		status: row.status,
		winnerId: row.winnerId,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
}
