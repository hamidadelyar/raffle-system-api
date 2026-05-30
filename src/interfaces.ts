// =============================================================================
// Raffle System — Domain Models
// =============================================================================
// These interfaces define the core domain entities for the raffle system.
// Use them as your starting point. You are expected to design the service
// interfaces, repository contracts, and use case signatures yourself.
// =============================================================================

/** A prize awarded to the winner of a raffle */
export interface IPrize {
	id: string;
	name: string;
	description: string;
	value: number;
	imageUrl: string | null;
}

/** A ticket purchased by a user for a specific raffle */
export interface ITicket {
	id: string;
	raffleId: string;
	userId: string;
	purchasedAt: Date;
}

/** A user who can purchase raffle tickets */
export interface IUser {
	id: string;
	email: string;
	name: string;
	balance: number;
	createdAt: Date;
}
