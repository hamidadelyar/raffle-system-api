import { Elysia, t } from "elysia";
import { authPlugin } from "../../plugins/auth.plugin";
import type { TicketService } from "./ticket.service";

export function createTicketRoutes(ticketService: TicketService) {
	return new Elysia()
		.use(authPlugin)
		.post(
			"/raffles/:raffleId/tickets",
			async ({ params, set, user }) => {
				const ticket = await ticketService.purchaseTicket({
					raffleId: params.raffleId,
					userId: user!.id,
				});

				set.status = 201;
				return {
					data: ticket,
					success: true,
					error: null,
				};
			},
			{
				params: t.Object({
					raffleId: t.String({ format: "uuid" }),
				}),
			},
		)
		.get("/tickets", async ({ user }) => {
			const tickets = await ticketService.listTickets({ userId: user!.id });
			return {
				data: tickets,
				success: true,
				error: null,
			};
		});
}
