import type { TicketRepository } from "./ticket.repository";
import type { ITicket } from "./ticket.types";

export class TicketService {
	constructor(private readonly ticketRepository: TicketRepository) {}
	async listTickets({ userId }: { userId: string }): Promise<ITicket[]> {
		return this.ticketRepository.findAll({ userId });
	}
}
