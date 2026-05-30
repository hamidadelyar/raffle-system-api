import { Elysia } from "elysia";
import type { RaffleService } from "./raffle.service";

export function createRaffleRoutes(raffleService: RaffleService) {
	return new Elysia({ prefix: "/raffles" }).get("/", async () => {
		const raffles = await raffleService.listRaffles();
		return {
			data: raffles,
		};
	});
}
