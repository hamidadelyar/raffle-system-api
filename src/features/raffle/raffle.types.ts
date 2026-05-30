import type { IPrize } from "../../interfaces";

/** The lifecycle states of a raffle */
export type RaffleStatus = "draft" | "active" | "drawn" | "cancelled";

/** A raffle that users can purchase tickets for */
export interface IRaffle {
	id: string;
	name: string;
	description: string;
	prize: IPrize;
	ticketPrice: number;
	maxTickets: number;
	ticketsSold: number;
	drawDate: Date;
	status: RaffleStatus;
	winnerId: string | null;
	createdAt: Date;
	updatedAt: Date;
}
