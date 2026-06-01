import { createProvider } from "difunkt";
import { DatabaseProvider } from "../../db/db.provider";
import { RaffleRepository } from "./raffle.repository";
import { RaffleService } from "./raffle.service";

export const RaffleRepositoryProvider = createProvider(({ inject }) => {
	const db = inject(DatabaseProvider);
	return new RaffleRepository(db);
});

export const RaffleServiceProvider = createProvider(({ inject }) => {
	const raffleRepository = inject(RaffleRepositoryProvider);
	return new RaffleService(raffleRepository);
});
