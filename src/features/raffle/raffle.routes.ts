import { Elysia, t } from "elysia";
import { AppError } from "../../errors/app-error";
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
			async ({ params }) => {
				const raffle = await raffleService.getRaffle(params.id);
				if (!raffle) {
					throw new AppError("RAFFLE_NOT_FOUND", "Raffle not found", 404);
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
