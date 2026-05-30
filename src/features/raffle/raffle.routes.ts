import { Elysia, t } from "elysia";
import type { RaffleService } from "./raffle.service";

export function createRaffleRoutes(raffleService: RaffleService) {
	return new Elysia({ prefix: "/raffles" })
		.get("/", async () => {
			const raffles = await raffleService.listRaffles();
			return {
				data: raffles,
			};
		})
		.get(
			"/:id",
			async ({ params, set }) => {
				const raffle = await raffleService.getRaffle(params.id);
				if (!raffle) {
					set.status = 404;
					return {
						error: {
							code: "RAFFLE_NOT_FOUND",
							message: "Raffle not found",
						},
					};
				}
				return {
					data: raffle,
				};
			},
			{
				params: t.Object({
					id: t.String({ format: "uuid" }),
				}),
			},
		);
}
