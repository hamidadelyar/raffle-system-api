import { Elysia } from "elysia";
import { authPlugin } from "../../plugins/auth.plugin";
import type { TicketService } from "./ticket.service";

export function createTicketRoutes(ticketService: TicketService) {
	return (
		new Elysia()
			.use(authPlugin)
			// .post("/raffles/:raffleId/tickets", async ({ params }) => {
			// 	const raffles = await ticketService.listRaffles(params.raffleId);
			// 	return {
			// 		data: raffles,
			// 		success: true,
			// 		error: null,
			// 	};
			// })
			.get("/tickets", async ({ user }) => {
				const tickets = await ticketService.listTickets({ userId: user!.id });
				return {
					data: tickets,
					success: true,
					error: null,
				};
			})
	);
}
