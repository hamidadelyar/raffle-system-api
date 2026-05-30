import { createModule } from "difunkt";
import {
	RaffleRepositoryProvider,
	RaffleServiceProvider,
} from "./raffle.providers";

export const RaffleModule = createModule({
	providers: [RaffleRepositoryProvider, RaffleServiceProvider],
});
