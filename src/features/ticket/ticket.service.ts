import { ApiError } from "../../errors/api-error";
import { logger } from "../../plugins/logger.plugin";
import type { PurchaseUser, UserRepository } from "../user/user.repository";
import type {
	TicketPurchaseRaffle,
	TicketRepository,
} from "./ticket.repository";
import type { ITicket } from "./ticket.types";

const log = logger.child({ service: "TicketService" });

export class TicketService {
	constructor(
		private readonly ticketRepository: TicketRepository,
		private readonly userRepository: UserRepository,
	) {}

	async listTickets({ userId }: { userId: string }): Promise<ITicket[]> {
		log.debug({ userId }, "Listing tickets");
		const tickets = await this.ticketRepository.findAll({ userId });
		log.info({ count: tickets.length, userId }, "Listed tickets");

		return tickets;
	}

	async purchaseTickets({
		quantity,
		raffleId,
		userId,
	}: {
		quantity: number;
		raffleId: string;
		userId: string;
	}): Promise<ITicket[]> {
		log.info({ quantity, raffleId, userId }, "Purchasing tickets");

		const raffle = await this.ticketRepository.findRaffleForPurchase(raffleId);

		if (!raffle) {
			log.warn({ raffleId, userId }, "Raffle not found for ticket purchase");
			throw ApiError.notFound("Raffle not found");
		}

		const user = await this.userRepository.findUser(userId);

		if (!user) {
			log.warn({ raffleId, userId }, "User not found for ticket purchase");
			throw ApiError.notFound("User not found");
		}

		validateTicketPurchase(raffle, user, quantity);

		const tickets = await this.ticketRepository.createPurchase({
			quantity,
			raffleId,
			ticketPrice: raffle.ticketPrice,
			userId,
		});

		log.info({ count: tickets.length, raffleId, userId }, "Purchased tickets");

		return tickets;
	}
}

function validateTicketPurchase(
	raffle: TicketPurchaseRaffle,
	user: PurchaseUser,
	quantity: number,
) {
	if (raffle.status !== "active") {
		log.warn(
			{ raffleId: raffle.id, status: raffle.status, userId: user.id },
			"Raffle is not active",
		);
		throw ApiError.conflict("Raffle is not active");
	}

	if (raffle.ticketsSold + quantity > raffle.maxTickets) {
		log.warn(
			{
				maxTickets: raffle.maxTickets,
				quantity,
				raffleId: raffle.id,
				ticketsSold: raffle.ticketsSold,
				userId: user.id,
			},
			"Raffle has no tickets available",
		);
		throw ApiError.conflict("Raffle has no tickets available");
	}

	if (Number(user.balance) < Number(raffle.ticketPrice) * quantity) {
		log.warn(
			{
				balance: user.balance,
				quantity,
				raffleId: raffle.id,
				ticketPrice: raffle.ticketPrice,
				userId: user.id,
			},
			"Insufficient balance",
		);
		throw ApiError.conflict("Insufficient balance");
	}
}
