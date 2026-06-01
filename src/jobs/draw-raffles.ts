import { createApplication } from "difunkt";
import { AppModule } from "../app.module";
import { RaffleServiceProvider } from "../features/raffle/raffle.providers";

const resolve = await createApplication(AppModule);
const raffleService = resolve(RaffleServiceProvider);

try {
	const drawnRaffles = await raffleService.drawDueRaffles();

	console.log(`Drawn ${drawnRaffles.length} raffle(s)`);
	process.exit(0);
} catch (error) {
	console.error("Failed to draw raffles", error);
	process.exit(1);
}
