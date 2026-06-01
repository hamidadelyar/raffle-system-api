import { ApiError } from "../../errors/api-error";
import type { PurchaseUser, UserRepository } from "../user/user.repository";
import type {
	TicketPurchaseRaffle,
	TicketRepository,
} from "./ticket.repository";
import type { ITicket } from "./ticket.types";

export class TicketService {
	constructor(
		private readonly ticketRepository: TicketRepository,
		private readonly userRepository: UserRepository,
	) {}

	async listTickets({ userId }: { userId: string }): Promise<ITicket[]> {
		return this.ticketRepository.findAll({ userId });
	}

	async purchaseTicket({
		raffleId,
		userId,
	}: {
		raffleId: string;
		userId: string;
	}): Promise<ITicket> {
		const raffle = await this.ticketRepository.findRaffleForPurchase(raffleId);

		if (!raffle) {
			throw ApiError.notFound("Raffle not found");
		}

		const user = await this.userRepository.findUser(userId);

		if (!user) {
			throw ApiError.notFound("User not found");
		}

		validateTicketPurchase(raffle, user);

		return this.ticketRepository.createPurchase({
			raffleId,
			ticketPrice: raffle.ticketPrice,
			userId,
		});
	}
}

function validateTicketPurchase(
	raffle: TicketPurchaseRaffle,
	user: PurchaseUser,
) {
	if (raffle.status !== "active") {
		throw ApiError.conflict("Raffle is not active");
	}

	if (raffle.ticketsSold >= raffle.maxTickets) {
		throw ApiError.conflict("Raffle has no tickets available");
	}

	if (Number(user.balance) < Number(raffle.ticketPrice)) {
		throw ApiError.conflict("Insufficient balance");
	}
}
