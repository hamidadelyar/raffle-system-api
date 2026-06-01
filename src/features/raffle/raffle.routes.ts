import { Elysia, t } from "elysia";
import { ApiError } from "../../errors/api-error";
import { authPlugin } from "../../plugins/auth.plugin";
import { errorResponseSchema } from "../../response.schemas";
import {
	raffleListResponseSchema,
	raffleResponseSchema,
} from "./raffle.schemas";
import type { RaffleService } from "./raffle.service";

export function createRaffleRoutes(raffleService: RaffleService) {
	return new Elysia({ prefix: "/raffles" })
		.use(authPlugin)
		.get(
			"/",
			async () => {
				const raffles = await raffleService.listRaffles();
				return {
					data: raffles,
					success: true as const,
					error: null,
				};
			},
			{
				detail: {
					tags: ["Raffles"],
					summary: "List raffles",
					description:
						"Returns all available raffles with their prize details, ticket pricing, draw dates, and current lifecycle status.",
				},
				response: {
					200: raffleListResponseSchema,
					error: errorResponseSchema,
				},
			},
		)
		.get(
			"/:id",
			async ({ params }) => {
				const raffle = await raffleService.getRaffle(params.id);
				if (!raffle) {
					throw ApiError.notFound("Raffle not found");
				}
				return {
					data: raffle,
					success: true as const,
					error: null,
				};
			},
			{
				detail: {
					tags: ["Raffles"],
					summary: "Get raffle by ID",
					description:
						"Returns a single raffle, including prize details and ticket availability information. Responds with 404 when the raffle does not exist.",
				},
				params: t.Object({
					id: t.String({ format: "uuid" }),
				}),
				response: {
					200: raffleResponseSchema,
					error: errorResponseSchema,
				},
			},
		);
}
