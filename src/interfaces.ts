// =============================================================================
// Raffle System — Domain Models
// =============================================================================
// These interfaces define the core domain entities for the raffle system.
// Use them as your starting point. You are expected to design the service
// interfaces, repository contracts, and use case signatures yourself.
// =============================================================================

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
