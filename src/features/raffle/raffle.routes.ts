import { Elysia, t } from "elysia";
import { authPlugin } from "../../plugins/auth.plugin";
import type { RaffleService } from "./raffle.service";

export function createRaffleRoutes(raffleService: RaffleService) {
	return new Elysia({ prefix: "/raffles" })
		.use(authPlugin)
		.get("/", async ({ getAuthenticatedUser }) => {
			const { id } = await getAuthenticatedUser();
			console.log({ id });

			const raffles = await raffleService.listRaffles();
			return {
				data: raffles,
			};
		})
		.get(
			"/:id",
			async ({ params, status, getAuthenticatedUser }) => {
				const { id } = await getAuthenticatedUser();
				const raffle = await raffleService.getRaffle(params.id);
				if (!raffle) {
					throw status(404);
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
