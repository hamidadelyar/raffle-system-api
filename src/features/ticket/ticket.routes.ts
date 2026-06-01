import { Elysia, t } from "elysia";
import { authPlugin } from "../../plugins/auth.plugin";
import { errorResponseSchema } from "../../response.schemas";
import {
	ticketListResponseSchema,
	ticketResponseSchema,
} from "./ticket.schemas";
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
				detail: {
					tags: ["Tickets"],
					summary: "Purchase raffle ticket",
					description:
						"Purchases one ticket for the authenticated user in the selected raffle. The raffle must be active, have remaining tickets, and the user must have enough balance.",
				},
				params: t.Object({
					raffleId: t.String({ format: "uuid" }),
				}),
				response: {
					201: ticketResponseSchema,
					error: errorResponseSchema,
				},
			},
		)
		.get(
			"/tickets",
			async ({ user }) => {
				const tickets = await ticketService.listTickets({ userId: user!.id });
				return {
					data: tickets,
					success: true,
					error: null,
				};
			},
			{
				detail: {
					tags: ["Tickets"],
					summary: "List my tickets",
					description:
						"Returns all tickets purchased by the authenticated user, including the raffle and user identifiers for each purchase.",
				},
				response: {
					200: ticketListResponseSchema,
					error: errorResponseSchema,
				},
			},
		);
}
