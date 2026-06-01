import type { Static } from "@sinclair/typebox";
import type {
	prizeSelectSchema,
	raffleSchema,
	raffleStatusSchema,
} from "./raffle.schemas";

/** The lifecycle states of a raffle */
export type IRaffleStatus = Static<typeof raffleStatusSchema>;

/** A prize awarded to the winner of a raffle */
export type IPrize = Static<typeof prizeSelectSchema>;

/** A raffle that users can purchase tickets for */
export type IRaffle = Static<typeof raffleSchema>;
