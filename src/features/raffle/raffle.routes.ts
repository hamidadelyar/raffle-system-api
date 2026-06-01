import { Elysia, t } from "elysia";
import { authPlugin } from "../../plugins/auth.plugin";
import type { RaffleService } from "./raffle.service";

export function createRaffleRoutes(raffleService: RaffleService) {
	return new Elysia({ prefix: "/raffles" })
		.use(authPlugin)
		.get("/", async ({ user }) => {
			const raffles = await raffleService.listRaffles();
			return {
				data: raffles,
				success: true,
				error: null,
			};
		})
		.get(
			"/:id",
			async ({ params, status }) => {
				const raffle = await raffleService.getRaffle(params.id);
				if (!raffle) {
					throw status(404);
				}
				return {
					data: raffle,
					success: true,
					error: null,
				};
			},
			{
				params: t.Object({
					id: t.String({ format: "uuid" }),
				}),
			},
		);
}
