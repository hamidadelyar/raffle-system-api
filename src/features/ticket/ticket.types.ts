/** A ticket purchased by a user for a specific raffle */
export interface ITicket {
	id: string;
	raffleId: string;
	userId: string;
	purchasedAt: Date;
}
