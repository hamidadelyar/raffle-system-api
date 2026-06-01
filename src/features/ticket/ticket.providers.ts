import { createProvider } from "difunkt";
import { DatabaseProvider } from "../../db/db.provider";
import { UserRepositoryProvider } from "../user/user.providers";
import { TicketRepository } from "./ticket.repository";
import { TicketService } from "./ticket.service";

export const TicketRepositoryProvider = createProvider(({ inject }) => {
	const db = inject(DatabaseProvider);
	return new TicketRepository(db);
});

export const TicketServiceProvider = createProvider(({ inject }) => {
	const ticketRepository = inject(TicketRepositoryProvider);
	const userRepository = inject(UserRepositoryProvider);
	return new TicketService(ticketRepository, userRepository);
});
