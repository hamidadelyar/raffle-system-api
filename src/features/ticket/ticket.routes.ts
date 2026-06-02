import { Elysia, t } from "elysia";
import { authPlugin } from "../../plugins/auth.plugin";
import { errorResponseSchema } from "../../response.schemas";
import {
	ticketListResponseSchema,
	ticketPurchaseBodySchema,
	ticketPurchaseResponseSchema,
} from "./ticket.schemas";
import type { TicketService } from "./ticket.service";

export function createTicketRoutes(ticketService: TicketService) {
	return new Elysia()
		.use(authPlugin)
		.post(
			"/raffles/:raffleId/tickets",
			async ({ body, params, set, user }) => {
				const tickets = await ticketService.purchaseTickets({
					quantity: body.quantity,
					raffleId: params.raffleId,
					userId: user.id,
				});

				set.status = 201;
				return {
					data: tickets,
					success: true,
					error: null,
				};
			},
			{
				detail: {
					tags: ["Tickets"],
					summary: "Purchase raffle tickets",
					description:
						"Purchases one or more tickets for the authenticated user in the selected raffle. The raffle must be active, have enough remaining tickets, and the user must have enough balance.",
				},
				body: ticketPurchaseBodySchema,
				params: t.Object({
					raffleId: t.String({ format: "uuid" }),
				}),
				response: {
					201: ticketPurchaseResponseSchema,
					error: errorResponseSchema,
				},
			},
		)
		.get(
			"/tickets",
			async ({ user }) => {
				const tickets = await ticketService.listTickets({
					userId: user.id,
				});
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
